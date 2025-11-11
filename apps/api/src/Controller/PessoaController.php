<?php

namespace App\Controller;

use App\Attribute\RequiresJwtAuth;
use App\Attribute\RouteCpfEncrypted;
use App\Attribute\ValidateCpfOwnership;
use App\Exception\PessoaNotFoundException;
use App\Http\Response\ApiResponse;
use App\Interface\Trust\Service\TrustPessoaServiceInterface;
use App\Trait\ApiTrait;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/v1/pessoas')]
#[RequiresJwtAuth(required: true)]
final class PessoaController extends AbstractController
{
    use ApiTrait;

    public function __construct(
        private readonly TrustPessoaServiceInterface $trustPessoaService,
        private readonly SerializerInterface $serializer
    ) {
    }

    #[Route('/{cpf}', name: 'pessoas_get_by_cpf', methods: ['GET'])]
    public function getByCpf(
        #[RouteCpfEncrypted]
        #[ValidateCpfOwnership]
        string $cpf,
        Request $request
    ): JsonResponse {
        try {
            $pessoa = $this->trustPessoaService->getPessoaByCpf($cpf);

            return ApiResponse::success(
                data: $pessoa,
                message: 'Pessoa encontrada com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                    'groups' => ['pessoa:read'],
                ]
            );
        } catch (PessoaNotFoundException $e) {
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
}
