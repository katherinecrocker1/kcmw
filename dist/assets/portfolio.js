const filter = document.querySelector('#client-filter');
const role = document.querySelector('#role-filter');
const sort = document.querySelector('#project-sort');
const activeOnly = document.querySelector('#active-only');
const grid = document.querySelector('.project-grid');
const cards = [...grid.querySelectorAll('.project-card')];
const count = document.querySelector('#project-count');
const empty = document.querySelector('#project-empty');

const sortOptions = {
  newest: (a, b) => b.dataset.startDate.localeCompare(a.dataset.startDate),
  oldest: (a, b) => a.dataset.startDate.localeCompare(b.dataset.startDate),
  'client-az': (a, b) => a.dataset.client.localeCompare(b.dataset.client),
  'client-za': (a, b) => b.dataset.client.localeCompare(a.dataset.client),
};

const legacyCategories = {
  'sweeney-and-sons': 'Sweeney & Sons',
  'joel-osteen-ministries-and-lakewood-church': 'Joel Osteen Ministries | Lakewood Church',
  'jentezen-franklin-media-ministries': 'Jentezen Franklin Media Ministries',
  'royal-change': 'Royal Change',
  'misc': 'Misc.',
  'shaw-industries': 'Shaw Industries',
};

const params = new URLSearchParams(window.location.search);
const legacyCategory = params.get('vp_filter')?.replace(/^portfolio_category:/, '');
const requestedClient = params.get('client')?.replace(' and Lakewood Church', ' | Lakewood Church')
  || legacyCategories[legacyCategory];

if ([...filter.options].some(option => option.value === requestedClient)) {
  filter.value = requestedClient;
}

const requestedRole = params.get('role');
if ([...role.options].some(option => option.value === requestedRole)) {
  role.value = requestedRole;
}

activeOnly.checked = params.get('active') === '1';

const requestedSort = params.get('sort');
if (Object.hasOwn(sortOptions, requestedSort)) {
  sort.value = requestedSort;
}

function sortProjects() {
  const compare = sortOptions[sort.value];
  const orderedCards = compare ? [...cards].sort(compare) : cards;
  grid.append(...orderedCards);
}

function updateProjects() {
  let visible = 0;

  for (const card of cards) {
    const matchesClient = !filter.value || card.dataset.client === filter.value;
    const matchesStatus = !activeOnly.checked || card.querySelector('.project-status');
    const matchesRole = !role.value || card.dataset.roles.split(' ').includes(role.value);
    card.hidden = !matchesClient || !matchesStatus || !matchesRole;
    if (!card.hidden) visible += 1;
  }

  empty.hidden = visible !== 0;
  count.textContent = `${visible} ${visible === 1 ? 'project' : 'projects'}`;
}

function updateUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete('vp_filter');
  url.searchParams.delete('vp_page');
  if (filter.value) url.searchParams.set('client', filter.value);
  else url.searchParams.delete('client');
  if (role.value) url.searchParams.set('role', role.value);
  else url.searchParams.delete('role');
  if (sort.value) url.searchParams.set('sort', sort.value);
  else url.searchParams.delete('sort');
  if (activeOnly.checked) url.searchParams.set('active', '1');
  else url.searchParams.delete('active');
  window.history.replaceState(null, '', url);
}

function filterProjects() {
  updateUrl();
  updateProjects();
}

filter.addEventListener('change', filterProjects);
role.addEventListener('change', filterProjects);
activeOnly.addEventListener('change', filterProjects);

sort.addEventListener('change', () => {
  updateUrl();
  sortProjects();
});

sortProjects();
updateProjects();
filter.closest('.filter-panel').hidden = false;
