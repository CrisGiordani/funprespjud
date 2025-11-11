<?php

namespace App\Domain\Trust\Mapper;

use App\Domain\Trust\Entity\Participante;
use App\Domain\Trust\ValueObject\CPF;
use App\Domain\Trust\ValueObject\Email;
use App\Domain\Trust\ValueObject\Endereco;
use App\DTO\Trust\Input\ParticipanteProfileDTO;
use App\DTO\Trust\Output\ParticipanteProfileOutputDTO;
use DateTimeImmutable;

class ParticipanteMapper {
    public static function toEntity(array $data): Participante {
        $participante = new Participante(
            $data['id'],
            $data['nome'],
            new DateTimeImmutable($data['dtNascimento']),
            $data['sexo'],
            new CPF($data['cpf'])
        );

        if (! empty($data['rg'])) {
            $participante->atualizarDadosPessoais(
                $data['nome'],
                new DateTimeImmutable($data['dtNascimento']),
                $data['sexo'],
                $data['rg'] ?? null,
                $data['emissorRg'] ?? null,
                $data['ufRg'] ?? null,
                $data['dtExpedicaoRg'] ? new DateTimeImmutable($data['dtExpedicaoRg']) : null,
                $data['estadoCivil'] ?? null,
                $data['nmMae'] ?? null,
                $data['nmPai'] ?? null,
                $data['naturalidade'] ?? null,
                $data['ufNaturalidade'] ?? null,
                $data['nacionalidade'] ?? null,
                $data['nmNacionalidade'] ?? null
            );
        }

        if (! empty($data['logradouro'])) {
            $participante->atualizarEndereco(new Endereco(
                $data['logradouro'],
                $data['numero'],
                $data['enderecoComplemento'] ?? null,
                $data['bairro'],
                $data['cidade'],
                $data['enderecoUf'],
                $data['cep']
            ));
        }

        if (! empty($data['email'])) {
            $participante->atualizarContatos(
                $data['telefone'] ?? null,
                $data['telefoneComercial'] ?? null,
                $data['celular'] ?? null,
                new Email($data['email']),
                $data['emailAdicional1'] ? new Email($data['emailAdicional1']) : null,
                $data['emailAdicional2'] ? new Email($data['emailAdicional2']) : null
            );
        }

        if (! empty($data['inscricao'])) {
            $participante->atualizarDadosProfissionais(
                $data['inscricao'] ?? null,
                $data['matricula'] ?? null,
                $data['dtExercicio'] ? new DateTimeImmutable($data['dtExercicio']) : null,
                $data['dtInscricaoPlano'] ? new DateTimeImmutable($data['dtInscricaoPlano']) : null,
                $data['idCargo'] ?? null,
                $data['nmCargo'] ?? null
            );
        }

        if ($data['politicamenteExposto'] === 'S') {
            $participante->marcarComoPoliticamenteExposto();
        }

        return $participante;
    }

    public static function toDTO(Participante $participante): ParticipanteProfileDTO {
        $dto = new ParticipanteProfileDTO();

        $dto->setId($participante->getId());
        $dto->setNome($participante->getNome());
        $dto->setDtNascimento($participante->getDataNascimento()->format('d/m/Y'));
        $dto->setSexo($participante->getSexo());
        $dto->setCpf($participante->getCpf()->getNumero());
        $dto->setInscricao($participante->getInscricao());
        $dto->setMatricula($participante->getMatricula());
        $dto->setRg($participante->getRg());
        $dto->setEmissorRg($participante->getEmissorRg());
        $dto->setUfRg($participante->getUfRg());
        $dto->setDtExpedicaoRg($participante->getDataExpedicaoRg()?->format('d/m/Y'));
        $dto->setEstadoCivil($participante->getEstadoCivil());
        $dto->setPoliticamenteExposto($participante->isPoliticamenteExposto() ? 'S' : 'N');
        $dto->setNmMae($participante->getNomeMae());
        $dto->setNmPai($participante->getNomePai());

        if ($endereco = $participante->getEndereco()) {
            $dto->setLogradouro($endereco->getLogradouro());
            $dto->setNumero($endereco->getNumero());
            $dto->setEnderecoComplemento($endereco->getComplemento());
            $dto->setBairro($endereco->getBairro());
            $dto->setCidade($endereco->getCidade());
            $dto->setEnderecoUf($endereco->getUF());
            $dto->setCep($endereco->getCEP());
        }

        $dto->setTelefone($participante->getTelefone());
        $dto->setTelefoneComercial($participante->getTelefoneComercial());
        $dto->setCelular($participante->getCelular());
        $dto->setDtExercicio($participante->getDataExercicio()?->format('d/m/Y'));
        $dto->setDtInscricaoPlano($participante->getDataInscricaoPlano()?->format('d/m/Y'));
        $dto->setIdCargo($participante->getIdCargo());
        $dto->setNmCargo($participante->getNomeCargo());
        $dto->setNaturalidade($participante->getNaturalidade());
        $dto->setUfNaturalidade($participante->getUfNaturalidade());
        $dto->setNacionalidade($participante->getNacionalidade());
        $dto->setNmNacionalidade($participante->getNomeNacionalidade());

        if ($email = $participante->getEmail()) {
            $dto->setEmail($email->getEndereco());
        }
        if ($emailAdicional1 = $participante->getEmailAdicional1()) {
            $dto->setEmailAdicional1($emailAdicional1->getEndereco());
        }
        if ($emailAdicional2 = $participante->getEmailAdicional2()) {
            $dto->setEmailAdicional2($emailAdicional2->getEndereco());
        }

        return $dto;
    }

    public static function toOutputDTO(Participante $participante): ParticipanteProfileOutputDTO {
        $dto = new ParticipanteProfileOutputDTO();

        $dto->setId($participante->getId());
        $dto->setNome($participante->getNome());
        $dto->setDtNascimento($participante->getDataNascimento()->format('d/m/Y'));
        $dto->setSexo($participante->getSexo());
        $dto->setCpf($participante->getCpf()->getNumero());
        $dto->setInscricao($participante->getInscricao());
        $dto->setMatricula($participante->getMatricula());
        $dto->setRg($participante->getRg());
        $dto->setEmissorRg($participante->getEmissorRg());
        $dto->setUfRg($participante->getUfRg());
        $dto->setDtExpedicaoRg($participante->getDataExpedicaoRg()?->format('d/m/Y'));
        $dto->setNmEstadoCivil($participante->getEstadoCivil());
        $dto->setPoliticamenteExposto($participante->isPoliticamenteExposto() ? 'S' : 'N');
        $dto->setNmMae($participante->getNomeMae());
        $dto->setNmPai($participante->getNomePai());

        if ($endereco = $participante->getEndereco()) {
            $dto->setLogradouro($endereco->getLogradouro());
            $dto->setNumero($endereco->getNumero());
            $dto->setEnderecoComplemento($endereco->getComplemento());
            $dto->setBairro($endereco->getBairro());
            $dto->setCidade($endereco->getCidade());
            $dto->setEnderecoUf($endereco->getUF());
            $dto->setCep($endereco->getCEP());
        }

        $dto->setTelefone($participante->getTelefone());
        $dto->setTelefoneComercial($participante->getTelefoneComercial());
        $dto->setCelular($participante->getCelular());
        $dto->setDtExercicio($participante->getDataExercicio()?->format('d/m/Y'));
        $dto->setDtInscricaoPlano($participante->getDataInscricaoPlano()?->format('d/m/Y'));
        $dto->setIdCargo($participante->getIdCargo());
        $dto->setNmCargo($participante->getNomeCargo());
        $dto->setNaturalidade($participante->getNaturalidade());
        $dto->setUfNaturalidade($participante->getUfNaturalidade());
        $dto->setNacionalidade($participante->getNacionalidade());
        $dto->setNmNacionalidade($participante->getNomeNacionalidade());
        $dto->setEstadoCivil($participante->getEstadoCivil());

        if ($email = $participante->getEmail()) {
            $dto->setEmail($email->getEndereco());
        }
        if ($emailAdicional1 = $participante->getEmailAdicional1()) {
            $dto->setEmailAdicional1($emailAdicional1->getEndereco());
        }
        if ($emailAdicional2 = $participante->getEmailAdicional2()) {
            $dto->setEmailAdicional2($emailAdicional2->getEndereco());
        }

        return $dto;
    }
}
