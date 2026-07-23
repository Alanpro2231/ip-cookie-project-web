const banner = document.getElementById('cookie-banner');
const acceptBtn = document.getElementById('accept-btn');
const rejectBtn = document.getElementById('reject-btn');

// Si ya se respondió antes en este navegador, no mostrar el banner de nuevo
if (localStorage.getItem('cookieChoice')) {
  banner.style.display = 'none';
}

// --- Técnica de "fingerprinting" con Canvas ---
// Genera un identificador a partir de cómo el navegador dibuja un canvas oculto.
// Es una técnica real usada por sistemas de rastreo (para uso educativo aquí).
function obtenerCanvasFingerprint() {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('fingerprint-demo-uni', 2, 2);
    const dataUrl = canvas.toDataURL();
    // Convertimos a un hash corto para no mandar la imagen entera
    let hash = 0;
    for (let i = 0; i < dataUrl.length; i++) {
      hash = (hash << 5) - hash + dataUrl.charCodeAt(i);
      hash |= 0;
    }
    return hash.toString(16);
  } catch {
    return null;
  }
}

function recopilarDatosNavegador() {
  return {
    userAgentJS: navigator.userAgent,
    plataforma: navigator.platform || null,
    idioma: navigator.language,
    idiomas: navigator.languages ? navigator.languages.join(', ') : null,
    nucleosCPU: navigator.hardwareConcurrency || null,
    memoriaDispositivoGB: navigator.deviceMemory || null,
    pantallaTactil: navigator.maxTouchPoints > 0,
    doNotTrack: navigator.doNotTrack || null,
    cookiesHabilitadas: navigator.cookieEnabled,
    resolucionPantalla: `${screen.width}x${screen.height}`,
    profundidadColor: screen.colorDepth,
    tamanoVentana: `${window.innerWidth}x${window.innerHeight}`,
    zonaHoraria: Intl.DateTimeFormat().resolvedOptions().timeZone,
    offsetHorarioMin: new Date().getTimezoneOffset(),
    tipoConexion: navigator.connection ? navigator.connection.effectiveType : null,
    referrer: document.referrer || null,
    canvasFingerprint: obtenerCanvasFingerprint()
  };
}

acceptBtn.addEventListener('click', async () => {
  try {
    await fetch('/api/accept-cookies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recopilarDatosNavegador())
    });
  } catch (err) {
    console.error('No se pudo registrar los datos:', err);
  }
  localStorage.setItem('cookieChoice', 'accepted');
  banner.style.display = 'none';
});

rejectBtn.addEventListener('click', () => {
  // No se llama al servidor: no se registra ningún dato
  localStorage.setItem('cookieChoice', 'rejected');
  banner.style.display = 'none';
});