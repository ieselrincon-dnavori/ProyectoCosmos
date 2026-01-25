CREATE DATABASE cosmos_db;
\c cosmos_db;
CREATE TABLE Usuario (
id_usuario SERIAL PRIMARY KEY,
nombre VARCHAR(100) NOT NULL,
apellidos VARCHAR(100) NOT NULL,
email VARCHAR(100) UNIQUE NOT NULL,
contraseña_hash VARCHAR(255) NOT NULL,
telefono VARCHAR(20),
rol VARCHAR(20) NOT NULL,
fecha_registro DATE DEFAULT CURRENT_DATE
);
CREATE TABLE Bono_Plan (
id_bono SERIAL PRIMARY KEY,
nombre_bono VARCHAR(100) UNIQUE NOT NULL,
precio NUMERIC(10,2) NOT NULL,
duracion_dias INTEGER,
num_sesiones INTEGER,
descripcion TEXT
);
CREATE TABLE Pago (
id_pago SERIAL PRIMARY KEY,
id_cliente INTEGER NOT NULL,
id_bono INTEGER NOT NULL,
fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
monto NUMERIC(10,2) NOT NULL,
metodo_pago VARCHAR(50),
fecha_vencimiento DATE,
CONSTRAINT fk_pago_cliente FOREIGN KEY (id_cliente)
REFERENCES Usuario(id_usuario),
CONSTRAINT fk_pago_bono FOREIGN KEY (id_bono)
REFERENCES Bono_Plan(id_bono)
);
CREATE TABLE Clase (
id_clase SERIAL PRIMARY KEY,
nombre_clase VARCHAR(100) NOT NULL,
descripcion TEXT,
capacidad_maxima INTEGER NOT NULL,
contenido_profesor TEXT,
id_profesor INTEGER NOT NULL,
CONSTRAINT fk_clase_profesor FOREIGN KEY (id_profesor)
REFERENCES Usuario(id_usuario)
);
CREATE TABLE Horario (
id_horario SERIAL PRIMARY KEY,
id_clase INTEGER NOT NULL,
fecha DATE NOT NULL,
hora_inicio TIME NOT NULL,
hora_fin TIME NOT NULL,
lugar VARCHAR(100),
CONSTRAINT fk_horario_clase FOREIGN KEY (id_clase)
REFERENCES Clase(id_clase)
);
CREATE TABLE Reserva (
id_reserva SERIAL PRIMARY KEY,
id_cliente INTEGER NOT NULL,
id_horario INTEGER NOT NULL,
fecha_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
estado VARCHAR(20) NOT NULL,
CONSTRAINT fk_reserva_cliente FOREIGN KEY (id_cliente)
REFERENCES Usuario(id_usuario),
CONSTRAINT fk_reserva_horario FOREIGN KEY (id_horario)
REFERENCES Horario(id_horario)
);
CREATE TABLE Rutina (
id_rutina SERIAL PRIMARY KEY,
nombre_rutina VARCHAR(100) NOT NULL,
descripcion TEXT,
fecha_asignacion DATE DEFAULT CURRENT_DATE,
id_cliente INTEGER NOT NULL,
id_profesor INTEGER NOT NULL,
CONSTRAINT fk_rutina_cliente FOREIGN KEY (id_cliente)
REFERENCES Usuario(id_usuario),
CONSTRAINT fk_rutina_profesor FOREIGN KEY (id_profesor)
REFERENCES Usuario(id_usuario)
);