for (const gallery of document.querySelectorAll('.case-gallery')) {
  const track = gallery.querySelector('.gallery-track');
  const links = [...track.querySelectorAll('a')];
  const controls = document.createElement('div');
  controls.className = 'gallery-controls';
  gallery.querySelector('.gallery-heading-row').append(controls);

  function addButton(parent, text, label = text) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = text;
    button.setAttribute('aria-label', label);
    parent.append(button);
    return button;
  }

  const viewAll = addButton(controls, 'View Full Gallery');
  viewAll.className = 'gallery-view';
  viewAll.removeAttribute('aria-label');
  viewAll.setAttribute('aria-expanded', 'false');

  const arrows = document.createElement('div');
  arrows.className = 'gallery-arrows';
  controls.append(arrows);
  const previous = addButton(arrows, '←', 'Previous images');
  const next = addButton(arrows, '→', 'Next images');
  previous.className = next.className = 'gallery-arrow';

  const progress = document.createElement('div');
  progress.className = 'gallery-progress';
  progress.setAttribute('aria-hidden', 'true');
  const barFill = document.createElement('span');
  progress.append(barFill);
  track.after(progress);

  function updateProgress() {
    const remaining = track.scrollWidth - track.clientWidth;
    const fraction = remaining > 0 ? track.scrollLeft / remaining : 0;
    const width = Math.max(15, track.scrollWidth ? 100 * track.clientWidth / track.scrollWidth : 100);
    barFill.style.width = `${width}%`;
    barFill.style.left = `${fraction * (100 - width)}%`;
  }

  function scrollTrack(direction) {
    const item = links[0];
    const gap = parseFloat(getComputedStyle(track).columnGap);
    const behavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
    track.scrollBy({ left: direction * (item.offsetWidth + gap), behavior });
  }

  previous.addEventListener('click', () => scrollTrack(-1));
  next.addEventListener('click', () => scrollTrack(1));
  track.addEventListener('scroll', updateProgress, { passive: true });
  new ResizeObserver(updateProgress).observe(track);
  updateProgress();

  viewAll.addEventListener('click', () => {
    const expanded = track.classList.toggle('is-expanded');
    viewAll.textContent = expanded ? 'View Carousel' : 'View Full Gallery';
    viewAll.setAttribute('aria-expanded', String(expanded));
    arrows.hidden = progress.hidden = expanded;
    if (!expanded) updateProgress();
  });

  const dialog = document.createElement('dialog');
  dialog.className = 'case-lightbox';
  dialog.setAttribute('aria-label', 'Gallery image');
  const bar = document.createElement('div');
  bar.className = 'gallery-lightbox-controls';
  const backImage = addButton(bar, '←', 'Previous image');
  backImage.className = 'gallery-lightbox-prev';
  const count = document.createElement('span');
  count.setAttribute('aria-live', 'polite');
  count.className = 'gallery-lightbox-count';
  const nextImage = addButton(bar, '→', 'Next image');
  nextImage.className = 'gallery-lightbox-next';
  const close = addButton(bar, '×', 'Close');
  close.className = 'gallery-lightbox-close';
  const image = document.createElement('img');
  dialog.append(bar, image, count);
  gallery.append(dialog);

  let index = 0;
  function showImage(position) {
    index = (position + links.length) % links.length;
    const link = links[index];
    image.src = link.href;
    image.alt = link.querySelector('img').alt;
    count.textContent = `${index + 1} / ${links.length}`;
  }

  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  backImage.addEventListener('click', () => showImage(index - 1));
  nextImage.addEventListener('click', () => showImage(index + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showImage(index + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });

  track.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    showImage(links.indexOf(link));
    dialog.showModal();
    close.focus();
  });
}

for (const gallery of document.querySelectorAll('.website-redesign')) {
  const pagePicker = gallery.querySelector('.redesign-page-picker');
  const select = pagePicker.querySelector('select');
  const pages = gallery.querySelectorAll('.redesign-card');

  function updateComparison() {
    for (const page of pages) {
      page.hidden = page.dataset.page !== select.value;
    }
  }

  select.addEventListener('change', updateComparison);
  updateComparison();
  pagePicker.hidden = false;

  const dialog = gallery.querySelector('.redesign-lightbox');
  const preview = dialog.querySelector('img');
  const caption = dialog.querySelector('.gallery-lightbox-caption');
  const previous = dialog.querySelector('.gallery-lightbox-prev');
  const next = dialog.querySelector('.gallery-lightbox-next');
  let screenshots = [];
  let index = 0;

  function showScreenshot(position) {
    index = (position + screenshots.length) % screenshots.length;
    const link = screenshots[index];
    preview.src = link.href;
    preview.alt = link.querySelector('img').alt;
    caption.textContent = link.closest('figure').querySelector('figcaption').firstChild.textContent.trim();
  }

  previous.addEventListener('click', () => showScreenshot(index - 1));
  next.addEventListener('click', () => showScreenshot(index + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showScreenshot(index + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });

  gallery.addEventListener('click', event => {
    const link = event.target.closest('.redesign-versions figure > a');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    screenshots = [...link.closest('.redesign-versions').querySelectorAll('figure > a')];
    showScreenshot(screenshots.indexOf(link));
    dialog.showModal();
  });
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
}
