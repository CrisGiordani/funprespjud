<?php

namespace App\Service\Iris\App;

use App\DTO\Iris\App\Input\QuestionarioRespostaDTO;
use App\Entity\Iris\App\Historico;
use App\Entity\Iris\App\QuestionarioResposta;
use App\Enum\Iris\App\StatusHistoricoEnum;
use App\Exception\QuestionarioException;
use App\Interface\Iris\Repository\App\QuestionarioRespostaRepositoryInterface;
use App\Interface\Iris\Repository\App\StatusHistoricoRepositoryInterface;
use App\Interface\Iris\Service\App\AlternativaServiceInterface;
use App\Interface\Iris\Service\App\DocumentoServiceInterface;
use App\Interface\Iris\Service\App\HistoricoServiceInterface;
use App\Interface\Iris\Service\App\PerguntaServiceInterface;
use App\Interface\Iris\Service\App\QuestionarioRespostaServiceInterface;
use App\Interface\Iris\Service\App\QuestionarioServiceInterface;
use Psr\Log\LoggerInterface;

class QuestionarioRespostaService implements QuestionarioRespostaServiceInterface
{
    public function __construct(
        private QuestionarioRespostaRepositoryInterface $questionarioRespostaRepository,
        private QuestionarioServiceInterface $questionarioService,
        private PerguntaServiceInterface $perguntaService,
        private AlternativaServiceInterface $alternativaService,
        private LoggerInterface $logger,
        private HistoricoServiceInterface $historicoService,
        private DocumentoServiceInterface $documentoService,
        private StatusHistoricoRepositoryInterface $statusHistoricoRepository
    ) {}

    /**
     * @return array
     */
    public function getAll(): array
    {
        return $this->questionarioRespostaRepository->getAll();
    }

    /**
     * @param string $cpf
     *
     * @return array
     */
    public function findByCpf(string $cpf): array
    {
        return $this->questionarioRespostaRepository->findByCpf($cpf);
    }

    /**
     * @param QuestionarioRespostaDTO $questionarioRespostaDTO
     *
     * @return void
     */
    public function salvarRespostas(QuestionarioRespostaDTO $questionarioRespostaDTO): void
    {
        try {
            $this->questionarioRespostaRepository->beginTransaction();

            $this->validateRespostas($questionarioRespostaDTO);

            foreach ($questionarioRespostaDTO->getRespostas() as $resposta) {
                $questionarioResposta = new QuestionarioResposta();
                $questionarioResposta->setCpf($questionarioRespostaDTO->getCpf());
                $questionarioResposta->setDtResposta(new \DateTime());

                $questionario = $this->questionarioService->getById($resposta['id_app_questionario']);
                $pergunta = $this->perguntaService->getById($resposta['id_app_pergunta']);
                $alternativa = $this->alternativaService->getById($resposta['id_app_alternativa']);

                if (! $questionario || ! $pergunta || ! $alternativa) {
                    throw new QuestionarioException('Uma ou mais entidades relacionadas não foram encontradas.');
                }

                $questionarioResposta->setQuestionario($questionario);
                $questionarioResposta->setPergunta($pergunta);
                $questionarioResposta->setAlternativa($alternativa);

                $this->questionarioRespostaRepository->persist($questionarioResposta);
            }

            $this->questionarioRespostaRepository->flush();
            $this->questionarioRespostaRepository->commit();

            $this->salvarHistoricoQuestionario($questionarioRespostaDTO);
        } catch (QuestionarioException $exception) {
            $this->questionarioRespostaRepository->rollback();
            $this->logger->error('Erro ao salvar respostas: ' . $exception->getMessage());

            throw $exception;
        }
    }

    /**
     * @param QuestionarioRespostaDTO $questionarioRespostaDTO
     *
     * @return void
     */
    private function salvarHistoricoQuestionario(QuestionarioRespostaDTO $questionarioRespostaDTO): void
    {
        $statusHistorico = $this->statusHistoricoRepository->getByCdStatus(StatusHistoricoEnum::PREENCHIDO->value);

        if (! $statusHistorico) {
            throw new QuestionarioException('Status do histórico não encontrado');
        }

        $historico = new Historico(
            cpf: $questionarioRespostaDTO->getCpf(),
            status: $statusHistorico,
            dt_evento: new \DateTime(),
            urlDocumento: $this->documentoService->relatoriosApp($questionarioRespostaDTO->getCpf(), StatusHistoricoEnum::PREENCHIDO->value)
        );

        $this->historicoService->save($historico);
    }

    /**
     * @param string $cpf
     *
     * @return array
     */
    public function getUltimaRespostaByCpf(string $cpf): array
    {
        return $this->questionarioRespostaRepository->getUltimaRespostaByCpf($cpf);
    }

    /**
     * @param QuestionarioRespostaDTO $questionarioRespostaDTO
     *
     * @return void
     */
    private function validateRespostas(QuestionarioRespostaDTO $questionarioRespostaDTO): void
    {
        if (! $questionarioRespostaDTO->validateRespostas()) {
            throw new QuestionarioException('Erro na validação das respostas');
        }
    }
}
