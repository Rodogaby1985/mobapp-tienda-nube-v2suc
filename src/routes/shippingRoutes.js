// src/routes/shippingRoutes.js V5.7 (SUCURSAL ONLY - reducción mínima)
// Variante SUCURSAL (sheetMap solo SUC)
const express = require('express');
const router = express.Router();
const { getShippingRatesFromSheet } = require('../services/googleSheetsService');

router.post('/shipping_rates', async (req, res) => {
  const data = req.body || {};
  const postalCode = data.destination?.zipcode || data.destination?.postal_code;
  const items = data.items || [];
  let totalWeightKg = 0;
  for (const it of items) totalWeightKg += (it.grams / 1000) * it.quantity;

  const sheetMap = {
    "ANDREANI A SUCURSAL": "ANDREANI SUC",
    "CORREO ARGENTINO A SUCURSAL": "CA SUC",
    "OCA A SUCURSAL": "OCA SUC"
  };

  const options = (data.carrier?.options || []).filter(o => o.name.toUpperCase().includes('SUCURSAL'));
  const finalRates = [];

  for (const option of options) {
    const sheetName = sheetMap[option.name];
    if (!sheetName) continue;
    const rates = await getShippingRatesFromSheet(sheetName, totalWeightKg, postalCode);
    const match = rates.find(r => r.name.trim().toUpperCase() === option.name.trim().toUpperCase());
    if (match) {
      finalRates.push({
        id: option.id,
        name: option.name,
        code: option.code,
        price: match.cost,
        price_merchant: match.cost,
        currency: "ARS",
        type: 'ship',
        min_delivery_date: new Date().toISOString(),
        max_delivery_date: new Date(Date.now() + 7*24*3600*1000).toISOString(),
        phone_required: false,
        reference: "ref123"
      });
    }
  }

  res.status(200).json({ rates: finalRates });
});

module.exports = router;

