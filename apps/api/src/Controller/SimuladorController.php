<?php

namespace App\Controller;

use App\Attribute\RouteCpfEncrypted;
use App\Attribute\RequiresJwtAuth;
use App\Attribute\ValidateCpfOwnership;
use App\DTO\Trust\Input\SimuladorDTO;
use App\Exception\SimuladorNotFoundException;
use App\Http\Response\ApiResponse;
use App\Interface\Trust\Service\IndexadorValorServiceInterface;
use App\Interface\Trust\Service\TrustContribuicaoServiceInterface;
use App\Interface\Trust\Service\TrustPlanoServiceInterface;
use App\Service\Trust\Simulador\TrustSimuladorService;
use App\Trait\ApiTrait;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/v1/simulacoes', name: 'app_simulador')]
#[RequiresJwtAuth]
final class SimuladorController extends AbstractController
{
    use ApiTrait;
    public function __construct(
        private TrustSimuladorService $simuladorService,
        private IndexadorValorServiceInterface $indexadorValorService,
        private TrustContribuicaoServiceInterface $trustContribuicaoService,
        private TrustPlanoServiceInterface $trustPlanoService
    ) {}

    #[Route('/parametros/{cpf}', name: 'parametros', methods: ['POST'])]
    public function simulacaoAction(
        #[RouteCpfEncrypted]
        #[ValidateCpfOwnership]
        string $cpf,
        Request $request,
        ValidatorInterface $validator
    ): JsonResponse {
        try {
            // Buscar dados do simulador baseado no CPF
            $dadosSimulacao = $this->simuladorService->getDadosSimulador($cpf);
            $data = json_decode($request->getContent(), true);

            // Mesclar os dados do CPF com os dados da requisição
            $dataNascimento = $dadosSimulacao['dadosParticipante']->getDtNascimento() ?? null;

            // Converter data do formato brasileiro (dd/mm/yyyy) para formato ISO (yyyy-mm-dd)
            if ($dataNascimento) {
                $dataNascimento = \DateTime::createFromFormat('d/m/Y', $dataNascimento);
                if ($dataNascimento) {
                    $dataNascimento = $dataNascimento->format('Y-m-d');
                }
            }

            $dadosCompletos = array_merge([
                'cpf' => $cpf,
                'dataNascimento' => $dataNascimento,
                'sexo' => $dadosSimulacao['dadosParticipante']->getSexo() ?? null,
                'idadeAposentadoria' => $dadosSimulacao['idadePrevistaAposentadoria'] ?? null,
                'rentabilidadeProjetada' => $dadosSimulacao['rentabilidadeRealProjetada'] ?? null,
                'salarioParticipante' => $dadosSimulacao['salarioParticipante'] ?? null,
                'percentualContribuicaoNormal' => $dadosSimulacao['percentualContribuicaoNormal'] ?? null,
                'percentualContribuicaoFacultativa' => $dadosSimulacao['percentualContribuicaoFacultativa'] ?? null,
                'aporteExtraordinario' => 0,
                'prazoRecebimento' => 480,
                'saqueReserva' => 0,
            ], $data['dados'] ?? []);



            $dto = new SimuladorDTO($dadosCompletos);
            $errors = $validator->validate($dto);

            if (count($errors) > 0) {
                return $this->json([
                    'success' => false,
                    'errors' => (string) $errors,
                ], 400);
            }

            $resultado = $this->simuladorService->calculoSimulacao($dto);

            return $this->json($resultado->toArray());
        } catch (SimuladorNotFoundException $e) {
            return $this->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 404);
        } catch (\Throwable $e) {
            return $this->json([
                'success' => false,
                'error' => 'Erro inesperado: ' . $e->getMessage(),
            ], 500);
        }
    }

    #[Route('/parametros/predefinidos/{cpf}/{idPerfil}', name: 'simulacao_by_cpf', methods: ['GET'])]
    public function simulacaoByCpf(
        #[RouteCpfEncrypted]
        #[ValidateCpfOwnership]
        string $cpf,
        int $idPerfil,
        Request $request
    ): JsonResponse {
        try {

            $dadosSimulacao = $this->simuladorService->preparaDadosSimulacaoSimplificada($cpf, $idPerfil);

            $resultado = $this->simuladorService->calculoSimulacao($dadosSimulacao);

            return ApiResponse::success(
                data: $resultado->toArray(),
                message: 'Simulação calculada com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (SimuladorNotFoundException $e) {
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

    #[Route('/{cpf}/projecao-beneficio', name: 'projecao_beneficio', methods: ['GET'])]
    public function projecaoBeneficio(
        #[RouteCpfEncrypted]
        #[ValidateCpfOwnership]
        string $cpf,
        Request $request
    ): JsonResponse {
        try {

            $resultado = $this->simuladorService->getProjecaoBeneficio($cpf);

            return ApiResponse::success(
                data: $resultado,
                message: 'Projecao de beneficio encontrada com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (SimuladorNotFoundException $e) {

            return ApiResponse::notFound(
                message: $e->getMessage(),
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (\Throwable $e) {
            return $this->handleApiException($e, $request);
        }
    }


    #[Route('/parametros/{cpf}/urps', name: 'urps', methods: ['GET'])]
    public function urps(): JsonResponse
    {
        try {
            $resultado = $this->simuladorService->calcularIndexadorUrp();
            return $this->json([
                'success' => true,
                'data' => $resultado,
                'message' => 'URPs calculadas com sucesso',
            ]);
        } catch (\Throwable $e) {
            return $this->json([
                'success' => false,
                'error' => 'Erro inesperado: ' . $e->getMessage(),
            ], 500);
        }
    }

    #[Route('/parametros/{cpf}/ultimo-historico-salario', name: 'ultimo-historico-salario', methods: ['GET'])]
    public function getUltimoHistoricoSalario(
        #[RouteCpfEncrypted]
        #[ValidateCpfOwnership]
        string $cpf,
        Request $request
    ): JsonResponse {
        try {
            $resultado = $this->simuladorService->getLastHistoricoSalario($cpf);

            return ApiResponse::success(
                data: ['ultimoHistoricoSalario' => $resultado],
                message: 'Último histórico de salário encontrado com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (\Throwable $e) {
            return $this->json([
                'success' => false,
                'error' => 'Erro inesperado: ' . $e->getMessage(),
            ], 500);
        }
    }

    #[Route('/{cpf}/simplificada-normal', name: 'simplificada-normal', methods: ['GET'])]
    public function simplificadaNormal(
        #[RouteCpfEncrypted]
        #[ValidateCpfOwnership]
        string $cpf,
        Request $request
    ): JsonResponse {
        try {
            $resultado = $this->simuladorService->simplificadaNormal($cpf);
            return ApiResponse::success(
                data: $resultado,
                message: 'Simulação simplificada encontrada com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        }
        catch (\Throwable $e) {
            return $this->json([
                'success' => false,
                'error' => 'Erro inesperado: ' . $e->getMessage(),
            ], 500);
        }
    }

    #[Route('/{cpf}/rentabilidade-projetada', name: 'rentabilidade-projetada', methods: ['GET'])]
    public function getRentabilidadeProjetada(
        #[RouteCpfEncrypted]
        #[ValidateCpfOwnership]
        string $cpf,
    ): JsonResponse {
        try {
            $resultado = $this->simuladorService->getRentabilidadesProjetadas($cpf);
            return ApiResponse::success(
                data: ['rentabilidadeProjetada' => $resultado['rentabilidadeProjetada']],
                message: 'Rentabilidade projetada encontrada com sucesso'
            );
        } catch (\Throwable $e) {
            return ApiResponse::error(
                message: 'Erro inesperado: ' . $e->getMessage()
            );
        }
    }
}
