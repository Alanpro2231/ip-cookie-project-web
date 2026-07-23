/* ---------- Contador de cuenta atrás ---------- */
const fechaSorteo = new Date();
fechaSorteo.setDate(fechaSorteo.getDate() + 4); // sorteo dentro de 4 días

function actualizarContador() {
  const ahora = new Date();
  const diff = fechaSorteo - ahora;
  if (diff <= 0) return;
  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const min = Math.floor((diff / (1000 * 60)) % 60);
  const seg = Math.floor((diff / 1000) % 60);
  document.getElementById('d').textContent = String(dias).padStart(2, '0');
  document.getElementById('h').textContent = String(horas).padStart(2, '0');
  document.getElementById('m').textContent = String(min).padStart(2, '0');
  document.getElementById('s').textContent = String(seg).padStart(2, '0');
}
actualizarContador();
setInterval(actualizarContador, 1000);

/* ---------- Fingerprinting + envío ---------- */
const banner = document.getElementById('cookie-banner');
const acceptBtn = document.getElementById('accept-btn');
const rejectBtn = document.getElementById('reject-btn');
const entryBtn = document.getElementById('entry-btn');
const entryConfirm = document.getElementById('entry-confirm');

let yaParticipa = !!localStorage.getItem('cookieChoice');
if (yaParticipa) {
  banner.style.display = 'none';
  if (localStorage.getItem('cookieChoice') === 'accepted') {
    entryBtn.textContent = 'Ya estás participando';
    entryBtn.disabled = true;
    entryConfirm.hidden = false;
  }
}

function obtenerCanvasFingerprint() {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('fingerprint-demo-uni', 2, 2);
    const dataUrl = canvas.toDataURL();
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

async function confirmarParticipacion() {
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
  entryBtn.textContent = 'Ya estás participando';
  entryBtn.disabled = true;
  entryConfirm.hidden = false;
}

acceptBtn.addEventListener('click', confirmarParticipacion);

entryBtn.addEventListener('click', () => {
  if (!localStorage.getItem('cookieChoice')) {
    confirmarParticipacion();
  }
});

rejectBtn.addEventListener('click', () => {
  localStorage.setItem('cookieChoice', 'rejected');
  banner.style.display = 'none';
});