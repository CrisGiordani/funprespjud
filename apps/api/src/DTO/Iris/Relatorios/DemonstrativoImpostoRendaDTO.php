<?php

namespace App\DTO\Iris\Relatorios;

use App\DTO\Trust\Input\ParticipanteProfileDTO;
use App\DTO\Trust\Input\PatrocinadorDTO;
use App\Helper\CpfHelper;
use App\Helper\NumberHelper;

class DemonstrativoImpostoRendaDTO
{
    private string $anoIr;

    private string $cnpb;

    private string $patrocinador;

    private string $exercicio;

    private string $nmCargo;

    private string $cnpjFunprespJud;

    // * parte do participante....
    private string $cpf;

    private string $dtExercicio;

    private string $nome;

    private string $sexo;

    private string $dtNascimento;

    private string $naturalidade;

    private string $nacionalidade;

    private string $estadoCivil;

    private string $identidade;

    private string $orgaoEmissorRg;

    private string $dataExpedicao;

    private string $celular;

    private string $nomePai;

    private string $nomeMae;

    private string $endereco;

    private string $bairro;

    private string $cidade;

    private string $uf;

    private string $cep;

    private string $email;

    private ?string $telResidencial;

    private ?string $telComercial;

    //* Parte de contribuições....
    private float $contribuicoesRepassadasOrgaoParticipante;
    private float $contribuicoesRepassadasOrgaoPatrocinador;
    private float $contribuicoesRecolhidasFunprespjudParticipante;
    private float $contribuicoesRecolhidasFunprespjudPatrocinador;
    private float $totalParticipante;
    private float $totalPatrocinador;

    public function __construct(
        protected PatrocinadorDTO $patrocinadorDTO,
        protected ParticipanteProfileDTO $participanteProfileDTO,
        protected ContribuicaoPrevidenciaComplementarDTO $contribuicaoPrevidenciaComplementarDTO,
    ) {
        // dump($participanteProfileDTO);
        // die();
        // * parte do patrocinador....
        $this->cnpb = '2013.0017-38';
        $this->patrocinador = $patrocinadorDTO->getNome();
        $this->exercicio = $patrocinadorDTO->getDtExercicio();
        $this->nmCargo = $patrocinadorDTO->getNmCargo();
        $this->cnpjFunprespJud = '18.465.825/0001-47';

        // * parte do participante....
        $this->cpf = $participanteProfileDTO->getCpf();
        $this->dtExercicio = $participanteProfileDTO->getDtExercicio();
        $this->nome = $participanteProfileDTO->getNome();
        $this->sexo = $participanteProfileDTO->getSexo();
        $this->dtNascimento = $participanteProfileDTO->getDtNascimento();
        $this->naturalidade = $participanteProfileDTO->getNaturalidade();
        $this->nacionalidade = $participanteProfileDTO->getNmNacionalidade();
        $this->estadoCivil = $participanteProfileDTO->getNmEstadoCivil();
        $this->identidade = $participanteProfileDTO->getRg();
        $this->orgaoEmissorRg = $participanteProfileDTO->getEmissorRg();
        $this->dataExpedicao = $participanteProfileDTO->getDtExpedicaoRg();
        $this->celular = $participanteProfileDTO->getCelular();
        $this->nomePai = $participanteProfileDTO->getNmPai();
        $this->nomeMae = $participanteProfileDTO->getNmMae();
        $this->endereco = $participanteProfileDTO->getLogradouro();
        $this->bairro = $participanteProfileDTO->getBairro();
        $this->cidade = $participanteProfileDTO->getCidade();
        $this->uf = $participanteProfileDTO->getEnderecoUf();
        $this->cep = $participanteProfileDTO->getCep();
        $this->email = $participanteProfileDTO->getEmail();
        $this->telResidencial = $participanteProfileDTO?->getTelefone();
        $this->telComercial = $participanteProfileDTO?->getTelefoneComercial();

        //* Parte de contribuições....
        $this->contribuicoesRepassadasOrgaoParticipante = $contribuicaoPrevidenciaComplementarDTO->getContribuicoesRepassadasOrgaoParticipante();
        $this->contribuicoesRepassadasOrgaoPatrocinador = $contribuicaoPrevidenciaComplementarDTO->getContribuicoesRepassadasOrgaoPatrocinador();
        $this->contribuicoesRecolhidasFunprespjudParticipante = $contribuicaoPrevidenciaComplementarDTO->getContribuicoesRecolhidasFunprespjudParticipante();
        $this->contribuicoesRecolhidasFunprespjudPatrocinador = $contribuicaoPrevidenciaComplementarDTO->getContribuicoesRecolhidasFunprespjudPatrocinador();
        $this->totalParticipante = $contribuicaoPrevidenciaComplementarDTO->getTotalParticipante();
        $this->totalPatrocinador = $contribuicaoPrevidenciaComplementarDTO->getTotalPatrocinador();
    }

    public function getAnoIr(): string
    {
        return $this->anoIr;
    }

    public function setAnoIr(string $anoIr): void
    {
        $this->anoIr = $anoIr;
    }

    public function getCnpb(): string
    {
        return $this->cnpb;
    }

    public function getPatrocinador(): string
    {
        return $this->patrocinador;
    }

    public function getExercicio(): string
    {
        return $this->exercicio;
    }

    public function getNmCargo(): string
    {
        return $this->nmCargo;
    }

    public function getCnpjFunprespJud(): string
    {
        return $this->cnpjFunprespJud;
    }

    public function getCpf(): string
    {
        return CpfHelper::formatCpf($this->cpf);
    }

    public function getDtExercicio(): string
    {
        return $this->dtExercicio;
    }

    public function getNome(): string
    {
        return $this->nome;
    }

    public function getSexo(): string
    {
        return $this->sexo === 'M' ? 'Masculino' : 'Feminino';
    }

    public function getDtNascimento(): string
    {
        return $this->dtNascimento;
    }

    public function getNaturalidade(): string
    {
        return $this->naturalidade;
    }

    public function getNacionalidade(): string
    {
        return $this->nacionalidade;
    }

    public function getEstadoCivil(): string
    {
        return $this->estadoCivil;
    }

    public function getIdentidade(): string
    {
        return $this->identidade;
    }

    public function getOrgaoEmissorRg(): string
    {
        return $this->orgaoEmissorRg;
    }

    public function getDtExpedicaoRg(): string
    {
        return $this->dataExpedicao;
    }

    public function getCelular(): string
    {
        return $this->celular;
    }

    public function getNomePai(): string
    {
        return $this->nomePai;
    }

    public function getNomeMae(): string
    {
        return $this->nomeMae;
    }

    public function getEndereco(): string
    {
        return $this->endereco;
    }

    public function getBairro(): string
    {
        return $this->bairro;
    }

    public function getCidade(): string
    {
        return $this->cidade;
    }

    public function getUf(): string
    {
        return $this->uf;
    }

    public function getCep(): string
    {
        return $this->cep;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function getTelResidencial(): ?string
    {
        return $this?->telResidencial;
    }

    public function getTelComercial(): ?string
    {
        return $this?->telComercial;
    }

    public function getContribuicoesRepassadasOrgaoParticipante(): float|string
    {
        return NumberHelper::formatCurrency($this->contribuicoesRepassadasOrgaoParticipante);
    }

    public function getContribuicoesRepassadasOrgaoPatrocinador(): float|string
    {
        return NumberHelper::formatCurrency($this->contribuicoesRepassadasOrgaoPatrocinador);
    }

    public function getContribuicoesRecolhidasFunprespjudParticipante(): float|string
    {
        return NumberHelper::formatCurrency($this->contribuicoesRecolhidasFunprespjudParticipante);
    }

    public function getContribuicoesRecolhidasFunprespjudPatrocinador(): float|string
    {
        return NumberHelper::formatCurrency($this->contribuicoesRecolhidasFunprespjudPatrocinador);
    }

    public function getTotalParticipante(): float|string
    {
        return NumberHelper::formatCurrency($this->totalParticipante);
    }

    public function getTotalPatrocinador(): float|string
    {
        return NumberHelper::formatCurrency($this->totalPatrocinador);
    }

    /**
    * Retorna todas as propriedades da DTO em um array associativo
    *
    * @return array<string, string>
    */
    public function toArray(): array
    {
        return [
            'cnpb' => $this->getCnpb(),
            'orgaoPatrocinador' => $this->getPatrocinador(),
            'anoIr' => $this->getAnoIr(),
            'cargoEfetivo' => $this->getNmCargo(),

            //* *Parte do participante* */
            'nmCargo' => $this->getNmCargo(),
            'cnpjFunprespJud' => $this->getCnpjFunprespJud(),
            'cpf' => $this->getCpf(),
            'dtIngresso' => $this->getDtExercicio(),
            'nome' => $this->getNome(),
            'sexo' => $this->getSexo(),
            'dtNascimento' => $this->getDtNascimento(),
            'naturalidade' => $this->getNaturalidade(),
            'nacionalidade' => $this->getNacionalidade(),
            'estadoCivil' => $this->getEstadoCivil(),
            'identidade' => $this->getIdentidade(),
            'orgaoExpedidorRg' => $this->getOrgaoEmissorRg(),
            'dataExpedicao' => $this->getDtExpedicaoRg(),
            'celular' => $this->getCelular(),
            'nomePai' => $this->getNomePai(),
            'nomeMae' => $this->getNomeMae(),
            'endereco' => $this->getEndereco(),
            'bairro' => $this->getBairro(),
            'cidade' => $this->getCidade(),
            'uf' => $this->getUf(),
            'cep' => $this->getCep(),
            'email' => $this->getEmail(),
            'telResidencial' => $this->getTelResidencial(),
            'telComercial' => $this->getTelComercial(),

            //* *Parte de contribuições* */
            'contribuicoesRepassadasOrgaoParticipante' => $this->getContribuicoesRepassadasOrgaoParticipante(),
            'contribuicoesRepassadasOrgaoPatrocinador' => $this->getContribuicoesRepassadasOrgaoPatrocinador(),
            'contribuicoesRecolhidasFunprespjudParticipante' => $this->getContribuicoesRecolhidasFunprespjudParticipante(),
            'contribuicoesRecolhidasFunprespjudPatrocinador' => $this->getContribuicoesRecolhidasFunprespjudPatrocinador(),
            'totalParticipante' => $this->getTotalParticipante(),
            'totalPatrocinador' => $this->getTotalPatrocinador(),
        ];
    }

    public function getContribuicaoPrevidenciaComplementarDTO(): array
    {
        return [
            'contribuicoesRepassadasOrgaoParticipante' => $this->getContribuicoesRepassadasOrgaoParticipante(),
            'contribuicoesRepassadasOrgaoPatrocinador' => $this->getContribuicoesRepassadasOrgaoPatrocinador(),
            'contribuicoesRecolhidasFunprespjudParticipante' => $this->getContribuicoesRecolhidasFunprespjudParticipante(),
            'contribuicoesRecolhidasFunprespjudPatrocinador' => $this->getContribuicoesRecolhidasFunprespjudPatrocinador(),
            'totalParticipante' => $this->getTotalParticipante(),
            'totalPatrocinador' => $this->getTotalPatrocinador(),
        ];
    }
}
