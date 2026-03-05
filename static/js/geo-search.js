document.addEventListener('DOMContentLoaded', function () {
  const openBtn = document.getElementById('openSearchModal');
  const overlay = document.getElementById('geoSearchOverlay');
  const closeBtn = document.getElementById('geoSearchClose');
  const form = document.getElementById('geoSearchForm');
  const countryInput = document.getElementById('geoCountry');
  const cityInput = document.getElementById('geoCity');
  const err = document.getElementById('geoSearchError');

  if (!overlay || !form) return;

  function norm(s) {
    s = (s || "").toString();
    if (s.normalize) s = s.normalize('NFD');
    return s.toLowerCase().replace(/[\u0300-\u036f]/g, '').trim();
  }

  function slugify(s) {
    return norm(s).replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  }

  // MODAL LOGIKA
  function showModal() {
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    if (err) { err.style.display = 'none'; err.textContent = ''; }
    if (countryInput) setTimeout(() => countryInput.focus(), 0);
  }

  function hideModal() {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
  }

  if (openBtn) openBtn.addEventListener('click', (e) => { e.preventDefault(); showModal(); });
  if (closeBtn) closeBtn.addEventListener('click', hideModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) hideModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && overlay.classList.contains('active')) hideModal(); });

  // BRISANJE NA KLIK (Ono što si tražio na početku)
  [countryInput, cityInput].forEach(input => {
    if (input) {
      input.addEventListener('focus', function() {
        this.value = ''; 
      });
    }
  });

  const countryMap = new Map();
  const cityMap = new Map();

  const dataEl = document.getElementById('geoSearchData');
  if (dataEl) {
    try {
      const data = JSON.parse(dataEl.textContent || "{}");
      data.countries?.forEach(item => countryMap.set(norm(item.name), item.url));
      data.cities?.forEach(item => cityMap.set(norm(item.name), item.url));
    } catch (_) {}
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const cVal = norm(countryInput.value);
    const ctVal = norm(cityInput.value);

    const cityUrl = cityMap.get(ctVal);
    const countryUrl = countryMap.get(cVal);

    if (cityUrl) { window.location.href = cityUrl; return; }
    if (countryUrl) { window.location.href = countryUrl; return; }

    // Fallback ako nije iz liste
    const ctSlug = slugify(cityInput.value);
    const cSlug = slugify(countryInput.value);
    if (ctSlug) window.location.href = `/cities/${ctSlug}/`;
    else if (cSlug) window.location.href = `/countries/${cSlug}/`;
  });
});