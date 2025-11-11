<?php

namespace App\Service\Iris\Core;

use App\Entity\Iris\Core\Documento;
use App\Enum\Iris\Core\TipoDocumentoEnum;
use App\Exception\FileException;
use App\Interface\Iris\Repository\Core\DocumentoRepositoryInterface;
use App\Interface\Iris\Service\Core\DocumentoServiceInterface;
use App\Interface\Trust\Service\TrustParticipanteServiceInterface;
use App\Interface\Trust\Service\TrustPlanoServiceInterface;
use Knp\Component\Pager\Pagination\PaginationInterface;
use Knp\Component\Pager\PaginatorInterface;
use Psr\Log\LoggerInterface;

class DocumentoService implements DocumentoServiceInterface
{
    public function __construct(
        private readonly DocumentoRepositoryInterface $documentoRepository,
        private readonly TrustPlanoServiceInterface $trustPlanoService,
        private readonly TrustParticipanteServiceInterface $trustParticipanteService,
        private readonly PaginatorInterface $paginator,
        private readonly LoggerInterface $logger,
    ) {
    }

    /**
     * @return \Knp\Component\Pager\Pagination\PaginationInterface
     */
    public function getAll(array $filter = []): PaginationInterface
    {
        try {
            $query = $this->documentoRepository->getAll($filter);

            return $this->paginator->paginate(
                $query,
                $filter['pageIndex'] + 1, // KnpPaginator uses 1-based page numbers
                $filter['pageSize']
            );
        } catch (FileException $e) {
            $this->logger->error($e->getMessage());

            throw new FileException('Não foi possível buscar os documentos');
        } catch (\Exception $e) {
            $this->logger->error($e->getMessage());

            throw new \Exception('Não foi possível buscar os documentos');
        }
    }

    /**
     * @param int $usuarioId
     *
     * @return [type]
     */
    public function getByUsuarioId(int $usuarioId)
    {
        try {
            return $this->documentoRepository->getByUsuarioId($usuarioId);
        } catch (FileException $e) {
            $this->logger->error($e->getMessage());

            throw new FileException('Não foi possível buscar os documentos');
        } catch (\Exception $e) {
            $this->logger->error($e->getMessage());

            throw new \Exception('Não foi possível buscar os documentos');
        }
    }

    /**
     * @param int $id
     *
     * @return Documento|Exception|FileException
     */
    public function getById(int $id): Documento|\Exception|FileException
    {
        try {
            $documento = $this->documentoRepository->getById($id);

            if (! $documento) {
                throw new FileException();
            }

            return $documento;
        } catch (FileException $e) {
            $this->logger->error($e->getMessage());

            throw new FileException('Não foi possível buscar o documento');
        } catch (\Exception $e) {
            $this->logger->error($e->getMessage());

            throw new \Exception('Não foi possível buscar o documento');
        }
    }

    /**
     * @param Documento $documento
     *
     * @return Documento
     */
    public function save(Documento $documento): Documento
    {
        try {
            $documento->setDtCriacao(new \DateTime('now'));

            return $this->documentoRepository->save($documento);
        } catch (FileException $e) {
            $this->logger->error($e->getMessage());

            throw new FileException('Não foi possível salvar o documento');
        } catch (\Exception $e) {
            $this->logger->error($e->getMessage());

            throw new \Exception('Não foi possível salvar o documento');
        }
    }

    /**
     * @param Documento $documento
     * @param array $dados
     * @return Documento
     */
    public function update(Documento $documento, array $dados): Documento
    {
        try {
            $camposPermitidos = [
                'nome' => fn ($valor) => $documento->setNome($valor),
                'tipo' => fn ($valor) => $documento->setTipo($valor),
                'link' => fn ($valor) => $documento->setLink($valor),
                'dtDocumento' => fn ($valor) => $documento->setDtDocumento(new \DateTime($valor)),
                'usuarioId' => fn ($valor) => $documento->setUsuarioId($valor),
            ];

            foreach ($camposPermitidos as $campo => $setter) {
                if (isset($dados[$campo])) {
                    $setter($dados[$campo]);
                }
            }

            $documento->setDtAtualizacao(new \DateTime());

            return $this->documentoRepository->update($documento);
        } catch (FileException $e) {
            $this->logger->error($e->getMessage());

            throw new FileException('Não foi possível atualizar o documento');
        } catch (\Exception $e) {
            $this->logger->error($e->getMessage());

            throw new \Exception('Não foi possível atualizar o documento');
        }
    }

    public function softDelete(int $id): void
    {
        try {
            $documento = $this->getById($id);

            $this->documentoRepository->softDelete($documento);
        } catch (FileException $e) {
            $this->logger->error($e->getMessage());

            throw new FileException('Não foi possível deletar o documento');
        } catch (\Exception $e) {
            $this->logger->error($e->getMessage());

            throw new \Exception('Não foi possível deletar o documento');
        }
    }

    public function restore(Documento $documento): void
    {
        try {
            $this->documentoRepository->restore($documento);
        } catch (FileException $e) {
            $this->logger->error($e->getMessage());

            throw new FileException('Não foi possível restaurar o documento');
        } catch (\Exception $e) {
            $this->logger->error($e->getMessage());

            throw new \Exception('Não foi possível restaurar o documento');
        }
    }

    public function getDadosUsuario(string $cpf)
    {
        try {
            $plano = $this->trustPlanoService->getPlanosByCpf($cpf);

            if (empty($plano)) {
                throw new \Exception('Não foi possível buscar o certificado, plano não encontrado');
            }

            $dadosParticipante = $this->trustParticipanteService->getParticipante($cpf);

            return [
                'nome' => $dadosParticipante->getNome(),
            ];
        } catch (FileException $e) {
            $this->logger->error($e->getMessage());

            throw new FileException('Não foi possível buscar o certificado');
        } catch (\Exception $e) {
            $this->logger->error($e->getMessage());

            throw new \Exception('Não foi possível buscar o certificado');
        }
    }

    public function getTipoDocumento(): array
    {
        return TipoDocumentoEnum::getAllLabelsValues();
    }
}
