CREATE TABLE core_documentos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(255) NOT NULL,
    link VARCHAR(255) NOT NULL,
    dt_documento DATETIME NOT NULL,
    usuario_id INT NOT NULL,
    dt_criacao DATETIME DEFAULT GETDATE(),
    dt_atualizacao DATETIME DEFAULT GETDATE(),
    dt_delecao DATETIME NULL,
    CONSTRAINT fk_documentos_usuario FOREIGN KEY (usuario_id) REFERENCES core_usuario(id)
);
