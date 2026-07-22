const banner = document.getElementById('cookie-banner');
const acceptBtn = document.getElementById('accept-btn');
const rejectBtn = document.getElementById('reject-btn');

// Si ya se respondió antes en este navegador, no mostrar el banner de nuevo
if (localStorage.getItem('cookieChoice')) {
  banner.style.display = 'none';
}

acceptBtn.addEventListener('click', async () => {
  try {
    await fetch('/api/accept-cookies', { method: 'POST' });
  } catch (err) {
    console.error('No se pudo registrar la IP:', err);
  }
  localStorage.setItem('cookieChoice', 'accepted');
  banner.style.display = 'none';
});

rejectBtn.addEventListener('click', () => {
  // No se llama al servidor: no se registra la IP
  localStorage.setItem('cookieChoice', 'rejected');
  banner.style.display = 'none';
});
