/**
 * Composants partagés : navigation, footer, utilitaires
 */
function renderNav(activePage) {
  const vitrine = SITE_CONFIG.nav.filter(n => n.section === 'vitrine');

  const vitrineLinks = vitrine.map(n =>
    `<li><a href="${n.href}"${n.href === activePage ? ' class="active"' : ''}>${n.label}</a></li>`
  ).join('');

  return `
    <nav class="site-nav" aria-label="Navigation principale">
      <div class="container nav-inner">
        <a href="index.html" class="nav-brand">
          <span class="nav-brand-title">${SITE_CONFIG.title}</span>
          <span class="nav-brand-sub">${SITE_CONFIG.subtitle}</span>
        </a>
        <button class="nav-toggle" aria-label="Menu" aria-expanded="false">
          <i class="fa-solid fa-bars"></i>
        </button>
        <div class="nav-menu">
          <ul class="nav-links">
            ${vitrineLinks}
          </ul>
        </div>
        <div class="nav-cta">
          <a href="documents.html" class="btn btn-primary btn-sm">
            <i class="fa-solid fa-folder-open"></i> Documents
          </a>
        </div>
      </div>
    </nav>`;
}

function renderFooter() {
  return `
    <footer class="site-footer">
      <div class="container">
        <p>Projet AGV — Mécatronique 4e année — ICAM</p>
        <p style="margin-top:0.5rem">
          <a href="documents.html">Documents</a> ·
          <a href="galerie.html">Galerie</a> ·
          <a href="simulateur/index.html">Simulateur legacy</a>
        </p>
      </div>
    </footer>`;
}

function initSite(activePage) {
  const navEl = document.getElementById('site-nav');
  const footerEl = document.getElementById('site-footer');
  if (navEl) navEl.innerHTML = renderNav(activePage);
  if (footerEl) footerEl.innerHTML = renderFooter();

  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
  }
}

function renderDocuments(containerId, filterCategory) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const categories = [...new Set(SITE_CONFIG.documents.map(d => d.category))];
  const catLabels = {
    presentation: 'Présentation', cahier: 'Cahier des charges', conception: 'Conception',
    budget: 'Budget / Matériel', planning: 'Planning', equipe: 'Équipe',
    lidar: 'Essais LiDAR', code: 'Code source'
  };

  let filtersHtml = `<button class="doc-filter active" data-cat="all">Tous</button>`;
  categories.forEach(c => {
    filtersHtml += `<button class="doc-filter" data-cat="${c}">${catLabels[c] || c}</button>`;
  });

  const docsHtml = SITE_CONFIG.documents.map(d => `
    <article class="card doc-card" data-category="${d.category}">
      <div class="doc-card-icon">${getFileIcon(d.type)}</div>
      <h3 class="card-title">${d.title}</h3>
      <span class="tag">${d.type}</span>
      <p style="font-size:0.85rem;color:var(--muted);margin:0.5rem 0">${d.desc}</p>
      <div class="doc-card-actions">
        <a href="${encodeURI(d.file)}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm">
          <i class="fa-solid fa-eye"></i> Voir
        </a>
        <a href="${encodeURI(d.file)}" download class="btn btn-outline btn-sm" style="color:var(--primary);border-color:var(--border)">
          <i class="fa-solid fa-download"></i>
        </a>
      </div>
    </article>`).join('');

  container.innerHTML = `
    <div class="doc-filters">${filtersHtml}</div>
    <div class="doc-grid">${docsHtml}</div>`;

  container.querySelectorAll('.doc-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.doc-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      container.querySelectorAll('.doc-card').forEach(card => {
        card.style.display = (cat === 'all' || card.dataset.category === cat) ? '' : 'none';
      });
    });
  });

  if (filterCategory) {
    const btn = container.querySelector(`[data-cat="${filterCategory}"]`);
    if (btn) btn.click();
  }
}

function renderGallery(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const tags = [...new Set(SITE_CONFIG.gallery.map(g => g.tag))];
  const tagLabels = {
    prototype: 'Prototype', mecanique: 'Mécanique', electronique: 'Électronique',
    lidar: 'LiDAR', test: 'Tests', equipe: 'Équipe', planning: 'Planning', logiciel: 'Logiciel'
  };

  let filtersHtml = `<button class="doc-filter active" data-tag="all">Tous</button>`;
  tags.forEach(t => {
    filtersHtml += `<button class="doc-filter" data-tag="${t}">${tagLabels[t] || t}</button>`;
  });

  const itemsHtml = SITE_CONFIG.gallery.map(g => {
    const media = g.type === 'video'
      ? `<video src="${encodeURI(g.src)}" controls playsinline preload="metadata"></video>`
      : `<img src="${encodeURI(g.src)}" alt="${g.title}" loading="lazy">`;
    return `
    <figure class="card gallery-item" data-tag="${g.tag}">
      <figcaption class="photo-title">${g.title}</figcaption>
      ${media}
      <p class="photo-desc">${g.desc}</p>
    </figure>`;
  }).join('');

  container.innerHTML = `
    <div class="gallery-filters">${filtersHtml}</div>
    <div class="gallery-grid">${itemsHtml}</div>`;

  container.querySelectorAll('.gallery-filters .doc-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.gallery-filters .doc-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tag = btn.dataset.tag;
      container.querySelectorAll('.gallery-item').forEach(item => {
        item.style.display = (tag === 'all' || item.dataset.tag === tag) ? '' : 'none';
      });
    });
  });
}

function getFileIcon(type) {
  const icons = { PDF: '📄', DOCX: '📝', PPTX: '📊', STEP: '🔧', EASM: '🔧', HTML: '🌐', Image: '🖼️', 'Vidéo': '🎬' };
  return icons[type] || '📁';
}
