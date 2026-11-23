for (const comparison of document.querySelectorAll('.case-comparison')) {
  const range = comparison.querySelector('input');
  comparison.classList.add('is-interactive');
  for (const control of comparison.querySelectorAll('[hidden]')) control.hidden = false;
  range.addEventListener('input', () => {
    comparison.style.setProperty('--split', range.value + '%');
  });
}

for (const gallery of document.querySelectorAll('.case-gallery')) {
  const thumbnails = gallery.querySelector('.gallery-thumbnails');
  const links = [...thumbnails.querySelectorAll('a')];
  if (!links.length) continue;

  const preview = document.createElement('a');
  preview.className = 'gallery-preview';
  const previewImage = document.createElement('img');
  preview.append(previewImage);
  const caption = document.createElement('p');
  caption.className = 'gallery-caption';
  caption.setAttribute('aria-live', 'polite');
  thumbnails.before(preview, caption);

  const buttons = links.map(link => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', link.dataset.galleryTitle);
    const thumbnail = link.querySelector('img').cloneNode();
    thumbnail.alt = '';
    button.append(thumbnail);
    link.replaceWith(button);
    return button;
  });

  function selectImage(index) {
    const link = links[index];
    preview.href = link.href;
    preview.setAttribute('aria-label', `Enlarge ${link.dataset.galleryTitle}`);
    previewImage.src = link.href;
    previewImage.alt = link.querySelector('img').alt;
    caption.textContent = link.dataset.galleryTitle;
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
  }

  buttons.forEach((button, index) => button.addEventListener('click', () => selectImage(index)));
  selectImage(0);

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

  preview.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    image.src = preview.href;
    image.alt = previewImage.alt;
    dialog.showModal();
  });
}
