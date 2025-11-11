<?php

namespace App\Controller;

use App\Attribute\RequiresJwtAuth;
use App\Attribute\RouteCpfEncrypted;
use App\Attribute\ValidateCpfOwnership;
use App\DTO\Trust\Input\ContribuicaoFilterDTO;
use App\DTO\Trust\Output\SaldoOutputDTO;
use App\Http\Response\ApiResponse;
use App\Service\Trust\Saldo\TrustSaldoService;
use App\Trait\ApiTrait;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/v1/participante/{cpf}', name: 'app_saldo')]
#[RequiresJwtAuth]
final class SaldoController extends AbstractController
{
    use ApiTrait;

    public function __construct(
        private readonly TrustSaldoService $trustSaldoService,
        private readonly SerializerInterface $serializer
    ) {
    }

    #[Route('/saldo', name: 'get_saldo', methods: ['GET'])]
    public function getSaldo(
        #[RouteCpfEncrypted]
        #[ValidateCpfOwnership]
        string $cpf,
        Request $request
    ): JsonResponse {
        try {
            $filter = new ContribuicaoFilterDTO();
            $saldoData = $this->trustSaldoService->getSaldo($cpf, $filter);

            $saldoDTO = new SaldoOutputDTO($saldoData);
            $saldoArray = $saldoDTO->toArray();

            return ApiResponse::success(
                data: $saldoArray,
                message: 'Saldo encontrado com sucesso',
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
