#!/bin/bash

set -e

# Limpa o terminal antes de iniciar
clear

# Cores do output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

show_help() {
    echo -e "${BLUE}Uso:${NC}"
    echo "  $0 [--restart]"
    echo ""
    echo -e "${BLUE}Descrição:${NC}"
    echo "  O ambiente é detectado automaticamente através da variável APP_ENV"
    echo ""
    echo -e "${BLUE}Ambientes suportados:${NC}"
    echo "  dev  - Ambiente de desenvolvimento"
    echo "  prd  - Ambiente de produção"
    echo "  hml  - Ambiente de homologação"
    echo ""
    echo -e "${BLUE}Opções:${NC}"
    echo "  --restart  - Reinicia os containers automaticamente após o build"
    echo ""
    echo -e "${BLUE}Exemplos:${NC}"
    echo "  $0"
    echo "  $0 --restart"
    echo ""
}

RESTART=false

# Verifica flag de restart
if [ "$1" == "--restart" ]; then
    RESTART=true
fi

# Função para detectar APP_ENV automaticamente
detect_app_env() {
    local detected_env=""
    
    # 1. Verifica variável de ambiente do sistema
    if [ -n "$APP_ENV" ]; then
        echo "$APP_ENV"
        return 0
    fi
    
    # 2. Verifica no arquivo .env do frontend
    if [ -f "./apps/front/.env" ]; then
        # Lê apenas a linha APP_ENV sem carregar todas as variáveis
        detected_env=$(grep -E "^APP_ENV=" "./apps/front/.env" 2>/dev/null | head -1 | cut -d'=' -f2 | tr -d '"' | tr -d "'" | xargs)
        if [ -n "$detected_env" ]; then
            echo "$detected_env"
            return 0
        fi
    fi
    
    # 3. Verifica no arquivo .env da API
    if [ -f "./apps/api/.env" ]; then
        # Lê apenas a linha APP_ENV sem carregar todas as variáveis
        detected_env=$(grep -E "^APP_ENV=" "./apps/api/.env" 2>/dev/null | head -1 | cut -d'=' -f2 | tr -d '"' | tr -d "'" | xargs)
        if [ -n "$detected_env" ]; then
            echo "$detected_env"
            return 0
        fi
    fi
    
    # Não encontrou APP_ENV
    return 1
}

# Detecta o ambiente automaticamente
ENV=$(detect_app_env)
DETECT_EXIT_CODE=$?
if [ $DETECT_EXIT_CODE -ne 0 ] || [ -z "$ENV" ]; then
    echo -e "${RED}Erro: Não foi possível detectar o ambiente!${NC}"
    echo ""
    echo -e "${YELLOW}A variável APP_ENV não foi encontrada em:${NC}"
    echo "  - Variável de ambiente do sistema"
    echo "  - ./apps/front/.env"
    echo "  - ./apps/api/.env"
    echo ""
    echo -e "${BLUE}Defina APP_ENV com um dos valores: dev, prd ou hml${NC}"
    echo ""
    show_help
    exit 1
fi

# Valida o ambiente detectado
if [ "$ENV" != "dev" ] && [ "$ENV" != "prd" ] && [ "$ENV" != "hml" ]; then
    echo -e "${RED}Erro: Ambiente inválido detectado!${NC}"
    echo ""
    echo -e "${YELLOW}APP_ENV=${ENV}${NC}"
    echo -e "${YELLOW}Valores aceitos: dev, prd ou hml${NC}"
    echo ""
    show_help
    exit 1
fi

# Verifica se há diferença entre APP_ENV do frontend e da API (ANTES de anunciar o ambiente)
FRONT_ENV_FILE="./apps/front/.env"
API_ENV_FILE="./apps/api/.env"

if [ -f "$FRONT_ENV_FILE" ] && [ -f "$API_ENV_FILE" ]; then
    # Lê APP_ENV diretamente dos arquivos sem carregar variáveis
    frontend_app_env=$(grep -E "^APP_ENV=" "$FRONT_ENV_FILE" 2>/dev/null | head -1 | cut -d'=' -f2 | tr -d '"' | tr -d "'" | xargs)
    api_app_env=$(grep -E "^APP_ENV=" "$API_ENV_FILE" 2>/dev/null | head -1 | cut -d'=' -f2 | tr -d '"' | tr -d "'" | xargs)
    
    if [ -n "$api_app_env" ] && [ -n "$frontend_app_env" ]; then
        if [ "$frontend_app_env" != "$api_app_env" ]; then
            echo ""
            echo -e "${RED}════════════════════════════════════════════════${NC}"
            echo -e "${RED}✗ ERRO: Ambientes diferentes detectados!${NC}"
            echo -e "${RED}════════════════════════════════════════════════${NC}"
            echo ""
            echo -e "  ${YELLOW}Frontend:${NC} APP_ENV=${frontend_app_env}"
            echo -e "  ${YELLOW}API:${NC}      APP_ENV=${api_app_env}"
            echo ""
            echo -e "${RED}Os ambientes devem ser iguais para prosseguir com o build.${NC}"
            echo -e "${YELLOW}Corrija os arquivos .env antes de continuar.${NC}"
            echo ""
            exit 1
        fi
    fi
fi

echo -e "${BLUE}════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Build e Deploy Completo - Ambiente: ${GREEN}${ENV^^}${NC}"
echo -e "${BLUE}════════════════════════════════════════════════${NC}"
echo ""

# Função para obter a branch baseada no ambiente
get_branch_for_env() {
    local env="$1"
    case "$env" in
        dev)
            echo "develop"
            ;;
        hml)
            echo "homolog"
            ;;
        prd)
            echo "main"
            ;;
        *)
            echo ""
            ;;
    esac
}

# Função para perguntar se deseja continuar em caso de erro
ask_continue_on_error() {
    local error_message="$1"
    echo -e "${RED}✗ $error_message${NC}"
    echo ""
    read -p "Deseja continuar mesmo assim? (S/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Nn]$ ]]; then
        return 1
    else
        echo -e "${YELLOW}⚠ Continuando mesmo com erro...${NC}"
        return 0
    fi
}

# Função para verificar e atualizar repositório git
check_and_update_git() {
    local dir="$1"
    local branch="$2"
    local component_name="$3"
    
    # Verifica se é um repositório git
    if [ ! -d "$dir/.git" ]; then
        echo -e "${YELLOW}⚠ Diretório $component_name não é um repositório git, pulando atualização${NC}"
        return 0
    fi
    
    # Entra no diretório
    local original_dir=$(pwd)
    if ! cd "$dir"; then
        ask_continue_on_error "Erro ao acessar diretório $component_name" || return 1
        return 0
    fi
    
    # Verifica se a branch existe localmente
    if ! git rev-parse --verify "$branch" >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠ Branch '$branch' não existe localmente em $component_name, tentando fazer checkout...${NC}"
        git fetch origin >/dev/null 2>&1 || true
        if git rev-parse --verify "origin/$branch" >/dev/null 2>&1; then
            if ! git checkout -b "$branch" "origin/$branch" >/dev/null 2>&1 && ! git checkout "$branch" >/dev/null 2>&1; then
                cd "$original_dir"
                ask_continue_on_error "Erro ao criar branch '$branch' em $component_name" || return 1
                return 0
            fi
        else
            cd "$original_dir"
            ask_continue_on_error "Branch '$branch' não existe no repositório remoto para $component_name" || return 1
            return 0
        fi
    fi
    
    # Verifica se está na branch correta
    local current_branch=$(git rev-parse --abbrev-ref HEAD)
    if [ "$current_branch" != "$branch" ]; then
        echo -e "${YELLOW}⚠ Mudando para branch '$branch' em $component_name...${NC}"
        if ! git checkout "$branch" >/dev/null 2>&1; then
            cd "$original_dir"
            ask_continue_on_error "Erro ao mudar para branch '$branch' em $component_name" || return 1
            return 0
        fi
    fi
    
    # Busca atualizações remotas
    echo -e "${BLUE}Verificando atualizações remotas para $component_name (branch: $branch)...${NC}"
    if ! git fetch origin "$branch" >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠ Não foi possível buscar atualizações remotas${NC}"
        cd "$original_dir"
        ask_continue_on_error "Erro ao buscar atualizações remotas para $component_name" || return 1
        return 0
    fi
    
    # Para branch develop, não faz pull (trabalho em andamento)
    if [ "$branch" == "develop" ]; then
        echo -e "${YELLOW}⚠ Branch develop detectada - pulando atualização (pull)${NC}"
        echo -e "${BLUE}  (Trabalho atual sendo realizado localmente)${NC}"
        cd "$original_dir"
        return 0
    fi
    
    # Verifica se há diferenças entre local e remoto
    local local_commit=$(git rev-parse HEAD 2>/dev/null)
    local remote_commit=$(git rev-parse "origin/$branch" 2>/dev/null)
    
    if [ "$local_commit" != "$remote_commit" ]; then
        echo -e "${YELLOW}⚠ Há alterações remotas em $component_name, fazendo pull...${NC}"
        if ! git pull origin "$branch"; then
            cd "$original_dir"
            ask_continue_on_error "Erro ao fazer pull em $component_name" || return 1
            return 0
        fi
        echo -e "${GREEN}✓ $component_name atualizado!${NC}"
    else
        echo -e "${GREEN}✓ $component_name já está atualizado${NC}"
    fi
    
    cd "$original_dir"
    return 0
}

# Obtém a branch baseada no ambiente
BRANCH=$(get_branch_for_env "$ENV")

if [ -z "$BRANCH" ]; then
    echo -e "${RED}Erro: Não foi possível determinar a branch para o ambiente $ENV${NC}"
    exit 1
fi

# Verifica e atualiza repositórios Git se existirem
if [ "$ENV" != "dev" ]; then
    echo -e "${BLUE}Verificando atualizações do Git (branch: ${GREEN}$BRANCH${BLUE})...${NC}"
    echo ""
    
    # Verifica e atualiza repositório do frontend
    if [ ! -d "./apps/front" ]; then
        echo -e "${RED}✗ Diretório apps/front não existe!${NC}"
        echo -e "${YELLOW}⚠ Você precisa clonar o repositório manualmente antes de executar este script${NC}"
        echo ""
        if ! ask_continue_on_error "Deseja continuar mesmo sem o diretório apps/front?"; then
            exit 1
        fi
    elif [ -d "./apps/front/.git" ]; then
        if ! check_and_update_git "./apps/front" "$BRANCH" "Frontend"; then
            echo -e "${RED}Processo interrompido pelo usuário.${NC}"
            exit 1
        fi
        echo ""
    else
        echo -e "${YELLOW}⚠ Diretório apps/front não é um repositório git${NC}"
        echo ""
    fi
    
    # Verifica e atualiza repositório da API
    if [ ! -d "./apps/api" ]; then
        echo -e "${RED}✗ Diretório apps/api não existe!${NC}"
        echo -e "${YELLOW}⚠ Você precisa clonar o repositório manualmente antes de executar este script${NC}"
        echo ""
        if ! ask_continue_on_error "Deseja continuar mesmo sem o diretório apps/api?"; then
            exit 1
        fi
    elif [ -d "./apps/api/.git" ]; then
        if ! check_and_update_git "./apps/api" "$BRANCH" "API"; then
            echo -e "${RED}Processo interrompido pelo usuário.${NC}"
            exit 1
        fi
        echo ""
    else
        echo -e "${YELLOW}⚠ Diretório apps/api não é um repositório git${NC}"
        echo ""
    fi
fi

# Usa sempre o arquivo .env padrão do frontend
ENV_FILE="./apps/front/.env"

# Verifica se o arquivo .env existe
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}Erro: Arquivo .env do frontend não encontrado!${NC}"
    echo "  Procurado: ${ENV_FILE}"
    exit 1
fi

# Função para validar e limpar DATABASE_URL
validate_database_url() {
    local url="$1"
    # Remove aspas e espaços
    url=$(echo "$url" | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//" | xargs)
    # Valida formato
    if [ -z "$url" ] || ! echo "$url" | grep -qE '^(postgresql|postgres)://'; then
        return 1
    else
        echo "$url"
        return 0
    fi
}

# Carrega as variáveis do .env do frontend
echo -e "${BLUE}Carregando variáveis de ambiente do frontend...${NC}"
set -a
source "$ENV_FILE" 2>/dev/null || true
set +a

# Define valores padrão se não estiverem definidos
export NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL:-http://127.0.0.1:3000}
export NEXT_PUBLIC_SYMFONY_APP_URL=${NEXT_PUBLIC_SYMFONY_APP_URL:-http://127.0.0.1:8000/api/v1}

# Exporta explicitamente as variáveis JWT (garantir que estejam disponíveis para docker-compose)
export JWT_SECRET="${JWT_SECRET}"
export JWT_REFRESH_SECRET="${JWT_REFRESH_SECRET}"

# Valida DATABASE_URL (obrigatória para build)
if ! DATABASE_URL_VALIDATED=$(validate_database_url "${DATABASE_URL:-}"); then
    echo -e "${RED}✗ ERRO: DATABASE_URL não está definida ou não tem formato válido!${NC}"
    echo -e "${RED}   A URL deve começar com 'postgresql://' ou 'postgres://'${NC}"
    echo -e "${YELLOW}   Verifique o arquivo: ${ENV_FILE}${NC}"
    exit 1
fi
export DATABASE_URL="$DATABASE_URL_VALIDATED"

# Exporta DATABASE_AMBIENTE se existir no .env (remove aspas se houver)
if [ -n "$DATABASE_AMBIENTE" ]; then
    export DATABASE_AMBIENTE=$(echo "$DATABASE_AMBIENTE" | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")
fi

# Cria um arquivo .env na raiz com as variáveis necessárias para o docker-compose
# O docker-compose lê automaticamente um arquivo .env na raiz do projeto
ROOT_ENV_FILE="./.env"

# Carrega variáveis da API também para incluir no .env da raiz
# Preserva DATABASE_URL do frontend antes de carregar o .env da API
FRONTEND_DATABASE_URL="$DATABASE_URL"
if [ -f "./apps/api/.env" ]; then
    set -a
    source "./apps/api/.env" 2>/dev/null || true
    set +a
fi
# Restaura DATABASE_URL do frontend (não deve ser sobrescrita pelo .env da API)
export DATABASE_URL="$FRONTEND_DATABASE_URL"

# Valida DATABASE_URL novamente antes de escrever no .env
if ! DATABASE_URL_VALIDATED=$(validate_database_url "${DATABASE_URL}"); then
    echo -e "${RED}✗ ERRO: DATABASE_URL inválida após carregar .env da API!${NC}"
    echo -e "${RED}   DATABASE_URL atual: ${DATABASE_URL}${NC}"
    exit 1
fi
export DATABASE_URL="$DATABASE_URL_VALIDATED"

cat > "$ROOT_ENV_FILE" << EOF
# Variáveis JWT para docker-compose (frontend)
JWT_SECRET=${JWT_SECRET}
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
DATABASE_URL=${DATABASE_URL}
DATABASE_AMBIENTE=${DATABASE_AMBIENTE}

# Variáveis da API para docker-compose
JWT_PASSPHRASE=${JWT_PASSPHRASE}
APP_ENCRYPTION_KEY=${APP_ENCRYPTION_KEY}
APP_ENCRYPTION_IV=${APP_ENCRYPTION_IV}
CORS_ALLOW_ORIGIN=${CORS_ALLOW_ORIGIN}
EOF

echo -e "${GREEN}✓ Variáveis do frontend carregadas!${NC}"
echo ""

# Carrega variáveis do .env da API (se existir)
# Preserva DATABASE_URL do frontend antes de carregar
FRONTEND_DATABASE_URL="$DATABASE_URL"
API_ENV_FILE="./apps/api/.env"
if [ -f "$API_ENV_FILE" ]; then
    echo -e "${BLUE}Carregando variáveis de ambiente da API...${NC}"
    # Carrega todas as variáveis do .env da API (exceto comentários e linhas vazias)
    set -a
    source "$API_ENV_FILE" 2>/dev/null || true
    set +a
    # Restaura DATABASE_URL do frontend (não deve ser sobrescrita pelo .env da API)
    export DATABASE_URL="$FRONTEND_DATABASE_URL"
    echo -e "${GREEN}✓ Variáveis da API carregadas!${NC}"
else
    echo -e "${YELLOW}Arquivo .env da API não encontrado, usando valores padrão${NC}"
fi

echo ""

# Em ambiente DEV, pergunta se quer fazer build do frontend
BUILD_FRONTEND=true
if [ "$ENV" == "dev" ]; then
    echo -e "${BLUE}Ambiente DEV detectado${NC}"
    read -p "Deseja fazer build do frontend antes de iniciar? (S/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Nn]$ ]]; then
        BUILD_FRONTEND=false
        echo -e "${YELLOW}⚠ Pulando build do frontend${NC}"
    fi
fi

# Garante que DATABASE_URL está preservada após interações
# Re-valida e re-exporta a DATABASE_URL (pode ter sido perdida após read)
if ! DATABASE_URL_VALIDATED=$(validate_database_url "${DATABASE_URL:-}"); then
    # Se não estiver disponível, recarrega do .env
    if [ -f "$ENV_FILE" ]; then
        set -a
        source "$ENV_FILE" 2>/dev/null || true
        set +a
        DATABASE_URL_VALIDATED=$(validate_database_url "${DATABASE_URL:-}" || echo "")
    fi
    if [ -z "$DATABASE_URL_VALIDATED" ]; then
        echo -e "${RED}✗ ERRO: Não foi possível recuperar DATABASE_URL válida!${NC}"
        exit 1
    fi
fi
export DATABASE_URL="$DATABASE_URL_VALIDATED"

# Faz o build dos serviços
if [ "$BUILD_FRONTEND" == "true" ]; then
    echo -e "${YELLOW}Fazendo build de todos os serviços para ambiente ${ENV^^}...${NC}"
else
    echo -e "${YELLOW}Fazendo build da API para ambiente ${ENV^^}...${NC}"
fi
echo ""

if [ "$BUILD_FRONTEND" == "true" ]; then
    echo -e "${BLUE}[1/2] Build do Frontend...${NC}"
    # Para DEV, define target dev no docker-compose
    if [ "$ENV" == "dev" ]; then
        export FRONT_BUILD_TARGET="dev"
    fi
    
    # Valida DATABASE_URL antes do build
    if ! DATABASE_URL_VALIDATED=$(validate_database_url "${DATABASE_URL}"); then
        echo -e "${RED}✗ ERRO: DATABASE_URL não está definida ou não tem formato válido!${NC}"
        echo -e "${RED}   A URL deve começar com 'postgresql://' ou 'postgres://'${NC}"
        exit 1
    fi
    export DATABASE_URL="$DATABASE_URL_VALIDATED"
    
    docker compose -f docker-compose.yml build front

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Frontend build concluído!${NC}"
    else
        echo -e "${RED}✗ Erro no build do frontend!${NC}"
        exit 1
    fi
    echo ""
fi

if [ "$BUILD_FRONTEND" == "true" ]; then
    echo -e "${BLUE}[2/2] Build da API...${NC}"
else
    echo -e "${BLUE}[1/1] Build da API...${NC}"
fi
docker compose -f docker-compose.yml -f apps/api/docker-compose.yml build api

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ API build concluído!${NC}"
else
    echo -e "${RED}✗ Erro no build da API!${NC}"
    exit 1
fi

echo ""
if [ "$BUILD_FRONTEND" == "true" ]; then
    echo -e "${GREEN}════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}  ✓ Build completo concluído para ambiente ${ENV^^}!${NC}"
    echo -e "${GREEN}════════════════════════════════════════════════${NC}"
else
    echo -e "${GREEN}════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}  ✓ Build da API concluído para ambiente ${ENV^^}!${NC}"
    echo -e "${YELLOW}  ⚠ Build do frontend foi pulado${NC}"
    echo -e "${GREEN}════════════════════════════════════════════════${NC}"
fi
echo ""

# Função para extrair nome do banco de uma URL de conexão
extract_db_name_from_url() {
    local url="$1"
    if [ -z "$url" ]; then
        echo "N/A"
        return
    fi
    
    # Extrai o nome do banco de dados da URL
    # Formato esperado: mssql://user:pass@host:port/DB_NAME ou postgresql://user:pass@host:port/DB_NAME
    local db_name=$(echo "$url" | sed -E 's|.*/([^?]+).*|\1|' | tr -d ' ')
    if [ -n "$db_name" ]; then
        echo "$db_name"
    else
        echo "N/A"
    fi
}

# Função para exibir informações do ambiente
show_environment_info() {
    echo ""
    echo -e "${BLUE}════════════════════════════════════════════════${NC}"
    echo -e "${BLUE} 🚀 AMBIENTE RODANDO: ${GREEN}${ENV^^}${NC}"
    echo -e "${BLUE}════════════════════════════════════════════════${NC}"
    echo ""
    
    # URLs de acesso
    echo -e "  ${GREEN}URLs de Acesso:${NC}"
    if [ -n "$NEXT_PUBLIC_APP_URL" ]; then
        echo -e "  ${YELLOW}Frontend:${NC} ${NEXT_PUBLIC_APP_URL}"
    else
        echo -e "  ${YELLOW}Frontend:${NC} N/A"
    fi
    
    if [ -n "$NEXT_PUBLIC_SYMFONY_APP_URL" ]; then
        echo -e "  ${YELLOW}Backend:${NC}  ${NEXT_PUBLIC_SYMFONY_APP_URL}"
    else
        echo -e "  ${YELLOW}Backend:${NC}  N/A"
    fi
    
    echo ""
    
    # Bancos de dados
    echo -e "  ${GREEN}Bancos de Dados:${NC}"
    
    # PostgreSQL (Frontend) - usa DATABASE_AMBIENTE
    if [ -n "$DATABASE_AMBIENTE" ]; then
        echo -e "  ${YELLOW}Postgres:${NC} ${DATABASE_AMBIENTE}"
    elif [ -f "./apps/front/.env" ]; then
        echo -e "  ${YELLOW}Postgres:${NC}  N/A"
    fi
    
    # SQL Server (API - Principal) - busca no .env da API
    local api_db_url=""
    if [ -f "./apps/api/.env" ]; then
        api_db_url=$(grep -E "^DATABASE_URL=" "./apps/api/.env" 2>/dev/null | head -1 | cut -d'=' -f2- | tr -d '"' | tr -d "'" | xargs)
    fi
    
    if [ -n "$api_db_url" ] && echo "$api_db_url" | grep -qi "mssql\|sqlserver"; then
        local mssql_db=$(extract_db_name_from_url "$api_db_url")
        echo -e "  ${YELLOW}SQL Server:${NC} ${mssql_db}"
    elif [ -n "$DATABASE_URL" ] && echo "$DATABASE_URL" | grep -qi "mssql\|sqlserver"; then
        local mssql_db=$(extract_db_name_from_url "$DATABASE_URL")
        echo -e "  ${YELLOW}SQL Server:${NC} ${mssql_db}"
    elif [ -n "$TRUST_DATABASE_NAME" ]; then
        echo -e "  ${YELLOW}SQL Server:${NC} ${TRUST_DATABASE_NAME}"
    elif [ -n "$PORTAL_DATABASE_NAME" ]; then
        echo -e "  ${YELLOW}SQL Server:${NC} ${PORTAL_DATABASE_NAME}"
    else
        echo -e "  ${YELLOW}SQL Server:${NC} N/A"
    fi
    
    # SQL Server IRIS (se configurado)
    local iris_url=""
    if [ -f "./apps/api/.env" ]; then
        iris_url=$(grep -E "^Iris_DATABASE_URL=|^IRIS_DATABASE_URL=" "./apps/api/.env" 2>/dev/null | head -1 | cut -d'=' -f2- | tr -d '"' | tr -d "'" | xargs)
    fi
    
    if [ -z "$iris_url" ]; then
        iris_url="${Iris_DATABASE_URL:-$IRIS_DATABASE_URL}"
    fi
    
    if [ -n "$iris_url" ]; then
        local iris_db=$(extract_db_name_from_url "$iris_url")
        echo -e "  ${YELLOW}SQL Server IRIS:${NC} ${iris_db}"
    fi
    
    echo ""
    echo -e "${BLUE}════════════════════════════════════════════════${NC}"
    echo ""
}

# Função para liberar portas em uso
free_ports() {
    local ports=("3000" "8000")
    
    for port in "${ports[@]}"; do
        local pid=""
        
        # Tenta encontrar processo usando lsof
        if command -v lsof >/dev/null 2>&1; then
            pid=$(lsof -ti:$port 2>/dev/null || true)
        # Tenta com netstat
        elif command -v netstat >/dev/null 2>&1; then
            pid=$(netstat -tlnp 2>/dev/null | grep ":$port " | awk '{print $7}' | cut -d'/' -f1 | head -1 || true)
        # Tenta com ss
        elif command -v ss >/dev/null 2>&1; then
            pid=$(ss -tlnp 2>/dev/null | grep ":$port " | grep -oP 'pid=\K[0-9]+' | head -1 || true)
        fi
        
        if [ -n "$pid" ] && [ "$pid" != "-" ]; then
            echo -e "${YELLOW}Porta $port está em uso (PID: $pid), liberando...${NC}"
            kill -9 "$pid" >/dev/null 2>&1 || true
            sleep 1
        fi
    done
}

# Função para verificar se os containers foram removidos
verify_cleanup() {
    local containers=("front_next" "api_symfony")
    local has_containers=false
    
    for container in "${containers[@]}"; do
        if docker ps -a --format '{{.Names}}' | grep -q "^${container}$"; then
            echo -e "${RED}✗ Erro: Container ${container} ainda existe após limpeza!${NC}"
            has_containers=true
        fi
    done
    
    if [ "$has_containers" == "true" ]; then
        echo -e "${RED}Erro: Não foi possível limpar todos os containers.${NC}"
        echo -e "${YELLOW}Tente executar manualmente:${NC}"
        echo "  docker stop front_next api_symfony 2>/dev/null || true"
        echo "  docker rm -f front_next api_symfony 2>/dev/null || true"
        return 1
    fi
    
    return 0
}

# Função para parar e remover containers existentes
cleanup_containers() {
    local compose_files="$1"
    echo -e "${YELLOW}Limpando containers existentes...${NC}"
    
    # Lista de containers a limpar
    local containers=("front_next" "api_symfony")
    
    # Primeiro, tenta remover via docker-compose com diferentes combinações de arquivos
    echo -e "${BLUE}Removendo containers via docker-compose...${NC}"
    
    # Tentativa 1: Com todos os arquivos
    if [ -n "$compose_files" ]; then
        docker compose $compose_files down --remove-orphans --volumes >/dev/null 2>&1 || true
    fi
    
    # Tentativa 2: Apenas com docker-compose.yml principal
    docker compose -f docker-compose.yml down --remove-orphans >/dev/null 2>&1 || true
    
    # Tentativa 3: Com docker-compose.yml + apps/front/docker-compose.yml
    docker compose -f docker-compose.yml -f apps/front/docker-compose.yml down --remove-orphans >/dev/null 2>&1 || true
    
    # Para e remove containers pelo nome (força remoção)
    for container in "${containers[@]}"; do
        # Busca containers por nome (exato e parcial)
        local container_ids=$(docker ps -a --filter "name=^${container}$" --format "{{.ID}}" 2>/dev/null || true)
        
        if [ -n "$container_ids" ]; then
            echo -e "${BLUE}Removendo container ${container}...${NC}"
            # Para cada ID encontrado, força remoção
            for cid in $container_ids; do
                docker stop "$cid" --time 0 >/dev/null 2>&1 || true
                docker rm -f "$cid" >/dev/null 2>&1 || true
            done
        fi
        
        # Também tenta remover diretamente pelo nome
        docker stop "$container" --time 0 >/dev/null 2>&1 || true
        docker rm -f "$container" >/dev/null 2>&1 || true
    done
    
    # Remove containers órfãos que possam ter o mesmo nome
    docker container prune -f >/dev/null 2>&1 || true
    
    # Aguarda um pouco para garantir que tudo foi limpo
    sleep 3
    
    # Verifica e força remoção novamente se ainda existirem containers
    for container in "${containers[@]}"; do
        local container_ids=$(docker ps -a --filter "name=^${container}$" --format "{{.ID}}" 2>/dev/null || true)
        
        if [ -n "$container_ids" ]; then
            echo -e "${YELLOW}⚠ Aviso: Container ${container} ainda existe, forçando remoção agressiva...${NC}"
            for cid in $container_ids; do
                docker stop "$cid" --time 0 >/dev/null 2>&1 || true
                docker rm -f "$cid" >/dev/null 2>&1 || true
            done
            docker rm -f "$container" >/dev/null 2>&1 || true
        fi
    done
    
    echo -e "${GREEN}✓ Limpeza concluída!${NC}"
    echo ""
}

# Prepara arquivos docker-compose baseado no ambiente
DOCKER_COMPOSE_FILES="-f docker-compose.yml"
if [ "$ENV" == "dev" ]; then
    echo -e "${BLUE}Modo DEV ativado - usando pnpm dev para hot reloading${NC}"
    # Usa pnpm exec next dev para garantir que encontre o next
    export FRONT_COMMAND="sh -c 'pnpm exec next dev'"
    # Configura volumes para hot reloading (paths absolutos)
    # Garante que os diretórios existem antes de montar
    FRONT_SOURCE="$(pwd)/apps/front"
    API_SOURCE="$(pwd)/apps/api"
    
    if [ ! -d "$FRONT_SOURCE" ]; then
        echo -e "${RED}Erro: Diretório $FRONT_SOURCE não existe!${NC}"
        exit 1
    fi
    
    if [ ! -d "$API_SOURCE" ]; then
        echo -e "${RED}Erro: Diretório $API_SOURCE não existe!${NC}"
        exit 1
    fi
    
    export FRONT_VOLUME_SOURCE="$FRONT_SOURCE"
    export FRONT_VOLUME_TARGET="/app"
    export API_VOLUME_SOURCE="$API_SOURCE"
    export API_VOLUME_TARGET="/var/www/html"
    
    # Cria arquivo docker-compose.override.yml para adicionar volumes em modo DEV
    OVERRIDE_FILE="docker-compose.override.yml"
    cat > "$OVERRIDE_FILE" << EOF
services:
  front:
    volumes:
      - ${FRONT_VOLUME_SOURCE}:${FRONT_VOLUME_TARGET}
  
  api:
    volumes:
      - ${API_VOLUME_SOURCE}:${API_VOLUME_TARGET}
EOF
    DOCKER_COMPOSE_FILES="$DOCKER_COMPOSE_FILES -f $OVERRIDE_FILE"
    echo -e "${BLUE}Hot reloading ativado - mudanças no código serão refletidas automaticamente${NC}"
else
    # Em modo não-DEV, remove arquivo de override se existir
    if [ -f "docker-compose.override.yml" ]; then
        rm -f "docker-compose.override.yml"
    fi
    # Não define variáveis de volume em modo não-DEV
    unset FRONT_VOLUME_SOURCE FRONT_VOLUME_TARGET API_VOLUME_SOURCE API_VOLUME_TARGET 2>/dev/null || true
fi

# Reinicia automaticamente se solicitado
if [ "$RESTART" == "true" ]; then
    # Libera portas e limpa containers existentes antes de iniciar
    free_ports
    cleanup_containers "$DOCKER_COMPOSE_FILES"
    
    # Verifica limpeza antes de continuar
    if ! verify_cleanup; then
        echo -e "${YELLOW}Tentando limpeza adicional...${NC}"
        # Tenta uma última vez remover qualquer container relacionado
        docker stop front_next api_symfony 2>/dev/null || true
        docker rm -f front_next api_symfony 2>/dev/null || true
        sleep 2
        
        # Verifica novamente
        if ! verify_cleanup; then
            echo -e "${RED}Não foi possível limpar completamente os containers.${NC}"
            echo -e "${YELLOW}Execute manualmente antes de continuar:${NC}"
            echo "  docker stop front_next api_symfony"
            echo "  docker rm -f front_next api_symfony"
            exit 1
        fi
    fi
    
    echo -e "${YELLOW}Iniciando todos os containers...${NC}"
    # Tenta criar os containers
    if ! docker compose $DOCKER_COMPOSE_FILES up -d --force-recreate --remove-orphans 2>&1; then
        echo -e "${YELLOW}Tentativa falhou, limpando e tentando novamente...${NC}"
        # Remove containers novamente e tenta sem force-recreate
        docker stop front_next api_symfony 2>/dev/null || true
        docker rm -f front_next api_symfony 2>/dev/null || true
        sleep 3
        docker compose $DOCKER_COMPOSE_FILES up -d --remove-orphans
    fi
    echo ""
    echo -e "${GREEN}✓ Containers iniciados!${NC}"
    echo ""
    # Exibe informações do ambiente
    show_environment_info
    else
        # Pergunta se deseja fazer restart (padrão: S)
        read -p "Deseja iniciar/reiniciar os containers agora? (S/n): " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Nn]$ ]]; then
            echo -e "${BLUE}Para iniciar/reiniciar os containers:${NC}"
            echo "  docker compose $DOCKER_COMPOSE_FILES up -d"
            echo ""
            echo -e "${BLUE}Para ver o status:${NC}"
            echo "  docker compose -f docker-compose.yml ps"
            # Exibe informações do ambiente mesmo sem iniciar containers
            show_environment_info
        else
            # Libera portas e limpa containers existentes antes de iniciar
            free_ports
            cleanup_containers "$DOCKER_COMPOSE_FILES"
            
            # Verifica limpeza antes de continuar
            if ! verify_cleanup; then
                echo -e "${YELLOW}Tentando limpeza adicional...${NC}"
                # Tenta uma última vez remover qualquer container relacionado
                docker stop front_next api_symfony 2>/dev/null || true
                docker rm -f front_next api_symfony 2>/dev/null || true
                sleep 2
                
                # Verifica novamente
                if ! verify_cleanup; then
                    echo -e "${RED}Não foi possível limpar completamente os containers.${NC}"
                    echo -e "${YELLOW}Execute manualmente antes de continuar:${NC}"
                    echo "  docker stop front_next api_symfony"
                    echo "  docker rm -f front_next api_symfony"
                    exit 1
                fi
            fi
            
            echo -e "${YELLOW}Iniciando containers...${NC}"
            # Tenta criar os containers
            if ! docker compose $DOCKER_COMPOSE_FILES up -d --force-recreate --remove-orphans 2>&1; then
                echo -e "${YELLOW}Tentativa falhou, limpando e tentando novamente...${NC}"
                # Remove containers novamente e tenta sem force-recreate
                docker stop front_next api_symfony 2>/dev/null || true
                docker rm -f front_next api_symfony 2>/dev/null || true
                sleep 3
                docker compose $DOCKER_COMPOSE_FILES up -d --remove-orphans
            fi
            echo ""
            echo -e "${GREEN}✓ Containers iniciados!${NC}"
            echo ""
            # Exibe informações do ambiente
            show_environment_info
        fi
    fi
# Remove o arquivo .env da raiz após o build e deploy por segurança
# O arquivo será recriado automaticamente na próxima execução do script
if [ -f "$ROOT_ENV_FILE" ]; then
    rm -f "$ROOT_ENV_FILE"
fi

# Remove o arquivo docker-compose.override.yml se não estiver em modo DEV
# (em modo DEV, ele será recriado na próxima execução)
if [ "$ENV" != "dev" ] && [ -f "docker-compose.override.yml" ]; then
    rm -f "docker-compose.override.yml"
fi

