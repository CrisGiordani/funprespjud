<?php

namespace App\Service\Iris\App;

use App\DTO\Iris\App\Input\DistribuicaoSolicitacoesDTO;
use App\DTO\Iris\App\Input\ResumoSolicitacoesDTO;
use App\DTO\Iris\App\Input\TotalDistribuicaoSolicitacoesDTO;
use App\Entity\Iris\App\Campanha;
use App\Enum\Iris\App\StatusCampanhaEnum;
use App\Exception\CampanhaNotFoundException;
use App\Exception\CampanhaSaveException;
use App\Interface\Iris\Repository\App\CampanhaRepositoryInterface;
use App\Interface\Iris\Service\App\CampanhaServiceInterface;
use App\Interface\Iris\Service\App\PortalPerfilInvestimentoServiceInterface;
use Psr\Log\LoggerInterface;
use Knp\Component\Pager\Pagination\PaginationInterface;
use Knp\Component\Pager\PaginatorInterface;

class CampanhaService implements CampanhaServiceInterface
{

    public function __construct(
        private readonly PaginatorInterface $paginator,
        private readonly CampanhaRepositoryInterface $campanhaRepository,
        private readonly PortalPerfilInvestimentoServiceInterface $portalPerfilInvestimentoService,
        private LoggerInterface $logger
    ) {}

    /**
     * @param array $data
     * 
     * @return void
     */
    public function criarCampanha(array $data): void
    {
        try {

            if ($data['dt_fim'] < date('Y-m-d')) {
                throw new CampanhaSaveException('A data de fim não pode ser anterior a data atual');
            }

            if ($data['dt_inicio'] > $data['dt_fim']) {
                throw new CampanhaSaveException('A data de início não pode ser posterior a data de fim');
            }

            $campanhaAtiva = $this->getCampanhaAtiva($data['dt_inicio']);

            if ($campanhaAtiva) {
                throw new CampanhaSaveException('Não pode criar uma campanha com data que já existe uma campanha ativa');
            }

            $campanha = new Campanha();
            $campanha->setDescricao($data['descricao']);
            $campanha->setDtInicio($data['dt_inicio']);
            $campanha->setDtFim($data['dt_fim']);
            $campanha->setUsuarioCriador($data['usuario_criador']);

            $this->campanhaRepository->salvarCampanha($campanha);
        } catch (CampanhaSaveException $e) {
            $this->logger->error($e->getMessage());

            throw $e;
        }
    }

    /**
     * @param int $idCampanha
     * @param array $data
     * 
     * @return Campanha
     */
    public function editarCampanha(int $idCampanha, array $data): Campanha
    {
        try {
            $campanha = $this->getById($idCampanha);

            if (! $campanha) {
                throw new CampanhaNotFoundException('Campanha não encontrada');
            }

            $mappingCapanhaUpdate = [
                'descricao' => 'setDescricao',
                'dt_inicio' => 'setDtInicio',
                'dt_fim' => 'setDtFim',
            ];

            foreach ($mappingCapanhaUpdate as $key => $value) {
                if (isset($data[$key])) {
                    $campanha->$value($data[$key]);
                }
            }
            $this->campanhaRepository->salvarCampanha($campanha);

            return $this->getById($idCampanha);
        } catch (CampanhaSaveException $exception) {
            throw $exception;
        } catch (\Exception $exception) {
            throw $exception;
        }
    }

    /**
     * @return Campanha[]
     */
    public function getAll(array $filter = []): PaginationInterface
    {
        $query = $this->campanhaRepository->getAll();
        $result = $this->paginator->paginate(
            $query,
            $filter['pageIndex'] + 1, // KnpPaginator uses 1-based page numbers
            $filter['pageSize']
        );

        // Processar os resultados para adicionar o status a cada campanha
        $items = $result->getItems();
        $processedItems = [];

        foreach ($items as $item) {
            if (is_array($item)) {
                // Se o resultado é um array (com status separado)
                $campanha = $item; // Primeiro elemento é a entidade Campanha
                $status = $item['status']; // Campo status calculado

                // Adicionar status como propriedade virtual
                $campanha['status'] = $status;
                $processedItems[] = $campanha;
            } else {
                // Se o resultado é diretamente a entidade
                $processedItems[] = $item;
            }
        }

        // Criar um novo objeto de paginação com os itens processados
        $result->setItems($processedItems);

        return $result;
    }

    /**
     * @param int $id
     * @return Campanha|null
     */
    public function getById(int $id): Campanha|null|array
    {
        return $this->campanhaRepository->getById($id);
    }

    /**
     * @return array|null
     */
    public function getCampanhaAtiva(?string $dtAtual = null): array | null
    {
        try {
            $dtAtual = $dtAtual ?? date('Y-m-d');
            $campanha = $this->campanhaRepository->getCampanhaAtiva($dtAtual);

            // Se não encontrou campanha, retorna null
            if (!$campanha) {
                return null;
            }

            // Valida se a campanha está realmente ativa
            $dataInicio = new \DateTime($campanha['dt_inicio']);
            $dataFim = new \DateTime($campanha['dt_fim']);
            $dataAtual = new \DateTime($dtAtual);

            // Verifica se está dentro do período ativo
            if ($dataAtual < $dataInicio || $dataAtual > $dataFim) {
                return null;
            }

            // Adiciona status calculado
            $campanha['status'] = $this->calcularStatusCampanha($dataInicio, $dataFim, $dataAtual);
            $campanha['ativa'] = true;

            return $campanha;
        } catch (CampanhaNotFoundException $exception) {
            return null; // Retorna null em vez de lançar exceção
        } catch (\Exception $exception) {
            $this->logger->error('Erro ao buscar campanha ativa: ' . $exception->getMessage());
            return null;
        }
    }

    /**
     * Calcula o status da campanha baseado nas datas
     */
    private function calcularStatusCampanha(\DateTime $dataInicio, \DateTime $dataFim, \DateTime $dataAtual): string
    {
        if ($dataInicio > $dataAtual) {
            return StatusCampanhaEnum::AGENDADA->value;
        }
        
        if ($dataInicio <= $dataAtual && $dataFim >= $dataAtual) {
            return StatusCampanhaEnum::ANDAMENTO->value;
        }
        
        return StatusCampanhaEnum::FINALIZADA->value;
    }

    /**
     * @param Campanha $campanha
     * 
     * @return void
     */
    public function deleteCampanha(Campanha $campanha): void
    {

        if (! $campanha) {
            throw new CampanhaNotFoundException('Campanha não encontrada');
        }

        if ($campanha->getStatus() === StatusCampanhaEnum::ANDAMENTO->value) {
            throw new CampanhaSaveException('Não é possível deletar uma campanha em andamento');
        }

        if ($campanha->getStatus() === StatusCampanhaEnum::FINALIZADA->value) {
            throw new CampanhaSaveException('Não é possível deletar uma campanha finalizada');
        }

        $this->campanhaRepository->deleteCampanha($campanha);
    }

    /**
     * @param int $idCampanha
     * 
     * @return ResumoSolicitacoesDTO
     */
    public function getResumoSolicitacoesCampanha(int $idCampanha): ResumoSolicitacoesDTO|null
    {
        return $this->campanhaRepository->getResumoSolicitacoesCampanha($idCampanha);
    }

    /**
     * @param int $idCampanha
     * 
     * @return DistribuicaoSolicitacoesDTO
     */
    public function getDistribuicaoSolicitacoesCampanha(int $idCampanha): TotalDistribuicaoSolicitacoesDTO|null
    {
        $perfils = $this->portalPerfilInvestimentoService->getAll();

        $distribuicao = array();
        foreach ($perfils as  $perfil) {

            $distribuicao[str_replace(' ', '', $perfil->getDescricao())] = $this->campanhaRepository->distruibuicaoSolicitacoesCampanha($idCampanha, $perfil->getDescricao());
        }
 
        $result = new TotalDistribuicaoSolicitacoesDTO($distribuicao);

        return $result;
    }
}
