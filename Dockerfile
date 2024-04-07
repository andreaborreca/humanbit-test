#PHP-Apache enviroment image
FROM php:8.3-apache

#Setting the workdir
WORKDIR /var/www/html

#Update and install additional libraries
RUN apt-get update -y && apt-get install -y libicu-dev unzip zip

#Install php libraries
RUN docker-php-ext-install gettext intl pdo_mysql mysqli && docker-php-ext-enable mysqli

#Install composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

#Mod Rewrite
RUN a2enmod rewrite