<?php

namespace App\Tests\Feature\Controller;

use App\Controller\ParticipanteController;
use App\DTO\Trust\Input\ParticipanteProfileDTO;
use App\DTO\Trust\Input\PatrimonioEvolucaoDTO;
use App\DTO\Trust\Input\PatrocinadorDTO;
use App\Enum\Trust\Avatar\AvatarEnum;
use App\Exception\ParticipanteNotFoundException;
use App\Interface\Helpers\UploadFileHelperInterface;
use App\Interface\Trust\Service\TrustParticipanteServiceInterface;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Serializer\SerializerInterface;

class ParticipanteControllerTest extends TestCase
{
    private ParticipanteController $controller;
    private TrustParticipanteServiceInterface&MockObject $trustParticipanteService;
    private UploadFileHelperInterface&MockObject $uploadFileHelper;
    private SerializerInterface&MockObject $serializer;
    private UrlGeneratorInterface&MockObject $urlGenerator;
    private ContainerInterface&MockObject $container;

    protected function setUp(): void
    {
        $this->trustParticipanteService = $this->createMock(TrustParticipanteServiceInterface::class);
        $this->uploadFileHelper = $this->createMock(UploadFileHelperInterface::class);
        $this->serializer = $this->createMock(SerializerInterface::class);
        $this->urlGenerator = $this->createMock(UrlGeneratorInterface::class);
        $this->container = $this->createMock(ContainerInterface::class);

        $this->controller = new ParticipanteController(
            $this->trustParticipanteService,
            $this->uploadFileHelper
        );

        // Set up container with required parameters
        $this->container->method('getParameter')
            ->willReturnCallback(function ($name)
            {
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 2a8cca0 (Ajuste no php fix)
=======
>>>>>>> 6c63068 (PHP Fix ajustado para PSR-12)
>>>>>>> NPDP-83-criar-classe-de-cpf
                return match ($name) {
=======
                return match ($name)
                {
<<<<<<< HEAD
>>>>>>> 26387fa (Ajuste no php fix)
=======
                return match ($name) {
>>>>>>> ab67014 (PHP Fix ajustado para PSR-12)
=======
>>>>>>> be0e468 (Ajuste no php fix)
<<<<<<< HEAD
>>>>>>> 2a8cca0 (Ajuste no php fix)
=======
=======
                return match ($name) {
>>>>>>> b127044 (PHP Fix ajustado para PSR-12)
>>>>>>> 6c63068 (PHP Fix ajustado para PSR-12)
                    'participants_private_directory' => '/path/to/avatars',
                    default => null,
                };
            });

        $this->container->method('get')
            ->willReturnCallback(function ($id)
            {
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 2a8cca0 (Ajuste no php fix)
=======
>>>>>>> 6c63068 (PHP Fix ajustado para PSR-12)
>>>>>>> NPDP-83-criar-classe-de-cpf
                return match ($id) {
=======
                return match ($id)
                {
<<<<<<< HEAD
>>>>>>> 26387fa (Ajuste no php fix)
=======
                return match ($id) {
>>>>>>> ab67014 (PHP Fix ajustado para PSR-12)
=======
>>>>>>> be0e468 (Ajuste no php fix)
<<<<<<< HEAD
>>>>>>> 2a8cca0 (Ajuste no php fix)
=======
=======
                return match ($id) {
>>>>>>> b127044 (PHP Fix ajustado para PSR-12)
>>>>>>> 6c63068 (PHP Fix ajustado para PSR-12)
                    'router' => $this->urlGenerator,
                    default => null,
                };
            });

        $this->controller->setContainer($this->container);
    }

    public function testGetPerfilSuccess(): void
    {
        $cpf = '12345678901';
        $participanteData = ['nome' => 'Teste', 'cpf' => $cpf];

        $this->trustParticipanteService
            ->expects($this->once())
            ->method('getParticipante')
            ->with($cpf)
            ->willReturn($participanteData);

        $response = $this->controller->getPerfil($cpf);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            json_encode(['data' => $participanteData]),
            $response->getContent()
        );
    }

    public function testGetPerfilNotFound(): void
    {
        $cpf = '12345678901';

        $this->trustParticipanteService
            ->expects($this->once())
            ->method('getParticipante')
            ->with($cpf)
            ->willThrowException(new ParticipanteNotFoundException('Participante não encontrado'));

        $response = $this->controller->getPerfil($cpf);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(404, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            json_encode(['error' => 'Participante não encontrado']),
            $response->getContent()
        );
    }

    public function testUpdatePerfilSuccess(): void
    {
        $cpf = '12345678901';
        $request = new Request([], [], [], [], [], [], json_encode(['nome' => 'Teste']));
        $dto = new ParticipanteProfileDTO(['nome' => 'Teste']);

        $this->serializer
            ->expects($this->once())
            ->method('deserialize')
            ->willReturn($dto);

        $this->trustParticipanteService
            ->expects($this->once())
            ->method('updateParticipante')
            ->with($cpf, $dto)
            ->willReturn(true);

        $response = $this->controller->updatePerfil($cpf, $request, $this->serializer);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            json_encode(['message' => 'Dados atualizados com sucesso']),
            $response->getContent()
        );
    }

    // public function testUploadAvatarSuccess(): void
    // {
    //     $cpf = '12345678901';
    //     $file = $this->createMock(UploadedFile::class);
    //     $file->method('getMimeType')->willReturn('image/jpeg');
    //     $file->method('getSize')->willReturn(1024 * 1024); // 1MB
    //     $file->method('getClientOriginalExtension')->willReturn('jpg');

    //     $request = new Request([], [], [], [], [], [], [], ['avatar' => $file]);
    //     $imageUrl = 'http://example.com/avatar.jpg';

    //     $this->trustParticipanteService
    //         ->expects($this->once())
    //         ->method('uploadAvatar')
    //         ->with($cpf, $file)
    //         ->willReturn($imageUrl);

    //     $response = $this->controller->uploadAvatar($cpf, $request);

    //     $this->assertInstanceOf(JsonResponse::class, $response);
    //     $this->assertEquals(200, $response->getStatusCode());
    //     $this->assertJsonStringEqualsJsonString(
    //         json_encode([
    //             'message' => AvatarEnum::SUCCESS_UPLOAD->getValue(),
    //             'url' => $imageUrl
    //         ]),
    //         $response->getContent()
    //     );
    // }

    // public function testUploadAvatarNoFile(): void
    // {
    //     $cpf = '12345678901';
    //     $request = new Request();

    //     $response = $this->controller->uploadAvatar($cpf, $request);

    //     $this->assertInstanceOf(JsonResponse::class, $response);
    //     $this->assertEquals(500, $response->getStatusCode());
    //     $this->assertJsonStringEqualsJsonString(
    //         json_encode([
    //             'error' => AvatarEnum::ERROR_NO_FILE->getValue()
    //         ]),
    //         $response->getContent()
    //     );
    // }

    public function testGetPatrocinadorSuccess(): void
    {
        $cpf = '12345678901';
        $patrocinadorDTO = new PatrocinadorDTO([
            'id' => '1',
            'nome' => 'Patrocinador Teste',
        ]);

        $this->trustParticipanteService
            ->expects($this->once())
            ->method('getPatrocinador')
            ->with($cpf)
            ->willReturn($patrocinadorDTO);

        $response = $this->controller->getPatrocinador($cpf);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            json_encode(['patrocinador' => $patrocinadorDTO]),
            $response->getContent()
        );
    }

    public function testGetPatrimonioSuccess(): void
    {
        $cpf = '12345678901';
        $patrimonioData = [
            'cpf' => $cpf,
            'totalPatrimonioAcumulado' => [
                'vlNominal' => 1000.00,
                'vlAtualizado' => 1500.00,
                'percentual' => 50.00,
                'rentabilidade' => 500.00,
            ],
            'totalPatrimonioAcumuladoPatrocinador' => [
                'vlNominal' => 500.00,
                'vlAtualizado' => 750.00,
            ],
            'totalPatrimonioAcumuladoParticipante' => [
                'vlNominal' => 500.00,
                'vlAtualizado' => 750.00,
            ],
        ];

        $this->trustParticipanteService
            ->expects($this->once())
            ->method('getPatrimonio')
            ->with($cpf)
            ->willReturn($patrimonioData);

        $response = $this->controller->getPatrimonio($cpf);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            json_encode(['patrimonio' => $patrimonioData]),
            $response->getContent()
        );
    }

    public function testGetPatrimonioNotFound(): void
    {
        $cpf = '12345678901';

        $this->trustParticipanteService
            ->expects($this->once())
            ->method('getPatrimonio')
            ->with($cpf)
            ->willThrowException(new ParticipanteNotFoundException('Participante não encontrado'));

        $response = $this->controller->getPatrimonio($cpf);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(404, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            json_encode(['error' => 'Participante não encontrado']),
            $response->getContent()
        );
    }

    public function testGetPatrimonioEvolucaoAnualSuccess(): void
    {
        $cpf = '12345678901';
        $evolucaoData = [
            [
                'ano' => '2023',
                'vlNominal' => 1000.00,
                'qtCota' => 50.00,
                'vlAtualizado' => 1500.00,
                'dtIndexador' => '04/04/2024',
                'vlIndexador' => 1.50,
            ],
            [
                'ano' => '2024',
                'vlNominal' => 2000.00,
                'qtCota' => 100.00,
                'vlAtualizado' => 3000.00,
                'dtIndexador' => '04/04/2024',
                'vlIndexador' => 1.50,
            ],
        ];

        $patrimonioEvolucaoDTO = new PatrimonioEvolucaoDTO($cpf, PatrimonioEvolucaoDTO::TIPO_ANUAL, $evolucaoData);

        $this->trustParticipanteService
            ->expects($this->once())
            ->method('getPatrimonioEvolucaoAnual')
            ->with($cpf)
            ->willReturn($patrimonioEvolucaoDTO);

        $response = $this->controller->getPatrimonioEvolucaoAnual($cpf);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            json_encode(['patrimonioEvolucaoAnual' => $patrimonioEvolucaoDTO]),
            $response->getContent()
        );
    }

    public function testGetPatrimonioEvolucaoMensalSuccess(): void
    {
        $cpf = '12345678901';
        $evolucaoData = [
            [
                'ano' => '2024',
                'mes' => '01',
                'vlNominal' => 1000.00,
                'qtCota' => 50.00,
                'vlAtualizado' => 1500.00,
                'dtIndexador' => '04/04/2024',
                'vlIndexador' => 1.50,
            ],
            [
                'ano' => '2024',
                'mes' => '02',
                'vlNominal' => 2000.00,
                'qtCota' => 100.00,
                'vlAtualizado' => 3000.00,
                'dtIndexador' => '04/04/2024',
                'vlIndexador' => 1.50,
            ],
        ];

        $patrimonioEvolucaoDTO = new PatrimonioEvolucaoDTO($cpf, PatrimonioEvolucaoDTO::TIPO_MENSAL, $evolucaoData);

        $this->trustParticipanteService
            ->expects($this->once())
            ->method('getPatrimonioEvolucaoMensal')
            ->with($cpf)
            ->willReturn($patrimonioEvolucaoDTO);

        $response = $this->controller->getPatrimonioEvolucaoMensal($cpf);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            json_encode(['patrimonioEvolucaoMensal' => $patrimonioEvolucaoDTO]),
            $response->getContent()
        );
    }

    public function testGetPatrimonioEvolucaoAnualNotFound(): void
    {
        $cpf = '12345678901';

        $this->trustParticipanteService
            ->expects($this->once())
            ->method('getPatrimonioEvolucaoAnual')
            ->with($cpf)
            ->willThrowException(new ParticipanteNotFoundException('Participante não encontrado'));

        $response = $this->controller->getPatrimonioEvolucaoAnual($cpf);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(404, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            json_encode(['error' => 'Participante não encontrado']),
            $response->getContent()
        );
    }

    public function testGetPatrimonioEvolucaoMensalNotFound(): void
    {
        $cpf = '12345678901';

        $this->trustParticipanteService
            ->expects($this->once())
            ->method('getPatrimonioEvolucaoMensal')
            ->with($cpf)
            ->willThrowException(new ParticipanteNotFoundException('Participante não encontrado'));

        $response = $this->controller->getPatrimonioEvolucaoMensal($cpf);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(404, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(
            json_encode(['error' => 'Participante não encontrado']),
            $response->getContent()
        );
    }
}
