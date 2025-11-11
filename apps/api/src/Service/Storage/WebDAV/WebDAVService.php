<?php

namespace App\Service\Storage\WebDAV;

use App\DTO\Storage\WebDAV\WebDAVFileDTO;
use App\Interface\Storage\WebDAV\WebDAVServiceInterface;
use Psr\Log\LoggerInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;

class WebDAVService implements WebDAVServiceInterface
{
    public function __construct(
        private readonly string $webdavUrl,
        private readonly string $username,
        private readonly string $password,
        private readonly LoggerInterface $logger,
        private readonly HttpClientInterface $httpClient,
        private readonly string $ocsApiUrl
    ) {}

    /**
     * Obtém a URL completa do arquivo no WebDAV
     * @param string $path
     * @return string
     */
    private function getFileUrl(string $path): string
    {
        return rtrim($this->webdavUrl, '/') . '/' . ltrim($path, '/');
    }

    /**
     * Cria uma requisição HTTP para o WebDAV
     * @param string $method
     * @param string $path
     * @param mixed $body
     * @return ResponseInterface
     */
    private function createRequest(string $method, string $path, $body = null): ResponseInterface
    {
        $options = [
            'headers' => [
                'Authorization' => 'Basic ' . base64_encode($this->username . ':' . $this->password),
            ],
        ];

        if ($body !== null) {
            $options['body'] = $body;
        }

        return $this->httpClient->request($method, $this->getFileUrl($path), $options);
    }

    /**
     ** Faz o upload de um arquivo LOCAL para o WebDAV
     * @param string $localPath
     * @param string $remotePath
     * @return string
     */
    public function uploadFile(string $localPath, string $remotePath): string
    {
        try {
            if (! file_exists($localPath)) {
                throw new \Exception("Arquivo local não encontrado: {$localPath}");
            }


            $fileContent = file_get_contents($localPath);
            $response = $this->createRequest('PUT', $remotePath, $fileContent);



            if ($response->getStatusCode() >= 400) {
                throw new \Exception("Erro ao fazer upload do arquivo: {$response->getStatusCode()}");
            }

            $urlCompartilhamento = $this->obterURLCompartilhamento($remotePath);

            return $urlCompartilhamento['urlarquivo'];
        } catch (\Exception $e) {
            $this->logger->error("Erro ao fazer upload do arquivo: {$e->getMessage()}", [
                'localPath' => $localPath,
                'remotePath' => $remotePath,
                'exception' => $e,
            ]);

            throw $e;
        }
    }

    /**
     ** Faz o upload de conteúdo em memória para o WebDAV
     * @param string $content
     * @param string $remotePath
     * @return string
     */
    public function uploadContent(string $content, string $remotePath): string
    {
        try {
            $response = $this->createRequest('PUT', $remotePath, $content);

            if ($response->getStatusCode() >= 400) {
                throw new \Exception("Erro ao fazer upload do conteúdo: {$response->getStatusCode()}");
            }

            $urlCompartilhamento = $this->obterURLCompartilhamento('' . $remotePath);

            return $urlCompartilhamento['urlarquivo'];
        } catch (\Exception $e) {
            $this->logger->error("Erro ao fazer upload do conteúdo: {$e->getMessage()}", [
                'remotePath' => $remotePath,
                'exception' => $e,
            ]);

            throw $e;
        }
    }

    /**
     * Faz o download de um arquivo do WebDAV
     * @param string $remotePath
     * @param string $localPath
     * @return bool
     */
    public function downloadFile(string $remotePath, string $localPath): bool
    {
        try {
            $response = $this->createRequest('GET', $remotePath);

            if ($response->getStatusCode() !== 200) {
                throw new \Exception("Erro ao baixar arquivo: {$response->getStatusCode()}");
            }

            return file_put_contents($localPath, $response->getContent()) !== false;
        } catch (\Exception $e) {
            $this->logger->error("Erro ao fazer download do arquivo: {$e->getMessage()}", [
                'remotePath' => $remotePath,
                'localPath' => $localPath,
                'exception' => $e,
            ]);

            throw $e;
        }
    }

    /**
     * Deleta um arquivo do WebDAV
     * @param string $remotePath
     * @return bool
     */
    public function deleteFile(string $remotePath): bool
    {
        try {
            $response = $this->createRequest('DELETE', $remotePath);

            return $response->getStatusCode() === 204;
        } catch (\Exception $e) {
            $this->logger->error("Erro ao deletar arquivo: {$e->getMessage()}", [
                'remotePath' => $remotePath,
                'exception' => $e,
            ]);

            throw $e;
        }
    }

    /**
     * Lista os arquivos do WebDAV
     * @param string $remotePath
     * @return array
     */
    public function listFiles(string $remotePath): array
    {
        try {
            $response = $this->createRequest('PROPFIND', $remotePath, null);
            $response->getHeaders()['Depth'] = '1';

            if ($response->getStatusCode() !== 207) {
                throw new \Exception("Erro ao listar arquivos: {$response->getStatusCode()}");
            }

            $files = [];
            $xml = new \SimpleXMLElement($response->getContent());
            $xml->registerXPathNamespace('d', 'DAV:');

            foreach ($xml->xpath('//d:response') as $item) {
                $href = (string)$item->xpath('.//d:href')[0];
                $isDirectory = isset($item->xpath('.//d:collection')[0]);

                $file = new WebDAVFileDTO([
                    'name' => basename($href),
                    'path' => $href,
                    'url' => $this->getFileUrl($href),
                    'isDirectory' => $isDirectory,
                ]);

                if (! $isDirectory) {
                    $file->setSize((int)$item->xpath('.//d:getcontentlength')[0]);
                    $file->setLastModified((string)$item->xpath('.//d:getlastmodified')[0]);
                    $file->setMimeType((string)$item->xpath('.//d:getcontenttype')[0]);
                }

                $files[] = $file;
            }

            return $files;
        } catch (\Exception $e) {
            $this->logger->error("Erro ao listar arquivos: {$e->getMessage()}", [
                'remotePath' => $remotePath,
                'exception' => $e,
            ]);

            throw $e;
        }
    }

    /**
     * Verifica se um arquivo existe no WebDAV
     * @param string $remotePath
     * @return bool
     */
    public function fileExists(string $remotePath): bool
    {
        try {
            $response = $this->createRequest('HEAD', $remotePath);

            return $response->getStatusCode() === 200;
        } catch (\Exception $e) {
            if ($e->getCode() === 404) {
                return false;
            }
            $this->logger->error("Erro ao verificar existência do arquivo: {$e->getMessage()}", [
                'remotePath' => $remotePath,
                'exception' => $e,
            ]);

            throw $e;
        }
    }

    /**
     * Cria um diretório no WebDAV
     * @param string $remotePath
     * @return bool
     */
    public function createDirectory(string $remotePath): bool
    {
        try {
            $response = $this->createRequest('MKCOL', $remotePath);

            return $response->getStatusCode() === 201;
        } catch (\Exception $e) {
            $this->logger->error("Erro ao criar diretório: {$e->getMessage()}", [
                'remotePath' => $remotePath,
                'exception' => $e,
            ]);

            throw $e;
        }
    }

    /**
     * Obtém a URL de compartilhamento de um arquivo no WebDAV
     * @param string $remotePath
     * @return array
     */
    public function obterURLCompartilhamento(string $remotePath): array
    {
        try {
            // Extrair apenas o nome do arquivo do caminho remoto
            $nomeSimples = basename($remotePath);

            // Fazer requisição para criar compartilhamento usando URL configurada
            $response = $this->httpClient->request('POST', $this->ocsApiUrl, [
                'auth_basic' => [$this->username, $this->password],
                'headers' => [
                    'OCS-APIRequest' => 'true',
                    'Content-Type' => 'application/x-www-form-urlencoded',
                ],
                'body' => http_build_query([
                    'path' => $remotePath,
                    'shareType' => 3,
                    'permissions' => 1,
                ]),
            ]);

            if ($response->getStatusCode() >= 400) {
                throw new \Exception("Erro ao criar compartilhamento: {$response->getStatusCode()}");
            }

            // Processar resposta XML
            $xmlContent = $response->getContent();
            $xml = simplexml_load_string($xmlContent);
            $json = json_encode($xml);
            $array = json_decode($json, true);

            // Retornar resultado estruturado
            return [
                'sid' => uniqid(), // Gerar um ID único para o compartilhamento
                'filename' => $nomeSimples,
                'urlarquivo' => $array['data']['url'] ?? null,
            ];
        } catch (\Exception $e) {
            $this->logger->error("Erro ao compartilhar arquivo: {$e->getMessage()}", [
                'remotePath' => $remotePath,
                'exception' => $e,
            ]);

            // Retornar resultado com erro
            return [
                'result' => $e->getMessage(),
            ];
        }
    }
}
