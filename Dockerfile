# Etapa 1: Construir a imagem
FROM node:18

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos de configuração do projeto
COPY package*.json ./
COPY tsconfig.json ./

# Instale as dependências
RUN npm install

# Copie o código-fonte para o contêiner
COPY . .

# Compile o código TypeScript
RUN npm run build

# Exponha a porta para o host
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "dev:server"]
