<?php

namespace App\Interface\Helpers;

use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

interface UploadFileHelperInterface
{
    /**
     * @param string $dir
     * @param string $filename
     * @param UploadedFile $file
     *
     * @return void
     */
    public function uploadFile(string $dir, string $filename, UploadedFile $file): void;

    /**
     * @param string $filename
     *
     * @return bool
     */
    public function isFileExists(string $filename): bool;

    /**
     * @param string $routeName
     * @param string $filename
     * @param int $referenceType
     *
     * @return string
     */
    public function generateUrl(string $routeName, string $filename, int $referenceType = UrlGeneratorInterface::ABSOLUTE_PATH): string;

    /**
     * @param string $filename
     *
     * @return BinaryFileResponse
     */
    public function generateBinary(string $filename): BinaryFileResponse;

    /**
     * @param UploadedFile $file
     * @param array $allowedMimeTypes
     * @param mixed 'image/png'
     * @param mixed 'image/gif']
     *
     * @return bool
     */
    public function isAllowedMimeType(UploadedFile $file, array $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif']): bool;

    /**
     * @param UploadedFile $file
     *
     * @return string
     */
    public function getMimeType(UploadedFile $file): string;

    /**
     * @param UploadedFile $file
     *
     * @return int
     */
    public function getFileSize(UploadedFile $file): int;

    /**
     * @param UploadedFile $file
     *
     * @return string
     */
    public function getExtension(UploadedFile $file): string;
}
