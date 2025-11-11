# Convenção de Commits

Este projeto segue a convenção de commits convencionais para manter um histórico limpo e organizado.

## Formato

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

## Tipos de Commit

- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **docs**: Documentação
- **style**: Formatação, ponto e vírgula, etc
- **refactor**: Refatoração de código
- **perf**: Melhorias de performance
- **test**: Adicionando ou corrigindo testes
- **chore**: Tarefas de manutenção
- **ci**: Mudanças em CI/CD
- **build**: Mudanças no build
- **revert**: Reverte um commit anterior

## Exemplos

### ✅ Commits válidos:

```bash
git commit -m "feat: adiciona autenticação com JWT"
git commit -m "fix: corrige erro de validação no formulário"
git commit -m "docs: atualiza README com instruções de instalação"
git commit -m "style: formata código com prettier"
git commit -m "refactor: reorganiza estrutura de componentes"
git commit -m "test: adiciona testes para componente Button"
git commit -m "chore: atualiza dependências"
```

### ❌ Commits inválidos:

```bash
git commit -m "adiciona coisa nova"           # Sem tipo
git commit -m "FEAT: nova funcionalidade"     # Tipo em maiúsculo
git commit -m "feat:"                         # Sem descrição
git commit -m "feat: nova funcionalidade."    # Com ponto final
```

## Escopo (Opcional)

Você pode especificar um escopo para indicar qual parte do projeto foi afetada:

```bash
git commit -m "feat(auth): implementa login social"
git commit -m "fix(ui): corrige alinhamento dos botões"
git commit -m "docs(api): atualiza documentação dos endpoints"
```

## Corpo da Mensagem (Opcional)

Para commits mais complexos, você pode adicionar um corpo explicando o que e por que:

```bash
git commit -m "feat: implementa sistema de notificações

- Adiciona toast notifications
- Implementa sistema de prioridades
- Permite configuração de tempo de exibição

Closes #123"
```

## Como funciona

1. **Pre-commit**: Executa o lint para verificar qualidade do código
2. **Commit-msg**: Valida o formato da mensagem de commit
3. Se qualquer um falhar, o commit é bloqueado
