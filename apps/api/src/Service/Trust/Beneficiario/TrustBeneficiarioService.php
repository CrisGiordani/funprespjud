<?php

namespace App\Service\Trust\Beneficiario;

use App\DTO\Trust\Input\BeneficiarioDTO;
use App\DTO\Trust\Input\BeneficiarioUpdateDTO;
use App\Exception\BeneficiarioJaVinculadoException;
use App\Exception\ParticipanteNotFoundException;
use App\Interface\Trust\Repository\TrustBeneficiarioRepositoryInterface;
use App\Interface\Trust\Repository\TrustPessoaRepositoryInterface;
use App\Interface\Trust\Service\TrustBeneficiarioServiceInterface;
use App\Interface\Trust\Service\TrustParticipanteServiceInterface;

class TrustBeneficiarioService implements TrustBeneficiarioServiceInterface
{

    public function __construct(
        private TrustBeneficiarioRepositoryInterface $trustBeneficiarioRepository,
        private TrustParticipanteServiceInterface $trustParticipanteService,
        private TrustPessoaRepositoryInterface $trustPessoaRepository
    ) {}

    /**
     * @param string $cpf
     * @return array<BeneficiarioDTO>|null
     */
    public function getBeneficiarios(string $cpf): array|null
    {
        return $this->trustBeneficiarioRepository->getBeneficiarios($cpf);
    }

    /**
     * Valida as regras de negócio do beneficiário sem inserir
     * 
     * @param string $cpf
     * @param BeneficiarioDTO $dados
     * @return array Array com os erros encontrados (vazio se não houver erros)
     */
    public function validateBeneficiario(string $cpf, BeneficiarioDTO $dados): array
    {
        $errors = [];

        try {
            $dadosParticipante = $this->trustParticipanteService->getDadosParticipanteAtivo($cpf);
            if (!isset($dadosParticipante) || count($dadosParticipante) == 0 || !$dadosParticipante) {
                $errors['participante'] = 'Não foi encontrado registro ativo para o participante';
                return $errors;
            }

            // Verifica se o CPF já está cadastrado como beneficiário para este participante
            $cpfJaCadastrado = $this->trustBeneficiarioRepository->hasBeneficiarioComCpf($dadosParticipante, $dados->getCpf());
            if ($cpfJaCadastrado) {
                $errors['cpf'] = 'Este CPF já está cadastrado como beneficiário para este participante';
            }

            // Verifica se já existe um cônjuge vinculado ao participante
            // IMPORTANTE: Esta validação só deve ser aplicada se o grau de parentesco for de cônjuge
            if (TrustBeneficiarioConstants::isConjuge($dados->getGrauParentesco())) {
                $conjugeJaVinculado = $this->trustBeneficiarioRepository->hasConjugeVinculado($dadosParticipante, $dados->getGrauParentesco());
                if ($conjugeJaVinculado) {
                    $errors['grauParentesco'] = 'Participante já possui um beneficiário cônjuge cadastrado';
                }
            }

            return $errors;
        } catch (\Exception $e) {
            $errors['geral'] = 'Erro ao validar beneficiário: ' . $e->getMessage();
            return $errors;
        }
    }

    /**
     * @param string $cpf
     * @param BeneficiarioDTO $dados
     * 
     * @return bool
     */
    public function insertBeneficiario(string $cpf, BeneficiarioDTO $dados): bool
    {
        try {
            $this->trustBeneficiarioRepository->beginTransaction();

            $dadosParticipante = $this->trustParticipanteService->getDadosParticipanteAtivo($cpf);
            if (!isset($dadosParticipante) || count($dadosParticipante) == 0 || !$dadosParticipante) {
                throw new ParticipanteNotFoundException('Não foi encontrado registro ativo para o participante');
            }

            // Verifica se a pessoa já existe na tabela PESSOA (mesmo que não esteja vinculada)
            $beneficiario = $this->trustPessoaRepository->getPessoaByCpf($dados->getCpf());

            if (!$beneficiario) {
                // CPF não existe na tabela PESSOA, pode inserir
                $this->trustPessoaRepository->insertPessoaBeneficiario($dados);
                $beneficiario = $this->trustPessoaRepository->getPessoaByCpf($dados->getCpf());
            }

            // Verifica se já está vinculado a ESTE participante
            $isVinculado = $this->trustBeneficiarioRepository->isVinculado($dadosParticipante, $beneficiario->getId());
            if ($isVinculado) {
                throw new BeneficiarioJaVinculadoException('Beneficiário já vinculado ao participante');
            }

            // Filtra participantes que ainda não tem este beneficiário vinculado
            $dadosParticipanteFiltrado = $this->trustBeneficiarioRepository->filterDadosParticipanteNaoVinculadosAoBeneficiario($dadosParticipante, $beneficiario->getId());

            if (empty($dadosParticipanteFiltrado)) {
                throw new BeneficiarioJaVinculadoException('Este CPF já está cadastrado como beneficiário para todos os vínculos do participante');
            }

            $this->trustBeneficiarioRepository->insertBeneficiario($dadosParticipanteFiltrado, $dados,  $beneficiario->getId());

            $this->trustBeneficiarioRepository->commitTransaction();

            return true;
        } catch (BeneficiarioJaVinculadoException $e) {
            $this->trustBeneficiarioRepository->rollbackTransaction();
            throw $e;
        } catch (\Exception $e) {
            $this->trustBeneficiarioRepository->rollbackTransaction();
            throw new \Exception('Erro ao inserir beneficiário: ' . $e->getMessage());
        }
    }

    /**
     * @param string $cpf
     * @param string $id
     * @param BeneficiarioDTO|BeneficiarioUpdateDTO $dados
     * 
     * @return bool
     */
    public function updateBeneficiario(string $cpf, string $id, BeneficiarioDTO|BeneficiarioUpdateDTO $dados): bool
    {
        return $this->trustBeneficiarioRepository->updateBeneficiario($cpf, $id, $dados);
    }

    /**
     * @param string $id
     * 
     * @return bool
     */
    public function deleteBeneficiario(string $id): bool
    {
        return $this->trustBeneficiarioRepository->deleteBeneficiario($id);
    }
}