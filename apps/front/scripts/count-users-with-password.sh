#!/bin/bash

# Script para contar usuários com senha cadastrada
# Executa o script TypeScript através do pnpm

cd "$(dirname "$0")/.." || exit 1

echo "📊 Executando análise de usuários com senha..."
echo ""

pnpm run count:users-with-password

