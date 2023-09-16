const db = require('../db/conexion');
const { query_11 } = require('../db/script');

let query11 = async(req, res) => {
    try {
        // Eliminar los comentarios del script
        const sanitize_script = query_11.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');

        /* Ejecutar el script SQL */
        let result = await db.query(sanitize_script, []);
        res.status(200).json({ consulta: 11, rows: result.length, return: result });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Ocurrio un problema al ejecutar la consulta 11", err });
    }
}

module.exports = { query11 };