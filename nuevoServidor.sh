#!/bin/bash

echo "🚀 Configurando Cosmos Fitness en nuevo servidor..."

# ==============================
# 1️⃣ ACTUALIZAR SISTEMA
# ==============================
sudo apt update -y

# ==============================
# 2️⃣ INSTALAR CURL
# ==============================
sudo apt install -y curl

# ==============================
# 3️⃣ INSTALAR NODE 20 (LTS)
# ==============================
echo "📦 Instalando Node.js 20 LTS..."

curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

echo "🔎 Versiones instaladas:"
node -v
npm -v

# ==============================
# 4️⃣ INSTALAR JAVA 17
# ==============================
sudo apt install -y openjdk-17-jdk

# ==============================
# 5️⃣ CONFIGURAR ANDROID ENV
# ==============================
if ! grep -q "ANDROID_HOME" ~/.bashrc; then
  echo '' >> ~/.bashrc
  echo 'export ANDROID_HOME=$HOME/Android/Sdk' >> ~/.bashrc
  echo 'export PATH=$PATH:$ANDROID_HOME/emulator' >> ~/.bashrc
  echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.bashrc
fi

source ~/.bashrc

# ==============================
# 6️⃣ LEVANTAR DOCKER
# ==============================
docker compose up -d

# ==============================
# 7️⃣ INSTALAR DEPENDENCIAS FRONTEND
# ==============================
cd ionic/app-ionic || exit
npm install

# ==============================
# 8️⃣ BUILD + SYNC
# ==============================
npx ionic build
npx cap sync android

echo "✅ Configuración completada."
echo "👉 Ejecuta: npx cap open android"