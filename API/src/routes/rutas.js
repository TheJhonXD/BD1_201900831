const express = require('express');
const router = express.Router();

const { modelo } = require('../controllers/createmodel');

router.get('/crearmodelo', modelo);

module.exports = router;