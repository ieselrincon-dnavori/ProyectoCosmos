#!/bin/bash

echo "🚀 Iniciando configuración Cosmos Fitness..."

# ==============================
# 1️⃣ ACTUALIZAR SISTEMA
# ==============================
echo "📦 Actualizando sistema..."
sudo apt update -y

# ==============================
# 2️⃣ INSTALAR JAVA 17
# ==============================
echo "☕ Instalando Java 17..."
sudo apt install -y openjdk-17-jdk

echo "🔎 Configurando Java 17 como predeterminado..."
sudo update-alternatives --set java /usr/lib/jvm/java-17-openjdk-amd64/bin/java 2>/dev/null

# ==============================
# 3️⃣ INSTALAR DEPENDENCIAS ANDROID
# ==============================
echo "📱 Configurando variables Android..."

if ! grep -q "ANDROID_HOME" ~/.bashrc; then
    echo '' >> ~/.bashrc
    echo 'export ANDROID_HOME=$HOME/Android/Sdk' >> ~/.bashrc
    echo 'export PATH=$PATH:$ANDROID_HOME/emulator' >> ~/.bashrc
    echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.bashrc
    echo 'export PATH=$PATH:$ANDROID_HOME/tools' >> ~/.bashrc
    echo 'export PATH=$PATH:$ANDROID_HOME/tools/bin' >> ~/.bashrc
fi

source ~/.bashrc

# ==============================
# 4️⃣ LEVANTAR DOCKER
# ==============================
echo "🐳 Levantando contenedores Docker..."
docker compose up -d

# ==============================
# 5️⃣ INSTALAR DEPENDENCIAS FRONTEND
# ==============================
echo "📦 Instalando dependencias Ionic..."
cd ionic/app-ionic || exit
npm install

# ==============================
# 6️⃣ BUILD + SYNC CAPACITOR
# ==============================
echo "🏗 Compilando Ionic..."
npx ionic build

echo "🔄 Sincronizando Capacitor..."
npx cap sync android

echo "🎉 Configuración completada correctamente."
echo ""
echo "👉 Para abrir Android Studio ejecuta:"
echo "   npx cap open android"
echo ""
echo "👉 Para ver la web:"
echo "   http://localhost:8100"
echo ""