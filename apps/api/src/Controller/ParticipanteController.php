<?php

namespace App\Controller;

use App\Attribute\RequiresJwtAuth;
use App\Attribute\RouteCpfEncrypted;
use App\Attribute\ValidateCpfOwnership;
use App\DTO\Trust\Input\ParticipanteProfileDTO;
use App\Enum\Trust\Avatar\AvatarEnum;
use App\Exception\AvatarNotFoundException;
use App\Exception\CoberturasNotFoundException;
use App\Exception\FileException;
use App\Exception\ParticipanteNotFoundException;
use App\Http\Response\ApiResponse;
use App\Interface\Helpers\UploadFileHelperInterface;
use App\Interface\Trust\Service\TrustParticipanteServiceInterface;
use App\Trait\ApiTrait;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/v1/participantes')]
final class ParticipanteController extends AbstractController
{
    use ApiTrait;

    public function __construct(
        private readonly TrustParticipanteServiceInterface $trustParticipanteService,
        private UploadFileHelperInterface $uploadFileHelper,
    ) {}

    #[Route('/{cpf}/perfil', methods: ['GET'])]
    #[RequiresJwtAuth]
    public function getPerfil(
        #[RouteCpfEncrypted]
        #[ValidateCpfOwnership]
        string $cpf,
        Request $request,
        SerializerInterface $serializer
    ): JsonResponse {
        try {
            $comPatrocinadores = $request->query->get('com-patrocinadores');

            $participante = $this->trustParticipanteService->getParticipante($cpf, $comPatrocinadores === 'true');

            // Serializa o participante para array
            $participanteArray = $serializer->serialize($participante, 'json');

            $participanteArray = json_decode($participanteArray, true);

            return ApiResponse::success(
                data: $participanteArray,
                message: 'Perfil encontrado com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                    'groups' => ['participante:read'],
                ]
            );
        } catch (ParticipanteNotFoundException $exception) {
            return ApiResponse::notFound(
                message: $exception->getMessage(),
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

    #[Route('/{cpf}/perfil', methods: ['PUT'])]
    #[RequiresJwtAuth]
    public function updatePerfil(
        #[RouteCpfEncrypted]
        #[ValidateCpfOwnership]
        string $cpf,
        Request $request
    ): JsonResponse {
        try {
            $dados = json_decode($request->getContent(), true);
            $participanteDto = new ParticipanteProfileDTO($dados);

            $participante = $this->trustParticipanteService->updateParticipante($cpf, $participanteDto);

            return ApiResponse::success(
                data: $participante,
                message: $participante ? 'Dados atualizados com sucesso' : 'Não foi possível atualizar os dados',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                    'groups' => ['participante:read'],
                ]
            );
        } catch (ParticipanteNotFoundException $exception) {
            return ApiResponse::notFound(
                message: $exception->getMessage(),
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

    #[Route('/{cpf}/emails-adicionais', methods: ['GET'])]
    #[RequiresJwtAuth]
    public function getEmailsAdicionais(
        #[RouteCpfEncrypted]
        #[ValidateCpfOwnership]
        string $cpf,
        Request $request,
        SerializerInterface $serializer
    ): JsonResponse {
        try {
            $emailsAdicionais = $this->trustParticipanteService->getEmailsAdicionaisParticipante($cpf);

            // Serializa os emails adicionais para array
            $emailsArray = $serializer->serialize($emailsAdicionais, 'json');
            $emailsArray = json_decode($emailsArray, true);

            return ApiResponse::success(
                data: ['emailsAdicionais' => $emailsArray],
                message: 'Emails adicionais encontrados com sucesso',
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

    #[Route('/participant/image/{filename}', name: 'avatar')]
    #[RequiresJwtAuth(required: false)]
    public function serveImage(string $filename): Response
    {
        $avatarPath = $this->getParameter('participants_private_directory') . "/{$filename}";
        $response = $this->trustParticipanteService->serveImage($avatarPath);
        $response->headers->set('Content-Type', 'image/jpeg');

        return $response;
    }

    #[Route('/{cpf}/avatar', methods: ['GET'])]
    #[RequiresJwtAuth(required: false)]
    public function getUrlAvatar(
        #[RouteCpfEncrypted]
        string $cpf,
        Request $request
    ): JsonResponse {
        try {
            $avatarDir = $this->getParameter('participants_private_directory');
            $url = $this->trustParticipanteService->getUrlAvatar($avatarDir, $cpf);

            return ApiResponse::success(
                data: ['urlAvatar' => $url],
                message: 'URL do avatar encontrada com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (AvatarNotFoundException $e) {
            return ApiResponse::noContent();
        } catch (\Exception $e) {
            return $this->handleApiException($e, $request);
        }
    }

    #[Route('/{cpf}/avatar', methods: ['POST'])]
    #[RequiresJwtAuth]
    public function uploadAvatar(
        #[RouteCpfEncrypted]
        #[ValidateCpfOwnership]
        string $cpf,
        Request $request
    ): JsonResponse {
        try {
            if (! $request->files->has('avatar')) {
                throw new FileException(AvatarEnum::ERROR_NO_FILE->getValue());
            }

            $imageUrl = $this->trustParticipanteService->uploadAvatar($cpf, $request->files->get('avatar'));

            return ApiResponse::success(
                data: ['url' => $imageUrl],
                message: AvatarEnum::SUCCESS_UPLOAD->getValue(),
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (ParticipanteNotFoundException $exception) {
            return ApiResponse::notFound(
                message: $exception->getMessage(),
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (\Exception $e) {
            return ApiResponse::error(
                message: AvatarEnum::ERROR_UPLOAD->getErrorMessage($e->getMessage()),
                statusCode: Response::HTTP_INTERNAL_SERVER_ERROR,
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        }
    }

    #[Route('/{cpf}/patrocinadores', methods: ['GET'])]
    #[RequiresJwtAuth]
    public function getPatrocinadores(
        #[RouteCpfEncrypted]
        #[ValidateCpfOwnership]
        string $cpf,
        Request $request,
        SerializerInterface $serializer
    ): JsonResponse {
        try {
            $patrocinadores = $this->trustParticipanteService->getPatrocinadores($cpf);

            // Serializa o patrocinador para array
            $patrocinadoresArray = $serializer->serialize($patrocinadores, 'json', ['groups' => ['patrocinador:read']]);
            $patrocinadoresArray = json_decode($patrocinadoresArray, true);

            return ApiResponse::success(
                data: ['patrocinadores' => $patrocinadoresArray],
                message: 'Patrocinadores encontrados com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                    'groups' => ['salario:read'],
                ]
            );
        } catch (ParticipanteNotFoundException $exception) {
            return ApiResponse::notFound(
                message: $exception->getMessage(),
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

    #[Route('/{cpf}/patrocinador', methods: ['GET'])]
    #[RequiresJwtAuth]
    public function getPatrocinador(
        #[RouteCpfEncrypted]
        #[ValidateCpfOwnership]
        string $cpf,
        Request $request,
        SerializerInterface $serializer
    ): JsonResponse {
        try {
            $patrocinador = $this->trustParticipanteService->getPatrocinador($cpf);

            // Serializa o patrocinador para array
            $patrocinadorArray = $serializer->serialize($patrocinador, 'json', ['groups' => ['salario:read']]);
            $patrocinadorArray = json_decode($patrocinadorArray, true);

            return ApiResponse::success(
                data: ['patrocinadores' => $patrocinadorArray],
                message: 'Patrocinador encontrado com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                    'groups' => ['salario:read'],
                ]
            );
        } catch (ParticipanteNotFoundException $exception) {
            return ApiResponse::notFound(
                message: $exception->getMessage(),
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


    #[Route('/{cpf}/coberturas-car', name: 'coberturas_car', methods: ['GET'])]
    #[RequiresJwtAuth]
    public function coberturasCAR(
        #[RouteCpfEncrypted]
        #[ValidateCpfOwnership]
        string $cpf,
        Request $request
    ): JsonResponse {
        try {
            $resultado = $this->trustParticipanteService->getCoberturasCAR($cpf);

            return ApiResponse::success(
                data: $resultado,
                message: 'Coberturas encontradas com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (CoberturasNotFoundException $e) {
            return ApiResponse::noContent();
        } catch (\Throwable $e) {
            return $this->json([
                'success' => false,
                'error' => 'Erro inesperado: ' . $e->getMessage(),
            ], 500);
        }
    }

    #[Route('/{cpf}/cargos', name: 'update_cargos', methods: ['PUT'])]
    #[RequiresJwtAuth]
    public function updateCargo(
        #[RouteCpfEncrypted]
        #[ValidateCpfOwnership]
        string $cpf,
        Request $request
    ): JsonResponse {
        try {
            $dados = json_decode($request->getContent(), true);
            $retorno = $this->trustParticipanteService->updateCargo($cpf, $dados['data']);

            return ApiResponse::success(data: $retorno, message: 'Cargo atualizado com sucesso');
        } catch (\Exception $e) {

            return $this->handleApiException($e, $request);
        }
    }
}
