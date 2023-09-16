const db = require('../db/conexion');
const config = require('../db/config');
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
let filepath = path.join(__dirname, '../test/partidos.csv');

function dateFormat(date) {
    // Divido la cadena en partes (día, mes, año)
    const split_date = date.trim().split('/');

    const fecha = new Date(split_date[2], split_date[1] - 1, split_date[0]);

    // Obtengo las partes de la fecha formateada (año, mes, día)
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Sumar 1 ya que los meses comienzan en 0
    const día = String(fecha.getDate()).padStart(2, '0');

    // Formato "YYYY-MM-DD"
    return `${año}-${mes}-${día}`;
}

function notacionCientifica(cadena) {
    const partes = cadena.split('E+');
    console.log(partes);
    const numero = parseFloat(partes[0]);
    const exponente = parseInt(partes[1]);
  
    const numeroEntero = numero * Math.pow(10, exponente);
  
    return numeroEntero;
}

async function addDataToTable(filepath, table, campos) {
    // Carga de datos de csv a tabla temporal
    let data = fs.readFileSync(filepath, 'utf8');
    let lines = data.split('\n');
    let nulo;
    //Recorrer el arreglo
    for (let i = 1; i < lines.length; i++) {
        const fields = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        const fields_sanitized = fields.map(field => field.replace(/['"]+/g, '').trim());
        // Insertar los datos en la tabla temporal
        if (fields_sanitized.length > 1) {
            if (fields_sanitized[0] == -1){
                console.log(fields_sanitized);
                nulo = fields_sanitized;
                // await db.queryWithoutClose(connection, `INSERT INTO bd1_p1.PARTIDO_TMP ( nombre, siglas, fundacion) VALUES (?, ?, ?)`, [fields_sanitized[1], fields_sanitized[2], dateFormat(fields_sanitized[3])]);
            }else{
                await db.queryWithoutClose(connection, `INSERT INTO bd1_p1.${table}_TMP (nombre, siglas, fundacion) VALUES (?, ?, ?)`, [fields_sanitized[1], fields_sanitized[2], dateFormat(fields_sanitized[3])]);
            }
        }
    }
    await db.queryWithoutClose(connection, `INSERT INTO bd1_p1.PARTIDO (nombre, siglas, fundacion) SELECT nombre, siglas, fundacion FROM bd1_p1.PARTIDO_TMP`, []);
    await db.queryWithoutClose(connection, `INSERT INTO bd1_p1.PARTIDO (id, nombre, siglas, fundacion) VALUES (?, ?, ?, ?)`, [nulo[0], nulo[1], nulo[2], dateFormat(nulo[3])]);
    /* *********************************************************************************** */    
}

let create_tmp_table = async(req, res) => {
    const { script_create_tmp_tables } = require('../db/script');

    try {
        
        const connection = await mysql.createConnection(config.db);

        // Eliminar los comentarios del script
        const sanitize_script = script_create_tmp_tables.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');

        /* Ejecutar el script SQL */
        const sqlCmds = sanitize_script.split(';').map(cmd => cmd.trim());

        for (let i=0; i<sqlCmds.length; i++) {
            let sql = sqlCmds[i];
            if (sql.length === 0) {
                continue;
            }
            await db.queryWithoutClose(connection, sql, []);
        }

        /* ********************************* TABLA PARTIDO ********************************* */
        // Carga de datos de csv a tabla temporal
        let data = fs.readFileSync(filepath, 'utf8');
        let lines = data.split('\n');
        let nulo;
        //Recorrer el arreglo
        for (let i = 1; i < lines.length; i++) {
            const fields = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            const fields_sanitized = fields.map(field => field.replace(/['"]+/g, '').trim());
            // Insertar los datos en la tabla temporal
            if (fields_sanitized.length > 1) {
                await db.queryWithoutClose(connection, `INSERT INTO bd1_p1.PARTIDO_TMP (id, nombre, siglas, fundacion) VALUES (?, ?, ?, ?)`, [fields_sanitized[0], fields_sanitized[1], fields_sanitized[2], dateFormat(fields_sanitized[3])]);
            }
        }
        await db.queryWithoutClose(connection, `INSERT INTO bd1_p1.PARTIDO (id, nombre, siglas, fundacion) SELECT id, nombre, siglas, fundacion FROM bd1_p1.PARTIDO_TMP`, []);
        // await db.queryWithoutClose(connection, `INSERT INTO bd1_p1.PARTIDO (id, nombre, siglas, fundacion) VALUES (?, ?, ?, ?)`, [nulo[0], nulo[1], nulo[2], dateFormat(nulo[3])]);
        /* *********************************************************************************** */
        /* ********************************* TABLA CARGO ********************************* */
        // Carga de datos de csv a tabla temporal
        filepath = path.join(__dirname, '../test/cargos.csv');
        data = fs.readFileSync(filepath, 'utf8');
        lines = data.split('\n');
        //Recorrer el arreglo
        for (let i = 1; i < lines.length; i++) {
            const fields = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            const fields_sanitized = fields.map(field => field.replace(/['"]+/g, '').trim());
            // Insertar los datos en la tabla temporal
            if (fields_sanitized.length > 1) {
                await db.queryWithoutClose(connection, `INSERT INTO bd1_p1.CARGO_TMP (id, cargo) VALUES (?, ?)`, [fields_sanitized[0], fields_sanitized[1]]);
            }
        }
        await db.queryWithoutClose(connection, `INSERT INTO bd1_p1.CARGO (id, cargo) SELECT id, cargo FROM bd1_p1.CARGO_TMP`, []);
        // await db.queryWithoutClose(connection, `INSERT INTO bd1_p1.CARGO (id, cargo) VALUES (?, ?)`, [nulo[0], nulo[1]]);
        /* *********************************************************************************** */
        /* ********************************* TABLA CANDIDATO ********************************* */
        // Carga de datos de csv a tabla temporal
        filepath = path.join(__dirname, '../test/candidatos.csv');
        data = fs.readFileSync(filepath, 'utf8');
        lines = data.split('\n');
        //Recorrer el arreglo
        for (let i = 1; i < lines.length; i++) {
            const fields = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            const fields_sanitized = fields.map(field => field.replace(/['"]+/g, '').trim());
            // Insertar los datos en la tabla temporal
            if (fields_sanitized.length > 1) {
                await db.queryWithoutClose(connection, `INSERT INTO bd1_p1.CANDIDATO_TMP (id, nombre, fecha_nac, id_partido, id_cargo) VALUES (?, ?, ?, ?, ?)`, [fields_sanitized[0], fields_sanitized[1], dateFormat(fields_sanitized[2]), fields_sanitized[3], fields_sanitized[4]]);
            }
        }
        await db.queryWithoutClose(connection, `INSERT INTO bd1_p1.CANDIDATO (id, nombre, fecha_nac, id_partido, id_cargo) SELECT id, nombre, fecha_nac, id_partido, id_cargo FROM bd1_p1.CANDIDATO_TMP`, []);
        // await db.queryWithoutClose(connection, `INSERT INTO bd1_p1.CANDIDATO (id, nombre, fecha_nac, id_cargo, id_partido) VALUES (?, ?, ?, ?, ?)`, [nulo[0], nulo[1], dateFormat(nulo[2]), nulo[3], nulo[4]]);
        
        /* *********************************************************************************** */
        /* ********************************* TABLA CIUDADANO ********************************* */
        // Carga de datos de csv a tabla temporal
        filepath = path.join(__dirname, '../test/ciudadanos.csv');
        data = fs.readFileSync(filepath, 'utf8');
        lines = data.split('\n');
        //Recorrer el arreglo
        for (let i = 1; i < lines.length; i++) {
            const fields = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            const fields_sanitized = fields.map(field => field.replace(/['"]+/g, '').trim());
            // Insertar los datos en la tabla temporal
            if (fields_sanitized.length > 1) {
                // console.log(fields_sanitized);
                /* console.log("B:", fields_sanitized);
                console.log("A:", fields_sanitized[0]); */
                await db.queryWithoutClose(connection, `INSERT INTO bd1_p1.CIUDADANO_TMP (dpi, nombre, apellido, direccion, telefono, edad, genero) VALUES (?, ?, ?, ?, ?, ?, ?)`, [fields_sanitized[0], fields_sanitized[1], fields_sanitized[2], fields_sanitized[3], fields_sanitized[4], fields_sanitized[5], fields_sanitized[6]]);
            }
        }
        await db.queryWithoutClose(connection, `INSERT INTO bd1_p1.CIUDADANO (dpi, nombre, apellido, direccion, telefono, edad, genero) SELECT dpi, nombre, apellido, direccion, telefono, edad, genero FROM bd1_p1.CIUDADANO_TMP`, []);
        /* *********************************************************************************** */
        /* ********************************* TABLA DEPARTAMENTO ********************************* */
        // Carga de datos de csv a tabla temporal
        filepath = path.join(__dirname, '../test/departamentos.csv');
        data = fs.readFileSync(filepath, 'utf8');
        lines = data.split('\n');
        //Recorrer el arreglo
        for (let i = 1; i < lines.length; i++) {
            const fields = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            const fields_sanitized = fields.map(field => field.replace(/['"]+/g, '').trim());
            // Insertar los datos en la tabla temporal
            if (fields_sanitized.length > 1) {
                console.log(fields_sanitized);
                await db.queryWithoutClose(connection, `INSERT INTO bd1_p1.DEPARTAMENTO_TMP (nombre) VALUES (?)`, [fields_sanitized[1]]);
            }
        }
        await db.queryWithoutClose(connection, `INSERT INTO bd1_p1.DEPARTAMENTO (nombre) SELECT nombre FROM bd1_p1.DEPARTAMENTO_TMP`, []);
        /* *********************************************************************************** */
        /* ********************************* TABLA MESA ********************************* */
        // Carga de datos de csv a tabla temporal
        filepath = path.join(__dirname, '../test/mesas.csv');
        data = fs.readFileSync(filepath, 'utf8');
        lines = data.split('\n');
        //Recorrer el arreglo
        for (let i = 1; i < lines.length; i++) {
            const fields = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            const fields_sanitized = fields.map(field => field.replace(/['"]+/g, '').trim());
            // Insertar los datos en la tabla temporal
            if (fields_sanitized.length > 1) {
                console.log(fields_sanitized);
                await db.queryWithoutClose(connection, `INSERT INTO bd1_p1.MESA_TMP (id_dep) VALUES (?)`, [fields_sanitized[1]]);
            }
        }
        await db.queryWithoutClose(connection, `INSERT INTO bd1_p1.MESA (id_dep) SELECT id_dep FROM bd1_p1.MESA_TMP`, []);
        /* *********************************************************************************** */
        /* ********************************* TABLA VOTO ********************************* */
        // Carga de datos de csv a tabla temporal
        filepath = path.join(__dirname, '../test/Votos.csv');
        data = fs.readFileSync(filepath, 'utf8');
        lines = data.split('\n');
        //Recorrer el arreglo
        for (let i = 1; i < lines.length; i++) {
            const fields = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            const fields_sanitized = fields.map(field => field.replace(/['"]+/g, '').trim());
            // Insertar los datos en la tabla temporal
            if (fields_sanitized.length > 1) {
                let split_date = fields_sanitized[3].trim().split(' ');
                let newdate = dateFormat(split_date[0]);
                console.log(fields_sanitized[1]);
                await db.queryWithoutClose(connection, `INSERT INTO bd1_p1.VOTO_TMP (dpi, id_mesa, fechahora) VALUES (?, ?, ?)`, [notacionCientifica(fields_sanitized[1]), fields_sanitized[2], newdate.concat(' ', split_date[1])]);
            }
        }
        let tmpxd = await db.queryWithoutClose(connection, `SELECT * FROM bd1_p1.VOTO_TMP`, []);
        console.log(tmpxd);
        await db.queryWithoutClose(connection, `INSERT INTO bd1_p1.VOTO (dpi, id_mesa, fechahora) SELECT dpi, id_mesa, fechahora FROM bd1_p1.VOTO_TMP`, []);
        /* *********************************************************************************** */
        /* ********************************* TABLA DETALLE VOTO ********************************* */
        // Carga de datos de csv a tabla temporal
        filepath = path.join(__dirname, '../test/Detalle_voto.csv');
        data = fs.readFileSync(filepath, 'utf8');
        lines = data.split('\n');
        //Recorrer el arreglo
        for (let i = 1; i < lines.length; i++) {
            const fields = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            const fields_sanitized = fields.map(field => field.replace(/['"]+/g, '').trim());
            // Insertar los datos en la tabla temporal
            if (fields_sanitized.length > 1) {
                console.log(fields_sanitized);
                await db.queryWithoutClose(connection, `INSERT INTO bd1_p1.DETALLE_VOTO_TMP (id_voto, id_candidato) VALUES (?, ?)`, [fields_sanitized[0], fields_sanitized[1]]);
            }
        }
        const tmpData = await db.queryWithoutClose(connection, `SELECT * FROM bd1_p1.DETALLE_VOTO_TMP`, []);
        console.log(tmpData);
        await db.queryWithoutClose(connection, `INSERT INTO bd1_p1.DETALLE_VOTO (id_voto, id_candidato) SELECT id_voto, id_candidato FROM bd1_p1.DETALLE_VOTO_TMP`, []);
        /* *********************************************************************************** */
        /* const tmpData = await db.queryWithoutClose(connection, `SELECT * FROM bd1_p1.CARGO_TMP`, []);
        console.log(tmpData); */
        // De la tabla temporal a la tabla original

        // Cierro la conexion
        await connection.end();

        res.status(200).json({ message: "Tablas temporales creadas exitosamente" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocurrio un problema al crear el modelo", error })
    }
}

module.exports = { create_tmp_table };