<?php

namespace App\Tests\Unit\DTO\Trust\Output;

use App\DTO\Trust\Output\ExtratoOutputDTO;
use PHPUnit\Framework\TestCase;

class ExtratoOutputDTOTest extends TestCase
{
    private ExtratoOutputDTO $dto;

    protected function setUp(): void
    {
        $this->dto = new ExtratoOutputDTO();
    }

    public function testConstructorWithData(): void
    {
        $data = [
            'contribuidor' => 'João Silva',
            'patrocinador' => 'Empresa XYZ',
            'dtRecolhimento' => '2024-03-15',
            'tipoContribuicao' => 'Mensal',
            'valorContribuicao' => 1000.00,
            'taxaCarregamento' => 50.00,
            'fcbe' => 20.00,
            'car' => 30.00,
            'ran' => 500.00,
            'ras' => 500.00,
            'ranCotas' => 10.00,
            'rasCotas' => 10.00,
            'rentabilidade' => 100.00,
            'competencia' => '03/2024',
            'mesCompetencia' => '03',
<<<<<<< HEAD
            'anoCompetencia' => '2024',
=======
<<<<<<< HEAD
<<<<<<< HEAD
            'anoCompetencia' => '2024',
=======
            'anoCompetencia' => '2024'
>>>>>>> a4fcd00 (Solução de conflitos nas classes TrustExtratoServiceInterface e TrustContribuicaoRepository.)
=======
            'anoCompetencia' => '2024',
>>>>>>> 14b1d4c (FEATURE/NPDP-74-Php fix)
>>>>>>> NPDP-83-criar-classe-de-cpf
        ];

        $dto = new ExtratoOutputDTO($data);

        $this->assertEquals($data['contribuidor'], $dto->getContribuidor());
        $this->assertEquals($data['patrocinador'], $dto->getPatrocinador());
        $this->assertEquals($data['dtRecolhimento'], $dto->getDtRecolhimento());
        $this->assertEquals($data['tipoContribuicao'], $dto->getTipoContribuicao());
        $this->assertEquals($data['valorContribuicao'], $dto->getValorContribuicao());
        $this->assertEquals($data['taxaCarregamento'], $dto->getTaxaCarregamento());
        $this->assertEquals($data['fcbe'], $dto->getFcbe());
        $this->assertEquals($data['car'], $dto->getCar());
        $this->assertEquals($data['ran'], $dto->getRan());
        $this->assertEquals($data['ras'], $dto->getRas());
        $this->assertEquals($data['ranCotas'], $dto->getRanCotas());
        $this->assertEquals($data['rasCotas'], $dto->getRasCotas());
        $this->assertEquals($data['rentabilidade'], $dto->getRentabilidade());
        $this->assertEquals($data['competencia'], $dto->getCompetencia());
        $this->assertEquals($data['mesCompetencia'], $dto->getMesCompetencia());
        $this->assertEquals($data['anoCompetencia'], $dto->getAnoCompetencia());
    }

    public function testSettersAndGetters(): void
    {
        $this->dto->setContribuidor('Maria Santos')
            ->setPatrocinador('Empresa ABC')
            ->setDtRecolhimento('2024-03-16')
            ->setTipoContribuicao('Anual')
            ->setValorContribuicao(2000.00)
            ->setTaxaCarregamento(100.00)
            ->setFcbe(40.00)
            ->setCar(60.00)
            ->setRan(1000.00)
            ->setRas(1000.00)
            ->setRanCotas(20.00)
            ->setRasCotas(20.00)
            ->setRentabilidade(200.00)
            ->setCompetencia('04/2024')
            ->setMesCompetencia('04')
            ->setAnoCompetencia('2024');

        $this->assertEquals('Maria Santos', $this->dto->getContribuidor());
        $this->assertEquals('Empresa ABC', $this->dto->getPatrocinador());
        $this->assertEquals('2024-03-16', $this->dto->getDtRecolhimento());
        $this->assertEquals('Anual', $this->dto->getTipoContribuicao());
        $this->assertEquals(2000.00, $this->dto->getValorContribuicao());
        $this->assertEquals(100.00, $this->dto->getTaxaCarregamento());
        $this->assertEquals(40.00, $this->dto->getFcbe());
        $this->assertEquals(60.00, $this->dto->getCar());
        $this->assertEquals(1000.00, $this->dto->getRan());
        $this->assertEquals(1000.00, $this->dto->getRas());
        $this->assertEquals(20.00, $this->dto->getRanCotas());
        $this->assertEquals(20.00, $this->dto->getRasCotas());
        $this->assertEquals(200.00, $this->dto->getRentabilidade());
        $this->assertEquals('04/2024', $this->dto->getCompetencia());
        $this->assertEquals('04', $this->dto->getMesCompetencia());
        $this->assertEquals('2024', $this->dto->getAnoCompetencia());
    }

    public function testToArray(): void
    {
        $data = [
            'contribuidor' => 'João Silva',
            'patrocinador' => 'Empresa XYZ',
            'dtRecolhimento' => '2024-03-15',
            'tipoContribuicao' => 'Mensal',
            'valorContribuicao' => 1000.00,
            'taxaCarregamento' => 50.00,
            'fcbe' => 20.00,
            'car' => 30.00,
            'ran' => 500.00,
            'ras' => 500.00,
            'ranCotas' => 10.00,
            'rasCotas' => 10.00,
            'rentabilidade' => 100.00,
            'competencia' => '03/2024',
            'mesCompetencia' => '03',
<<<<<<< HEAD
            'anoCompetencia' => '2024',
=======
<<<<<<< HEAD
<<<<<<< HEAD
            'anoCompetencia' => '2024',
=======
            'anoCompetencia' => '2024'
>>>>>>> a4fcd00 (Solução de conflitos nas classes TrustExtratoServiceInterface e TrustContribuicaoRepository.)
=======
            'anoCompetencia' => '2024',
>>>>>>> 14b1d4c (FEATURE/NPDP-74-Php fix)
>>>>>>> NPDP-83-criar-classe-de-cpf
        ];

        $dto = new ExtratoOutputDTO($data);
        $array = $dto->toArray();

        $this->assertEquals($data, $array);
    }

    public function testFromArray(): void
    {
        $data = [
            'contribuidor' => 'João Silva',
            'patrocinador' => 'Empresa XYZ',
            'dtRecolhimento' => '2024-03-15',
            'tipoContribuicao' => 'Mensal',
            'valorContribuicao' => 1000.00,
            'taxaCarregamento' => 50.00,
            'fcbe' => 20.00,
            'car' => 30.00,
            'ran' => 500.00,
            'ras' => 500.00,
            'ranCotas' => 10.00,
            'rasCotas' => 10.00,
            'rentabilidade' => 100.00,
            'competencia' => '03/2024',
            'mesCompetencia' => '03',
<<<<<<< HEAD
            'anoCompetencia' => '2024',
=======
<<<<<<< HEAD
<<<<<<< HEAD
            'anoCompetencia' => '2024',
=======
            'anoCompetencia' => '2024'
>>>>>>> a4fcd00 (Solução de conflitos nas classes TrustExtratoServiceInterface e TrustContribuicaoRepository.)
=======
            'anoCompetencia' => '2024',
>>>>>>> 14b1d4c (FEATURE/NPDP-74-Php fix)
>>>>>>> NPDP-83-criar-classe-de-cpf
        ];

        $dto = ExtratoOutputDTO::fromArray($data);

        $this->assertEquals($data['contribuidor'], $dto->getContribuidor());
        $this->assertEquals($data['patrocinador'], $dto->getPatrocinador());
        $this->assertEquals($data['dtRecolhimento'], $dto->getDtRecolhimento());
        $this->assertEquals($data['tipoContribuicao'], $dto->getTipoContribuicao());
        $this->assertEquals($data['valorContribuicao'], $dto->getValorContribuicao());
        $this->assertEquals($data['taxaCarregamento'], $dto->getTaxaCarregamento());
        $this->assertEquals($data['fcbe'], $dto->getFcbe());
        $this->assertEquals($data['car'], $dto->getCar());
        $this->assertEquals($data['ran'], $dto->getRan());
        $this->assertEquals($data['ras'], $dto->getRas());
        $this->assertEquals($data['ranCotas'], $dto->getRanCotas());
        $this->assertEquals($data['rasCotas'], $dto->getRasCotas());
        $this->assertEquals($data['rentabilidade'], $dto->getRentabilidade());
        $this->assertEquals($data['competencia'], $dto->getCompetencia());
        $this->assertEquals($data['mesCompetencia'], $dto->getMesCompetencia());
        $this->assertEquals($data['anoCompetencia'], $dto->getAnoCompetencia());
    }
<<<<<<< HEAD
}
=======
<<<<<<< HEAD
<<<<<<< HEAD
}
=======
} 
>>>>>>> a4fcd00 (Solução de conflitos nas classes TrustExtratoServiceInterface e TrustContribuicaoRepository.)
=======
}
>>>>>>> 14b1d4c (FEATURE/NPDP-74-Php fix)
>>>>>>> NPDP-83-criar-classe-de-cpf
