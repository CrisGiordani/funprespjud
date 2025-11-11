<?php

namespace App\Controller;

use App\Attribute\RequiresJwtAuth;
use App\Attribute\RouteCpfEncrypted;
use App\Attribute\ValidateCpfOwnership;
use App\DTO\Trust\Input\ContribuicaoFilterDTO;
use App\Exception\ContribuicaoDoMesNotFoundException;
use App\Http\Response\ApiResponse;
use App\Service\Trust\Contribuicao\TrustContribuicaoService;
use App\Trait\ApiTrait;
use DateTime;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/v1/participantes')]
#[RequiresJwtAuth]
final class ContribuicoesController extends AbstractController
{
    use ApiTrait;

    public function __construct(
        private TrustContribuicaoService $trustContribuicaoService,
        private SerializerInterface $serializer
    ) {}

    #[Route('/{cpf}/contribuicoes', name: 'contribuicoes_list', methods: ['GET'])]
    public function list(#[RouteCpfEncrypted] #[ValidateCpfOwnership] string $cpf, Request $request): JsonResponse
    {
        try {
            $query = json_encode($request->query->all());
            $filter = $this->serializer->deserialize($query, ContribuicaoFilterDTO::class, 'json');

            $contribuicoes = $this->trustContribuicaoService->getContribuicoes($cpf, $filter);

            // Serialize the data with proper groups
            $serializedContribuicoes = $this->serializer->serialize($contribuicoes, 'json', [
                'groups' => ['contribuicao:read'],
                'circular_reference_handler' => function ($object) {
                    return $object->getId();
                },
            ]);
            $contribuicoesArray = json_decode($serializedContribuicoes, true);

            return ApiResponse::success(
                data: $contribuicoesArray,
                message: 'Contribuições encontradas com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                    'filtros' => [
                        'dataInicial' => $filter->getDataInicial(),
                        'dataFinal' => $filter->getDataFinal(),
                        'pageIndex' => $filter->getPageIndex(),
                        'pageSize' => $filter->getPageSize(),
                        'tipo' => $filter->getTipo(),
                        'orgao' => $filter->getOrgao(),
                        'autor' => $filter->getAutor(),
                        'patrocinador' => $filter->getPatrocinador(),
                    ],
                ]
            );
        } catch (\Exception $e) {
            return $this->handleApiException($e, $request);
        }
    }

    #[Route('/{cpf}/contribuicoes-mes-ano', name: 'contribuicoes_mes_ano', methods: ['GET'])]
    public function getContribuicaoMesAno(#[RouteCpfEncrypted] #[ValidateCpfOwnership] string $cpf, Request $request): JsonResponse
    {
        try {
            $contribuicoes = $this->trustContribuicaoService->getContribuicaoDoMes($cpf);

            $serializedData = $this->serializer->serialize($contribuicoes, 'json');
            $data = json_decode($serializedData, true);

            return ApiResponse::success(
                data: $data,
                message: 'Contribuições encontradas com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (ContribuicaoDoMesNotFoundException $exception) {
            return ApiResponse::noContent();
        } catch (\Exception $e) {
            return $this->handleApiException($e, $request);
        }
    }

    #[Route('/{cpf}/percentual-contribuicao', name: 'percentual_contribuicoes', methods: ['GET'])]
    public function getPercentualContribuicaoAtual(#[RouteCpfEncrypted] #[ValidateCpfOwnership] string $cpf, Request $request): JsonResponse
    {
        try {
            $percentualContribuicaoAtual = $this->trustContribuicaoService->getPercentualContribuicaoAtual($cpf);

            return ApiResponse::success(
                data: $percentualContribuicaoAtual,
                message: 'Percentual de contribuição atual encontrado com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (ContribuicaoDoMesNotFoundException $exception) {
            return ApiResponse::noContent();
        } catch (\Exception $e) {
            return $this->handleApiException($e, $request);
        }
    }

    /**
     * Retorna um filtro com as datas dos últimos 6 meses
     */
    private function getDefaultFilter(): ContribuicaoFilterDTO
    {
        $hoje = new DateTime();
        $dataFinal = $hoje->format('d/m/Y');

        // Subtrai 6 meses da data atual
        $dataInicial = (clone $hoje)->modify('-6 months')->format('d/m/Y');

        return new ContribuicaoFilterDTO([
            'dataInicial' => $dataInicial,
            'dataFinal' => $dataFinal,
        ]);
    }
}
