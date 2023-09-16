const db = require('../db/conexion');
const { query_5 } = require('../db/script');

let query5 = async(req, res) => {
    try {
        // Eliminar los comentarios del script
        const sanitize_script = query_5.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');

        /* Ejecutar el script SQL */
        const sqlCmds = sanitize_script.split(';').map(cmd => cmd.trim());
        let result;
 
        for (let i=0; i<sqlCmds.length; i++) {
            let sql = sqlCmds[i];
            if (sql.length === 0) {
                continue;
            }
            result = await db.query(sql, []);
        }
        // console.log(result);
        res.status(200).json({ consulta: 5, rows: result.length, return: result });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Ocurrio un problema al ejecutar la consulta 1", err });
    }
}

module.exports = { query5 };