<?php

namespace App\Controller;

use App\Attribute\RequiresJwtAuth;
use App\Attribute\RouteCpfEncrypted;
use App\Attribute\ValidateCpfOwnership;
use App\DTO\Trust\Input\ContribuicaoFilterDTO;
use App\Enum\Jasper\JasperReportPathEnum;
use App\Exception\ParticipanteNotFoundException;
use App\Http\Response\ApiResponse;
use App\Interface\Iris\Service\Relatorios\DemonstrativoImpostoRendaServiceInterface;
use App\Interface\Jasper\JasperServiceInterface;
use App\Interface\Trust\Service\TrustContribuicaoServiceInterface;
use App\Interface\Trust\Service\TrustParticipanteServiceInterface;
use App\Trait\ApiTrait;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/v1/participantes', name: 'app_imposto_renda')]
#[RequiresJwtAuth]
final class ImpostoRendaController extends AbstractController
{
    use ApiTrait;

    public function __construct(
        private readonly TrustParticipanteServiceInterface $participanteService,
        private readonly DemonstrativoImpostoRendaServiceInterface $demonstrativoImpostoRendaService,
        private readonly JasperServiceInterface $jasperService,
        private readonly SerializerInterface $serializer,
        private readonly TrustContribuicaoServiceInterface $contribuicaoService
    ) {
    }

    #[Route('/{cpf}/imposto-renda/patrocinadores', name: 'get_imposto_renda_orgaos', methods: ['GET'])]
    public function getOrgaosImpostoRenda(
        #[RouteCpfEncrypted]
        #[ValidateCpfOwnership]
        string $cpf,
        Request $request
    ): JsonResponse {
        try {
            $patrocinadores = $this->participanteService->getPatrocinadores($cpf);

            $patrocinadoresArray = $this->serializer->serialize($patrocinadores, 'json', ['groups' => ['patrocinador:read']]);
            $patrocinadoresArray = json_decode($patrocinadoresArray, true);

            return ApiResponse::success(
                data: ['patrocinadores' => $patrocinadoresArray],
                message: 'Patrocinadores encontrados com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                    'groups' => ['patrocinador:read'],
                ]
            );
        } catch (ParticipanteNotFoundException $e) {
            return ApiResponse::notFound(
                message: $e->getMessage(),
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (\Exception $e) {
            return $this->handleApiException($e, $request);
        }
    }

    #[Route('/{cpf}/imposto-renda/contribuicoes', name: 'get_imposto_renda_contribuicoes', methods: ['GET'])]
    public function getContribuicoesImpostoRenda(
        #[RouteCpfEncrypted]
        #[ValidateCpfOwnership]
        string $cpf,
        Request $request
    ): JsonResponse {
        try {
            $ano = $request->query->get('ano') ?? date('Y');
            $patrocinador = $request->query->get('patrocinador') ?? null;

            if (! is_numeric($ano) || strlen($ano) !== 4) {
                return ApiResponse::error(
                    message: 'Ano inválido. Deve ser um número de 4 dígitos',
                    statusCode: Response::HTTP_BAD_REQUEST,
                    metadata: [
                        'version' => '1.0',
                        'endpoint' => $request->getPathInfo(),
                        'method' => $request->getMethod(),
                    ]
                );
            }

            $filter = new ContribuicaoFilterDTO([
                'dataInicial' => "01/01/{$ano}",
                'dataFinal' => "31/12/{$ano}",
                'patrocinador' => $patrocinador,
            ]);
            $contribuicoes = $this->contribuicaoService->demonstrativoAnaliticoImpostoRenda($cpf, $filter);

            return ApiResponse::success(
                data: $contribuicoes,
                message: 'Contribuições encontradas com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                    'groups' => ['contribuicao:read'],
                    'filters' => [
                        'ano' => $ano,
                    ],
                ]
            );
        } catch (\Exception $e) {
            return $this->handleApiException($e, $request);
        }
    }

    #[Route('/imposto-renda/relatorio/{cpf}/{ano}/{patrocinador}', methods: ['GET'])]
    public function relatorioImpostoRenda(
        #[RouteCpfEncrypted]
        #[ValidateCpfOwnership]
        string $cpf,
        string $ano,
        string $patrocinador
    ): Response {
        try {
            $demonstrativoImpostoRenda = $this->demonstrativoImpostoRendaService->getDemonstrativoImpostoRenda($cpf, $ano, $patrocinador);

            $report = $this->jasperService->generateReport(
                reportName: JasperReportPathEnum::REPORT_IR->value,
                params: $demonstrativoImpostoRenda->toArray()
            );

            return new Response(
                $report,
                Response::HTTP_OK,
                [
                    'Content-Type' => 'application/pdf',
                    'Content-Disposition' => 'inline; filename=Report.pdf',
                    'Cache-Control' => 'must-revalidate',
                ]
            );
        } catch (\Exception $exception) {
            return $this->json([
                'error' => $exception->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/imposto-renda/contribuicoes-complementares/{cpf}/{ano}/{patrocinador}', methods: ['GET'])]
    public function getContribuicoesComplementares(
        #[RouteCpfEncrypted]
        #[ValidateCpfOwnership]
        string $cpf,
        string $ano,
        string $patrocinador,
        Request $request
    ): Response {
        try {
            $contribuicoesComplementares = $this->demonstrativoImpostoRendaService->getDemonstrativoImpostoRenda($cpf, $ano, $patrocinador);

            return ApiResponse::success(
                data: $contribuicoesComplementares->getContribuicaoPrevidenciaComplementarDTO(),
                message: 'Contribuições complementares encontradas com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                    'groups' => ['relatorio:read'],
                ]
            );
        } catch (\Exception $exception) {
        
            return $this->json([
                'error' => $exception->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
