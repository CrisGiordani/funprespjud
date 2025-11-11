FROM php:8.2-apache

# Atualizar os repositórios e instalar dependências do sistema
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        unzip git curl gnupg2 libxml2-dev libzip-dev \
        libicu-dev libpq-dev libssl-dev zlib1g-dev \
        libpng-dev libjpeg-dev libfreetype6-dev libxslt-dev \
        libkrb5-dev unixodbc-dev wget apt-transport-https && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN apt-get update && \
    apt-get install -y \
    curl gnupg2 ca-certificates apt-transport-https \
    unixodbc-dev

# Adicionar repositório Microsoft e importar chave
RUN curl -fsSL https://packages.microsoft.com/keys/microsoft.asc \
      | gpg --dearmor \
      | tee /usr/share/keyrings/microsoft.gpg > /dev/null

# Adicionar repositório Microsoft para Ubuntu 24.04
RUN echo "deb [arch=amd64 signed-by=/usr/share/keyrings/microsoft.gpg] \
      https://packages.microsoft.com/ubuntu/24.04/prod noble main" \
      > /etc/apt/sources.list.d/mssql-release.list

# Atualizar índices e instalar ODBC Driver + ferramentas
RUN apt-get update && \
    ACCEPT_EULA=Y apt-get install -y \
      msodbcsql18 \
      mssql-tools18

# Instalar extensões do SQL Server
RUN pecl install pdo_sqlsrv sqlsrv && \
    docker-php-ext-enable pdo_sqlsrv sqlsrv && \
    docker-php-ext-install intl zip pdo bcmath

# Substituir o VirtualHost padrão pelo nosso
COPY apache-vhost.conf /etc/apache2/sites-available/000-default.conf
COPY . /var/www/html
# Definir diretório de trabalho
WORKDIR /var/www/html

# Permissões para Apache funcionar corretamente com cache e logs
RUN mkdir -p var/cache var/log var/uploads/avatares && \
    chown -R www-data:www-data var && \
    chmod -R 777 var

# Copiar arquivos do projeto para o container
COPY . /var/www/html

# Corrigir permissões (opcional)
RUN chown -R www-data:www-data /var/www/html
RUN mkdir -p var/cache var/log var/uploads/avatares \
    && chown -R www-data:www-data var \
    && chmod -R 775 var


# Instalar Composer
RUN curl -sS https://getcomposer.org/installer | php && \
    mv composer.phar /usr/local/bin/composer && chmod +x /usr/local/bin/composer

# Instalar dependências do projeto Symfony (sem scripts para evitar erro de .env durante o build)
RUN composer install --no-interaction --prefer-dist --no-scripts

# Ativar módulo de reescrita do Apache
RUN a2enmod rewrite

# Configurar ServerName globalmente para suprimir o aviso
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Configurar PHP timeouts e limites
RUN echo "max_execution_time = 30" >> /usr/local/etc/php/conf.d/docker-php-timeout.ini && \
    echo "max_input_time = 30" >> /usr/local/etc/php/conf.d/docker-php-timeout.ini && \
    echo "memory_limit = 256M" >> /usr/local/etc/php/conf.d/docker-php-timeout.ini && \
    echo "default_socket_timeout = 30" >> /usr/local/etc/php/conf.d/docker-php-timeout.ini

RUN service apache2 restart

# Expor porta do Apache
EXPOSE 80