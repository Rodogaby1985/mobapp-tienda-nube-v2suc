// app.js V2.2 - Modalidad: SUCURSAL
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const logger = require('./src/utils/logger');
const authRoutes = require('./src/routes/authRoutes');
const shippingRoutes = require('./src/routes/shippingRoutes');
const { loadAllSheetDataIntoCache } = require('./src/services/googleSheetsService');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const MODALIDAD = process.env.MODALIDAD || 'sucursal';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'a_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Middleware para exponer la modalidad a todas las rutas
app.use((req, res, next) => {
  req.modality = MODALIDAD;
  next();
});

// Rutas
app.use('/', authRoutes);
app.use('/api', shippingRoutes);

// Manejador de errores
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.stack}`);
  res.status(500).send('Internal Server Error');
});

app.listen(port, async () => {
  logger.info(`Servidor Node.js (MODALIDAD=${MODALIDAD}) escuchando en puerto ${port}`);
  logger.info(`PUBLIC_API_URL: ${process.env.PUBLIC_API_URL || 'NO DEFINIDA'}`);
  if (!process.env.PUBLIC_API_URL) {
    logger.warn('PUBLIC_API_URL no está definida. Tienda Nube necesitará una URL pública.');
  }
  logger.info('Visita /install para iniciar la instalación (SUCURSAL).');
  try {
    await loadAllSheetDataIntoCache();
    logger.info('Cache inicial cargada (Google Sheets).');
  } catch (e) {
    logger.error('Error al cargar datos iniciales en cache: ' + e.message);
  }
});
