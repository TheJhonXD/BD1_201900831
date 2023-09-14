const db = require('../db/conexion');
const { script_create_model } = require('../db/script');

let model = async(req, res) => {
    try {
        // Eliminar los comentarios del script
        const sanitize_script = script_create_model.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');

        /* Ejecutar el script SQL */
        const sqlCmds = sanitize_script.split(';').map(cmd => cmd.trim());

        for (let i=0; i<sqlCmds.length; i++) {
            let sql = sqlCmds[i];
            if (sql.length === 0) {
                continue;
            }
            await db.query(sql, []);
        }

        res.status(200).json({ message: "Modelo creado exitosamente" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Ocurrio un problema al crear el modelo", err });
    }
}

module.exports = { model };