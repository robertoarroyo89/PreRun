const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const startOnboarding = document.getElementById('startOnboarding');
const onboardingModal = document.getElementById('onboardingModal');
const closeModal = document.getElementById('closeModal');
const skipOnboarding = document.getElementById('skipOnboarding');
const onboardForm = document.getElementById('onboardForm');
const deviceDate = document.getElementById('deviceDate');
const syncDate = document.getElementById('syncDate');
const checklist = document.getElementById('checklist');
const completionBadge = document.getElementById('completionBadge');
const motivationalCard = document.getElementById('motivationalCard');
const phraseText = document.getElementById('phraseText');
const nextMotivation = document.getElementById('nextMotivation');
const eventList = document.getElementById('eventList');
const addRaceBtn = document.getElementById('addRaceBtn');
const openExport = document.getElementById('openExport');
const openGoogle = document.getElementById('openGoogle');
const installBtn = document.getElementById('installBtn');

let deferredInstallPrompt = null;

const phrases = [
  'El entrenamiento empieza en la decisión de salir. (Uta Pippig)',
  'No hay atajos en el running, sólo pasos constantes. (Eliud Kipchoge)',
  'Corre con confianza, el día está en tu favor. (Meb Keflezighi)',
  'Un gran día de carrera empieza con un gran desayuno y un gran plan. (Kara Goucher)',
  'El dolor es temporal; el orgullo es para siempre. (Lance Armstrong)',
  'Respira, avanza y conviértete en tu propio récord. (Mo Farah)',
  'La fuerza no se mide en velocidad, sino en perseverancia. (Kathrine Switzer)',
  'Cada kilómetro es una declaración de voluntad. (Paula Radcliffe)',
  'La carrera más importante es la que corre tu mente. (Shalane Flanagan)',
  'La motivación te pone en marcha; el hábito te lleva hasta el final. (John Bingham)',
  'No corro para escapar de la vida, corro para encontrarla. (Dean Karnazes)',
  'Cuando tus piernas flaqueen, recuerda por qué comenzaste. (Deena Kastor)',
  'No importa cuántas veces caigas, importa cuántas veces te levantes. (Steve Prefontaine)',
  'Antes de la carrera está el ritual, después está el logro. (Grete Waitz)',
  'El verdadero rival está en tu mente, no en el cronómetro. (Rod Dixon)',
  'Cada paso te acerca un poco más a tu mejor versión. (Sifan Hassan)',
  'La preparación lo es todo: la carrera es la recompensa. (Joan Benoit)',
  'El éxito no es mágico, es el resultado de la constancia. (Bill Rodgers)',
  'El cuerpo sigue lo que la mente cree. (Eliud Kipchoge)',
  'Tu mejor carrera es la que ya te preparaste para ganar. (Paula Radcliffe)',
  'Las piernas se cansan, el espíritu sigue de frente. (Frank Shorter)',
  'Corre con gratitud: tu cuerpo puede hacer lo que tu mente cree. (Des Linden)',
  'La mejor marca no siempre está en el tiempo, sino en el esfuerzo invertido. (Amby Burfoot)',
  'El entrenador más importante eres tú mismo. (Bill Bowerman)',
  'La disciplina es el puente entre metas y victorias. (Kenneth Cooper)',
  'Corre con propósito y la meta será sólo el siguiente paso. (Shalane Flanagan)',
  'El atletismo es una manera de convertir el esfuerzo en logro. (Haile Gebrselassie)',
  'La meta no siempre es el final, sino la persona en la línea de salida. (Sonia O’Sullivan)',
  'En cada zancada hay una nueva versión de ti mismo. (Tirunesh Dibaba)',
  'Tu preparación de hoy define tu rendimiento de mañana. (Paula Radcliffe)'
];

const events = [];

function setTheme(mode) {
  body.className = mode;
  localStorage.setItem('prerun-theme', mode);
}

function loadTheme() {
  const saved = localStorage.getItem('prerun-theme') || 'light';
  setTheme(saved);
}

function formatDate(date) {
  return date.toLocaleDateString('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

function updateDeviceDate() {
  const now = new Date();
  deviceDate.textContent = formatDate(now);
}

function openModal() {
  onboardingModal.classList.remove('hidden');
}

function closeModalDialog() {
  onboardingModal.classList.add('hidden');
}

function updateChecklistStatus() {
  const checked = checklist.querySelectorAll('input:checked').length;
  const total = checklist.querySelectorAll('input').length;
  completionBadge.textContent = `${checked}/${total} completados`;
  if (checked === total) {
    motivationalCard.classList.remove('hidden');
    phraseText.textContent = phrases[Math.floor(Math.random() * phrases.length)];
  }
}

function installApp() {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  deferredInstallPrompt.userChoice.then(choice => {
    if (choice.outcome === 'accepted') {
      installBtn.classList.add('hidden');
    }
    deferredInstallPrompt = null;
  });
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .catch(error => console.error('Service Worker registration failed:', error));
  }
}

function createEventItem(event) {
  const item = document.createElement('li');
  item.className = 'event-item';
  item.innerHTML = `
    <div>
      <h4>${event.title}</h4>
      <p>${event.date} · ${event.distance}</p>
    </div>
    <span class="badge">${event.status}</span>
  `;
  return item;
}

function refreshEvents() {
  eventList.innerHTML = '';
  if (!events.length) {
    const empty = document.createElement('li');
    empty.className = 'event-empty';
    empty.textContent = 'Aún no hay carreras registradas.';
    eventList.appendChild(empty);
    return;
  }
  events.forEach(event => eventList.appendChild(createEventItem(event)));
}

function downloadIcs() {
  if (!events.length) return;
  const event = events[0];
  const dt = new Date(event.isoDate);
  const dtEnd = new Date(dt.getTime() + 60 * 60 * 1000);
  const pad = num => String(num).padStart(2, '0');
  const format = date => `${date.getUTCFullYear()}${pad(date.getUTCMonth()+1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}00Z`;
  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//PreRun//ES//EN\nBEGIN:VEVENT\nUID:${Date.now()}@prerun.app\nDTSTAMP:${format(new Date())}\nDTSTART:${format(dt)}\nDTEND:${format(dtEnd)}\nSUMMARY:${event.title}\nDESCRIPTION:${event.distance} programada con PreRun\nEND:VEVENT\nEND:VCALENDAR`;
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'prerun-event.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function openGoogleCalendar() {
  if (!events.length) return;
  const event = events[0];
  const start = new Date(event.isoDate).toISOString().replace(/-|:|\.\d{3}/g, '');
  const end = new Date(new Date(event.isoDate).getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d{3}/g, '');
  const url = new URL('https://calendar.google.com/calendar/render');
  url.searchParams.set('action', 'TEMPLATE');
  url.searchParams.set('text', event.title);
  url.searchParams.set('dates', `${start}/${end}`);
  url.searchParams.set('details', `${event.distance} programada con PreRun`);
  window.open(url.toString(), '_blank');
}

function addRace() {
  const title = prompt('Nombre de la carrera (ej. Carrera 10K ciudad)');
  if (!title) return;
  const distance = prompt('Distancia (5K, 10K, 15K, 21K, 42K)');
  if (!distance) return;
  const dateInput = prompt('Fecha de la carrera (AAAA-MM-DD)');
  if (!dateInput) return;
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return alert('Fecha no válida');
  const event = {
    title,
    date: date.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }),
    isoDate: date.toISOString(),
    distance,
    status: 'Programada'
  };
  events.unshift(event);
  refreshEvents();
}

themeToggle.addEventListener('click', () => {
  const next = body.classList.contains('dark') ? 'light' : 'dark';
  setTheme(next);
});

startOnboarding.addEventListener('click', openModal);
closeModal.addEventListener('click', closeModalDialog);
skipOnboarding.addEventListener('click', closeModalDialog);

onboardForm.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(onboardForm);
  const distance = data.get('distance');
  const feeling = data.get('feeling');
  const goal = data.get('goal');
  const level = data.get('level');
  closeModalDialog();
  alert(`¡Perfecto! Has elegido ${distance} con objetivo de ${goal}.\nTe ayudaremos a sentirte ${feeling.toLowerCase()} y preparado como un corredor ${level.toLowerCase()}.`);
});

syncDate.addEventListener('click', updateDeviceDate);
addRaceBtn.addEventListener('click', addRace);
openExport.addEventListener('click', downloadIcs);
openGoogle.addEventListener('click', openGoogleCalendar);
installBtn.addEventListener('click', installApp);
nextMotivation.addEventListener('click', () => {
  phraseText.textContent = phrases[Math.floor(Math.random() * phrases.length)];
});

checklist.addEventListener('change', updateChecklistStatus);

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  deferredInstallPrompt = event;
  installBtn.classList.remove('hidden');
});

window.addEventListener('appinstalled', () => {
  installBtn.classList.add('hidden');
});

registerServiceWorker();
loadTheme();
updateDeviceDate();
refreshEvents();
updateChecklistStatus();
