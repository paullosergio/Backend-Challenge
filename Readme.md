# Backend Project

## Descrição

Este projeto é um backend desenvolvido em Node.js e TypeScript que lida com o upload, confirmação e listagem de medições. Ele inclui a integração com APIs externas, armazenamento de dados no MongoDB, e a exposição de uma API REST documentada com Swagger.


## Funcionalidades

- **Upload de Medições**: Realiza o upload de uma nova medição em formato de imagem base64 e armazena no MongoDB.
- **Confirmação de Medições**: Permite a confirmação ou correção de um valor lido por um modelo LLM.
- **Listagem de Medições**: Lista as medições realizadas por um determinado cliente.

## Pré-requisitos

- **Node.js**: Certifique-se de ter o Node.js instalado (versão 18 ou superior).
- **Docker**: Docker e Docker Compose são necessários para rodar a aplicação em contêineres.
- **MongoDB**: A aplicação utiliza MongoDB para armazenar os dados.

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/paullosergio/Backend-Challenge.git
   ```

2. Navegue até o diretório do projeto:

    ```bash
    cd Backend-Challenge
    ```

3. Instale as dependências do projeto:

     ```bash
    npm install
    ```

4. Inicie o ambiente Docker:

     ```bash
    docker-compose up --build
    ```

    ou 

     ```bash
    make run
    ```

5. Acesse a aplicação no navegador em http://localhost:3000/docs.

## Scripts Disponíveis

- `npm run build`: Compila o código TypeScript em JavaScript.
- `npm run dev:server`: Inicia o servidor em modo de desenvolvimento com auto-reload.

## Documentação da API

A documentação da API está disponível em `http://localhost:3000/docs` quando a aplicação está em execução. A documentação é gerada automaticamente pelo Swagger.

## Variáveis de Ambiente

Certifique-se de configurar as variáveis de ambiente necessárias antes de iniciar a aplicação. As variáveis podem ser definidas em um arquivo `.env` na raiz do projeto:

```
GEMINI_API_KEY
```

