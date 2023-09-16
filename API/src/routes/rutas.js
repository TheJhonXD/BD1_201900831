const express = require('express');
const router = express.Router();

const { model } = require('../controllers/createmodel');
const { deleteModel } = require('../controllers/delete_model');
const { create_tmp_table } = require('../controllers/bulk_load_tmp');
const { query1 } = require('../controllers/query1');
const { query2 } = require('../controllers/query2');
const { query3 } = require('../controllers/query3');
const { query4 } = require('../controllers/query4');
const { query5 } = require('../controllers/query5');
const { query6 } = require('../controllers/query6');

router.get('/crearmodelo', model);
router.get('/eliminarmodelo', deleteModel);
router.get('/cargartabtemp', create_tmp_table);
router.get('/consulta1', query1);
router.get('/consulta2', query2);
router.get('/consulta3', query3);
router.get('/consulta4', query4);
router.get('/consulta5', query5);
router.get('/consulta6', query6);


module.exports = router;