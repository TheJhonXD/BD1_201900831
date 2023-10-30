USE bd_p2;

-- FUNCION PARA VALIDAR QUE UNA CADENA SOLO CONTENGA LETRAS

DELIMITER $$
CREATE FUNCTION valLet(str VARCHAR(100))
RETURNS BOOLEAN DETERMINISTIC
BEGIN
RETURN IF (str REGEXP '^[a-zA-Zaáéíóú ]*$', true, false);
END $$
DELIMITER ;

-- FUNCION PARA VALIDAR QUE UNA CADENA SOLO CONTENGA NUMEROS

DELIMITER $$
CREATE FUNCTION valNum(num VARCHAR(100))
RETURNS BOOLEAN DETERMINISTIC
BEGIN
RETURN IF (num REGEXP '^[0-9]*$', true, false);
END $$
DELIMITER ;

-- FUNCION PARA VALIDAR QUE LA ENTRADA ES MAYOR O IGUAL A 0

DELIMITER $$
CREATE FUNCTION valCreditosNec(num INT)
RETURNS BOOLEAN DETERMINISTIC
BEGIN
RETURN IF (num >= 0, true, false);
END $$
DELIMITER ;

-- FUNCION PARA VALIDAR QUE LA ENTRADA ES MAYOR A 0

DELIMITER $$
CREATE FUNCTION valCreditosOtor(num INT)
RETURNS BOOLEAN DETERMINISTIC
BEGIN
RETURN IF (num > 0, true, false);
END $$
DELIMITER ;

-- FUNCION PARA VALIDAR QUE SEA UN CICLO VALIDO

DELIMITER $$
CREATE FUNCTION valCiclo(ciclo VARCHAR(2))
RETURNS BOOLEAN DETERMINISTIC
BEGIN
RETURN IF 
(BINARY ciclo = '1S' 
OR BINARY ciclo= '2S' 
OR BINARY ciclo= 'VD' 
OR BINARY ciclo= 'VJ', true, false);
END $$
DELIMITER ;


-- FUNCION PARA VALIDAR QUE EL CORREO TIENE EL FORMATO CORRECTO

DELIMITER $$
CREATE FUNCTION valCorreo(correo VARCHAR(100))
RETURNS BOOLEAN DETERMINISTIC
BEGIN
RETURN IF (correo REGEXP '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', true, false);
END $$
DELIMITER ;

-- PROCEDIMIENTO PARA CREAR UNA CARRERA

DELIMITER $$
CREATE PROCEDURE crearCarrera(IN nombre_carrera VARCHAR(50))
BEGIN
    DECLARE id_carrera INT;

    IF valLet(nombre_carrera) THEN
        -- Compruebo si la carrera ya existe
        SELECT id INTO id_carrera FROM bd_p2.CARRERA WHERE carrera = nombre_carrera;

        -- Si no existe, la creo
        IF id_carrera IS NULL THEN
            INSERT INTO bd_p2.CARRERA (carrera) VALUES (nombre_carrera);
        ELSE
            SELECT 'La carrera ya existe' AS mensaje;
        END IF;
    ELSE
        SELECT 'La cadena tiene numeros' AS mensaje;
    END IF;
END $$
DELIMITER ;

-- PROCEDIMIENTO PARA CREAR UN CURSO

DELIMITER $$
CREATE PROCEDURE crearCurso(
    IN codigo_curso INT,
    IN nombre_curso VARCHAR(50),
    IN creditos_nec INT,
    IN creditos_otor INT,
    IN idCarrera INT,
    IN es_obligatorio BOOLEAN
)
BEGIN
    DECLARE curso_id INTEGER;

    -- Valido creditos necesarios
    IF valCreditosNec(creditos_nec) THEN
        -- Valido creditos que otorga
        IF valCreditosOtor(creditos_otor) THEN
            -- Compruebo si el curso ya existe
            SELECT codigo INTO curso_id FROM bd_p2.CURSO WHERE codigo = codigo_curso;

            -- Si no existe, lo creo
            IF curso_id IS NULL THEN
                INSERT INTO bd_p2.CURSO (codigo, curso, creditos_necesarios, creditos_otorga, id_carrera, obligatorio)
                VALUES (codigo_curso, nombre_curso, creditos_nec, creditos_otor, idCarrera, es_obligatorio);
            ELSE
                SELECT 'El curso ya existe' AS mensaje;
            END IF;
        ELSE
            SELECT 'Creditos que otorga no validos' AS mensaje;
        END IF;
    ELSE
        SELECT 'Creditos necesarios no validos' AS mensaje;
    END IF;
END $$
DELIMITER ;

-- PROCEDIMIENTO PARA CREAR UN DOCENTE

DELIMITER $$
CREATE PROCEDURE registrarDocente(
    IN nombre_docente VARCHAR(50),
    IN apellido_docente VARCHAR(50),
    IN fechaNac VARCHAR(20),
    IN correo_docente VARCHAR(50),
    IN telefono_docente INT,
    IN direccion_docente VARCHAR(50),
    IN dpi_docente BIGINT,
    IN codigo_personal INT
)
BEGIN
    DECLARE docente_id INT;
    DECLARE fechan DATE;
    DECLARE fecha_actual DATE;

    -- Valido que no exista el docente
    SELECT siif INTO docente_id FROM bd_p2.DOCENTE WHERE siif = codigo_personal;

    IF docente_id IS NULL THEN
        -- Valido el formato del correo
        IF valCorreo(correo_docente) THEN
            
            SET fecha_actual = NOW();
            SET fechan = STR_TO_DATE(fechaNac, '%d-%m-%Y');

            -- Insertar el nuevo docente
            INSERT INTO bd_p2.DOCENTE (siif, nombre, apellido, fecha_nac, correo, telefono, direccion, dpi, fecha_adicion)
            VALUES (codigo_personal, nombre_docente, apellido_docente, fechan, correo_docente, telefono_docente, direccion_docente, dpi_docente, fecha_actual);

            SELECT LAST_INSERT_ID() AS nuevo_id;
        ELSE
            SELECT 'Correo no valido' AS mensaje;
        END IF;
    ELSE
        SELECT 'El docente ya existe' AS mensaje;
    END IF;
END $$
DELIMITER ;

