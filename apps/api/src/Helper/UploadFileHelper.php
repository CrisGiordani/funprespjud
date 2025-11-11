<?php

namespace App\Helper;

use App\Interface\Helpers\UploadFileHelperInterface;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class UploadFileHelper implements UploadFileHelperInterface
{
    public function __construct(
        private UrlGeneratorInterface $urlGenerator
    ) {
    }

    /**
     * Move o arquivo para o diretório especificado
     * @param string $dir
     * @param string $filename
     * @param UploadedFile $file
     *
     * @return void
     */
    public function uploadFile(string $dir, string $filename, UploadedFile $file): void
    {
        if (! is_dir($dir)) {
            mkdir($dir, 0777, true);
        }
        $file->move($dir, $filename);
    }

    /**
     * Verifica se o arquivo existe
     * @param string $filename -> caminho completo do arquivo
     *
     * @return bool
     */
    public function isFileExists(string $filename): bool
    {
        return file_exists($filename);
    }

    /**
     * Gera a url de acesso ao arquivo.
     * @param string $routeName
     * @param string $filename
     * @param int $referenceType
     *
     * @return string
     */
    public function generateUrl(string $routeName, string $filename, int $referenceType = UrlGeneratorInterface::ABSOLUTE_PATH): string
    {
        return $this->urlGenerator->generate($routeName, ['filename' => $filename], $referenceType);
    }

    /**
     * Gera a resposta binária do arquivo.
     * @param string $filename
     *
     * @return BinaryFileResponse
     */
    public function generateBinary(string $filename): BinaryFileResponse
    {
        return new BinaryFileResponse($filename);
    }

    /**
       * Verifica se o tipo MIME do arquivo é permitido
       *
       * @param UploadedFile $file O arquivo a ser verificado
       * @param array $allowedMimeTypes Array com os tipos MIME permitidos
       * @return bool True se o tipo MIME for permitido, false caso contrário
       */
    public function isAllowedMimeType(UploadedFile $file, array $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif']): bool
    {
        $mimeType = $file->getMimeType();

        return in_array($mimeType, $allowedMimeTypes);
    }

    /**
     * Consegue verificar o tipo MIME do arquivo.
     * @param UploadedFile $file
     *
     * @return string
     */
    public function getMimeType(UploadedFile $file): string
    {
        return $file->getMimeType();
    }

    /**
     * Pega o tamanho do arquivo.
     * @param UploadedFile $file
     *
     * @return int
     */
    public function getFileSize(UploadedFile $file): int
    {
        return $file->getSize();
    }

    /**
     * Pega a extensão do arquivo
     * @param UploadedFile $file
     *
     * @return string
     */
    public function getExtension(UploadedFile $file): string
    {
        return $file->getClientOriginalExtension();
    }
}
