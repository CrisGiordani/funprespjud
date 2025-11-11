<?php

namespace App\Controller;

use App\Attribute\RequiresJwtAuth;
use App\Attribute\RouteCpfEncrypted;
use App\Attribute\ValidateCpfOwnership;
use App\Exception\LgpdNotFoundException;
use App\Http\Response\ApiResponse;
use App\Interface\Trust\Service\TrustLgpdServiceInterface;
use App\Trait\ApiTrait;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/v1/participantes/{cpf}/lgpd')]
#[RequiresJwtAuth]
final class LgpdController extends AbstractController
{
    use ApiTrait;

    public function __construct(
        private TrustLgpdServiceInterface $trustLgpdService
    ) {
    }

    #[Route('/{idTrust}/consentimentos', methods: ['GET'])]
    /**
     * @param int $idTrust
     *
     * @return JsonResponse
     */
    public function getConsentimentoLgpd(
        #[RouteCpfEncrypted]
        #[ValidateCpfOwnership]
        string $cpf,
        int $idTrust,
        Request $request
    ): JsonResponse {
        try {
            $retorno = $this->trustLgpdService->getConsentimentoLgpd($idTrust);

            if (! $retorno || empty($retorno) || count($retorno) === 0) {
                throw new LgpdNotFoundException();
            }

            return ApiResponse::success(
                data: $retorno,
                message: 'Consentimentos LGPD encontrados com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (LgpdNotFoundException $e) {
            return ApiResponse::notFound(
                'Consentimentos LGPD não encontrados',
                [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (\Exception $e) {
            return $this->handleApiException($e, $request);
        }
    }

    /**
     * @param Request $request
     *
     * @return JsonResponse
     */
    #[Route('/consentimentos', methods: ['POST'])]
    public function postConsentimentoLgpd(
        #[RouteCpfEncrypted]
        #[ValidateCpfOwnership]
        string $cpf,
        Request $request
    ): JsonResponse {
        try {
            $dados = json_decode($request->getContent(), true);
            $retorno = $this->trustLgpdService->saveConsentimentoLgpd($dados['dados'], $dados['idTrust']);

            if (! $retorno || empty($retorno) || count($retorno) === 0) {
                throw new LgpdNotFoundException();
            }

            return ApiResponse::created(
                data: $retorno,
                message: 'Consentimento LGPD criado com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (LgpdNotFoundException $e) {
            return ApiResponse::error(
                'Consentimento LGPD não encontrado',
                Response::HTTP_BAD_REQUEST,
                null,
                [
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
