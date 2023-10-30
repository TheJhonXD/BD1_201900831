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
    DECLARE id_carrera INTEGER;

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
    IN codigo_curso INTEGER,
    IN nombre_curso VARCHAR(50),
    IN creditos_nec INTEGER,
    IN creditos_otor INTEGER,
    IN idCarrera INTEGER,
    IN es_obligatorio BOOLEAN
)
BEGIN
    DECLARE curso_id INTEGER;

    -- Validacion de creditos necesarios
    IF valCreditosNec(creditos_nec) THEN
        -- Validacion de creditos que otorga
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

