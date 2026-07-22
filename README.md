# Proyecto: Cookies + registro de IP (trabajo universidad)

## Qué hace
- `public/index.html` muestra un banner de cookies.
- Si el usuario pulsa **Aceptar**, el navegador llama a `/api/accept-cookies`
  y el servidor guarda la IP + fecha/hora en `ips_log.txt` (y lo imprime en consola).
- Si pulsa **Rechazar**, no se registra nada.
- `public/admin.html` muestra la lista de IPs registradas leyendo `/api/ips`.

Una web estática (solo HTML/CSS/JS abierto con "Live Server", por ejemplo)
**no puede** obtener la IP real del visitante: esa información solo la ve el
servidor cuando recibe la petición. Por eso este proyecto incluye un pequeño
servidor con Node.js + Express.

## Cómo ejecutarlo en VS Code

1. Abre la carpeta del proyecto en VS Code.
2. Abre una terminal (`Ctrl + ñ` o Terminal > Nueva terminal).
3. Instala las dependencias:
   ```
   npm install
   ```
4. Arranca el servidor:
   ```
   npm start
   ```
5. Abre en el navegador:
   - `http://localhost:3000` → página principal con el banner de cookies.
   - `http://localhost:3000/admin.html` → panel con las IPs registradas.

Como estás en `localhost`, verás típicamente `127.0.0.1` o `::1` (la IP de tu
propio ordenador). Es normal: para ver IPs distintas necesitarías desplegar
el servidor en internet (por ejemplo con Render, Railway o similar) y que
otras personas entren desde sus propios dispositivos.

## Nota para la memoria del trabajo (RGPD)
La dirección IP se considera **dato personal** según el RGPD. Para un caso
real (no solo un ejercicio de clase) haría falta:
- Informar claramente de la finalidad del tratamiento (aquí ya se indica en
  el propio banner).
- Tener una base legal (normalmente el consentimiento, que es justo lo que
  simula este ejercicio).
- Indicar cuánto tiempo se conservan los datos y cómo se pueden eliminar.
- Incluir una política de privacidad enlazada desde el banner.

Puedes mencionar estos puntos en la memoria del trabajo como parte del
análisis de buenas prácticas.
