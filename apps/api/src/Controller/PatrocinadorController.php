<?php

namespace App\Controller;

use App\Attribute\RequiresJwtAuth;
use App\Attribute\RouteCpfEncrypted;
use App\Attribute\ValidateCpfOwnership;
use App\Exception\ParticipanteNotFoundException;
use App\Exception\PatrocinadorException;
use App\Http\Response\ApiResponse;
use App\Interface\Trust\Service\TrustPatrocinadorServiceInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[RequiresJwtAuth]
#[Route('/api/v1/patrocinador')]
final class PatrocinadorController extends AbstractController
{
    /**
     * @param TrustPatrocinadorServiceInterface $trustPatrocinadorService
     */
    public function __construct(private TrustPatrocinadorServiceInterface $trustPatrocinadorService)
    {
    }

    #[Route('/listar-cargos/{cpf}', name: 'app_patrocinador_listar_cargos', methods: ['GET'])]
    public function listCargosPatrocinador(
        Request $request,
        #[RouteCpfEncrypted]
        #[ValidateCpfOwnership]
        string $cpf
    ): JsonResponse {
        try {
            $listarCargos = $this->trustPatrocinadorService->listarCargosPatrocinador($cpf);

            return ApiResponse::success(
                data: $listarCargos,
                message: 'Cargos listados com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (ParticipanteNotFoundException $exception) {
            return ApiResponse::noContent();
        } catch (PatrocinadorException $exception) {
            return ApiResponse::noContent();
        } catch (\Exception $exception) {
            return ApiResponse::error(
                message: $exception->getMessage(),
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        }
    }
}
