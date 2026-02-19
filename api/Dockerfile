FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
# No copiamos todo aquí porque usaremos volúmenes en compose para desarrollo
COPY package*.json ./
EXPOSE 3000
# El usuario node mejora la seguridad y evita líos de permisos en Ubuntu
RUN chown -R node:node /app
USER node
CMD ["npm", "run", "dev"]