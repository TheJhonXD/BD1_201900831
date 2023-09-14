const express = require('express');
const router = express.Router();

const { model } = require('../controllers/createmodel');
const { deleteModel } = require('../controllers/delete_model');

router.get('/crearmodelo', model);
router.get('/eliminarmodelo', deleteModel);

module.exports = router;