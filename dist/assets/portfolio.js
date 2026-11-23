const filter = document.querySelector('#client-filter');
const sort = document.querySelector('#project-sort');
const grid = document.querySelector('.project-grid');
const cards = [...grid.querySelectorAll('.project-card')];
const count = document.querySelector('#project-count');

const sortOptions = {
  newest: (a, b) => b.dataset.startDate.localeCompare(a.dataset.startDate),
  oldest: (a, b) => a.dataset.startDate.localeCompare(b.dataset.startDate),
  'client-az': (a, b) => a.dataset.client.localeCompare(b.dataset.client),
  'client-za': (a, b) => b.dataset.client.localeCompare(a.dataset.client),
};

const legacyCategories = {
  'sweeney-and-sons': 'Sweeney & Sons',
  'joel-osteen-ministries-and-lakewood-church': 'Joel Osteen Ministries and Lakewood Church',
  'jentezen-franklin-media-ministries': 'Jentezen Franklin Media Ministries',
  'royal-change': 'Royal Change',
  'misc': 'Misc.',
  'shaw-industries': 'Shaw Industries',
};

const params = new URLSearchParams(window.location.search);
const legacyCategory = params.get('vp_filter')?.replace(/^portfolio_category:/, '');
const requestedClient = params.get('client') || legacyCategories[legacyCategory];

if ([...filter.options].some(option => option.value === requestedClient)) {
  filter.value = requestedClient;
}

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
    card.hidden = Boolean(filter.value && card.dataset.client !== filter.value);
    if (!card.hidden) visible += 1;
  }

  count.textContent = `${visible} ${visible === 1 ? 'project' : 'projects'}`;
}

function updateUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete('vp_filter');
  url.searchParams.delete('vp_page');
  if (filter.value) url.searchParams.set('client', filter.value);
  else url.searchParams.delete('client');
  if (sort.value) url.searchParams.set('sort', sort.value);
  else url.searchParams.delete('sort');
  window.history.replaceState(null, '', url);
}

filter.addEventListener('change', () => {
  updateUrl();
  updateProjects();
});

sort.addEventListener('change', () => {
  updateUrl();
  sortProjects();
});

sortProjects();
updateProjects();
filter.closest('.filter').hidden = false;
