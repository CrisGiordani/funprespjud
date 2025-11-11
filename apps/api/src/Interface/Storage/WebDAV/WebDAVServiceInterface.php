<?php

namespace App\Interface\Storage\WebDAV;

interface WebDAVServiceInterface
{
    /**
     * Faz upload de um arquivo para o servidor WebDAV
     *
     * @param string $localPath Caminho local do arquivo
     * @param string $remotePath Caminho remoto onde o arquivo será salvo
     * @return string URL do arquivo no servidor WebDAV
     * @throws \Exception
     */
    public function uploadFile(string $localPath, string $remotePath): string;

    /**
     * Faz upload de conteúdo em memória para o servidor WebDAV
     *
     * @param string $content Conteúdo do arquivo em memória
     * @param string $remotePath Caminho remoto onde o arquivo será salvo
     * @return string URL do arquivo no servidor WebDAV
     * @throws \Exception
     */
    public function uploadContent(string $content, string $remotePath): string;

    /**
     * Faz download de um arquivo do servidor WebDAV
     *
     * @param string $remotePath Caminho remoto do arquivo
     * @param string $localPath Caminho local onde o arquivo será salvo
     * @return bool
     * @throws \Exception
     */
    public function downloadFile(string $remotePath, string $localPath): bool;

    /**
     * Deleta um arquivo do servidor WebDAV
     *
     * @param string $remotePath Caminho remoto do arquivo
     * @return bool
     * @throws \Exception
     */
    public function deleteFile(string $remotePath): bool;

    /**
     * Lista os arquivos em um diretório do servidor WebDAV
     *
     * @param string $remotePath Caminho remoto do diretório
     * @return array
     * @throws \Exception
     */
    public function listFiles(string $remotePath): array;

    /**
     * Verifica se um arquivo existe no servidor WebDAV
     *
     * @param string $remotePath Caminho remoto do arquivo
     * @return bool
     * @throws \Exception
     */
    public function fileExists(string $remotePath): bool;

    /**
     * Cria um diretório no servidor WebDAV
     *
     * @param string $remotePath Caminho remoto do diretório
     * @return bool
     * @throws \Exception
     */
    public function createDirectory(string $remotePath): bool;

    /**
     * Obtém a URL de compartilhamento de um arquivo no servidor WebDAV
     *
     * @param string $remotePath Caminho remoto do arquivo
     * @return array Array contendo informações do compartilhamento
     * @throws \Exception
     */
    public function obterURLCompartilhamento(string $remotePath): array;
}
