###################
# ESTÁGIO 1: BUILD (Usando Bun)
###################
FROM oven/bun:alpine AS builder

WORKDIR /app

# Copia os arquivos de dependências
# Se você tiver o bun.lockb, ele será copiado. Se não, usa o package-lock.json
COPY package.json bun.lockb* package-lock.json* ./

# Instala as dependências usando Bun (muito mais rápido)
RUN bun install --frozen-lockfile

# Copia o restante do código
COPY . .

# Faz o build da aplicação (gera a pasta /dist ou /build)
RUN bun run build

###################
# ESTÁGIO 2: RUNNER (Servindo com Nginx)
###################
FROM nginx:alpine

# Copia os arquivos estáticos do build para a pasta padrão do Nginx
# Verifique se o seu build gera a pasta 'dist' ou 'build' e ajuste abaixo
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia uma configuração customizada para o Nginx (opcional, veja abaixo)
# Isso é importante para que o React Router (rotas) funcione corretamente
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]