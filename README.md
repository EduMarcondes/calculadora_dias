# Calculadora de Dias

Aplicacao web para calcular data final a partir de uma data inicial e uma quantidade de dias, com suporte a dois modos de calculo:

- Dias corridos
- Dias uteis (ignora sabados, domingos e feriados cadastrados)

O projeto segue arquitetura modular no backend (Controller -> Service -> Repository), validacao de entrada com Zod e padrao unico de resposta de API.

## Stack Tecnologica

- Frontend: React, Vite, TypeScript, TailwindCSS, componentes estilo shadcn
- Backend: Node.js, Express, TypeScript
- Banco de dados: SQLite
- ORM: Prisma
- Infraestrutura: Docker e Docker Compose
- Testes backend: Vitest

## Principais Funcionalidades

- Calculo de data final por dias corridos
- Calculo de data final por dias uteis
- Cadastro, listagem e remocao de feriados
- Tema Light/Dark no frontend
- API com contrato de resposta padronizado:

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

## Arquitetura

Backend organizado em camadas:

- Controller: recebe e valida requests HTTP
- Service: concentra regras de negocio
- Repository: encapsula acesso ao banco via Prisma

Essa divisao melhora manutencao, testabilidade e evolucao do sistema.

## Estrutura do Projeto

```text
calculadora_dias/
  backend/
    prisma/
    src/
      controllers/
      database/
      errors/
      middlewares/
      models/
      repositories/
      routes/
      services/
      types/
      utils/
    Dockerfile
    package.json
  frontend/
    src/
      components/
      lib/
      types/
    Dockerfile
    package.json
  docs/
  docker-compose.yml
  README.md
```

## Requisitos

- Docker Desktop
- Docker Compose

Para execucao local sem Docker:

- Node.js 20+
- npm

## Execucao com Docker

1. Suba os containers:

```bash
docker compose up --build
```

2. Acesse as aplicacoes:

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Health check: http://localhost:3000/health

## Execucao Local (sem Docker)

### Backend

```bash
cd backend
npm install
npx prisma db push
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Variaveis de Ambiente

Backend em backend/.env:

```env
DATABASE_URL="file:./dev.db"
PORT=3000
CORS_ORIGIN="http://localhost:5173"
```

Frontend em frontend/.env:

```env
VITE_API_URL=http://localhost:3000
```

## Scripts

### Backend

- npm run dev: inicia servidor em modo desenvolvimento
- npm run test: executa testes unitarios
- npm run build: gera build TypeScript
- npm run start: inicia aplicacao compilada
- npm run prisma:generate: gera client do Prisma
- npm run prisma:migrate: executa migracoes de desenvolvimento

### Frontend

- npm run dev: inicia frontend em modo desenvolvimento
- npm run build: gera build de producao
- npm run preview: sobe preview do build

## Endpoints da API

- GET /health
- POST /calculate
- GET /holidays
- POST /holidays
- DELETE /holidays/:id

## Qualidade e Convencoes

- Validacao de entrada com Zod
- Logger com Pino
- Tratamento centralizado de erros no middleware
- Padrao de resposta em todas as APIs
- Testes unitarios para regras de calculo

## Verificacao de Funcionamento

No ambiente atual, foi validado:

- Backend: testes passando e build TypeScript sem erros
- Frontend: build de producao concluido com sucesso

## Observacoes para Windows (PowerShell)

Se houver bloqueio de execucao do npm.ps1, utilize npm.cmd no terminal:

```powershell
npm.cmd run build
```

## Licenca

Este projeto esta licenciado sob a licenca MIT. Consulte o arquivo LICENSE para detalhes.
