// src/routes/authRoutes.js v3.0 (VARIANTE SUCURSAL)
const express = require('express');
const router = express.Router();
const oauthClient = require('../utils/oauthClient');
const tiendaNubeService = require('../services/tiendaNubeService');
const crypto = require('crypto');

router.get('/', (req, res) => {
  res.send("API Mobapp Sucursal funcionando. Ve a /install para instalar en Tienda Nube.");
});

router.get('/install', (req, res) => {
  const state = crypto.randomBytes(16).toString('hex');
  req.session.oauth_state = state;
  const url = `https://www.tiendanube.com/apps/${process.env.TIENDA_NUBE_CLIENT_ID}/authorize`;
  res.redirect(url);
});

router.get('/oauth_callback', async (req, res) => {
  const { code, state } = req.query;
  if (state !== req.session.oauth_state) return res.status(400).send("Estado inválido");
  const tokenData = await oauthClient.exchangeCodeForToken(
    process.env.TIENDA_NUBE_CLIENT_ID,
    process.env.TIENDA_NUBE_CLIENT_SECRET,
    code,
    process.env.PUBLIC_API_URL
  );
  const accessToken = tokenData.access_token;
  const storeId = tokenData.user_id;

  const carrierName = "Mobapp Sucursal";
  const carrierInfo = await tiendaNubeService.registerShippingCarrier(
    storeId,
    accessToken,
    process.env.PUBLIC_API_URL,
    carrierName
  );
  const carrierId = carrierInfo.id;

  const options = [
    { code: "ANDREANI_SUC", name: "ANDREANI A SUCURSAL" },
    { code: "CA_SUC", name: "CORREO ARGENTINO A SUCURSAL" },
    { code: "OCA_SUC", name: "OCA A SUCURSAL" }
  ];

  for (const opt of options) {
    await tiendaNubeService.createCarrierOption(storeId, accessToken, carrierId, {
      code: opt.code,
      name: opt.name,
      types: 'ship',
      additional_days: 0,
      additional_cost: 0,
      allow_free_shipping: true,
      active: true
    });
  }

  res.send("Instalado SUCURSAL.");
});

module.exports = router;



