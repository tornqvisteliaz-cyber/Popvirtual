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
const CREW_CODES_KEY = 'northlink-crew-codes';
const CREW_SESSION_KEY = 'northlink-crew-session';
const CREW_PROFILES_KEY = 'northlink-crew-profiles';
const ADMIN_SESSION_KEY = 'northlink-admin-session';

const settings = loadSettings();
let requests = loadRequests();
let crewCodes = loadCrewCodes();
let crewProfiles = loadCrewProfiles();

applySettings(settings);
setActiveNav();
renderFleet();
setupRevealAnimations();
setupTrainingForm();
setupAdmin();
setupCrewCenter();
renderRequests();
renderCrewCodes();
updateRequestCounters();
updateCrewCodeCounters();
setupStorageSync();

function cloneDefaults() {
  return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
}
function loadJson(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try { return JSON.parse(raw); } catch { return fallback; }
}
function loadSettings() { return { ...cloneDefaults(), ...loadJson(SETTINGS_KEY, {}) }; }
function loadRequests() { return loadJson(REQUESTS_KEY, []); }
function loadCrewCodes() { return loadJson(CREW_CODES_KEY, []); }
function loadCrewProfiles() { return loadJson(CREW_PROFILES_KEY, {}); }
function saveSettings(next) { localStorage.setItem(SETTINGS_KEY, JSON.stringify(next)); }
function saveRequests(next) { localStorage.setItem(REQUESTS_KEY, JSON.stringify(next)); }
function saveCrewCodes(next) { localStorage.setItem(CREW_CODES_KEY, JSON.stringify(next)); }
function saveCrewProfiles(next) { localStorage.setItem(CREW_PROFILES_KEY, JSON.stringify(next)); }

function normalizeDiscord(value) { return String(value || '').trim().toLowerCase(); }

function applySettings(current) {
  document.documentElement.style.setProperty('--hero-image', `url('${current.heroImage}')`);
  document.documentElement.style.setProperty('--accent', current.accentColor || DEFAULT_SETTINGS.accentColor);
  document.documentElement.style.setProperty('--title-color', current.titleColor || DEFAULT_SETTINGS.titleColor);
  document.querySelectorAll('[data-field]').forEach((node) => {
    const key = node.dataset.field;
    if (Object.hasOwn(current, key)) node.textContent = current[key];
  });
  document.querySelectorAll('.brand strong').forEach((node) => { node.textContent = current.siteName; });
  document.querySelectorAll('.brand-mark').forEach((node) => { node.textContent = current.logoLetter || 'N'; });
}

function setActiveNav() {
  const page = document.body.dataset.page;
  document.querySelector(`[data-nav="${page}"]`)?.classList.add('active');
}

function renderFleet() {
  const container = document.getElementById('fleetGrid');
  if (!container) return;
  container.innerHTML = settings.fleetItems.map((item) => `
    <article class="card glass fleet-card reveal visible">
      <img src="${item.image}" alt="${item.name}" />
      <span>${item.role}</span>
      <h3>${item.name}</h3>
    </article>`).join('');
}

function renderRequests() {
  const list = document.getElementById('requestList');
  if (!list) return;
  if (!requests.length) {
    list.innerHTML = '<div class="empty-state">No training requests have been submitted yet.</div>';
    return;
  }
  list.innerHTML = [...requests].reverse().map((request) => `
    <article class="request-card">
      <div class="request-card-top">
        <h3>${request.name}</h3>
        <span class="request-position">${request.position}</span>
      </div>
      <div class="request-meta">
        <span>Discord: ${request.discord}</span>
        <span>${request.contact}</span>
        <span>${request.availability}</span>
        <span>${request.submittedAt}</span>
      </div>
      <p><strong>Experience:</strong> ${request.experience || 'Not provided'}</p>
      <p><strong>Goals:</strong> ${request.goals}</p>
    </article>`).join('');
}

function renderCrewCodes() {
  const list = document.getElementById('crewCodeList');
  if (!list) return;
  if (!crewCodes.length) {
    list.innerHTML = '<div class="empty-state">No crew access codes generated yet.</div>';
    return;
  }
  list.innerHTML = [...crewCodes].reverse().map((entry) => `
    <article class="request-card">
      <div class="request-card-top">
        <h3>${entry.label}</h3>
        <span class="request-position">${entry.code}</span>
      </div>
      <div class="request-meta">
        <span>Discord: ${entry.discord}</span>
        <span>Prefix: ${entry.prefix}</span>
        <span>Created: ${entry.createdAt}</span>
      </div>
    </article>`).join('');
}

function updateRequestCounters() {
  const total = requests.length;
  ['requestCountBadge', 'requestCountHeader', 'requestCountInline'].forEach((id) => {
    const node = document.getElementById(id);
    if (node) node.textContent = String(total);
  });
}

function updateCrewCodeCounters() {
  const total = crewCodes.length;
  ['crewCodeCount', 'crewCodeCountAdmin'].forEach((id) => {
    const node = document.getElementById(id);
    if (node) node.textContent = String(total);
  });
}

function setupRevealAnimations() {
  const animated = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    animated.forEach((item) => item.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
  }, { threshold: 0.15 });
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
    const discord = String(formData.get('discord') || '').trim();
    const submission = {
      id: globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : String(Date.now()),
      name: String(formData.get('name') || '').trim(),
      discord,
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
    status.textContent = `Training request saved for Discord user ${discord}.`;
  });
}

function setupAdmin() {
  const gate = document.getElementById('adminGate');
  const workspace = document.getElementById('adminWorkspace');
  const loginForm = document.getElementById('adminLoginForm');
  const gateStatus = document.getElementById('adminGateStatus');
  if (!gate || !workspace || !loginForm || !gateStatus) return;

  populateAdminForm();
  renderRequests();
  renderCrewCodes();
  updateRequestCounters();
  updateCrewCodeCounters();

  if (sessionStorage.getItem(ADMIN_SESSION_KEY) === 'open') unlockAdminView();

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const password = document.getElementById('adminPasswordInput')?.value || '';
    if (password === 'Popwings') {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'open');
      unlockAdminView();
      gateStatus.textContent = 'Portal unlocked.';
    } else {
      gateStatus.textContent = 'Incorrect password.';
    }
  });

  document.getElementById('adminLogout')?.addEventListener('click', () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    lockAdminView();
    gateStatus.textContent = 'Portal locked.';
  });

  document.getElementById('saveSettings')?.addEventListener('click', () => {
    const next = { ...settings };
    document.querySelectorAll('[data-setting]').forEach((input) => {
      const key = input.dataset.setting;
      if (key === 'fleetItems') {
        next.fleetItems = input.value.split('\n').map((line) => line.trim()).filter(Boolean).map((line) => {
          const [name, role, image] = line.split('|');
          return { name: name?.trim() || 'Aircraft', role: role?.trim() || 'Role', image: image?.trim() || DEFAULT_SETTINGS.fleetItems[0].image };
        });
      } else {
        next[key] = input.value.trim();
      }
    });
    Object.assign(settings, next);
    saveSettings(next);
    applySettings(settings);
    renderFleet();
  });

  document.getElementById('resetSettings')?.addEventListener('click', () => {
    localStorage.removeItem(SETTINGS_KEY);
    Object.assign(settings, cloneDefaults());
    populateAdminForm();
    applySettings(settings);
    renderFleet();
  });

  document.getElementById('clearRequests')?.addEventListener('click', () => {
    requests = [];
    saveRequests(requests);
    renderRequests();
    updateRequestCounters();
  });

  document.getElementById('crewCodeForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const prefix = String(formData.get('crew_prefix') || 'NTL').trim().toUpperCase();
    const label = String(formData.get('crew_label') || 'Crew Access').trim();
    const discord = String(formData.get('crew_discord') || '').trim();
    const code = `${prefix}-CREW-${Math.floor(1000 + Math.random() * 9000)}`;
    crewCodes = [...crewCodes, { code, prefix, label, discord, createdAt: new Date().toLocaleString() }];
    saveCrewCodes(crewCodes);
    renderCrewCodes();
    updateCrewCodeCounters();
    event.currentTarget.reset();
  });

  function unlockAdminView() {
    document.body.classList.remove('locked-admin-page');
    gate.classList.add('hidden-panel');
    workspace.classList.remove('hidden-panel');
  }
  function lockAdminView() {
    document.body.classList.add('locked-admin-page');
    gate.classList.remove('hidden-panel');
    workspace.classList.add('hidden-panel');
  }
}

function setupCrewCenter() {
  const loginForm = document.getElementById('crewLoginForm');
  const loginStatus = document.getElementById('crewLoginStatus');
  const dashboard = document.getElementById('crewDashboard');
  const profileForm = document.getElementById('crewProfileForm');
  const profileStatus = document.getElementById('crewProfileStatus');
  const logout = document.getElementById('crewLogout');
  const discordDisplay = document.getElementById('crewDiscordDisplay');
  if (!loginForm || !loginStatus || !dashboard || !profileForm || !profileStatus || !discordDisplay) return;

  updateCrewCodeCounters();

  const activeSession = loadJson(CREW_SESSION_KEY, null);
  if (activeSession) hydrateCrewSession(activeSession);

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(loginForm);
    const discord = String(formData.get('discord_username') || '').trim();
    const code = String(formData.get('access_code') || '').trim().toUpperCase();
    const match = crewCodes.find((entry) => entry.code.toUpperCase() === code && normalizeDiscord(entry.discord) === normalizeDiscord(discord));
    if (!match) {
      loginStatus.textContent = 'Discord verification failed. Use the same Discord username assigned in the admin portal.';
      return;
    }
    const session = { code: match.code, discord: match.discord, label: match.label };
    localStorage.setItem(CREW_SESSION_KEY, JSON.stringify(session));
    hydrateCrewSession(session);
    loginStatus.textContent = `Verified with Discord identity ${match.discord}. Crew center unlocked.`;
  });

  profileForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const session = loadJson(CREW_SESSION_KEY, null);
    if (!session) {
      profileStatus.textContent = 'Verify with Discord first.';
      return;
    }
    const formData = new FormData(profileForm);
    crewProfiles[normalizeDiscord(session.discord)] = {
      preferredHub: String(formData.get('preferred_hub') || '').trim(),
      preferredAircraft: String(formData.get('preferred_aircraft') || '').trim(),
      notes: String(formData.get('notes') || '').trim(),
      code: session.code,
      updatedAt: new Date().toLocaleString()
    };
    saveCrewProfiles(crewProfiles);
    profileStatus.textContent = `Crew profile saved for ${session.discord}.`;
  });

  logout?.addEventListener('click', () => {
    localStorage.removeItem(CREW_SESSION_KEY);
    dashboard.classList.add('hidden-panel');
    loginStatus.textContent = 'No crew session active.';
    profileStatus.textContent = 'No profile changes saved yet.';
  });

  function hydrateCrewSession(session) {
    dashboard.classList.remove('hidden-panel');
    discordDisplay.textContent = session.discord;
    const profile = crewProfiles[normalizeDiscord(session.discord)] || {};
    profileForm.elements.preferred_hub.value = profile.preferredHub || '';
    profileForm.elements.preferred_aircraft.value = profile.preferredAircraft || '';
    profileForm.elements.notes.value = profile.notes || '';
    profileStatus.textContent = profile.updatedAt ? `Profile restored from ${profile.updatedAt}.` : 'No profile changes saved yet.';
  }
}

function populateAdminForm() {
  document.querySelectorAll('[data-setting]').forEach((input) => {
    const key = input.dataset.setting;
    input.value = key === 'fleetItems' ? settings.fleetItems.map((item) => `${item.name}|${item.role}|${item.image}`).join('\n') : settings[key] || '';
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
    if (event.key === CREW_CODES_KEY) {
      crewCodes = loadCrewCodes();
      renderCrewCodes();
      updateCrewCodeCounters();
    }
    if (event.key === CREW_PROFILES_KEY) {
      crewProfiles = loadCrewProfiles();
    }
  });
}
