# Use uma imagem Node.js como base
FROM node:18

# Defina o diretório de trabalho
WORKDIR /

# Copie os arquivos do projeto para o diretório de trabalho
COPY..

# Instale as dependências do projeto
RUN npm install

# Inicie o aplicativo
CMD ["npm", "start"]
