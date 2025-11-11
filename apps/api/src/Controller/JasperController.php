<?php

namespace App\Controller;

use App\Attribute\RequiresJwtAuth;
use App\Enum\Jasper\JasperReportPathEnum;
use App\Http\Response\ApiResponse;
use App\Service\Jasper\JasperService;
use App\Trait\ApiTrait;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\HttpClient\HttpClientInterface;

#[Route('/api/v1/jasper')]
#[RequiresJwtAuth]
final class JasperController extends AbstractController
{
    use ApiTrait;

    public function __construct(
        private JasperService $jasperService,
        private HttpClientInterface $httpClient
    ) {
    }

    #[Route('/test', name: 'jasper_test', methods: ['GET'])]
    public function testReport(Request $request): Response
    {
        try {
            $params = [];
            $response = $this->jasperService->generateReport(JasperReportPathEnum::REPORT_IR->value, $params);

            //Caso queira salvar o relatório localmente
            $diretorio = __DIR__ . '/../../public/reports/output/';
            $NomeArquivo = 'wilTeste';
            $this->jasperService->saveReport($response, $diretorio, $NomeArquivo);

            return new Response(
                $response,
                Response::HTTP_OK,
                [
                    'Content-Type' => 'application/pdf',
                    'Content-Disposition' => "inline; filename='{$NomeArquivo}.pdf'",
                ]
            );
        } catch (\Throwable $th) {
            error_log(sprintf(
                'Error generating Jasper report: %s ',
                $th->getMessage(),
            ));

            return ApiResponse::error(
                message: $th->getMessage(),
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            )->setStatusCode(Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
