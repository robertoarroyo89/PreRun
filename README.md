# PreRun WebApp

PreRun es una webapp PWA para preparar tu carrera antes de un 5K, 10K, 15K, 21K o 42K.

## Incluye

- Onboarding con nivel y distancia
- Checklist pre-carrera
- Calendario de carreras con exportación iCal y enlace a Google Calendar
- Modo diurno y nocturno
- Frases motivacionales de running
- PWA instalable con manifest y service worker

## Cómo probar

1. Abre un servidor local en la carpeta del proyecto:

   ```bash
   cd /Users/robertoarroyoselles/Documents/Proyect-Claude
   python3 -m http.server 8000
   ```

2. Abre `http://localhost:8000` en tu navegador.
3. Activa la app desde el instalador de PWA o usa el botón `Instalar PreRun`.

## Archivos clave

- `index.html`
- `styles.css`
- `script.js`
- `manifest.webmanifest`
- `service-worker.js`
- `icons/icon-192.svg`
- `icons/icon-512.svg`
