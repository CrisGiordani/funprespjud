<?php

namespace App\Controller;

use App\Attribute\RequiresJwtAuth;
use App\Attribute\RouteCpfEncrypted;
use App\Attribute\ValidateCpfOwnership;
use App\DTO\Iris\App\Output\PerfilInvestimentoAlteracaoOutputDTO;
use App\Exception\SolicitacaoAlteracaoPerfilNotFoundException;
use App\Http\Response\ApiResponse;
use App\Interface\Iris\Repository\App\StatusHistoricoRepositoryInterface;
use App\Interface\Iris\Service\App\DocumentoServiceInterface;
use App\Interface\Iris\Service\App\HistoricoServiceInterface;
use App\Interface\Iris\Service\App\PerfilInvestimentoAlteracaoServiceInterface;
use App\Interface\Iris\Service\App\PerfilRecomendadoServiceInterface;
use App\Interface\Jasper\JasperServiceInterface;
use App\Interface\Storage\WebDAV\WebDAVServiceInterface;
use App\Interface\Trust\Service\TrustParticipanteServiceInterface;
use App\Trait\ApiTrait;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/v1/perfil-investimento')]
#[RequiresJwtAuth]
final class PerfilInvestimentoController extends AbstractController
{
    use ApiTrait;

    public function __construct(
        private readonly DocumentoServiceInterface $documentoService,
        private readonly JasperServiceInterface $jasperService,
        private readonly WebDAVServiceInterface $webDAVService,
        private readonly HistoricoServiceInterface $historicoService,
        private readonly StatusHistoricoRepositoryInterface $statusHistoricoRepository,
        private readonly PerfilInvestimentoAlteracaoServiceInterface $perfilInvestimentoAlteracaoService,
        private readonly PerfilRecomendadoServiceInterface $perfilRecomendadoService,
        private readonly SerializerInterface $serializer,
        private readonly TrustParticipanteServiceInterface $trustParticipanteService
    ) {}

    #[Route('/relatorio/{cpf}', name: 'relatorio', methods: ['POST'])]
    public function relatorio(Request $request, #[RouteCpfEncrypted] #[ValidateCpfOwnership] string $cpf): Response
    {
        try {
            $data = json_decode($request->getContent(), true);

            $url = $this->documentoService->relatoriosApp($cpf, $data['status']);
            if ($url) {
                return new JsonResponse([
                    'success' => true,
                    'url' => $url,
                    'message' => 'Relatório gerado e enviado para a nuvem com sucesso',
                ], Response::HTTP_OK);
            }

            return new JsonResponse([
                'success' => false,
                'message' => 'Erro ao gerar o relatório',
            ], Response::HTTP_BAD_REQUEST);
        } catch (\Throwable $th) {
            return new Response(
                $th->getMessage(),
                Response::HTTP_INTERNAL_SERVER_ERROR,
                [
                    'Content-Type' => 'application/json',
                ]
            );
        }
    }

    #[Route('/historico-solicitacoes-alteracao-perfil/{cpf}', name: 'historico_solicitacoes_alteracao_perfil', methods: ['GET'])]
    public function historicoSolicitacoesAlteracaoPerfil(Request $request, #[RouteCpfEncrypted] #[ValidateCpfOwnership] string $cpf): JsonResponse
    {
        try {
            $filterPagination = [
                'pageIndex' => intval($request->query->get('pageIndex', 0)),
                'pageSize' => intval($request->query->get('pageSize', 1)),
            ];

            $perfilInvestimentoHistoricoAlteracao = $this->perfilInvestimentoAlteracaoService->getByCpf($cpf, $filterPagination);

            $perfilInvestimentoHistoricoResponse = [
                'perfilInvestimentoHistorico' => $perfilInvestimentoHistoricoAlteracao->getItems(),
                'pageIndex' => $perfilInvestimentoHistoricoAlteracao->getCurrentPageNumber(),
                'pageSize' => $perfilInvestimentoHistoricoAlteracao->getItemNumberPerPage(),
                'totalPages' => ceil($perfilInvestimentoHistoricoAlteracao->getTotalItemCount() / $perfilInvestimentoHistoricoAlteracao->getItemNumberPerPage()),
                'totalItems' => $perfilInvestimentoHistoricoAlteracao->getTotalItemCount(),
            ];

            $serializedResult = $this->serializer->serialize($perfilInvestimentoHistoricoResponse, 'json', [
                'groups' => ['perfilInvestimentoAlteracao:read'],
                'circular_reference_handler' => function ($object) {
                    return $object->getId();
                },
            ]);

            $resultArray = json_decode($serializedResult, true);

            return ApiResponse::success(
                data: $resultArray,
                message: 'Histórico de solicitações de alteração de perfil encontrado com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (Exception $exception) {
            return $this->handleApiException($exception, $request);
        }
    }

    #[Route('/{cpf}/ultima-solicitacao-alteracao-perfil', name: 'ultima_solicitacao_alteracao_perfil', methods: ['GET'])]
    public function getUltimaSolicitacaoAlteracaoPerfil(Request $request, #[RouteCpfEncrypted] #[ValidateCpfOwnership] string $cpf): JsonResponse
    {
        try {
            $ultimaSolicitacaoAlteracaoPerfil = $this->perfilInvestimentoAlteracaoService->getUltimaSolicitacaoAlteracaoPerfil($cpf);
            $ultimaSolicitacaoAlteracaoPerfilOutputDTO = new PerfilInvestimentoAlteracaoOutputDTO($ultimaSolicitacaoAlteracaoPerfil);

            return ApiResponse::success(
                data: $ultimaSolicitacaoAlteracaoPerfilOutputDTO->toArray(),
                message: 'Solicitação de alteração de perfil encontrada com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (SolicitacaoAlteracaoPerfilNotFoundException $exception) {
            return ApiResponse::noContent();
        } catch (Exception $exception) {
            return $this->handleApiException($exception, $request);
        }
    }

    #[Route('/{cpf}/ciente-campanha-aberta', name: 'post_ciente_campanha_aberta', methods: ['POST'])]
    public function postCienteCampanhaAberta(Request $request, #[RouteCpfEncrypted] #[ValidateCpfOwnership] string $cpf): JsonResponse
    {
        try {
            $perfilRecomendado = $this->perfilRecomendadoService->getByCpf($cpf);

            if (! $perfilRecomendado) {
                return ApiResponse::noContent();
            }

            if ($perfilRecomendado->getCiente()) {
                return ApiResponse::success(
                    data: $perfilRecomendado->toArray(),
                    message: 'Participante já ciente da campanha',
                    metadata: [
                        'version' => '1.0',
                        'endpoint' => $request->getPathInfo(),
                        'method' => $request->getMethod(),
                    ]
                );
            }

            $perfilRecomendado->setCiente(true);
            $perfilRecomendado->setDtCiencia(new \DateTime('now'));

            $this->perfilRecomendadoService->update($perfilRecomendado);

            return ApiResponse::success(
                data: $perfilRecomendado->toArray(),
                message: 'Ciente campanha aberta enviado com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (Exception $exception) {

            return $this->handleApiException($exception, $request);
        }
    }
    #[Route('/{cpf}/ciente-campanha-aberta', name: 'get_ciente_campanha_aberta', methods: ['GET'])]
    public function getCienteCampanhaAberta(Request $request, #[RouteCpfEncrypted] #[ValidateCpfOwnership] string $cpf): JsonResponse
    {
        try {
            $perfilRecomendado = $this->perfilRecomendadoService->getByCpf($cpf);

            if (! $perfilRecomendado) {
                return ApiResponse::noContent();
            }

            return ApiResponse::success(
                data: $perfilRecomendado->toArray(),
                message: 'Ciente campanha aberta encontrado com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (Exception $exception) {
            return $this->handleApiException($exception, $request);
        }
    }

    #[Route('/{cpf}/perfil-indicado', name: 'perfil_indicado', methods: ['GET'])]
    public function getPerfilIndicadoByCpf(Request $request, #[RouteCpfEncrypted] #[ValidateCpfOwnership] string $cpf): JsonResponse
    {
        try {
            $perfilRecomendado = $this->perfilRecomendadoService->getPerfilRecomendadoByCpf($cpf);

            $perfilRecomendadoResult = $this->serializer->serialize($perfilRecomendado, 'json', [
                'groups' => ['perfilInvestimento:read'],
                'circular_reference_handler' => function ($object) {
                    return $object->getId();
                },
            ]);

            return ApiResponse::success(
                data: json_decode($perfilRecomendadoResult, true),
                message: 'Perfil recomendado encontrado com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (Exception $exception) {

            return $this->handleApiException($exception, $request);
        }
    }

    #[Route('/{cpf}/perfil-atual', name: 'perfil_atual', methods: ['GET'])]
    public function getPerfilAtual(Request $request, #[RouteCpfEncrypted] #[ValidateCpfOwnership] string $cpf): JsonResponse
    {
        try {
            $perfilAtual = $this->trustParticipanteService->getPerfilAtual($cpf);

            return ApiResponse::success(
                data: $perfilAtual,
                message: 'Perfil atual encontrado com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (Exception $exception) {

            return $this->handleApiException($exception, $request);
        }
    }

    #[Route('/{cpf}/perfil-solicitacao-alteracao', name: 'perfil_solicitacao_alteracao', methods: ['POST'])]
    public function postPerfilSolicitacaoAlteracao(Request $request, #[RouteCpfEncrypted] #[ValidateCpfOwnership] string $cpf): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            if (! isset($data['perfilInvestimento']) || ! isset($data['campanha'])) {
                return ApiResponse::validationError(
                    errors: [
                        'perfilInvestimento' => 'Perfil de investimento é obrigatório',
                        'campanha' => 'Campanha é obrigatório',
                    ],
                    message: 'Dados inválidos',
                    metadata: [
                        'version' => '1.0',
                        'endpoint' => $request->getPathInfo(),
                        'method' => $request->getMethod(),
                    ]
                );
            }

            $perfilSolicitacaoAlteracao = $this->perfilInvestimentoAlteracaoService->postPerfilSolicitacaoAlteracao(
                $cpf,
                $data['perfilInvestimento'],
                $data['campanha'],
                $request->getClientIp(),
                $data['dadosSimulacaoJson']
            );

            return ApiResponse::success(
                data: ['token' => $perfilSolicitacaoAlteracao?->getToken()],
                message: 'Solicitação de alteração de perfil enviada com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (Exception $exception) {
            return $this->handleApiException($exception, $request);
        }
    }

    #[Route('/{cpf}/verificar-token', name: 'verificar_token', methods: ['POST'])]
    public function postVerificarToken(Request $request, #[RouteCpfEncrypted] #[ValidateCpfOwnership] string $cpf): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            if (! isset($data['token'])) {
                return ApiResponse::validationError(
                    errors: [
                        'token' => 'Token é obrigatório',
                    ],
                    message: 'Dados inválidos',
                    metadata: [
                        'version' => '1.0',
                        'endpoint' => $request->getPathInfo(),
                        'method' => $request->getMethod(),
                    ]
                );
            }
            $verificarToken = $this->perfilInvestimentoAlteracaoService->verificarToken($cpf, $data['token'], $request->getClientIp());
            if (! $verificarToken) {
                return ApiResponse::noContent();
            }

            return ApiResponse::success(
                data: ['verificado' => $verificarToken],
                message: 'Token verificado com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (Exception $exception) {
            return $this->handleApiException($exception, $request);
        }
    }

    #[Route('/{cpf}/gerar-novo-token', name: 'gerar_novo_token', methods: ['GET'])]
    public function postGerarNovoToken(Request $request, #[RouteCpfEncrypted] #[ValidateCpfOwnership] string $cpf): JsonResponse
    {
        try {
            $gerarNovoToken = $this->perfilInvestimentoAlteracaoService->gerarNovoToken($cpf, $request->getClientIp());

            return ApiResponse::success(
                data: ['token' => $gerarNovoToken],
                message: 'Novo token gerado com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (Exception $exception) {
            return $this->handleApiException($exception, $request);
        }
    }

    #[Route('/{cpf}/buscar-perfil-solicitado', name: 'buscar_perfil_solicitado', methods: ['GET'])]
    public function getPerfilSolicitado(Request $request, #[RouteCpfEncrypted] #[ValidateCpfOwnership] string $cpf): JsonResponse
    {
        try {
            $perfilSolicitado = $this->perfilInvestimentoAlteracaoService->getPerfilSolicitado($cpf);

            if (! $perfilSolicitado) {
                return ApiResponse::noContent();
            }

            // Retorna apenas o perfil de investimento, não a entidade de alteração
            $perfilInvestimento = $perfilSolicitado->getPerfilInvestimento();

            if (! $perfilInvestimento) {
                return ApiResponse::noContent();
            }

            $perfilSolicitadoResult = $this->serializer->serialize($perfilInvestimento, 'json', [
                'groups' => ['perfilInvestimento:read'],
                'circular_reference_handler' => function ($object) {
                    return $object->getId();
                },
            ]);

            return ApiResponse::success(
                data: json_decode($perfilSolicitadoResult, true),
                message: 'Perfil solicitado encontrado com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (Exception $exception) {
            return $this->handleApiException($exception, $request);
        }
    }

    #[Route('/{cpf}/cancelar-solicitacao-alteracao-perfil', name: 'cancelar_solicitacao_alteracao_perfil', methods: ['PUT'])]
    public function cancelarSolicitacaoAlteracaoPerfil(Request $request, #[RouteCpfEncrypted] #[ValidateCpfOwnership] string $cpf): JsonResponse
    {
        try {
            $statusSolicitacaoAlteracaoPerfil = $this->perfilInvestimentoAlteracaoService->cancelarSolicitacaoAlteracaoPerfil($cpf);

            return ApiResponse::success(
                data: $statusSolicitacaoAlteracaoPerfil,
                message: 'Solicitação de alteração de perfil cancelada com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (Exception $exception) {
            return $this->handleApiException($exception, $request);
        }
    }

    /**
     * Migra o perfil de investimento de uma solicitação individual
     *
     * @param Request $request
     * @param int $solicitacaoId
     * @return JsonResponse
     */
    #[Route('/migrar-perfil-individual/{solicitacaoId}', name: 'migrar_perfil_individual', methods: ['POST'])]
    public function migrarPerfilIndividual(Request $request, int $solicitacaoId): JsonResponse
    {
        try {
            $resultado = $this->perfilInvestimentoAlteracaoService->migrarPerfilIndividual($solicitacaoId);

            return ApiResponse::success(
                data: $resultado,
                message: $resultado['message'],
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (Exception $exception) {
            return $this->handleApiException($exception, $request);
        }
    }
}
