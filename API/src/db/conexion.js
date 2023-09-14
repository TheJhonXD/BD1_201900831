const mysql = require('mysql2/promise');
const config = require('./config');

async function query(sql, params) {
    const connection = await mysql.createConnection(config.db);
    const [results, ] = await connection.execute(sql, params);

    connection.end((err) => {
        console.log("Conexion cerrada");
        if (err) {
            return console.log("Error conexion: ", err.message);
        }
        console.log("Conexion cerrada exitosamente");
    });
    connection.destroy();
    return results;
}

/* Funcion que no cierra la conexión */
async function queryWithoutClose(connection, sql, params) {
    const [results, ] = await connection.execute(sql, params);
    return results;
}

module.exports = { query, queryWithoutClose };