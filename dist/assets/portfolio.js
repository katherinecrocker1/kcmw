const filter = document.querySelector('#client-filter');
const cards = [...document.querySelectorAll('.project-card')];
const count = document.querySelector('#project-count');

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

function updateProjects() {
  let visible = 0;

  for (const card of cards) {
    card.hidden = Boolean(filter.value && card.dataset.client !== filter.value);
    if (!card.hidden) visible += 1;
  }

  count.textContent = `${visible} ${visible === 1 ? 'project' : 'projects'}`;
}

filter.addEventListener('change', () => {
  const url = new URL(window.location.href);
  url.searchParams.delete('vp_filter');
  url.searchParams.delete('vp_page');
  if (filter.value) url.searchParams.set('client', filter.value);
  else url.searchParams.delete('client');
  window.history.replaceState(null, '', url);
  updateProjects();
});

updateProjects();
filter.closest('.filter').hidden = false;
