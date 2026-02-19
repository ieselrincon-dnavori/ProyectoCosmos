FROM node:22
WORKDIR /app
COPY package*.json ./
# Instalamos CLI de forma global y dependencias locales
RUN npm install -g @ionic/cli && npm install
COPY . .
EXPOSE 8100
# --poll ayuda a que detecte cambios en volúmenes de Ubuntu/Docker
CMD ["ionic", "serve", "--host=0.0.0.0", "--port=8100", "--disable-host-check"]