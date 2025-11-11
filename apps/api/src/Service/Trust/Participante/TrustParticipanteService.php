<?php

namespace App\Service\Trust\Participante;

use App\DTO\Trust\Input\ParticipanteProfileDTO;
use App\DTO\Trust\Input\PatrocinadorDTO;
use App\DTO\Trust\Output\CoberturaOutputDTO;
use App\Enum\Trust\Avatar\AvatarEnum;
use App\Enum\Trust\Contribuicao\TipoCoberturaCAREnum;
use App\Exception\AvatarNotFoundException;
use App\Exception\CoberturasNotFoundException;
use App\Exception\FileException;
use App\Exception\ParticipanteNotFoundException;
use App\Exception\PatrocinadorException;
use App\Interface\Helpers\UploadFileHelperInterface;
use App\Interface\Trust\Repository\TrustParticipanteRepositoryInterface;
use App\Interface\Trust\Repository\TrustPlanoRepositoryInterface;
use App\Interface\Trust\Service\TrustParticipanteServiceInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Finder\Finder;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

final class TrustParticipanteService implements TrustParticipanteServiceInterface
{
    public function __construct(
        private TrustParticipanteRepositoryInterface $trustParticipanteRepository,
        private TrustPlanoRepositoryInterface $trustPlanoRepository,
        private LoggerInterface $logger,
        private ValidatorInterface $validator,
        private UploadFileHelperInterface $uploadFileHelper,
        private ParameterBagInterface $parameterBag
    ) {}

    public function getParticipante(string $cpf, bool $comPatrocinadores = false): mixed
    {
        try {
            $participante = $this->trustParticipanteRepository->getParticipante($cpf, true);

            if (! $participante) {

                throw new ParticipanteNotFoundException();
            }

            $patrocinadores = null;
            if ($comPatrocinadores) {
                $patrocinadores = $this->trustParticipanteRepository->getPatrocinador($cpf);
            }
            if ($patrocinadores) {
                $participante->setPatrocinadores($patrocinadores);
            }

            $planos = $this->trustPlanoRepository->getPlanosByCpf($cpf);
            if ($planos) {
                if (count($planos) > 1) {
                    $planosSemEncerrados = array_filter($planos, function ($plano) {
                        return $plano->getSituacao() !== 'ENCERRADO' && $plano->getDtFim() === null;
                    });
                    if (count($planosSemEncerrados) > 0) {
                        $participante->setPlanoSituacao($planosSemEncerrados[0]->getSituacao());
                        $participante->setPlanoCategoria($planosSemEncerrados[0]->getCategoria());
                    }
                }
                $participante->setPlanos($planos);
            }

            return $participante;
        } catch (\Exception $exception) {
            $this->logger->error($exception->getMessage());

            throw  $exception;
        }
    }

    /**
     * @param string $cpf
     *
     * @return array<ParticipanteProfileDTO>
     */
    public function getDadosParticipanteAtivo(string $cpf): array
    {
        return $this->trustParticipanteRepository->getDadosParticipanteAtivo($cpf);
    }

    /**
     * @param string $cpf
     * @param ParticipanteProfileDTO $dados
     *
     * @return bool
     */
    public function updateParticipante(string $cpf, ParticipanteProfileDTO $dados): bool
    {
        try {
            $participante = $this->trustParticipanteRepository->getParticipante($cpf);

            if (! $participante) {
                throw new ParticipanteNotFoundException();
            }

            return  $this->trustParticipanteRepository->updateParticipante($cpf, $dados);
        } catch (\Exception $exception) {
            $this->logger->error($exception->getMessage());

            throw  $exception;
        }
    }

    public function getEmailsAdicionaisParticipante(string $cpf): array|null
    {
        return $this->trustParticipanteRepository->getEmailsAdicionaisParticipante($cpf);
    }

    /**
     * @param string $avatarDir
     * @param string $cpf
     *
     * @return string
     */
    public function getUrlAvatar(string $avatarDir, string $cpf): string
    {
        // Verifica se o diretório existe antes de usar o Finder
        if (!is_dir($avatarDir)) {
            throw new AvatarNotFoundException();
        }

        $fileName = '';

        // Busca o arquivo de avatar do participante jpg, jpeg ou png
        $finder = new Finder();
        $finder->files()->in($avatarDir)->name('avatar' . $cpf . '*.{jpg,jpeg,png}');
        if ($finder->hasResults()) {
            $files = $finder->getIterator();
            foreach ($files as $file) {
                $avatarFilename = $file->getFilename();
            }
            $fileName = $avatarDir . $avatarFilename;
        }

        if (empty($fileName) || ! $this->uploadFileHelper->isFileExists($fileName)) {
            throw new AvatarNotFoundException();
        }

        return $this->uploadFileHelper->generateUrl('avatar', basename($fileName), UrlGeneratorInterface::ABSOLUTE_URL);
    }

    /**
     * @param string $filename
     *
     * @return BinaryFileResponse
     */
    public function serveImage(string $filename): BinaryFileResponse
    {
        return $this->uploadFileHelper->generateBinary($filename);
    }

    /**
     *
     * @param string $cpf
     * @param UploadedFile $file
     *
     * @return string
     */
    public function uploadAvatar(string $cpf, UploadedFile $file): string
    {
        try {
            $this->getParticipante($cpf);

            if (! $this->uploadFileHelper->isAllowedMimeType($file)) {
                throw new FileException(AvatarEnum::ERROR_INVALID_TYPE->getValue());
            }

            if ($this->uploadFileHelper->getFileSize($file) > AvatarEnum::getMaxSize()) {
                throw new FileException(AvatarEnum::getErrorUploadSize());
            }

            $avatarDir = $this->parameterBag->get('participants_private_directory');
            $avatarFilename = AvatarEnum::generateFileNameAvatar($cpf, $this->uploadFileHelper->getExtension($file));
            $avatarPath = $avatarDir . $avatarFilename;

            // Busca e deleta o arquivo do avatar independente jpg, jpeg ou png
            $finder = new Finder();
            $finder->files()->in($avatarDir)->name('avatar' . $cpf . '*.{jpg,jpeg,png}');
            $files = $finder->getIterator();
            foreach ($files as $fileOld) {
                unlink($avatarDir . $fileOld->getFilename());
            }

            // Salva o novo arquivo de avatar
            $this->uploadFileHelper->uploadFile($avatarDir, $avatarFilename, $file);

            return $this->uploadFileHelper->generateUrl(
                'avatar',
                basename($avatarPath),
                UrlGeneratorInterface::ABSOLUTE_URL
            );
        } catch (ParticipanteNotFoundException $exception) {
            $this->logger->error($exception->getMessage());

            throw  $exception;
        } catch (\Exception $exception) {
            $this->logger->error($exception->getMessage());

            throw  $exception;
        }
    }

    /**
     * @param string $cpf
     *
     * @return array|null
     */
    public function getPatrocinador(string $cpf): array|null|PatrocinadorDTO
    {
        try {
            $this->getParticipante($cpf);

            $patrocinador = $this->trustParticipanteRepository->getPatrocinadoresSalario($cpf);

            //tentar buscar patrocinador sem o salário () redundância...
            if (empty($patrocinador)) {
                $patrocinador = $this->trustParticipanteRepository->getPatrocinador($cpf);
            }

            if (! $patrocinador) {
                throw new PatrocinadorException();
            }

            return $patrocinador;
        } catch (PatrocinadorException $exception) {
            $this->logger->error($exception->getMessage());

            throw  $exception;
        } catch (\Exception $exception) {
            $this->logger->error($exception->getMessage());

            throw  $exception;
        }
    }

    /**
     * @param string $cpf
     *
     * @return array|null
     */
    public function getPatrocinadores(string $cpf): array|null
    {
        try {
            $this->getParticipante($cpf);

            $patrocinadores = $this->trustParticipanteRepository->getPatrocinadores($cpf);

            if (! $patrocinadores) {
                throw new PatrocinadorException();
            }

            return $patrocinadores;
        } catch (PatrocinadorException $exception) {
            $this->logger->error($exception->getMessage());

            throw  $exception;
        } catch (\Exception $exception) {
            $this->logger->error($exception->getMessage());

            throw  $exception;
        }
    }

    public function getPerfilAtual(string $cpf): array|null
    {
        try {
            $participante = $this->getParticipante($cpf);

            return $this->trustParticipanteRepository->getPerfilAtual($participante->getId());
        } catch (ParticipanteNotFoundException $exception) {
            $this->logger->error($exception->getMessage());

            throw  $exception;
        } catch (\Exception $exception) {
            $this->logger->error($exception->getMessage());

            throw  $exception;
        }
    }

    /**
     * @param string $cpf
     *
     * @return float
     */
    public function getSalarioParticipante(string $cpf): float
    {
        try {
            $participante = $this->getParticipante($cpf);

            return $this->trustParticipanteRepository->getSalarioParticipante($participante->getId());
        } catch (\Exception $exception) {
            $this->logger->error($exception->getMessage());

            throw  $exception;
        }
    }

    /**
     * @param string $cpf
     *
     * @return CoberturaOutputDTO[]|null
     */
    public function getCoberturasCAR(string $cpf): array|null
    {
        try {
            $retorno = $this->trustParticipanteRepository->getCoberturasCAR($cpf);

            if (! $retorno) {
                throw new CoberturasNotFoundException();
            }

            $resultado = array_reduce($retorno, function ($carry, $cobertura) {
                $id = (int) $cobertura['idContribuicao'];

                if ($id === TipoCoberturaCAREnum::CAPITAL_SEGURADO_MORTE->getValue()) {
                    $carry['morte']['tipoContribuicao'] = $cobertura['tipoContribuicao'];
                    $carry['morte']['valorSeguro'] = $cobertura['valorSeguro'];
                }
                if ($id === TipoCoberturaCAREnum::MORTE->getValue() || $id === TipoCoberturaCAREnum::MORTE_AUTOPATROCINADO->getValue()) {
                    $carry['morte']['mensalidade'] = $cobertura['valorSeguro'];
                }
                if ($id === TipoCoberturaCAREnum::CAPITAL_SEGURADO_INVALIDEZ->getValue()) {
                    $carry['invalidez']['tipoContribuicao'] = $cobertura['tipoContribuicao'];
                    $carry['invalidez']['valorSeguro'] = $cobertura['valorSeguro'];
                }
                if ($id === TipoCoberturaCAREnum::INVALIDEZ->getValue() || $id === TipoCoberturaCAREnum::INVALIDEZ_AUTOPATROCINADO->getValue()) {
                    $carry['invalidez']['mensalidade'] = $cobertura['valorSeguro'];
                }

                return $carry;
            }, ['morte' => [], 'invalidez' => []]);

            return [
                'morte' => count($resultado['morte']) > 0 ? new CoberturaOutputDTO($resultado['morte']) : null,
                'invalidez' => count($resultado['invalidez']) > 0 ? new CoberturaOutputDTO($resultado['invalidez']) : null,
            ];
        } catch (ParticipanteNotFoundException $exception) {
            $this->logger->error($exception->getMessage());

            throw  $exception;
        } catch (\Exception $exception) {
            $this->logger->error($exception->getMessage());

            throw  $exception;
        }
    }

    /**
     * @param string $cpf
     * @param array $dados
     *
     * @return bool
     */
    public function updateCargo(string $cpf, array $dados): bool
    {
        try {
            $participante = $this->getParticipante($cpf);
            if (! $participante) {
                throw new ParticipanteNotFoundException();
            }

            return $this->trustParticipanteRepository->updateCargo($cpf, $dados);
        } catch (ParticipanteNotFoundException $exception) {
            $this->logger->error($exception->getMessage());

            throw  $exception;
        } catch (\Exception $exception) {
            $this->logger->error($exception->getMessage());

            throw  $exception;
        }
    }

    /**
     * @param string $cpf
     *
     * @return array|null
     */
    public function getDadosPessoa(string $cpf): array|null
    {
        try {
            return $this->trustParticipanteRepository->getDadosPessoa($cpf);
        } catch (\Exception $exception) {
            $this->logger->error($exception->getMessage());

            throw  $exception;
        }
    }
}
