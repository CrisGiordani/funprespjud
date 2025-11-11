<?php

namespace App\Controller;

use App\Http\Response\ApiResponse;
use App\Interface\Iris\Service\Core\CobrancaServiceInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class CobrancaController extends AbstractController
{
    public function __construct(
        private readonly CobrancaServiceInterface $cobrancaService
    ) {
    }

    #[Route('/api/v1/cobranca', name: 'app_cobranca', methods: ['POST'])]
    public function criarCobranca(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $cobranca = $this->cobrancaService->criarCobranca($data);

        return ApiResponse::success(
            data: $cobranca->toArray(),
            message: 'Cobranca criada com sucesso',
            metadata: [
                'version' => '1.0',
                'endpoint' => $request->getPathInfo(),
                'method' => $request->getMethod(),
            ]
        );
    }

    #[Route('/api/v1/cobranca/{nossoNumero}', name: 'app_cobranca_obter', methods: ['GET'])]
    public function obterCobranca(string $nossoNumero): JsonResponse
    {
        $cobranca = $this->cobrancaService->obterCobranca($nossoNumero);

        return new JsonResponse($cobranca);
    }

    #[Route('/api/v1/cobrancas', name: 'app_cobrancas', methods: ['GET'])]
    public function listarCobrancas(Request $request): JsonResponse
    {
        $cobrancas = $this->cobrancaService->listarCobrancas($request->query->all());

        return ApiResponse::success(
            data: $cobrancas->getItems(),
            message: 'Cobrancas listadas com sucesso',
            metadata: [
                'version' => '1.0',
                'endpoint' => $request->getPathInfo(),
                'method' => $request->getMethod(),
            ]
        );
    }
}
