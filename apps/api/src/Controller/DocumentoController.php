<?php

namespace App\Controller;

use App\Attribute\RequiresJwtAuth;
use App\Attribute\RouteCpfEncrypted;
use App\Attribute\ValidateCpfOwnership;
use App\Entity\Iris\Core\Documento;
use App\Enum\Jasper\JasperReportPathEnum;
use App\Exception\FileException;
use App\Interface\Iris\Service\Core\DocumentoServiceInterface;
use App\Interface\Jasper\JasperServiceInterface;
use App\Interface\Storage\WebDAV\WebDAVServiceInterface;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/v1/documentos')]
#[RequiresJwtAuth]
final class DocumentoController extends AbstractController
{
    public function __construct(
        private readonly DocumentoServiceInterface $documentoService,
        private readonly SerializerInterface $serializer,
        private readonly JasperServiceInterface $jasperService,
        private readonly WebDAVServiceInterface $webDAVService
    ) {
    }

    #[Route('/', methods: ['GET'])]
    public function getAll(Request $request): JsonResponse
    {
        try {
            $filter = [
                'pageIndex' => (int) $request->query->get('pageIndex', 0),
                'pageSize' => (int) $request->query->get('pageSize', 9),
                'tipo' => $request->query->get('tipo'),
                'ano' => $request->query->get('ano'),
            ];

            $documentos = $this->documentoService->getAll($filter);

            return $this->json(
                [
                    'pagina' => $documentos->getCurrentPageNumber(),
                    'total_paginas' => ceil($documentos->getTotalItemCount() / $documentos->getItemNumberPerPage()),
                    'total_itens' => $documentos->getTotalItemCount(),
                    'itens_por_pagina' => $documentos->getItemNumberPerPage(),
                    'dados' => $documentos->getItems(),
                ],
                Response::HTTP_OK
            );
        } catch (FileException $e) {
            return $this->json([
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        } catch (\Exception $e) {
            return $this->json([
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/{id}/documento', methods: ['GET'])]
    public function getByIdDocumento(int $id): JsonResponse
    {
        try {
            $documento = $this->documentoService->getById($id);

            return $this->json($documento, Response::HTTP_OK);
        } catch (FileException $e) {
            return $this->json([
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        } catch (\Exception $e) {
            return $this->json([
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/documento/{usuarioId}', methods: ['GET'])]
    public function getByUsuarioId(int $usuarioId): JsonResponse
    {
        try {
            $documentos = $this->documentoService->getByUsuarioId($usuarioId);

            return $this->json($documentos, Response::HTTP_OK);
        } catch (FileException $e) {
            return $this->json([
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        } catch (\Exception $e) {
            return $this->json([
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        try {
            $dados = $request->getPayload()->all();

            $documento = new Documento();
            $documento->setNome($dados['nome']);
            $documento->setTipo($dados['tipo']);
            $documento->setLink($dados['link']);
            $documento->setUsuarioId($dados['usuario_id']);

            $file = $request->files->get('file');

            $url = null;
            if ($file) {
                $path = $request->request->get('path', '/');
                $remotePath = ($path ?: '/') . '/' . $file->getClientOriginalName();
                $localPath = $file->getPathname();
      
                $url = $this->webDAVService->uploadFile($localPath, $remotePath);
            }

            if (($file && $url) || (! $file)) {
                $documento->setLink($url);
                $documento = $this->documentoService->save($documento);
            }

            return $this->json([
                'data' => $documento,
                'message' => 'Documento criado com sucesso',
            ], Response::HTTP_CREATED);
        } catch (FileException $e) {
            return $this->json([
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        } catch (\Exception $e) {
            return $this->json([
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/{id}/documento', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        try {
            $this->documentoService->softDelete($id);

            return $this->json([
                'message' => 'Documento deletado com sucesso',
            ], Response::HTTP_OK);
        } catch (FileException $e) {
            return $this->json([
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        } catch (\Exception $e) {
            return $this->json([
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/{id:documento}', methods: ['PUT'])]
    public function update(
        #[MapEntity(expr: 'repository.getById(documento)', objectManager: 'iris', message: 'Documento não encontrado')]
        Documento $documento,
        Request $request
    ): JsonResponse {
        try {
            $dados = json_decode($request->getContent(), true);

            $documento = $this->documentoService->update($documento, $dados);

            return $this->json([
                'data' => $documento,
                'message' => 'Documento atualizado com sucesso',
            ], Response::HTTP_OK);
        } catch (FileException $e) {
            return $this->json([
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        } catch (\Exception $e) {
            return $this->json([
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/{cpf}/emitir-certificado', methods: ['GET'])]
    public function getDadosUsuario(#[RouteCpfEncrypted] #[ValidateCpfOwnership] string $cpf): Response
    {
        try {
            $nomeParticipante = $this->documentoService->getDadosUsuario($cpf);
            $report = $this->jasperService->generateReport(
                reportName: JasperReportPathEnum::REPORT_CERTIFICADO->value,
                params: $nomeParticipante
            );

            return new Response(
                $report,
                Response::HTTP_OK,
                [
                    'Content-Type' => 'application/pdf',
                    'Content-Disposition' => 'inline; filename=Report.pdf',
                    'Cache-Control' => 'must-revalidate',
                ]
            );
        } catch (\Exception $e) {
            return $this->json([
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/tipo-documento', methods: ['GET'])]
    public function getTipoDocumento(): JsonResponse
    {
        try {
            return $this->json(
                $this->documentoService->getTipoDocumento(),
                Response::HTTP_OK
            );
        } catch (\Exception $e) {
            return $this->json([
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
