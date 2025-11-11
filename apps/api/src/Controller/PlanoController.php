<?php

namespace App\Controller;

use App\Attribute\RequiresJwtAuth;
use App\Attribute\RouteCpfEncrypted;
use App\Attribute\ValidateCpfOwnership;
use App\Exception\PlanoNotFoundException;
use App\Http\Response\ApiResponse;
use App\Interface\Trust\Service\TrustPlanoServiceInterface;
use App\Trait\ApiTrait;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/v1/participantes', name: 'app_participantes')]
#[RequiresJwtAuth]
final class PlanoController extends AbstractController
{
    use ApiTrait;

    public function __construct(
        private readonly TrustPlanoServiceInterface $trustPlanoService,
        private readonly SerializerInterface $serializer
    ) {}

    #[Route('/{cpf}/planos', name: 'get_planos_by_cpf', methods: ['GET'])]
    public function getPlanosByCpf(
        #[RouteCpfEncrypted]
        #[ValidateCpfOwnership]
        string $cpf,
        Request $request
    ): JsonResponse {
        try {
            $allPlanos = $request->query->get('all') ?? 'false';

            $planos = $this->trustPlanoService->getPlanosByCpf($cpf, $allPlanos === 'true');
            $serializedPlanos = $this->serializer->serialize($planos, 'json');
            $planosArray = json_decode($serializedPlanos, true);

            return ApiResponse::success(
                data: $planosArray,
                message: 'Planos encontrados com sucesso',
                metadata: [
                    'totalItems' => count($planosArray),
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (PlanoNotFoundException $e) {
            return ApiResponse::notFound(
                'Plano não encontrado',
                [
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (\Exception $e) {
            return $this->handleApiException($e, $request);
        }
    }

    #[Route('/{cpf}/plano/{id}', name: 'get_plano_by_id', methods: ['GET'])]
    public function getPlanoById(
        #[RouteCpfEncrypted]
        #[ValidateCpfOwnership]
        string $cpf,
        int $id,
        Request $request
    ): JsonResponse {
        try {
            $plano = $this->trustPlanoService->getPlanoById($cpf, $id);
            $serializedPlano = $this->serializer->serialize($plano, 'json');
            $planoArray = json_decode($serializedPlano, true);

            return ApiResponse::success(
                data: $planoArray,
                message: 'Plano encontrado com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (PlanoNotFoundException $e) {
            return ApiResponse::notFound(
                'Plano não encontrado',
                [
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (\Exception $e) {
            return $this->handleApiException($e, $request);
        }
    }
}
