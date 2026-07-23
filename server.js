const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Necesario para obtener la IP real si hay un proxy delante (Render, por ejemplo)
app.set('trust proxy', true);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const LOG_FILE = path.join(__dirname, 'visitas_log.json');

// Carga el histórico existente (si lo hay)
function leerRegistros() {
  if (!fs.existsSync(LOG_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function guardarRegistros(registros) {
  fs.writeFileSync(LOG_FILE, JSON.stringify(registros, null, 2));
}

// Endpoint que se llama cuando el usuario acepta las cookies
app.post('/api/accept-cookies', (req, res) => {
  const ip = req.ip || req.connection.remoteAddress;
  const timestamp = new Date().toISOString();

  // Datos que llegan desde el navegador (recogidos en script.js)
  const datosCliente = req.body || {};

  const registro = {
    timestamp,
    ip,
    userAgent: req.headers['user-agent'] || null,
    idiomaNavegadorHTTP: req.headers['accept-language'] || null,
    ...datosCliente
  };

  console.log('✅ Cookies aceptadas. Registro:', registro);

  const registros = leerRegistros();
  registros.push(registro);
  guardarRegistros(registros);

  res.json({ success: true });
});

// Endpoint para consultar todos los registros (panel de administración)
app.get('/api/registros', (req, res) => {
  res.json({ registros: leerRegistros() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});