<?php

namespace App\Tests\Unit\Service\Trust\Extrato;

use App\DTO\Trust\Input\ContribuicaoFilterDTO;
<<<<<<< HEAD
use App\DTO\Trust\Output\ExtratoOutputDTO;
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
use App\DTO\Trust\Output\ExtratoOutputDTO;
>>>>>>> a4fcd00 (Solução de conflitos nas classes TrustExtratoServiceInterface e TrustContribuicaoRepository.)
=======
>>>>>>> 14b1d4c (FEATURE/NPDP-74-Php fix)
>>>>>>> NPDP-83-criar-classe-de-cpf
use App\Enum\Trust\Contribuicao\TipoValorEnum;
use App\Service\Trust\Contribuicao\TrustContribuicaoService;
use App\Service\Trust\Cotas\TrustCotasService;
use App\Service\Trust\Extrato\TrustExtratoService;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;

class TrustExtratoServiceTest extends TestCase
{
    private TrustExtratoService $service;
    private TrustCotasService&MockObject $trustCotasService;
    private TrustContribuicaoService&MockObject $trustContribuicaoService;

    protected function setUp(): void
    {
        $this->trustCotasService = $this->createMock(TrustCotasService::class);
        $this->trustContribuicaoService = $this->createMock(TrustContribuicaoService::class);
        $this->service = new TrustExtratoService(
            $this->trustCotasService,
            $this->trustContribuicaoService
        );
    }

    public function testGetExtratoWithInvalidCpf(): void
    {
        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('CPF inválido');

        $this->service->getExtrato('123', new ContribuicaoFilterDTO());
    }

    public function testGetExtratoSuccess(): void
    {
        $cpf = '12345678901';
        $filter = new ContribuicaoFilterDTO();
        $cotaAtual = ['vlCota' => 100.00];

        $contribuicoesParticipante = [
            [
                'contribuidor' => 'João Silva',
                'patrocinador' => 'Empresa XYZ',
                'dtRecolhimento' => '2024-03-15',
                'tipoContribuicao' => 'Mensal',
                'mantenedorContribuicao' => 'Participante',
                'valorContribuicao' => '1000.00',
                'qtdCota' => '10.00',
                'tipoValor' => TipoValorEnum::RAN->value,
                'mesCompetencia' => '03',
<<<<<<< HEAD
                'anoCompetencia' => '2024',
            ],
=======
<<<<<<< HEAD
<<<<<<< HEAD
                'anoCompetencia' => '2024',
            ],
=======
                'anoCompetencia' => '2024'
            ]
>>>>>>> a4fcd00 (Solução de conflitos nas classes TrustExtratoServiceInterface e TrustContribuicaoRepository.)
=======
                'anoCompetencia' => '2024',
            ],
>>>>>>> 14b1d4c (FEATURE/NPDP-74-Php fix)
>>>>>>> NPDP-83-criar-classe-de-cpf
        ];

        $this->trustContribuicaoService
            ->expects($this->once())
            ->method('getContribuicoes')
            ->with($cpf, $filter)
            ->willReturn($contribuicoesParticipante);

        $this->trustCotasService
            ->expects($this->once())
            ->method('getCotasAtual')
            ->willReturn($cotaAtual);

        $result = $this->service->getExtrato($cpf, $filter);

        $this->assertIsArray($result);
        $this->assertCount(1, $result);
        $this->assertEquals('João Silva', $result[0]['contribuidor']);
        $this->assertEquals('Empresa XYZ', $result[0]['patrocinador']);
        $this->assertEquals('2024-03-15', $result[0]['dtRecolhimento']);
        $this->assertEquals('Mensal - Participante', $result[0]['tipoContribuicao']);
        $this->assertEquals(1000.00, $result[0]['valorContribuicao']);
        $this->assertEquals(0.00, $result[0]['taxaCarregamento']);
        $this->assertEquals(0.00, $result[0]['fcbe']);
        $this->assertEquals(0.00, $result[0]['car']);
        $this->assertEquals(1000.00, $result[0]['ran']);
        $this->assertEquals(0.00, $result[0]['ras']);
        $this->assertEquals(10.00, $result[0]['ranCotas']);
        $this->assertEquals(0.00, $result[0]['rasCotas']);
        $this->assertEquals(0.00, $result[0]['rentabilidade']);
        $this->assertEquals('03/2024', $result[0]['competencia']);
        $this->assertEquals('03', $result[0]['mesCompetencia']);
        $this->assertEquals('2024', $result[0]['anoCompetencia']);
    }

    public function testGetExtratoWithMultipleContributions(): void
    {
        $cpf = '12345678901';
        $filter = new ContribuicaoFilterDTO();
        $cotaAtual = ['vlCota' => 100.00];

        $contribuicoesParticipante = [
            [
                'contribuidor' => 'João Silva',
                'patrocinador' => 'Empresa XYZ',
                'dtRecolhimento' => '2024-03-15',
                'tipoContribuicao' => 'Mensal',
                'mantenedorContribuicao' => 'Participante',
                'valorContribuicao' => '1000.00',
                'qtdCota' => '10.00',
                'tipoValor' => TipoValorEnum::RAN->value,
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
            ],
            [
                'contribuidor' => 'João Silva',
                'patrocinador' => 'Empresa XYZ',
                'dtRecolhimento' => '2024-03-15',
                'tipoContribuicao' => 'Mensal',
                'mantenedorContribuicao' => 'Patrocinador',
                'valorContribuicao' => '500.00',
                'qtdCota' => '5.00',
                'tipoValor' => TipoValorEnum::RAS->value,
                'mesCompetencia' => '03',
<<<<<<< HEAD
                'anoCompetencia' => '2024',
            ],
=======
<<<<<<< HEAD
<<<<<<< HEAD
                'anoCompetencia' => '2024',
            ],
=======
                'anoCompetencia' => '2024'
            ]
>>>>>>> a4fcd00 (Solução de conflitos nas classes TrustExtratoServiceInterface e TrustContribuicaoRepository.)
=======
                'anoCompetencia' => '2024',
            ],
>>>>>>> 14b1d4c (FEATURE/NPDP-74-Php fix)
>>>>>>> NPDP-83-criar-classe-de-cpf
        ];

        $this->trustContribuicaoService
            ->expects($this->once())
            ->method('getContribuicoes')
            ->with($cpf, $filter)
            ->willReturn($contribuicoesParticipante);

        $this->trustCotasService
            ->expects($this->once())
            ->method('getCotasAtual')
            ->willReturn($cotaAtual);

        $result = $this->service->getExtrato($cpf, $filter);

        $this->assertIsArray($result);
        $this->assertCount(2, $result);

        // Verifica a primeira contribuição (RAN)
        $this->assertEquals('João Silva', $result[0]['contribuidor']);
        $this->assertEquals('Mensal - Participante', $result[0]['tipoContribuicao']);
        $this->assertEquals(1000.00, $result[0]['ran']);
        $this->assertEquals(0.00, $result[0]['ras']);

        // Verifica a segunda contribuição (RAS)
        $this->assertEquals('João Silva', $result[1]['contribuidor']);
        $this->assertEquals('Mensal - Patrocinador', $result[1]['tipoContribuicao']);
        $this->assertEquals(0.00, $result[1]['ran']);
        $this->assertEquals(500.00, $result[1]['ras']);
    }

    public function testGetExtratoWithNoContributions(): void
    {
        $cpf = '12345678901';
        $filter = new ContribuicaoFilterDTO();
        $cotaAtual = ['vlCota' => 100.00];

        $this->trustContribuicaoService
            ->expects($this->once())
            ->method('getContribuicoes')
            ->with($cpf, $filter)
            ->willReturn([]);

        $this->trustCotasService
            ->expects($this->once())
            ->method('getCotasAtual')
            ->willReturn($cotaAtual);

        $result = $this->service->getExtrato($cpf, $filter);

        $this->assertIsArray($result);
        $this->assertEmpty($result);
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
