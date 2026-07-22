const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Necesario para obtener la IP real si hay un proxy delante (en local no afecta)
app.set('trust proxy', true);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const LOG_FILE = path.join(__dirname, 'ips_log.txt');

// Endpoint que se llama cuando el usuario acepta las cookies
app.post('/api/accept-cookies', (req, res) => {
  const ip = req.ip || req.connection.remoteAddress;
  const timestamp = new Date().toISOString();
  const entry = `${timestamp} | ${ip}\n`;

  console.log('✅ Cookies aceptadas. IP registrada:', ip);
  fs.appendFileSync(LOG_FILE, entry);

  res.json({ success: true, ip });
});

// Endpoint para consultar todas las IPs registradas (panel de administración)
app.get('/api/ips', (req, res) => {
  if (!fs.existsSync(LOG_FILE)) {
    return res.json({ ips: [] });
  }
  const data = fs.readFileSync(LOG_FILE, 'utf-8');
  const ips = data.trim().split('\n').filter(Boolean);
  res.json({ ips });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Panel de administración en http://localhost:${PORT}/admin.html`);
});
