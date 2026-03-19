const DEFAULT_SETTINGS = {
  siteName: 'Northlink',
  logoLetter: 'N',
  heroEyebrow: 'Atlantic precision. Northern discipline.',
  heroTitle: 'NORTHLINK',
  heroSubtitle: 'ATC TRAINING + VIRTUAL AIRLINE OPERATIONS',
  heroCopy: 'Build real procedures, fly organized schedules, and train with a virtual team that treats every session like the real thing.',
  heroImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80',
  fleetHeading: 'Northlink Operational Fleet',
  fleetIntro: 'Flexible fleet planning for regional training hops, cargo lines, and long-haul flagship operations.',
  fleetItems: [
    { name: 'Airbus A320neo', role: 'Regional passenger flagship', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80' },
    { name: 'Boeing 737-800', role: 'High-frequency event and schedule ops', image: 'https://images.unsplash.com/photo-1544017353-76d62e66c4b1?auto=format&fit=crop&w=900&q=80' },
    { name: 'ATR 72-600', role: 'Short-field training and feeder routes', image: 'https://images.unsplash.com/photo-1559628233-100c798642d4?auto=format&fit=crop&w=900&q=80' },
    { name: 'Boeing 787-9', role: 'Long-haul and flagship crossings', image: 'https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?auto=format&fit=crop&w=900&q=80' }
  ]
};

const STORAGE_KEY = 'northlink-admin-settings';
const settings = loadSettings();
applySettings(settings);
setActiveNav();
renderFleet();
setupRevealAnimations();
setupAdmin();

function loadSettings() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { ...DEFAULT_SETTINGS };
  try {
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettings(next) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function applySettings(current) {
  document.documentElement.style.setProperty('--hero-image', `url('${current.heroImage}')`);
  document.querySelectorAll('[data-field]').forEach((node) => {
    const key = node.dataset.field;
    if (current[key]) node.textContent = current[key];
  });
  document.querySelectorAll('.brand strong').forEach((node) => (node.textContent = current.siteName));
  document.querySelectorAll('.brand-mark').forEach((node) => (node.textContent = current.logoLetter || 'N'));
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
        <article class="card glass fleet-card">
          <img src="${item.image}" alt="${item.name}" />
          <span>${item.role}</span>
          <h3>${item.name}</h3>
        </article>`
    )
    .join('');
}

function setupRevealAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

function setupAdmin() {
  const panel = document.getElementById('adminPanel');
  const unlockButton = document.getElementById('adminUnlock');
  const status = document.getElementById('adminStatus');
  if (!panel || !unlockButton || !status) return;

  const serializedFleet = () =>
    settings.fleetItems.map((item) => `${item.name}|${item.role}|${item.image}`).join('\n');

  document.querySelectorAll('[data-setting]').forEach((input) => {
    const key = input.dataset.setting;
    input.value = key === 'fleetItems' ? serializedFleet() : settings[key] || '';
  });

  unlockButton.addEventListener('click', () => {
    const password = window.prompt('Enter admin password');
    if (password === 'Popwings') {
      panel.classList.remove('locked');
      status.textContent = 'Editor unlocked. You can now change logos, text, pictures, and fleet.';
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
            return { name: name?.trim() || 'Aircraft', role: role?.trim() || 'Role', image: image?.trim() || DEFAULT_SETTINGS.fleetItems[0].image };
          });
      } else {
        next[key] = input.value.trim();
      }
    });
    Object.assign(settings, next);
    saveSettings(next);
    applySettings(next);
    renderFleet();
    status.textContent = 'Changes saved locally in this browser.';
  });

  document.getElementById('resetSettings')?.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    Object.assign(settings, JSON.parse(JSON.stringify(DEFAULT_SETTINGS)));
    document.querySelectorAll('[data-setting]').forEach((input) => {
      const key = input.dataset.setting;
      input.value = key === 'fleetItems' ? serializedFleet() : settings[key] || '';
    });
    applySettings(settings);
    renderFleet();
    status.textContent = 'Defaults restored.';
  });
}
