FROM node:20-slim

RUN apt-get update -y \
 && apt-get install -y openssl \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Instalar dependências primeiro (cache de layer)
COPY package*.json ./
RUN npm install

# Gerar Prisma Client
COPY prisma ./prisma/
RUN npx prisma generate

# Copiar código fonte
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
