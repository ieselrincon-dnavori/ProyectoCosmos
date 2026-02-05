# ProyectoCosmos

#Usuarios de prueba

Cliente:
juan@mail.com
 / 1234

Profesor:
ana@mail.com
 / 1234

Admin:
admin@mail.com
 / admin



 // Configurar el repo:

 git clone https://github.com/TU_USUARIO/ProyectoCosmos.git


Ejemplo clone : https://github.com/ieselrincon-dnavori/ProyectoCosmos
 
 
 
 
cd NOMBRE_DEL_PROYECTO
chmod +x *.ps1


Configurar tus credenciales globales para git/github

git config --global credential.helper store




/// EJECUTAR ESTO SI NO FUNCIONA LOS SCRIPT PARA WINDOWS

Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser



//USO DE LA API

Ver horarios
    curl -s http://localhost:3000/horarios | jq

