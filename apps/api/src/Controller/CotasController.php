<?php

namespace App\Controller;

use App\Attribute\RequiresJwtAuth;
use App\Attribute\RouteCpfEncrypted;
use App\Attribute\ValidateCpfOwnership;
use App\Exception\CotasNotFoundException;
use App\Http\Response\ApiResponse;
use App\Interface\Trust\Service\TrustCotasServiceInterface;
use App\Trait\ApiTrait;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/v1')]
#[RequiresJwtAuth]
final class CotasController extends AbstractController
{
    use ApiTrait;

    public function __construct(
        private TrustCotasServiceInterface $trustCotasService,
        private SerializerInterface $serializer
    ) {}

    #[Route('/cotas/atual/{cpf}', name: 'cotas_atual', methods: ['GET'])]
    public function getCotasAtual(#[RouteCpfEncrypted] #[ValidateCpfOwnership] string $cpf, Request $request): JsonResponse
    {
        try {
            $cotasAtual = $this->trustCotasService->getCotasAtual($cpf);
             $cotasAtual = $this->serializer->serialize($cotasAtual, 'json', ['groups' => ['cotas:read']]);

            return ApiResponse::success(
                data: json_decode($cotasAtual, true),
                message: 'Cotas atuais encontradas com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (CotasNotFoundException $e) {
            return ApiResponse::notFound(
                'Cotas não encontradas',
                [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (\Exception $e) {
            return $this->handleApiException($e, $request);
        }
    }

    #[Route('/cotas/historico', name: 'cotas_historico', methods: ['GET'])]
    public function getCotasHistorico(Request $request): JsonResponse
    {
        try {
            $pageIndex = $request->query->getInt('pageIndex', 0);
            $pageSize = $request->query->getInt('pageSize', 10);
            $anoCotas = $request->query->get('anoCotas');

            $filter = [
                'pageIndex' => $pageIndex,
                'pageSize' => $pageSize,
                'anoCotas' => $anoCotas,
            ];

            $result = $this->trustCotasService->getCotasPaginadas($filter);

            return ApiResponse::paginated(
                items: $result['data'] ?? [],
                total: count($result['data']) ?? 0,
                page: $pageIndex + 1,
                perPage: $pageSize,
                message: 'Histórico de cotas encontrado com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                    'filtros' => [
                        'anoCotas' => $anoCotas,
                    ],
                ]
            );
        } catch (CotasNotFoundException $e) {
            return ApiResponse::notFound(
                'Histórico de cotas não encontrado',
                [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (\Exception $e) {
            return $this->handleApiException($e, $request);
        }
    }

    #[Route('/sorteios/resultados', name: 'sorteios_resultados', methods: ['GET'])]
    public function getSorteiosResultados(Request $request): JsonResponse
    {
        return ApiResponse::success(
            data: [
                'message' => 'Endpoint para resultados de sorteios',
            ],
            message: 'Endpoint de resultados de sorteios disponível',
            metadata: [
                'version' => '1.0',
                'endpoint' => $request->getPathInfo(),
                'method' => $request->getMethod(),
            ]
        );
    }
}
