<?php

namespace App\Controller;

use App\Attribute\RequiresJwtAuth;
use App\Attribute\RouteCpfEncrypted;
use App\Attribute\ValidateCpfOwnership;
use App\DTO\Trust\Input\BeneficiarioDTO;
use App\DTO\Trust\Input\BeneficiarioUpdateDTO;
use App\Http\Response\ApiResponse;
use App\Service\Trust\Beneficiario\TrustBeneficiarioService;
use App\Trait\ApiTrait;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\Context\Normalizer\ObjectNormalizerContextBuilder;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[RequiresJwtAuth]
final class BeneficiarioController extends AbstractController
{
    use ApiTrait;

    private TrustBeneficiarioService $beneficiarioService;
    private SerializerInterface $serializer;
    private ValidatorInterface $validator;

    public function __construct(
        TrustBeneficiarioService $beneficiarioService,
        SerializerInterface $serializer,
        ValidatorInterface $validator
    ) {
        $this->beneficiarioService = $beneficiarioService;
        $this->serializer = $serializer;
        $this->validator = $validator;
    }

    #[Route('/api/v1/participantes/{cpf}/beneficiarios', name: 'beneficiarios_list', methods: ['GET'])]
    public function list(#[RouteCpfEncrypted] #[ValidateCpfOwnership] string $cpf, Request $request): JsonResponse
    {
        try {
            $beneficiarios = $this->beneficiarioService->getBeneficiarios($cpf);

            $context = (new ObjectNormalizerContextBuilder())
                ->withGroups(['beneficiario:read'])
                ->toArray();

            $serializedData = $this->serializer->serialize($beneficiarios, 'json', $context);
            $data = json_decode($serializedData, true);

            return ApiResponse::success(
                data: $data,
                message: 'Beneficiários listados com sucesso',
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

    #[Route('/api/v1/participantes/{cpf}/beneficiarios', name: 'beneficiarios_create', methods: ['POST'])]
    public function create(#[RouteCpfEncrypted] #[ValidateCpfOwnership] string $cpf, Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            if (! $data) {
                return ApiResponse::error(
                    message: 'Dados inválidos',
                    statusCode: Response::HTTP_BAD_REQUEST
                );
            }

            $beneficiarioDTO = new BeneficiarioDTO(data: $data);

            // Acumula todos os erros de validação
            $allErrors = [];

            // 1. Valida o DTO (campos obrigatórios, formatos)
            $dtoErrors = $this->validator->validate($beneficiarioDTO);
            if (count($dtoErrors) > 0) {
                foreach ($dtoErrors as $error) {
                    $allErrors[$error->getPropertyPath()] = $error->getMessage();
                }
            }

            // 2. Valida regras de negócio (CPF duplicado, cônjuge duplicado)
            $businessErrors = $this->beneficiarioService->validateBeneficiario($cpf, $beneficiarioDTO);
            if (!empty($businessErrors)) {
                $allErrors = array_merge($allErrors, $businessErrors);
            }

            // Se houver erros, retorna todos de uma vez
            if (!empty($allErrors)) {
                return ApiResponse::validationError(
                    errors: $allErrors,
                    message: 'Erro de validação dos dados do beneficiário',
                    metadata: [
                        'version' => '1.0',
                        'endpoint' => $request->getPathInfo(),
                        'method' => $request->getMethod(),
                    ]
                );
            }

            // Se não houver erros, insere o beneficiário
            $beneficiario = $this->beneficiarioService->insertBeneficiario($cpf, $beneficiarioDTO);

            return ApiResponse::success(
                data: $beneficiario,
                message: 'Beneficiário cadastrado com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                    'groups' => ['beneficiario:read'],
                ]
            );
        } catch (\Exception $e) {
            return $this->handleApiException($e, $request);
        }
    }

    #[Route('/api/v1/participantes/{cpf}/beneficiario/{id}', name: 'beneficiarios_update', methods: ['PUT'])]
    public function update(#[RouteCpfEncrypted] #[ValidateCpfOwnership] string $cpf, string $id, Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            if (! $data) {
                return ApiResponse::error(
                    message: 'Dados inválidos',
                    statusCode: Response::HTTP_BAD_REQUEST
                );
            }

            $dados = new BeneficiarioUpdateDTO($data);

            // Acumula todos os erros de validação
            $allErrors = [];

            // 1. Valida o DTO (campos obrigatórios, formatos)
            $dtoErrors = $this->validator->validate($dados);
            if (count($dtoErrors) > 0) {
                foreach ($dtoErrors as $error) {
                    $allErrors[$error->getPropertyPath()] = $error->getMessage();
                }
            }

            // Se houver erros, retorna todos de uma vez
            if (!empty($allErrors)) {
                return ApiResponse::validationError(
                    errors: $allErrors,
                    message: 'Erro de validação dos dados do beneficiário',
                    metadata: [
                        'version' => '1.0',
                        'endpoint' => $request->getPathInfo(),
                        'method' => $request->getMethod(),
                    ]
                );
            }

            $beneficiario = $this->beneficiarioService->updateBeneficiario($cpf, $id, $dados);

            return ApiResponse::success(
                data: $beneficiario,
                message: 'Beneficiário atualizado com sucesso',
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

    #[Route('/api/v1/participantes/{cpf}/beneficiario/{id}', name: 'beneficiarios_delete', methods: ['DELETE'])]
    public function delete(#[RouteCpfEncrypted] #[ValidateCpfOwnership] string $cpf, string $id, Request $request): JsonResponse
    {
        try {
            $this->beneficiarioService->deleteBeneficiario($id);

            return ApiResponse::success(
                data: null,
                message: 'Beneficiário deletado com sucesso',
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