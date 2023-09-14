const db = require('../db/conexion');

let deleteModel = async(req, res) => {
    const { script_delete_model } = require('../db/script');

    try {
        // Eliminar los comentarios del script
        const sanitize_script = script_delete_model.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');

        /* Ejecutar el script SQL */
        const sqlCmds = sanitize_script.split(';').map(cmd => cmd.trim());

        for (let i=0; i<sqlCmds.length; i++) {
            let sql = sqlCmds[i];
            if (sql.length === 0) {
                continue;
            }
            await db.query(sql, []);
        }

        res.status(200).json({ message: "Modelo borrado exitosamente" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocurrio un problema al eliminar el modelo", error })
    }
}

module.exports = { deleteModel };