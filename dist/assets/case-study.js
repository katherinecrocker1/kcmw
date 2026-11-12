for (const comparison of document.querySelectorAll('.case-comparison')) {
  const range = comparison.querySelector('input');
  comparison.classList.add('is-interactive');
  for (const control of comparison.querySelectorAll('[hidden]')) control.hidden = false;
  range.addEventListener('input', () => {
    comparison.style.setProperty('--split', range.value + '%');
  });
}

for (const gallery of document.querySelectorAll('.case-gallery')) {
  const slides = gallery.querySelector('.case-slides');
  const controls = gallery.querySelector('.case-gallery-controls');
  const more = controls.querySelector('.gallery-more');
  const step = () => slides.firstElementChild.getBoundingClientRect().width + 16;

  controls.hidden = false;
  controls.querySelector('.gallery-prev').addEventListener('click', () => {
    slides.scrollBy({ left: -step(), behavior: 'smooth' });
  });
  controls.querySelector('.gallery-next').addEventListener('click', () => {
    slides.scrollBy({ left: step(), behavior: 'smooth' });
  });
  if (more) {
    more.hidden = false;
    more.addEventListener('click', () => {
      const next = slides.querySelector('figure[hidden]');
      for (const slide of slides.querySelectorAll('figure[hidden]')) slide.hidden = false;
      next.querySelector('a').focus({ preventScroll: true });
      next.scrollIntoView({ block: 'nearest', inline: 'start' });
      more.hidden = true;
    });
  }

  const dialog = document.createElement('dialog');
  dialog.className = 'case-lightbox';
  dialog.setAttribute('aria-label', 'Gallery image');
  const close = document.createElement('button');
  close.className = 'button';
  close.type = 'button';
  close.textContent = 'Close';
  const image = document.createElement('img');
  dialog.append(close, image);
  gallery.append(dialog);
  close.addEventListener('click', () => dialog.close());

  slides.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    image.src = link.href;
    image.alt = link.querySelector('img').alt;
    dialog.showModal();
  });
}
