const db = require('../db/conexion');
const { query_9 } = require('../db/script');

let query9 = async(req, res) => {
    try {
        // Eliminar los comentarios del script
        const sanitize_script = query_9.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');

        /* Ejecutar el script SQL */
        let result = await db.query(sanitize_script, []);
        res.status(200).json({ consulta: 9, rows: result.length, return: result });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Ocurrio un problema al ejecutar la consulta 9", err });
    }
}

module.exports = { query9 };