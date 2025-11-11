<?php

namespace App\DTO\Storage\WebDAV;

use Symfony\Component\Serializer\Annotation\Groups;

class WebDAVFileDTO
{
    #[Groups(['webdav:read'])]
    private ?string $name = null;

    #[Groups(['webdav:read'])]
    private ?string $path = null;

    #[Groups(['webdav:read'])]
    private ?string $url = null;

    #[Groups(['webdav:read'])]
    private ?int $size = null;

    #[Groups(['webdav:read'])]
    private ?string $mimeType = null;

    #[Groups(['webdav:read'])]
    private ?string $lastModified = null;

    #[Groups(['webdav:read'])]
    private ?bool $isDirectory = null;

    public function __construct(array $data = [])
    {
        $this->name = $data['name'] ?? null;
        $this->path = $data['path'] ?? null;
        $this->url = $data['url'] ?? null;
        $this->size = $data['size'] ?? null;
        $this->mimeType = $data['mimeType'] ?? null;
        $this->lastModified = $data['lastModified'] ?? null;
        $this->isDirectory = $data['isDirectory'] ?? false;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getPath(): ?string
    {
        return $this->path;
    }

    public function setPath(?string $path): self
    {
        $this->path = $path;

        return $this;
    }

    public function getUrl(): ?string
    {
        return $this->url;
    }

    public function setUrl(?string $url): self
    {
        $this->url = $url;

        return $this;
    }

    public function getSize(): ?int
    {
        return $this->size;
    }

    public function setSize(?int $size): self
    {
        $this->size = $size;

        return $this;
    }

    public function getMimeType(): ?string
    {
        return $this->mimeType;
    }

    public function setMimeType(?string $mimeType): self
    {
        $this->mimeType = $mimeType;

        return $this;
    }

    public function getLastModified(): ?string
    {
        return $this->lastModified;
    }

    public function setLastModified(?string $lastModified): self
    {
        $this->lastModified = $lastModified;

        return $this;
    }

    public function isDirectory(): ?bool
    {
        return $this->isDirectory;
    }

    public function setIsDirectory(?bool $isDirectory): self
    {
        $this->isDirectory = $isDirectory;

        return $this;
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'path' => $this->path,
            'url' => $this->url,
            'size' => $this->size,
            'mimeType' => $this->mimeType,
            'lastModified' => $this->lastModified,
            'isDirectory' => $this->isDirectory,
        ];
    }

    public static function fromArray(array $data): self
    {
        return new self($data);
    }
}
