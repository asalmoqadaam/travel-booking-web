
// server.js
const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.static('public'));

app.get('/config', (req, res) => {
  res.json({ key: process.env.GOOGLE_MAPS_API_KEY });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
