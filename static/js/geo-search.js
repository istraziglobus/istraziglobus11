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
    return s
      .toLowerCase()
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  function slugify(s) {
    return norm(s)
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

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

  if (openBtn) {
    openBtn.addEventListener('click', function (e) {
      e.preventDefault();
      showModal();
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', hideModal);

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) hideModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('active')) hideModal();
  });

  // Pokušaj učitati mapu iz geoSearchData (ako si je dodao u baseof.html)
  const countryMap = new Map();
  const cityMap = new Map();

  const dataEl = document.getElementById('geoSearchData');
  if (dataEl) {
    try {
      const data = JSON.parse(dataEl.textContent || "{}");
      if (Array.isArray(data.countries)) {
        data.countries.forEach(item => {
          if (item && item.name && item.url) countryMap.set(norm(item.name), item.url);
        });
      }
      if (Array.isArray(data.cities)) {
        data.cities.forEach(item => {
          if (item && item.name && item.url) cityMap.set(norm(item.name), item.url);
        });
      }
    } catch (_) {
      // ignorisi, radiće fallback preko slugify
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const cRaw = countryInput ? countryInput.value : "";
    const ctRaw = cityInput ? cityInput.value : "";

    const c = norm(cRaw);
    const ct = norm(ctRaw);

    // 1) tačan URL iz mape
    const cityUrlExact = ct ? cityMap.get(ct) : null;
    const countryUrlExact = c ? countryMap.get(c) : null;

    if (cityUrlExact) { window.location.href = cityUrlExact; return; }
    if (countryUrlExact) { window.location.href = countryUrlExact; return; }

    // 2) fallback URL (radi i bez geoSearchData)
    const citySlug = slugify(ctRaw);
    const countrySlug = slugify(cRaw);

    if (citySlug) { window.location.href = `/cities/${citySlug}/`; return; }
    if (countrySlug) { window.location.href = `/countries/${countrySlug}/`; return; }

    if (err) {
      err.textContent = "Izaberi državu ili grad iz liste.";
      err.style.display = "block";
    }
  });
});