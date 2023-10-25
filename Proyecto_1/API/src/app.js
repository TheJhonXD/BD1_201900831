const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.set('port', process.env.SERVER_PORT || 3000);
app.use(express.json());
app.use(cors());

// Routes
app.use(require('./routes/rutas'));

module.exports = app;