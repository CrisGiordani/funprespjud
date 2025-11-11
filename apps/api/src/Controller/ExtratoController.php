<?php

namespace App\Controller;

use App\Attribute\RequiresJwtAuth;
use App\Attribute\RouteCpfEncrypted;
use App\Attribute\ValidateCpfOwnership;
use App\DTO\Iris\Relatorios\ExtratoDTO;
use App\DTO\Trust\Input\ContribuicaoFilterDTO;
use App\DTO\Trust\Input\ParticipanteProfileDTO;
use App\Enum\Jasper\JasperReportPathEnum;
use App\Http\Response\ApiResponse;
use App\Interface\Jasper\JasperServiceInterface;
use App\Service\Trust\Extrato\TrustExtratoService;
use App\Service\Trust\Participante\TrustParticipanteService;
use App\Service\Trust\Patrimonio\TrustPatrimonioService;
use App\Trait\ApiTrait;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/v1/participante/{cpf}', name: 'app_extrato')]
#[RequiresJwtAuth]
final class ExtratoController extends AbstractController
{
    use ApiTrait;

    public function __construct(
        private readonly TrustExtratoService $trustExtratoService,
        private readonly SerializerInterface $serializer,
        private readonly JasperServiceInterface $jasperService,
        private readonly TrustParticipanteService $trustParticipanteService,
        private readonly TrustPatrimonioService $trustPatrimonioService,
        private readonly LoggerInterface $logger
    ) {}

    #[Route('/extrato', name: 'extrato', methods: ['GET'])]
    public function getExtrato(
        #[RouteCpfEncrypted]
        #[ValidateCpfOwnership]
        string $cpf,
        Request $request
    ): JsonResponse {
        try {
            $filter = $this->createFilterFromRequest($request, false);

            $extrato = $this->trustExtratoService->getExtrato($cpf, $filter);
            return ApiResponse::success(
                data: [
                    'pagina' => $extrato->getCurrentPageNumber(),
                    'total_itens' => $extrato->getTotalItemCount(),
                    'itens_por_pagina' => $extrato->getItemNumberPerPage(),
                    'dados' => $extrato->getItems(),
                ],
                message: 'Extrato encontrado com sucesso',
                metadata: [
                    'version' => '1.0',
                    'endpoint' => $request->getPathInfo(),
                    'method' => $request->getMethod(),
                ]
            );
        } catch (\Exception $e) {
            return $this->handleApiException($e, $request);
        }
    }

    #[Route('/extrato/pdf', name: 'extrato_pdf', methods: ['GET'])]
    public function getExtratoPdf(Request $request, #[RouteCpfEncrypted] #[ValidateCpfOwnership] string $cpf): Response
    {
        try {
            // Cria filtro com todos os parâmetros disponíveis, sem paginação para PDF
            $filter = $this->createFilterFromRequest($request, true);

            // Busca dados do participante
            $dadosPessoais = $this->trustParticipanteService->getParticipante($cpf);
            if (! $dadosPessoais) {
                throw new \Exception('Participante não encontrado');
            }

            // Busca extrato completo sem paginação
            $contribuicoes = $this->trustExtratoService->getExtratoCompleto($cpf, $filter);

            // Busca dados do patrimônio
            $patrimonio = $this->trustPatrimonioService->getPatrimonio($cpf);

            // Cria DTO com todos os dados
            $extratoDTO = new ExtratoDTO(
                ParticipanteProfileDTO::fromParticipanteProfileOutputDTO($dadosPessoais, $cpf),
                $contribuicoes,
                $patrimonio,
                false,
                $dadosPessoais // Passa os dados completos para obter o regime de tributação
            );
            // Gera PDF usando Jasper
            $pdf = $this->jasperService->generateReport(
                JasperReportPathEnum::REPORT_EXTRATO->value,
                $extratoDTO->toArray()
            );

            // Retorna PDF como resposta
            return new Response(
                $pdf,
                Response::HTTP_OK,
                [
                    'Content-Type' => 'application/pdf',
                    'Content-Disposition' => 'inline; filename="extrato_' . $cpf . '_' . date('Y-m-d') . '.pdf"',
                ]
            );
        } catch (\Exception $exception) {
            $this->logger->error('Erro ao gerar PDF do extrato: ' . $exception->getMessage(), [
                'cpf' => $cpf,
                'dataInicial' => $request->query->get('dataInicial'),
                'dataFinal' => $request->query->get('dataFinal'),
                'trace' => $exception->getTraceAsString(),
            ]);

            throw $exception;
        }
    }

    private function formatMoedaToView($valor): string
    {
        return 'R$ ' . number_format($valor, 2, ',', '.');
    }

    private function formatDataToView($data): string
    {
        if (empty($data)) {
            return '';
        }
        $date = new \DateTime($data);

        return $date->format('d/m/Y');
    }

    /**
     * Cria um filtro de contribuição a partir dos parâmetros da requisição
     *
     * @param Request $request
     * @param bool $isPdf Se true, remove paginação para gerar PDF completo
     * @return ContribuicaoFilterDTO
     */
    private function createFilterFromRequest(Request $request, bool $isPdf = false): ContribuicaoFilterDTO
    {
        $filter = new ContribuicaoFilterDTO();

        // Parâmetros de data
        $dataInicial = $request->query->get('dataInicial');
        $dataFinal = $request->query->get('dataFinal');

        // Para PDF, usar período padrão se não fornecido
        if ($isPdf && ! $dataInicial) {
            $dataInicial = '01/' . date('Y');
        }
        if ($isPdf && ! $dataFinal) {
            $dataFinal = '12/' . date('Y');
        }

        $filter->setDataInicial($dataInicial);
        $filter->setDataFinal($dataFinal);

        // Parâmetros de paginação (apenas para extrato normal, não para PDF)
        if (! $isPdf) {
            $filter->setPageIndex((int) $request->query->get('pageIndex', 0));
            $filter->setPageSize((int) $request->query->get('pageSize', 9));
        } else {
            // Para PDF, sem paginação para pegar todos os dados
            $filter->setPageIndex(0);
            $filter->setPageSize(0);
        }

        // Parâmetros de filtro
        $filter->setTipo($request->query->get('tipo'));
        $filter->setOrgao($request->query->get('orgao'));
        $filter->setAutor($request->query->get('autor'));

        return $filter;
    }
}