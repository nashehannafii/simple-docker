FROM php:8.1-apache

WORKDIR /var/www/html

# Copy application
COPY . /var/www/html

# Ensure mod_rewrite (not strictly necessary here) and expose port 80
RUN a2enmod rewrite || true

# Default backend URL (you can override with env BACKEND_URL in compose)
ENV BACKEND_URL=http://host.docker.internal:5001

EXPOSE 80
CMD ["apache2-foreground"]
