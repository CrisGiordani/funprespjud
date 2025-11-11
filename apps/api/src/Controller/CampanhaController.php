<?php

namespace App\Controller;

use App\Attribute\RequiresJwtAuth;
use App\Entity\Iris\App\Campanha;
use App\Exception\CampanhaNotFoundException;
use App\Exception\CampanhaSaveException;
use App\Http\Response\ApiResponse;
use App\Interface\Iris\Service\App\CampanhaServiceInterface;
use App\Interface\Iris\Service\App\PerfilInvestimentoAlteracaoServiceInterface;
use App\Trait\ApiTrait;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryString;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/v1/campanhas', name: 'app_campanhas')]
#[RequiresJwtAuth]
final class CampanhaController extends AbstractController
{
    use ApiTrait;

    public function __construct(
        private readonly CampanhaServiceInterface $campanhaService,
        private readonly SerializerInterface $serializer,
        private readonly PerfilInvestimentoAlteracaoServiceInterface $perfilInvestimentoAlteracaoService
    ) {}

    #[Route('/', name: 'campanhas_get', methods: ['GET'])]
    public function getCampanhas(Request $request): JsonResponse
    {
        try {
            $filter = [
                'pageIndex' => (int) $request->query->get('pageIndex', 0),
                'pageSize' => (int) $request->query->get('pageSize', 9),
                'tipo' => $request->query->get('tipo'),
                'ano' => $request->query->get('ano'),
            ];

            $campanhas = $this->campanhaService->getAll($filter);

            $campanhasResponse = [
                'campanhas' =>  $campanhas->getItems(),
                'pageIndex' => $campanhas->getCurrentPageNumber() - 1, // Converter para base 0
                'pageSize' => $campanhas->getItemNumberPerPage(),
                'totalPages' => ceil($campanhas->getTotalItemCount() / $campanhas->getItemNumberPerPage()),
                'totalItems' => $campanhas->getTotalItemCount(),
            ];

            $campanhasArray = json_decode($this->serializer->serialize($campanhasResponse, 'json', [
                'groups' => ['campanha:read'],
                'circular_reference_handler' => function ($object) {
                    return $object->getId();
                },
            ]), true);

            return ApiResponse::success(
                data: $campanhasArray,
                message: 'Campanhas encontradas com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (\Exception $exception) {
            return ApiResponse::notFound(
                message: $exception->getMessage(),
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        }
    }

    #[Route(name: 'criar-campanha', methods: ['POST'])]
    public function novaCampanha(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            $this->campanhaService->criarCampanha($data);

            return ApiResponse::created(
                message: 'Campanha criada com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (CampanhaSaveException $e) {
            return ApiResponse::error(
                errors: true,
                message: $e->getMessage(),
                statusCode: Response::HTTP_INTERNAL_SERVER_ERROR,
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ],
            );
        }
    }

    #[Route('/editar-campanha/{idCampanha}', name: 'editar-campanha', methods: ['PUT'])]
    public function editarCampanha(Request $request, int $idCampanha): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            $campanha = $this->campanhaService->editarCampanha($idCampanha, $data);

            return ApiResponse::success(
                message: 'Campanha atualizada com sucesso',
                data: json_decode($this->serializer->serialize($campanha, 'json', [
                    'groups' => ['campanha:read'],
                ]), true),
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (CampanhaNotFoundException $exception) {
            return ApiResponse::notFound(
                message: $exception->getMessage(),
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (CampanhaSaveException $exception) {
            return ApiResponse::error(
                message: $exception->getMessage(),
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (\Exception $exception) {
            return $this->handleApiException($exception, $request);
        }
    }

    #[Route('/campanha-ativa', name: 'campanha_ativa_get', methods: ['GET'])]
    public function getAtivas(
        Request $request
    ): JsonResponse {
        try {
            $campanha = $this->campanhaService->getCampanhaAtiva();

            return ApiResponse::success(
                data: $campanha,
                message: $campanha ? 'Campanha ativa encontrada com sucesso' : 'Nenhuma campanha ativa no momento',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (CampanhaNotFoundException $exception) {
            // Retorna sucesso com dados vazios em vez de erro 404
            return ApiResponse::success(
                data: null,
                message: 'Nenhuma campanha ativa no momento',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (\Exception $exception) {
            return $this->handleApiException($exception, $request);
        }
    }

    #[Route('/{id:campanha}', name: 'deletar-campanha', methods: ['DELETE'])]
    public function deleteCampanha(
        Request $request,
        #[MapEntity(mapping: ['campanha' => 'id'],  objectManager: 'iris', message: 'Campanha não encontrada')] Campanha $campanha
    ): JsonResponse {
        try {

            $this->campanhaService->deleteCampanha($campanha);

            return ApiResponse::success(
                message: 'Campanha deletada com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (CampanhaSaveException $exception) {
            return ApiResponse::error(
                message: $exception->getMessage(),
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (\Exception $exception) {
            return $this->handleApiException($exception, $request);
        }
    }

    #[Route('/resumo/{idCampanha}', name: 'resumo-solicitacoes-campanha', methods: ['GET'])]
    public function resumoSolicitacoesCampanha(Request $request, int $idCampanha): JsonResponse
    {
        try {
            $resumo = $this->campanhaService->getResumoSolicitacoesCampanha($idCampanha);

            return ApiResponse::success(
                message: 'Resumo de solicitações encontradas com sucesso',
                data: $resumo,
            );
        } catch (\Exception $exception) {

            return $this->handleApiException($exception, $request);
        }
    }

    #[Route('/distribuicao/{idCampanha}', name: 'distribuicao-solicitacoes-campanha', methods: ['GET'])]
    public function distribuirSolicitacoesCampanha(Request $request, int $idCampanha): JsonResponse
    {
        try {
            $distribuicao = $this->campanhaService->getDistribuicaoSolicitacoesCampanha($idCampanha);

            return ApiResponse::success(
                message: 'Distribuição de solicitações encontradas com sucesso',
                data: $distribuicao,
            );
        } catch (\Exception $exception) {
            return $this->handleApiException($exception, $request);
        }
    }

    #[Route('/migracao-perfil-investimento/{idCampanha}', name: 'migracao-perfil-investimento', methods: ['GET'])]
    public function migracaoPerfilInvestimento(Request $request, int $idCampanha): JsonResponse
    {
        try {
            //* MigracaoSolicitacoesDTO
            $solicitacoes = $this->perfilInvestimentoAlteracaoService->migracaoPerfilInvestimento($idCampanha);

            return ApiResponse::success(
                message: 'Solicitações de perfil de investimento encontradas com sucesso',
                data: $solicitacoes->toArray(),
            );
        } catch (\Exception $exception) {
            return $this->handleApiException($exception, $request);
        }
    }
}
