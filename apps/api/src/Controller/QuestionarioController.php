<?php

namespace App\Controller;

use App\Attribute\RequiresJwtAuth;
use App\Attribute\RouteCpfEncrypted;
use App\Attribute\ValidateCpfOwnership;
use App\DTO\Iris\App\Input\QuestionarioRespostaDTO;
use App\Exception\QuestionarioException;
use App\Http\Response\ApiResponse;
use App\Interface\Iris\Service\App\HistoricoServiceInterface;
use App\Interface\Iris\Service\App\QuestionarioRespostaServiceInterface;
use App\Interface\Iris\Service\App\QuestionarioServiceInterface;
use App\Trait\ApiTrait;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/v1/questionario')]
#[RequiresJwtAuth]
final class QuestionarioController extends AbstractController
{
    use ApiTrait;

    public function __construct(
        private readonly QuestionarioServiceInterface $questionarioService,
        private readonly QuestionarioRespostaServiceInterface $questionarioRespostaService,
        private readonly HistoricoServiceInterface $historicoService,
        private readonly SerializerInterface $serializer
    ) {
    }

    #[Route('/{id}', methods: ['GET'])]
    public function getQuestionario(Request $request, int $id): JsonResponse
    {
        try {
            $questionario = $this->questionarioService->getById($id);

            $serializedQuestionario = $this->serializer->serialize($questionario, 'json', [
                'groups' => ['questionario:read'],
                'circular_reference_handler' => function ($object)
                {
                    return $object->getId();
                },
            ]);
            $questionarioArray = json_decode($serializedQuestionario, true);

            return ApiResponse::success(
                data: $questionarioArray,
                message: 'Questionário encontrado com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                    'groups' => ['questionario:read'],
                    'totalItems' => count($questionarioArray),
                ]
            );
        } catch (\Exception $e) {
            return $this->handleApiException($e, $request);
        }
    }

    #[Route('/respostas/{cpf}', methods: ['POST'])]
    public function salvarRespostas(Request $request, #[RouteCpfEncrypted] #[ValidateCpfOwnership] string $cpf): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            $data['cpf'] = $cpf;

            $questionarioRespostaDTO = QuestionarioRespostaDTO::fromArray($data);
            $result = $this->questionarioRespostaService->salvarRespostas($questionarioRespostaDTO);

            $serializedResult = $this->serializer->serialize($result, 'json', [
                'groups' => ['questionario:read'],
                'circular_reference_handler' => function ($object)
                {
                    return $object->getId();
                },
            ]);
            $resultArray = json_decode($serializedResult, true);

            return ApiResponse::created(
                data: $resultArray,
                message: 'Respostas salvas com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (QuestionarioException $e) {
            return ApiResponse::error(
                $e->getMessage(),
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

    #[Route('/{cpf}/historico', methods: ['GET'])]
    public function getHistoricoQuestionario(
        #[RouteCpfEncrypted]
        #[ValidateCpfOwnership]
        string $cpf,
        Request $request
    ): JsonResponse {
        try {
            $filterPagination = [
                'pageIndex' => intval($request->query->get('pageIndex', 0)),
                'pageSize' => intval($request->query->get('pageSize', 4)),
            ];

            $historico = $this->historicoService->getByCpf($cpf, $filterPagination);

            $historicoResponse = [
                'historico' => $historico->getItems(),
                'pageIndex' => $historico->getCurrentPageNumber(),
                'pageSize' => $historico->getItemNumberPerPage(),
                'totalPages' => ceil($historico->getTotalItemCount() / $historico->getItemNumberPerPage()),
                'totalItems' => $historico->getTotalItemCount(),
            ];

            $serializedHistorico = $this->serializer->serialize($historicoResponse, 'json', [
                'groups' => ['historico:read'],
                'circular_reference_handler' => function ($object)
                {
                    return $object->getId();
                },
            ]);
            $historicoArray = json_decode($serializedHistorico, true);

            return ApiResponse::success(
                data: $historicoArray,
                message: 'Histórico do questionário encontrado com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                    'groups' => ['historico:read'],
                    'totalItems' => $historico->getTotalItemCount(),
                ]
            );
        } catch (\Exception $e) {
            return $this->handleApiException($e, $request);
        }
    }

    #[Route('/{cpf}/ultima-resposta', methods: ['GET'])]
    public function getUltimaResposta(
        #[RouteCpfEncrypted]
        #[ValidateCpfOwnership]
        string $cpf,
        Request $request
    ): JsonResponse {
        try {
            $ultimaResposta = $this->historicoService->findByCpfLastresult($cpf);

            $ultimaRespostaArray = $this->serializer->serialize($ultimaResposta, 'json', [
                'groups' => ['historico:read'],
                'circular_reference_handler' => function ($object)
                {
                    return $object->getId();
                },
            ]);

            $ultimaRespostaArray = json_decode($ultimaRespostaArray, true);

            return ApiResponse::success(
                data: $ultimaRespostaArray,
                message: 'Ultima resposta encontrada com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                    'groups' => ['questionario:read'],
                    'totalItems' => $ultimaResposta ? 1 : 0,
                ]
            );
        } catch (\Exception $e) {
            return $this->handleApiException($e, $request);
        }
    }

    #[Route('/{cpf}/status-app', methods: ['GET'])]
    public function getStatusApp(
        Request $request,
        #[RouteCpfEncrypted]
        #[ValidateCpfOwnership]
        string $cpf,
    ): JsonResponse {
        try {
            $statusApp = $this->historicoService->getStatusApp($cpf);

            return ApiResponse::success(
                data: $statusApp,
                message: 'Ultima resposta encontrada com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                    'groups' => ['questionario:read'],
                    'totalItems' => 1,
                ]
            );
        } catch (\Exception $e) {
            return $this->handleApiException($e, $request);
        }
    }
}
