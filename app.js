const DEFAULT_SETTINGS = {
  siteName: 'Northlink',
  siteTagline: 'ATC Training & Virtual Airline',
  logoLetter: 'N',
  accentColor: '#73c7ff',
  titleColor: '#ffffff',
  heroEyebrow: 'Atlantic precision. Northern discipline.',
  heroTitle: 'NORTHLINK',
  heroSubtitle: 'ATC TRAINING + VIRTUAL AIRLINE OPERATIONS',
  heroCopy: 'Build real procedures, fly organized schedules, and train with a virtual team that treats every session like the real thing.',
  primaryCtaLabel: 'Join Crew Center',
  secondaryCtaLabel: 'Request Training',
  briefTitle: 'North Atlantic Training Block',
  briefText: 'Mentor-guided tower and approach rotations with post-session review packs and progression tracking.',
  heroImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80',
  trainingTitle: 'Train from delivery to center',
  trainingText: 'Northlink mentors new and advanced controllers with live briefing nights, SOP packs, and guided session reviews.',
  vaTitle: 'Fly a modern northern network',
  vaText: 'From shuttle hops to transatlantic runs, our crew center keeps your routes, bids, and progression all in one place.',
  communityTitle: 'Built for squads, events, and growth',
  communityText: 'Host group flights, training nights, and flagship events with a style inspired by premium military and airline presentation sites.',
  whyTitle: 'A polished operations hub for serious sim pilots and controllers',
  whyText: 'Every page is built to feel cinematic and mission-ready, while still giving your team a clear way to manage information, fleets, imagery, and branding from the admin portal.',
  academyIntro: 'Progress through a five-stage academy with mentor pairing, live session debriefs, SOP drills, and event certifications.',
  statOneNumber: '24/7',
  statOneLabel: 'Operations board and dispatch planning',
  statTwoNumber: '5 Stages',
  statTwoLabel: 'Structured ATC training pipeline',
  statThreeNumber: '18 Aircraft',
  statThreeLabel: 'VA fleet with regional and long-haul routes',
  fleetHeading: 'Northlink Operational Fleet',
  fleetIntro: 'Flexible fleet planning for regional training hops, cargo lines, and long-haul flagship operations.',
  fleetItems: [
    { name: 'Airbus A320neo', role: 'Regional passenger flagship', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80' },
    { name: 'Boeing 737-800', role: 'High-frequency event and schedule ops', image: 'https://images.unsplash.com/photo-1544017353-76d62e66c4b1?auto=format&fit=crop&w=900&q=80' },
    { name: 'ATR 72-600', role: 'Short-field training and feeder routes', image: 'https://images.unsplash.com/photo-1559628233-100c798642d4?auto=format&fit=crop&w=900&q=80' },
    { name: 'Boeing 787-9', role: 'Long-haul and flagship crossings', image: 'https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?auto=format&fit=crop&w=900&q=80' }
  ]
};

const SETTINGS_KEY = 'northlink-admin-settings';
const REQUESTS_KEY = 'northlink-training-requests';
const settings = loadSettings();
let requests = loadRequests();

applySettings(settings);
setActiveNav();
renderFleet();
setupRevealAnimations();
setupTrainingForm();
setupAdmin();
renderRequests();
updateRequestCounters();
setupStorageSync();

function cloneDefaults() {
  return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
}

function loadSettings() {
  const raw = localStorage.getItem(SETTINGS_KEY);
  if (!raw) return cloneDefaults();
  try {
    return { ...cloneDefaults(), ...JSON.parse(raw) };
  } catch {
    return cloneDefaults();
  }
}

function loadRequests() {
  const raw = localStorage.getItem(REQUESTS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveSettings(next) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
}

function saveRequests(next) {
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(next));
}

function applySettings(current) {
  document.documentElement.style.setProperty('--hero-image', `url('${current.heroImage}')`);
  document.documentElement.style.setProperty('--accent', current.accentColor || DEFAULT_SETTINGS.accentColor);
  document.documentElement.style.setProperty('--title-color', current.titleColor || DEFAULT_SETTINGS.titleColor);

  document.querySelectorAll('[data-field]').forEach((node) => {
    const key = node.dataset.field;
    if (Object.hasOwn(current, key)) {
      node.textContent = current[key];
    }
  });

  document.querySelectorAll('.brand strong').forEach((node) => {
    node.textContent = current.siteName;
  });
  document.querySelectorAll('.brand-mark').forEach((node) => {
    node.textContent = current.logoLetter || 'N';
  });
}

function setActiveNav() {
  const page = document.body.dataset.page;
  document.querySelector(`[data-nav="${page}"]`)?.classList.add('active');
}

function renderFleet() {
  const container = document.getElementById('fleetGrid');
  if (!container) return;

  container.innerHTML = settings.fleetItems
    .map(
      (item) => `
        <article class="card glass fleet-card reveal visible">
          <img src="${item.image}" alt="${item.name}" />
          <span>${item.role}</span>
          <h3>${item.name}</h3>
        </article>`
    )
    .join('');
}

function renderRequests() {
  const list = document.getElementById('requestList');
  if (!list) return;

  if (!requests.length) {
    list.innerHTML = '<div class="empty-state">No training requests have been submitted yet.</div>';
    return;
  }

  list.innerHTML = [...requests]
    .reverse()
    .map(
      (request) => `
        <article class="request-card">
          <div class="request-card-top">
            <h3>${request.name}</h3>
            <span class="request-position">${request.position}</span>
          </div>
          <div class="request-meta">
            <span>${request.contact}</span>
            <span>${request.availability}</span>
            <span>${request.submittedAt}</span>
          </div>
          <p><strong>Experience:</strong> ${request.experience || 'Not provided'}</p>
          <p><strong>Goals:</strong> ${request.goals}</p>
        </article>`
    )
    .join('');
}

function updateRequestCounters() {
  const total = requests.length;
  document.getElementById('requestCountBadge')?.replaceChildren(document.createTextNode(String(total)));
  document.getElementById('requestCountHeader')?.replaceChildren(document.createTextNode(String(total)));
  document.getElementById('requestCountInline')?.replaceChildren(document.createTextNode(String(total)));
}

function setupRevealAnimations() {
  const animated = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    animated.forEach((item) => item.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    },
    { threshold: 0.15 }
  );

  animated.forEach((item) => observer.observe(item));
}

function setupTrainingForm() {
  const form = document.getElementById('trainingRequestForm');
  const status = document.getElementById('trainingFormStatus');
  if (!form || !status) return;

  updateRequestCounters();

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const submission = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      name: String(formData.get('name') || '').trim(),
      contact: String(formData.get('contact') || '').trim(),
      position: String(formData.get('position') || '').trim(),
      availability: String(formData.get('availability') || '').trim(),
      experience: String(formData.get('experience') || '').trim(),
      goals: String(formData.get('goals') || '').trim(),
      submittedAt: new Date().toLocaleString()
    };

    requests = [...loadRequests(), submission];
    saveRequests(requests);
    renderRequests();
    updateRequestCounters();
    form.reset();
    status.textContent = 'Training request saved and sent to the admin portal inbox.';
  });
}

function setupAdmin() {
  const panel = document.getElementById('adminPanel');
  const inbox = document.getElementById('requestInbox');
  const unlockButton = document.getElementById('adminUnlock');
  const status = document.getElementById('adminStatus');
  if (!panel || !unlockButton || !status || !inbox) return;

  populateAdminForm();
  renderRequests();
  updateRequestCounters();

  unlockButton.addEventListener('click', () => {
    const password = window.prompt('Enter admin password');
    if (password === 'Popwings') {
      panel.classList.remove('locked');
      inbox.classList.remove('locked');
      status.textContent = 'Editor unlocked. Live training requests are now visible below.';
    } else {
      status.textContent = 'Incorrect password. Editor remains locked.';
    }
  });

  document.getElementById('saveSettings')?.addEventListener('click', () => {
    const next = { ...settings };

    document.querySelectorAll('[data-setting]').forEach((input) => {
      const key = input.dataset.setting;
      if (key === 'fleetItems') {
        next.fleetItems = input.value
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => {
            const [name, role, image] = line.split('|');
            return {
              name: name?.trim() || 'Aircraft',
              role: role?.trim() || 'Role',
              image: image?.trim() || DEFAULT_SETTINGS.fleetItems[0].image
            };
          });
      } else {
        next[key] = input.value.trim();
      }
    });

    Object.assign(settings, next);
    saveSettings(next);
    applySettings(settings);
    renderFleet();
    status.textContent = 'Changes saved locally in this browser.';
  });

  document.getElementById('resetSettings')?.addEventListener('click', () => {
    localStorage.removeItem(SETTINGS_KEY);
    Object.assign(settings, cloneDefaults());
    populateAdminForm();
    applySettings(settings);
    renderFleet();
    status.textContent = 'Defaults restored.';
  });

  document.getElementById('clearRequests')?.addEventListener('click', () => {
    requests = [];
    saveRequests(requests);
    renderRequests();
    updateRequestCounters();
    status.textContent = 'Training request inbox cleared.';
  });
}

function populateAdminForm() {
  document.querySelectorAll('[data-setting]').forEach((input) => {
    const key = input.dataset.setting;
    input.value = key === 'fleetItems'
      ? settings.fleetItems.map((item) => `${item.name}|${item.role}|${item.image}`).join('\n')
      : settings[key] || '';
  });
}

function setupStorageSync() {
  window.addEventListener('storage', (event) => {
    if (event.key === REQUESTS_KEY) {
      requests = loadRequests();
      renderRequests();
      updateRequestCounters();
    }

    if (event.key === SETTINGS_KEY) {
      Object.assign(settings, loadSettings());
      applySettings(settings);
      populateAdminForm();
      renderFleet();
    }
  });
}
