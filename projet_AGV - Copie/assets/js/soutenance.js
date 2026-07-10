/**
 * Page soutenance — navigation ancres, images, animations
 */
const SOUTENANCE_SECTIONS = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'objectifs', label: 'Objectifs' },
  { id: 'organisation', label: 'Organisation' },
  { id: 'mecanique', label: 'Mécanique' },
  { id: 'modelisation', label: 'Modélisation' },
  { id: 'etude-statique', label: 'Étude statique' },
  { id: 'etude-dynamique', label: 'Étude dynamique' },
  { id: 'simulation', label: 'Simulation' },
  { id: 'electronique', label: 'Électronique' },
  { id: 'resultats', label: 'Résultats' },
  { id: 'conclusion', label: 'Conclusion' }
];

const SOUTENANCE_IMAGES = {
  'partie mecanique': 'partie mecanique.jpg',
  'modelisation': 'modelisation.jpg',
  'etude statique': 'etude statique.jpg',
  'etude dynamique': 'etude dynamique.jpg',
  'simulation': 'simulation.jpg',
  'architecture electronique': 'architecture electronique.jpg'
};

function resolveImage(imgEl) {
  const base = imgEl.dataset.imageBase;
  if (!base) return;

  const known = SOUTENANCE_IMAGES[base];
  const candidates = known
    ? [known]
    : [`${base}.jpg`, `${base}.jpeg`, `${base}.png`, `${base}.webp`, base];

  let idx = 0;
  const placeholder = imgEl.closest('.slide-visual');

  imgEl.onerror = () => {
    idx++;
    if (idx < candidates.length) {
      imgEl.src = encodeURI(candidates[idx]);
    } else if (placeholder) {
      placeholder.innerHTML = `<div class="img-placeholder"><i class="fa-solid fa-image"></i><br>Image manquante : <strong>${base}</strong></div>`;
    }
  };
  imgEl.src = encodeURI(candidates[0]);
}

function initSoutenanceNav() {
  const topLinks = document.querySelectorAll('.soutenance-links a, .soutenance-sidebar a');
  const sections = SOUTENANCE_SECTIONS.map(s => document.getElementById(s.id)).filter(Boolean);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        topLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  sections.forEach(s => observer.observe(s));

  topLinks.forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function initScrollReveal() {
  const sections = document.querySelectorAll('.slide-section');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.08 });
  sections.forEach(s => observer.observe(s));
}

function initSoutenanceImages() {
  document.querySelectorAll('[data-image-base]').forEach(resolveImage);
}

function renderSoutenanceSidebar() {
  const el = document.getElementById('soutenance-sidebar');
  if (!el) return;
  el.innerHTML = SOUTENANCE_SECTIONS.map(s =>
    `<a href="#${s.id}">${s.label}</a>`
  ).join('');
}

function renderSoutenanceTopNav() {
  const el = document.getElementById('soutenance-top-links');
  if (!el) return;
  el.innerHTML = SOUTENANCE_SECTIONS.map(s =>
    `<li><a href="#${s.id}">${s.label}</a></li>`
  ).join('');
}

function initPhotoLightbox() {
  const lightbox = document.getElementById('photo-lightbox');
  if (!lightbox) return;

  const backdrop = lightbox.querySelector('.photo-lightbox-backdrop');
  const closeBtn = lightbox.querySelector('.photo-lightbox-close');
  const lightboxImg = lightbox.querySelector('.photo-lightbox-img');
  const lightboxCaption = lightbox.querySelector('.photo-lightbox-caption');

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lightboxImg.removeAttribute('src');
  }

  function openLightbox(img) {
    const title = img.closest('.photo-card')?.querySelector('.photo-title')?.textContent?.trim();
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt || '';
    lightboxCaption.textContent = title || img.alt || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  document.addEventListener('click', (e) => {
    const img = e.target.closest('.photo-grid--zoomable .photo-zoomable');
    if (img) {
      e.preventDefault();
      openLightbox(img);
    }
  });

  backdrop.addEventListener('click', closeLightbox);
  closeBtn.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderSoutenanceSidebar();
  renderSoutenanceTopNav();
  initSoutenanceNav();
  initScrollReveal();
  initSoutenanceImages();
  initPhotoLightbox();
});
