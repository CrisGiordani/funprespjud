# 🔐 Guia de Autenticação JWT - RequiresJwtAuth

## 📋 Visão Geral

O `RequiresJwtAuth` é um atributo personalizado que protege rotas da API, exigindo um token JWT válido para acesso. Este guia explica como aplicar e usar a autenticação JWT em todo o projeto.

## 🎯 Como Aplicar o RequiresJwtAuth

### 1. **Proteção de Classe (Recomendado)**

Aplique o atributo na classe do controller para proteger **todas as rotas** do controller:

```php
<?php

namespace App\Controller;

use App\Attribute\RequiresJwtAuth;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/api/v1/meu-controller')]
#[RequiresJwtAuth]  // ← Protege todas as rotas da classe
final class MeuController extends AbstractController
{
    #[Route('/rota1', methods: ['GET'])]
    public function rota1(): JsonResponse
    {
        // Esta rota está automaticamente protegida
        return $this->json(['message' => 'Rota protegida']);
    }

    #[Route('/rota2', methods: ['POST'])]
    public function rota2(): JsonResponse
    {
        // Esta rota também está protegida
        return $this->json(['message' => 'Outra rota protegida']);
    }
}
```

### 2. **Proteção de Método Individual**

Aplique o atributo apenas em métodos específicos:

```php
<?php

namespace App\Controller;

use App\Attribute\RequiresJwtAuth;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/api/v1/meu-controller')]
final class MeuController extends AbstractController
{
    #[Route('/publica', methods: ['GET'])]
    public function rotaPublica(): JsonResponse
    {
        // Esta rota é pública
        return $this->json(['message' => 'Rota pública']);
    }

    #[Route('/protegida', methods: ['GET'])]
    #[RequiresJwtAuth]  // ← Protege apenas esta rota
    public function rotaProtegida(): JsonResponse
    {
        // Esta rota está protegida
        return $this->json(['message' => 'Rota protegida']);
    }
}
```

### 3. **Proteção com Roles Específicas**

Você pode especificar roles específicas para controle de acesso:

```php
#[RequiresJwtAuth(roles: ['ROLE_ADMIN'])]
public function rotaAdmin(): JsonResponse
{
    // Apenas usuários com ROLE_ADMIN podem acessar
    return $this->json(['message' => 'Rota de admin']);
}

#[RequiresJwtAuth(roles: ['ROLE_USER', 'ROLE_OPERATOR'])]
public function rotaUsuario(): JsonResponse
{
    // Usuários com ROLE_USER ou ROLE_OPERATOR podem acessar
    return $this->json(['message' => 'Rota de usuário']);
}
```

## 🔧 Como Funciona

### 1. **Processamento do Atributo**

O `JwtAttributeListener` intercepta todas as requisições e verifica:

1. Se o controller ou método tem o atributo `RequiresJwtAuth`
2. Se um token JWT válido foi fornecido
3. Se o token não expirou
4. Se o usuário tem as roles necessárias (se especificadas)

### 2. **Extração do Token**

O token é extraído do header `Authorization`:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. **Validação do Token**

O token é validado usando o algoritmo HS256 ou RS256, dependendo da configuração.

### 4. **Acesso aos Dados do Token**

Após a validação, os dados do payload ficam disponíveis na requisição:

```php
public function minhaRota(Request $request): JsonResponse
{
    $payload = $request->attributes->get('jwt_payload');

    $userId = $payload['sub'] ?? null;
    $email = $payload['email'] ?? null;
    $roles = $payload['roles'] ?? [];

    return $this->json([
        'user_id' => $userId,
        'email' => $email,
        'roles' => $roles
    ]);
}
```

## 📊 Status de Proteção dos Controllers

### ✅ Controllers Protegidos

| Controller                     | Status | Proteção            |
| ------------------------------ | ------ | ------------------- |
| `AuthController`               | ✅     | Métodos específicos |
| `BeneficiarioController`       | ✅     | Classe completa     |
| `CampanhaController`           | ✅     | Classe completa     |
| `ContribuicoesController`      | ✅     | Classe completa     |
| `CotasController`              | ✅     | Classe completa     |
| `DocumentoController`          | ✅     | Classe completa     |
| `ExtratoController`            | ✅     | Classe completa     |
| `ImpostoRendaController`       | ✅     | Classe completa     |
| `JasperController`             | ✅     | Classe completa     |
| `LgpdController`               | ✅     | Classe completa     |
| `ParticipanteController`       | ✅     | Métodos específicos |
| `PatrimonioController`         | ✅     | Classe completa     |
| `PerfilInvestimentoController` | ✅     | Métodos específicos |
| `PessoaController`             | ✅     | Classe completa     |
| `PlanoController`              | ✅     | Classe completa     |
| `QuestionarioController`       | ✅     | Classe completa     |
| `SaldoController`              | ✅     | Classe completa     |
| `SimuladorController`          | ✅     | Classe completa     |
| `WebDAVTestController`         | ✅     | Classe completa     |

## 🚀 Como Fazer Requisições

### 1. **Requisição com Token Válido**

```bash
curl -H "Authorization: Bearer SEU_TOKEN_JWT" \
     http://localhost:8000/api/v1/participantes/123/perfil
```

### 2. **Requisição sem Token (Retorna 401)**

```bash
curl http://localhost:8000/api/v1/participantes/123/perfil
# Retorna: {"error": "Unauthorized", "message": "Token não fornecido"}
```

### 3. **Requisição com Token Inválido (Retorna 401)**

```bash
curl -H "Authorization: Bearer TOKEN_INVALIDO" \
     http://localhost:8000/api/v1/participantes/123/perfil
# Retorna: {"error": "Unauthorized", "message": "Token JWT inválido: ..."}
```

## 🔍 Debug e Testes

### 1. **Verificar Token**

```bash
curl -H "Authorization: Bearer SEU_TOKEN" \
     http://localhost:8000/api/auth/validate
```

### 2. **Obter Informações do Usuário**

```bash
curl -H "Authorization: Bearer SEU_TOKEN" \
     http://localhost:8000/api/auth/user-info
```

### 3. **Rota Pública (Sem Autenticação)**

```bash
curl http://localhost:8000/api/auth/public
```

## ⚠️ Exceções e Rotas Públicas

### Rotas Públicas

Algumas rotas podem precisar ser públicas (sem autenticação):

```php
// Exemplo: rota de login, health check, etc.
#[Route('/api/auth/public', methods: ['GET'])]
public function rotaPublica(): JsonResponse
{
    return $this->json(['message' => 'Rota pública']);
}
```

### Tratamento de Erros

O sistema retorna respostas de erro padronizadas:

- **401 Unauthorized**: Token não fornecido ou inválido
- **403 Forbidden**: Token válido mas sem permissão (roles)
- **500 Internal Server Error**: Erro interno na validação

## 🔧 Configuração

### Variáveis de Ambiente

```env
# Chave secreta para tokens HS256
JWT_SECRET=sua-chave-secreta-muito-segura

# Chave pública para tokens RS256 (se aplicável)
JWT_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----
```

### Services Registrados

```yaml
# config/services.yaml
App\EventListener\JwtAttributeListener:
  tags:
    - { name: "kernel.event_subscriber" }
```

## 📝 Boas Práticas

1. **Use proteção de classe** para controllers onde todas as rotas precisam de autenticação
2. **Use proteção de método** para controllers com rotas mistas (públicas e protegidas)
3. **Especifique roles** quando necessário para controle de acesso granular
4. **Teste sempre** as rotas com e sem token para garantir a proteção
5. **Mantenha tokens seguros** e nunca os exponha em logs ou respostas de erro

## 🎯 Resumo

Com o `RequiresJwtAuth`, todas as rotas da API estão agora protegidas por autenticação JWT. O sistema:

- ✅ Valida tokens automaticamente
- ✅ Extrai dados do payload
- ✅ Suporta controle de acesso por roles
- ✅ Retorna respostas de erro padronizadas
- ✅ É fácil de usar e manter

Para adicionar proteção a novos controllers, simplesmente adicione `#[RequiresJwtAuth]` na classe ou nos métodos específicos!
