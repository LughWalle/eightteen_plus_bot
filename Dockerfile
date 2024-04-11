# Use a base image do Node.js
FROM node:14

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copie o package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o código-fonte para o diretório de trabalho
COPY ./src .

# Exponha a porta em que o aplicativo estará em execução
EXPOSE 5000

# Comando para iniciar o aplicativo
CMD ["node", "app.js"]
