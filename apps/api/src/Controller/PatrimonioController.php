<?php

namespace App\Controller;

use App\Attribute\RequiresJwtAuth;
use App\Attribute\RouteCpfEncrypted;
use App\Attribute\ValidateCpfOwnership;
use App\Http\Response\ApiResponse;
use App\Interface\Trust\Service\TrustPatrimonioServiceInterface;
use App\Trait\ApiTrait;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/v1/patrimonio')]
#[RequiresJwtAuth]
final class PatrimonioController extends AbstractController
{
    use ApiTrait;

    public function __construct(
        private readonly TrustPatrimonioServiceInterface $trustPatrimonioService
    ) {}

    #[Route('/{cpf}/', name: 'get_patrimonio', methods: ['GET'])]
    public function getPatrimonio(
        #[RouteCpfEncrypted]
        #[ValidateCpfOwnership]
        string $cpf,
        Request $request
    ): JsonResponse {
        try {
            // Obtém os dados do patrimônio do participante
            $patrimonioData = $this->trustPatrimonioService->getPatrimonio($cpf);

            $patrimonioArray = $patrimonioData->toArray();

            return ApiResponse::success(
                data: ['patrimonio' => $patrimonioArray],
                message: 'Patrimônio encontrado com sucesso',
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

    #[Route('/{cpf}/evolucao-anual', name: 'get_patrimonio_evolucao_anual', methods: ['GET'])]
    public function getPatrimonioEvolucaoAnual(
        #[RouteCpfEncrypted]
        #[ValidateCpfOwnership]
        string $cpf,
        Request $request,
    ): JsonResponse {
        try {
            $patrimonioEvolucaoAnual = $this->trustPatrimonioService->getPatrimonioEvolucaoAnual($cpf);

            return ApiResponse::success(
                data: ['patrimonioEvolucaoAnual' => $patrimonioEvolucaoAnual],
                message: 'Patrimônio encontrado com sucesso',
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

    #[Route('/{cpf}/dados-anuais', name: 'get_patrimonio_dados_anuais', methods: ['GET'])]
    public function buscarDadosAnuais(
        #[RouteCpfEncrypted]
        #[ValidateCpfOwnership]
        string $cpf,
        Request $request,
    ): JsonResponse {
        try {

            $dadosAnuais = $this->trustPatrimonioService->buscarDadosAnuais($cpf);

            return ApiResponse::success(
                data:  $dadosAnuais,
                message: 'Dados anuais encontrados com sucesso',
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
}
