# Guia de Uso do PaginationHelper

Este documento fornece um guia passo a passo sobre como implementar paginação em seus repositórios usando o `PaginationHelper`.

## 1. Estrutura Básica

O `PaginationHelper` fornece os seguintes métodos estáticos:

```php
PaginationHelper::validatePaginationParams($filter);    // Valida e retorna parâmetros de paginação
PaginationHelper::calculateOffset($pageIndex, $pageSize); // Calcula o offset
PaginationHelper::createEmptyResponse($pageIndex, $pageSize); // Cria resposta vazia
```

## 2. Implementação no Repositório

### 2.1. Importe as Dependências Necessárias

```php
use App\Helper\Pagination\PaginationHelper;
use Doctrine\DBAL\Connection;
use Psr\Log\LoggerInterface;
```

### 2.2. Crie o Método de Paginação

```php
public function getDadosPaginados(array $filter): array
{
    try {
        // 1. Valida e obtém os parâmetros de paginação
        $params = PaginationHelper::validatePaginationParams($filter);
        $pageIndex = $params['pageIndex'];
        $pageSize = $params['pageSize'];
        
        // 2. Calcula o offset
        $offset = PaginationHelper::calculateOffset($pageIndex, $pageSize);

        // 3. Obtém o total de registros
        $totalRegistros = $this->getTotalRegistros($filter);

        // 4. Se não houver registros, retorna resposta vazia
        if ($totalRegistros === 0) {
            return PaginationHelper::createEmptyResponse($pageIndex, $pageSize);
        }

        // 5. Obtém os dados paginados
        $dados = $this->getPaginatedData($pageSize, $offset, $filter);
        
        // 6. Transforma os dados
        $dadosTransformados = $this->transformResults($dados);

        // 7. Cria a resposta com paginação
        return [
            'dados' => $dadosTransformados,
            'totalRegistros' => $totalRegistros,
            'pageIndex' => $pageIndex,
            'pageSize' => $pageSize,
            'totalPages' => ceil($totalRegistros / $pageSize)
        ];
    } catch (\Exception $e) {
        $this->logger->error('Erro ao buscar dados paginados: ' . $e->getMessage());
        throw $e;
    }
}
```

### 2.3. Implemente os Métodos Auxiliares

```php
private function getTotalRegistros(array $filter): int
{
    $qb = $this->connection->createQueryBuilder()
        ->select('COUNT(*) as total')
        ->from('SUA_TABELA', 't');

    // Adicione filtros conforme necessário
    if (isset($filter['campo'])) {
        $qb->andWhere('t.campo = :valor')
           ->setParameter('valor', $filter['campo']);
    }

    $total = $qb->executeQuery()->fetchAssociative();
    return (int) $total['total'];
}

private function getPaginatedData(int $pageSize, int $offset, array $filter): array
{
    $qb = $this->connection->createQueryBuilder()
        ->select('t.*')
        ->from('SUA_TABELA', 't');

    // Adicione filtros conforme necessário
    if (isset($filter['campo'])) {
        $qb->andWhere('t.campo = :valor')
           ->setParameter('valor', $filter['campo']);
    }

    $qb->setMaxResults($pageSize)
       ->setFirstResult($offset);

    return $qb->executeQuery()->fetchAllAssociative();
}

private function transformResults(array $results): array
{
    return array_map(
        fn($result) => [
            // Transforme os dados conforme necessário
            'id' => $result['id'],
            'nome' => $result['nome'],
            // ... outros campos
        ],
        $results
    );
}
```

## 3. Implementação no Controller

### 3.1. Importe as Dependências Necessárias

```php
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
```

### 3.2. Crie o Endpoint de Paginação

```php
#[Route("/api/v1/seu-endpoint", name: 'seu_endpoint', methods: ['GET'])]
public function getDados(Request $request): JsonResponse
{
    try {
        // Obtém parâmetros da requisição
        $pageIndex = $request->query->getInt('pageIndex', 0);
        $pageSize = $request->query->getInt('pageSize', 10);
        $filtro = $request->query->get('filtro');

        // Cria o array de filtros
        $filter = [
            'pageIndex' => $pageIndex,
            'pageSize' => $pageSize,
            'filtro' => $filtro
        ];

        // Obtém os dados paginados
        $result = $this->seuService->getDadosPaginados($filter);

        // Retorna a resposta
        return $this->json([
            'success' => true,
            'data' => $result
        ], 200);
    } catch (\Exception $e) {
        return $this->json([
            'success' => false,
            'error' => $e->getMessage()
        ], 500);
    }
}
```

## 4. Estrutura da Resposta

A resposta terá a seguinte estrutura:

```json
{
    "success": true,
    "data": {
        "dados": [
            {
                "id": "123",
                "nome": "Exemplo",
                // ... outros campos
            }
        ],
        "totalRegistros": 100,
        "pageIndex": 0,
        "pageSize": 10,
        "totalPages": 10
    }
}
```

## 5. Exemplo de Uso

### 5.1. Requisição
```
GET /api/v1/seu-endpoint?pageIndex=0&pageSize=10&filtro=valor
```

### 5.2. Parâmetros Opcionais
- `pageIndex`: Índice da página (padrão: 0)
- `pageSize`: Tamanho da página (padrão: 10)
- Outros parâmetros de filtro conforme necessário

## 6. Boas Práticas

1. **Validação de Parâmetros**: Sempre valide os parâmetros de entrada
2. **Tratamento de Erros**: Implemente tratamento adequado de erros
3. **Logging**: Adicione logs para facilitar o debug
4. **Documentação**: Documente os parâmetros e a estrutura da resposta
5. **Consistência**: Mantenha a estrutura da resposta consistente em todos os endpoints

## 7. Exemplo Completo

Para um exemplo completo de implementação, consulte o `TrustCotasRepository` e `CotasController` no código fonte. 