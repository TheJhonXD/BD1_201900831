/* Script para crear la base de datos y sus tablas */
const script_create_model = `
-- CREAR BASE DE DATOS

CREATE SCHEMA IF NOT EXISTS bd1_p1;

--  TABLA PARTIDO

CREATE TABLE IF NOT EXISTS bd1_p1.PARTIDO (
  id INTEGER NOT NULL,
  nombre VARCHAR(50) NOT NULL,
  siglas VARCHAR(10) NOT NULL,
  fundacion DATE NOT NULL,
  PRIMARY KEY (id) 
);

-- TABLA CARGO

CREATE TABLE IF NOT EXISTS bd1_p1.CARGO (
  id INTEGER NOT NULL,
  cargo VARCHAR(50) NOT NULL,
  PRIMARY KEY (id)
);

-- TABLA CANDIDATO

CREATE TABLE IF NOT EXISTS bd1_p1.CANDIDATO (
  id INTEGER NOT NULL,
  nombre VARCHAR(50) NOT NULL,
  fecha_nac DATE NOT NULL,
  id_partido INTEGER NOT NULL,
  id_cargo INTEGER NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id_partido) REFERENCES bd1_p1.PARTIDO (id),
  FOREIGN KEY (id_cargo) REFERENCES bd1_p1.CARGO (id)
);


-- TABLA CIUDADANO

CREATE TABLE IF NOT EXISTS bd1_p1.CIUDADANO (
  dpi VARCHAR(13) NOT NULL,
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50) NOT NULL,
  direccion VARCHAR(100) NOT NULL,
  telefono VARCHAR(10) NOT NULL,
  edad INTEGER NOT NULL,
  genero VARCHAR(1) NOT NULL,
  PRIMARY KEY (dpi)
);

-- TABLA DEPARTAMENTO

CREATE TABLE IF NOT EXISTS bd1_p1.DEPARTAMENTO (
  id INTEGER NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(20) NOT NULL,
  PRIMARY KEY (id)
);

-- TABLA MESA

CREATE TABLE IF NOT EXISTS bd1_p1.MESA (
  id INTEGER NOT NULL AUTO_INCREMENT,
  id_dep INTEGER NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id_dep) REFERENCES bd1_p1.DEPARTAMENTO (id)
);

-- TABLA VOTO

CREATE TABLE IF NOT EXISTS bd1_p1.VOTO (
  id INTEGER NOT NULL AUTO_INCREMENT,
  dpi VARCHAR(13) NOT NULL,
  id_mesa INTEGER NOT NULL,
  fechahora DATETIME NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (dpi) REFERENCES bd1_p1.CIUDADANO (dpi),
  FOREIGN KEY (id_mesa) REFERENCES bd1_p1.MESA (id)
);

-- TABLA DETALLE VOTO

CREATE TABLE IF NOT EXISTS bd1_p1.DETALLE_VOTO (
  id_voto INTEGER NOT NULL,
  id_candidato INTEGER NOT NULL,
  FOREIGN KEY (id_voto) REFERENCES bd1_p1.VOTO (id),
  FOREIGN KEY (id_candidato) REFERENCES bd1_p1.CANDIDATO (id)
);
`;

/* Script para borrar el modelo */
const script_delete_model = `
  -- BORRAR BASE DE DATOS
  DROP DATABASE IF EXISTS bd1_p1;
  -- BORRAR TABLA PARTIDO
  DROP TABLE IF EXISTS bd1_p1.PARTIDO;
  -- BORRAR TABLA CARGO
  DROP TABLE IF EXISTS bd1_p1.CARGO;
  -- BORRAR TABLA CANDIDATO
  DROP TABLE IF EXISTS bd1_p1.CANDIDATO;
  -- BORRAR TABLA CIUDADANO
  DROP TABLE IF EXISTS bd1_p1.CIUDADANO;
  -- BORRAR TABLA DEPARTAMENTO
  DROP TABLE IF EXISTS bd1_p1.DEPARTAMENTO;
  -- BORRAR TABLA MESA
  DROP TABLE IF EXISTS bd1_p1.MESA;
  -- BORRAR TABLA VOTO
  DROP TABLE IF EXISTS bd1_p1.VOTO;
  -- BORRAR TABLA DETALLE VOTO
  DROP TABLE IF EXISTS bd1_p1.DETALLE_VOTO;
`;

const script_create_tmp_tables = `
  -- Tabla temporal para PARTIDO
  CREATE TEMPORARY TABLE bd1_p1.PARTIDO_TMP (
    id INTEGER NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    siglas VARCHAR(10) NOT NULL,
    fundacion DATE NOT NULL
  );

  -- Tabla temporal para CARGO
  CREATE TEMPORARY TABLE bd1_p1.CARGO_TMP (
    id INTEGER NOT NULL,
    cargo VARCHAR(50) NOT NULL
  );

  -- Tabla temporal para CANDIDATO
  CREATE TEMPORARY TABLE bd1_p1.CANDIDATO_TMP (
    id INTEGER NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    fecha_nac DATE NOT NULL,
    id_partido INTEGER NOT NULL,
    id_cargo INTEGER NOT NULL
  );

  -- Tabla temporal para CIUDADANO
  CREATE TEMPORARY TABLE bd1_p1.CIUDADANO_TMP (
    dpi VARCHAR(13) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    direccion VARCHAR(100) NOT NULL,
    telefono VARCHAR(10) NOT NULL,
    edad INTEGER NOT NULL,
    genero VARCHAR(1) NOT NULL
  );

  -- Tabla temporal para DEPARTAMENTO
  CREATE TEMPORARY TABLE bd1_p1.DEPARTAMENTO_TMP (
    nombre VARCHAR(20) NOT NULL
  );

  -- Tabla temporal para MESA
  CREATE TEMPORARY TABLE bd1_p1.MESA_TMP (
    id_dep INTEGER NOT NULL
  );

  -- Tabla temporal para VOTO
  CREATE TEMPORARY TABLE bd1_p1.VOTO_TMP (
    dpi VARCHAR(13) NOT NULL,
    id_mesa INTEGER NOT NULL,
    fechahora DATETIME NOT NULL
  );

  -- Tabla temporal para DETALLE VOTO
  CREATE TEMPORARY TABLE bd1_p1.DETALLE_VOTO_TMP (
    id_voto INTEGER NOT NULL,
    id_candidato INTEGER NOT NULL
  );
`;

/* Consulta 1 */
const query_1 = `
  SELECT 
    Presi.nombre AS "Presidente",
    Vice.nombre AS "Vicepresidente",
    PARTIDO.nombre AS "Partido"
  FROM 
    bd1_p1.CANDIDATO AS Presi
  JOIN 
    bd1_p1.CANDIDATO AS Vice ON Presi.id_partido = Vice.id_partido AND Presi.id <> Vice.id
  JOIN 
    bd1_p1.PARTIDO ON Presi.id_partido = PARTIDO.id
  WHERE 
    Presi.id_cargo = 1 AND Vice.id_cargo = 2;
`;

/* Consulta 2 */
const query_2 = `
  SELECT 
    PARTIDO.nombre AS "Partido",
    COUNT(*) AS "Cantidad"
  FROM 
    bd1_p1.CANDIDATO
  JOIN 
    bd1_p1.PARTIDO ON CANDIDATO.id_partido = PARTIDO.id
  JOIN 
    bd1_p1.CARGO ON CANDIDATO.id_cargo = CARGO.id
  WHERE 
    CARGO.cargo LIKE '%diputado%'
  GROUP BY 
    PARTIDO.nombre;
`;

const query_3 = `
  SELECT 
    CANDIDATO.nombre AS "Nombre",
    PARTIDO.nombre AS "Partido"
  FROM 
    bd1_p1.CANDIDATO
  JOIN 
    bd1_p1.PARTIDO ON CANDIDATO.id_partido = PARTIDO.id
  JOIN 
    bd1_p1.CARGO ON CANDIDATO.id_cargo = CARGO.id
  WHERE 
    CARGO.cargo = 'alcalde';
`;

const query_4 = `
  SELECT 
    PARTIDO.nombre AS "Partido",
    COUNT(*) AS "Cantidad"
  FROM 
    bd1_p1.CANDIDATO
  JOIN 
    bd1_p1.PARTIDO ON CANDIDATO.id_partido = PARTIDO.id
  JOIN 
    bd1_p1.CARGO ON CANDIDATO.id_cargo = CARGO.id
  GROUP BY 
    PARTIDO.nombre;
`;


module.exports = { script_create_model, script_delete_model, script_create_tmp_tables, query_1, query_2, query_3, query_4 };