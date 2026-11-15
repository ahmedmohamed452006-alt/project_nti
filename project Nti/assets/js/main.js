// BUNYORA - Main Frontend Controller (HTML5 + Bootstrap 5 + Vanilla JS)
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;

  // Global Sticky Header Scroll Effect
  const header = document.querySelector(".site-header");
  if (header) {
    window.addEventListener("scroll", () => {
      header.classList.toggle("scrolled", window.scrollY > 30);
    }, { passive: true });
  }

  // Navbar Theme Toggle Button (syncs with preferences.js)
  const navThemeBtn = document.getElementById("nav-theme-toggle-btn");
  if (navThemeBtn) {
    navThemeBtn.addEventListener("click", () => {
      const dockBtn = document.getElementById("mh-theme-toggle");
      if (dockBtn) dockBtn.click();
    });
  }

  // Scroll Reveal Observer
  const revealEls = document.querySelectorAll(".reveal-on-scroll");
  if (revealEls.length > 0 && "IntersectionObserver" in window) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => revealObs.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("revealed"));
  }

  // Render Engineer Card HTML helper
  function createEngineerCard(e, includeQuickView = false) {
    return `
      <div class="col-md-6 col-lg-4 engineer-item" data-specialty="${e.specialty}">
        <article class="engineer-card">
          <div class="engineer-card-top">
            <img class="avatar" src="${e.photo_url}" alt="صورة ${e.full_name}">
            <div class="flex-grow-1 min-w-0">
              <h3 class="engineer-name">${e.full_name}</h3>
              <p class="engineer-specialty">${e.specialty_ar}</p>
              <div class="card-meta">
                <span>⌖ ${e.city}، ${e.governorate}</span>
                <span>◷ ${e.years_experience} سنوات خبرة</span>
              </div>
              ${e.verified ? '<span class="verified-badge">✓ مهندس موثّق بنقابة المهندسين</span>' : '<span class="demo-tag">ملف تجريبي</span>'}
            </div>
          </div>
          <div class="engineer-card-body">
            <p class="engineer-bio">${e.bio}</p>
            <div class="d-flex align-items-center justify-content-between mt-3 pt-2 border-top">
              <span class="card-rating">★ <b>${Number(e.avg_rating).toFixed(1)}</b> <span class="text-muted fw-normal">(${e.review_count} تقييم)</span></span>
              <span class="small text-muted fw-bold">${e.services ? e.services.length : e.service_count} خدمات متاحة</span>
            </div>
            <div class="card-actions">
              ${includeQuickView ? `<button type="button" class="btn-bunyora btn-bunyora-outline quick-view-eng-btn" data-eng-id="${e.id}">👁️ معاينة</button>` : ""}
              <a class="btn-bunyora btn-bunyora-soft" href="engineer.html?id=${e.id}">شوف الملف</a>
              <a class="btn-bunyora btn-bunyora-primary" href="request.html?specialty=${e.specialty}&engineer=${e.id}">اطلب عروض</a>
            </div>
          </div>
        </article>
      </div>
    `;
  }

  // ==========================================
  // 1. HOME PAGE INTERACTIVE FEATURES
  // ==========================================
  if (page === "home") {
    // A. Hero Smart Finder
    const finderTabs = document.querySelectorAll(".finder-tab");
    const finderCategorySelect = document.getElementById("finder-category");
    const finderGovSelect = document.getElementById("finder-gov");
    const finderForm = document.getElementById("hero-finder-form");
    let currentFinderTarget = "engineers";

    if (finderGovSelect) {
      window.BUNYORA_DATA.governorates.forEach(g => {
        finderGovSelect.insertAdjacentHTML("beforeend", `<option value="${g}">${g}</option>`);
      });
    }

    function populateFinderOptions(target) {
      currentFinderTarget = target;
      if (!finderCategorySelect) return;
      if (target === "engineers") {
        finderCategorySelect.innerHTML = `<option value="">كل التخصصات الهندسية</option>` +
          window.BUNYORA_DATA.categories.map(c => `<option value="${c.slug}">${c.name_ar}</option>`).join("");
      } else if (target === "workers") {
        const trades = [...new Set(window.BUNYORA_DATA.workers.map(w => w.trade))];
        finderCategorySelect.innerHTML = `<option value="">كل المهن والصنايعية</option>` +
          trades.map(t => `<option value="${t}">${t}</option>`).join("");
      } else if (target === "suppliers") {
        const cats = [...new Set(window.BUNYORA_DATA.suppliers.map(s => s.category))];
        finderCategorySelect.innerHTML = `<option value="">كل الخامات والمحلات</option>` +
          cats.map(c => `<option value="${c}">${c}</option>`).join("");
      }
    }

    finderTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        finderTabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        populateFinderOptions(tab.dataset.target);
      });
    });
    populateFinderOptions("engineers");

    finderForm?.addEventListener("submit", e => {
      e.preventDefault();
      const cat = finderCategorySelect?.value || "";
      const gov = finderGovSelect?.value || "";
      if (currentFinderTarget === "engineers") {
        const qs = new URLSearchParams();
        if (cat) qs.set("specialty", cat);
        if (gov) qs.set("governorate", gov);
        window.location.href = `engineers.html${qs.toString() ? "?" + qs.toString() : ""}`;
      } else if (currentFinderTarget === "workers") {
        window.location.href = `workers.html`;
      } else {
        window.location.href = `suppliers.html`;
      }
    });

    // B. Animated Live Statistics Counters
    const counters = document.querySelectorAll("[data-counter-target]");
    if (counters.length > 0 && "IntersectionObserver" in window) {
      const counterObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = Number(el.dataset.counterTarget);
            const suffix = el.dataset.counterSuffix || "";
            const duration = 1500;
            const startTime = performance.now();

            function tick(now) {
              const progress = Math.min((now - startTime) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              el.textContent = "+" + Math.floor(eased * target).toLocaleString("ar-EG") + suffix;
              if (progress < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
            counterObs.unobserve(el);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(c => counterObs.observe(c));
    }

    // C. Engineering Specialties Pills
    const pillsContainer = document.getElementById("home-specialty-pills");
    if (pillsContainer) {
      pillsContainer.innerHTML = window.BUNYORA_DATA.categories.map(c => `
        <div class="col-6 col-md-4 col-lg-3">
          <a href="engineers.html?specialty=${c.slug}" class="specialty-pill">
            <span>${c.icon}</span>
            <b>${c.name_ar}</b>
            <small>${c.engineer_count} مهندس</small>
          </a>
        </div>
      `).join("");
    }

    // D. Featured Engineers Grid + Filter Tabs + Quick View Modal
    const featuredGrid = document.getElementById("home-featured-engineers");
    const engFilterBtns = document.querySelectorAll(".home-filter-btn");

    function renderHomeEngineers(filterSlug = "all") {
      if (!featuredGrid) return;
      const list = filterSlug === "all"
        ? window.BUNYORA_DATA.engineers
        : window.BUNYORA_DATA.engineers.filter(e => e.specialty === filterSlug);

      featuredGrid.innerHTML = list.map(e => createEngineerCard(e, true)).join("");

      // Attach Quick View Modal Listeners
      featuredGrid.querySelectorAll(".quick-view-eng-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const engId = Number(btn.dataset.engId);
          const eng = window.BUNYORA_DATA.engineers.find(item => item.id === engId);
          if (!eng) return;

          document.getElementById("qv-avatar").src = eng.photo_url;
          document.getElementById("qv-name").textContent = eng.full_name;
          document.getElementById("qv-specialty").textContent = eng.specialty_ar;
          document.getElementById("qv-meta").textContent = `⌖ ${eng.city}، ${eng.governorate} • ◷ ${eng.years_experience} سنوات خبرة • ★ ${eng.avg_rating}`;
          document.getElementById("qv-bio").textContent = eng.bio;
          document.getElementById("qv-uni").textContent = eng.university;
          document.getElementById("qv-services").innerHTML = (eng.services || []).map(s => `
            <div class="d-flex justify-content-between align-items-center py-2 border-bottom small">
              <div>
                <b class="d-block text-dark">${s.title}</b>
                <span class="text-muted">${s.desc}</span>
              </div>
              <span class="badge-status badge-green">${window.BunyoraHelpers.formatMoney(s.price)}</span>
            </div>
          `).join("");
          document.getElementById("qv-profile-link").href = `engineer.html?id=${eng.id}`;
          document.getElementById("qv-request-link").href = `request.html?specialty=${eng.specialty}&engineer=${eng.id}`;

          const modalEl = document.getElementById("engineerQuickViewModal");
          if (modalEl && window.bootstrap) {
            const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
            modal.show();
          }
        });
      });
    }

    engFilterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        engFilterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderHomeEngineers(btn.dataset.filter);
      });
    });
    renderHomeEngineers("all");

    // E. Interactive Project Cost & Finishing Estimator
    const areaRange = document.getElementById("est-area-range");
    const areaDisplay = document.getElementById("est-area-val");
    const tierBtns = document.querySelectorAll(".tier-btn");
    const totalOut = document.getElementById("est-total-cost");
    const designOut = document.getElementById("est-design-cost");
    const foundationOut = document.getElementById("est-foundation-cost");
    const finishOut = document.getElementById("est-finish-cost");
    const durationOut = document.getElementById("est-duration");
    const estRequestLink = document.getElementById("est-request-btn");

    let currentTierRate = 4800; // Default Super Lux per m2
    let currentTierName = "تشطيب سوبر لوكس متكامل";

    function updateEstimator() {
      if (!areaRange) return;
      const area = Number(areaRange.value);
      areaDisplay.textContent = `${area} م²`;

      const total = area * currentTierRate;
      const designCost = Math.round(total * 0.08);
      const foundationCost = Math.round(total * 0.42);
      const finishCost = total - designCost - foundationCost;
      const weeks = Math.max(3, Math.round((area / 25) * (currentTierRate > 1000 ? 1.4 : 0.5)));

      totalOut.textContent = total.toLocaleString("ar-EG") + " ج.م";
      designOut.textContent = designCost.toLocaleString("ar-EG") + " ج.م";
      foundationOut.textContent.includes && (foundationOut.textContent = foundationCost.toLocaleString("ar-EG") + " ج.م");
      finishOut.textContent = finishCost.toLocaleString("ar-EG") + " ج.م";
      durationOut.textContent = `${weeks} إلى ${weeks + 2} أسابيع عمل`;

      if (estRequestLink) {
        estRequestLink.href = `request.html?service=${encodeURIComponent(currentTierName + " - مساحة " + area + " م²")}`;
      }
    }

    tierBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        tierBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentTierRate = Number(btn.dataset.rate);
        currentTierName = btn.dataset.name;
        updateEstimator();
      });
    });

    areaRange?.addEventListener("input", updateEstimator);
    updateEstimator();

    // F. Footer Newsletter Subscription Form (Persists to MySQL via API)
    const newsForm = document.getElementById("footer-newsletter-form");
    newsForm?.addEventListener("submit", e => {
      e.preventDefault();
      const btn = newsForm.querySelector("button[type='submit']");
      const input = newsForm.querySelector("input");
      const email = input?.value || "";
      fetch("api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      }).catch(() => {});
      if (btn) {
        btn.textContent = "✓ تم الاشتراك بنجاح!";
        btn.disabled = true;
      }
      if (input) input.value = "";
    });
  }

  // ==========================================
  // 2. ENGINEERS DIRECTORY PAGE
  // ==========================================
  if (page === "engineers") {
    const specSelect = document.getElementById("filter-specialty");
    const govSelect = document.getElementById("filter-governorate");
    const searchInput = document.getElementById("filter-q");
    const expSelect = document.getElementById("filter-years");
    const verifiedCheck = document.getElementById("filter-verified");
    const sortSelect = document.getElementById("filter-sort");
    const resetBtn = document.getElementById("filter-reset");
    const resultsGrid = document.getElementById("engineers-grid");
    const countEl = document.getElementById("engineers-count");

    window.BUNYORA_DATA.categories.forEach(c => {
      specSelect?.insertAdjacentHTML("beforeend", `<option value="${c.slug}">${c.name_ar}</option>`);
    });
    window.BUNYORA_DATA.governorates.forEach(g => {
      govSelect?.insertAdjacentHTML("beforeend", `<option value="${g}">${g}</option>`);
    });

    const params = new URLSearchParams(window.location.search);
    if (params.get("specialty") && specSelect) specSelect.value = params.get("specialty");
    if (params.get("governorate") && govSelect) govSelect.value = params.get("governorate");
    if (params.get("q") && searchInput) searchInput.value = params.get("q");

    function renderEngineers() {
      const q = (searchInput?.value || "").trim().toLowerCase();
      const spec = specSelect?.value || "";
      const gov = govSelect?.value || "";
      const minYears = Number(expSelect?.value || 0);
      const onlyVerified = verifiedCheck?.checked || false;
      const sort = sortSelect?.value || "relevant";

      let filtered = window.BUNYORA_DATA.engineers.filter(e => {
        if (spec && e.specialty !== spec) return false;
        if (gov && e.governorate !== gov) return false;
        if (minYears && e.years_experience < minYears) return false;
        if (onlyVerified && !e.verified) return false;
        if (q && !(e.full_name.toLowerCase().includes(q) || e.specialty_ar.toLowerCase().includes(q) || e.bio.toLowerCase().includes(q) || e.city.toLowerCase().includes(q))) {
          return false;
        }
        return true;
      });

      if (sort === "rating") filtered.sort((a, b) => b.avg_rating - a.avg_rating);
      if (sort === "experience") filtered.sort((a, b) => b.years_experience - a.years_experience);

      if (countEl) countEl.textContent = `${filtered.length} مهندس متاح`;
      if (filtered.length === 0) {
        resultsGrid.innerHTML = `
          <div class="col-12">
            <div class="panel-card text-center py-5">
              <div class="fs-1 mb-2">🔎</div>
              <h4 class="fw-bold">لا توجد نتائج مطابقة للبحث</h4>
              <p class="text-muted small mb-3">جرّب تغيير التخصص أو المحافظة لعرض مهندسين أكثر.</p>
              <button type="button" class="btn-bunyora btn-bunyora-outline" id="empty-reset-btn">إعادة ضبط الفلاتر</button>
            </div>
          </div>
        `;
        document.getElementById("empty-reset-btn")?.addEventListener("click", resetFilters);
      } else {
        resultsGrid.innerHTML = filtered.map(e => createEngineerCard(e, false)).join("");
      }
    }

    function resetFilters() {
      if (searchInput) searchInput.value = "";
      if (specSelect) specSelect.value = "";
      if (govSelect) govSelect.value = "";
      if (expSelect) expSelect.value = "";
      if (verifiedCheck) verifiedCheck.checked = false;
      if (sortSelect) sortSelect.value = "relevant";
      renderEngineers();
    }

    [specSelect, govSelect, expSelect, verifiedCheck, sortSelect].forEach(el => el?.addEventListener("change", renderEngineers));
    searchInput?.addEventListener("input", renderEngineers);
    resetBtn?.addEventListener("click", resetFilters);
    renderEngineers();
  }

  // ==========================================
  // 3. ENGINEER PROFILE PAGE
  // ==========================================
  if (page === "engineer-profile") {
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id")) || 1;
    const eng = window.BUNYORA_DATA.engineers.find(e => e.id === id) || window.BUNYORA_DATA.engineers[0];

    document.title = `${eng.full_name} | BUNYORA`;
    document.getElementById("prof-avatar").src = eng.photo_url;
    document.getElementById("prof-name").textContent = eng.full_name;
    document.getElementById("prof-specialty").textContent = eng.specialty_ar;
    document.getElementById("prof-location").textContent = `${eng.city}، ${eng.governorate}`;
    document.getElementById("prof-exp").textContent = `${eng.years_experience} سنوات خبرة`;
    document.getElementById("prof-rating").textContent = `${eng.avg_rating} (${eng.review_count} تقييم)`;
    document.getElementById("prof-uni").textContent = eng.university;
    document.getElementById("prof-bio").textContent = eng.bio;
    document.getElementById("prof-request-btn").href = `request.html?specialty=${eng.specialty}&engineer=${eng.id}`;

    document.getElementById("prof-services").innerHTML = eng.services.map(s => `
      <div class="service-row">
        <div>
          <strong class="d-block">${s.title}</strong>
          <small class="text-muted">${s.desc}</small>
        </div>
        <div class="text-start">
          <span class="service-price d-block">${window.BunyoraHelpers.formatMoney(s.price)}</span>
          <a href="request.html?specialty=${eng.specialty}&service=${encodeURIComponent(s.title)}" class="small text-link">اطلب الخدمة ←</a>
        </div>
      </div>
    `).join("");

    document.getElementById("prof-projects").innerHTML = eng.projects.map(p => `
      <div class="col-md-6">
        <div class="p-3 border rounded-4 h-100 bg-light-subtle">
          <span class="badge-status badge-green mb-2">${p.category}</span>
          <h6 class="fw-bold mb-1">${p.title}</h6>
          <p class="text-muted small mb-0">${p.desc}</p>
        </div>
      </div>
    `).join("");

    document.getElementById("prof-reviews").innerHTML = eng.reviews.map(r => `
      <div class="py-3 border-bottom">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <strong class="small">${r.author}</strong>
          <span class="card-rating">★ ${r.rating}.0 <small class="text-muted ms-2">${r.date}</small></span>
        </div>
        <p class="text-muted small mb-0">${r.comment}</p>
      </div>
    `).join("");
  }

  // ==========================================
  // 4. WORKERS DIRECTORY PAGE
  // ==========================================
  if (page === "workers") {
    const list = window.BUNYORA_DATA.workers;
    const groupsContainer = document.getElementById("workers-groups");
    const gridContainer = document.getElementById("workers-grid");
    const searchInput = document.getElementById("workers-search");
    const detailPanel = document.getElementById("worker-detail-panel");
    const countBadge = document.getElementById("workers-count");

    let activeGroup = "الكل";
    let selectedWorker = list[0];
    const groups = ["الكل", ...new Set(list.map(w => w.group))];

    function renderGroups() {
      groupsContainer.innerHTML = groups.map(g => `
        <button type="button" class="${g === activeGroup ? 'active' : ''}" data-group="${g}">${g}</button>
      `).join("");
      groupsContainer.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", () => {
          activeGroup = btn.dataset.group;
          renderGroups();
          renderWorkers();
        });
      });
    }

    function renderDetail(w) {
      if (!w || !detailPanel) return;
      detailPanel.innerHTML = `
        <div class="row g-4 align-items-center">
          <div class="col-lg-8">
            <span class="section-kicker">${w.group}</span>
            <h3 class="fw-bold mt-1 mb-2">${w.icon} ${w.name} — <span class="text-success fs-5">${w.trade}</span></h3>
            <p class="text-muted small mb-2">⌖ ${w.city} | ◷ ${w.experience} | ★ ${w.rating}</p>
            <p class="mb-3">${w.summary}</p>
            <div class="d-flex flex-wrap gap-2">
              ${w.tags.map(t => `<span class="badge-status badge-green">${t}</span>`).join("")}
            </div>
          </div>
          <div class="col-lg-4">
            <div class="p-3 rounded-4 border bg-white">
              <b class="d-block mb-1">تواصل مباشر أو اطلب معاينة</b>
              <p class="text-muted small mb-3">يمكنك الاتصال المباشر بالفني أو إرسال طلب خدمة لتحديد موعد معاينة.</p>
              <div class="d-grid gap-2">
                <a href="tel:${w.phone}" class="btn-bunyora btn-bunyora-primary">📞 اتصل الآن (${w.phone})</a>
                <a href="request.html?service=${encodeURIComponent(w.trade)}" class="btn-bunyora btn-bunyora-outline">اطلب معاينة للموقع</a>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    function renderWorkers() {
      const q = (searchInput?.value || "").trim().toLowerCase();
      const filtered = list.filter(w => {
        if (activeGroup !== "الكل" && w.group !== activeGroup) return false;
        if (q && !(w.name.toLowerCase().includes(q) || w.trade.toLowerCase().includes(q) || w.summary.toLowerCase().includes(q) || w.city.toLowerCase().includes(q))) return false;
        return true;
      });

      if (countBadge) countBadge.textContent = filtered.length;
      gridContainer.innerHTML = filtered.map(w => `
        <div class="col-md-6 col-lg-4">
          <div class="directory-card ${selectedWorker?.id === w.id ? 'selected' : ''}" data-id="${w.id}">
            <div class="directory-card-icon">${w.icon}</div>
            <div class="directory-card-copy">
              <b>${w.name}</b>
              <small>${w.trade} • ${w.city}</small>
              <span>${w.summary}</span>
              <em>عرض التفاصيل ورقم التواصل ←</em>
            </div>
          </div>
        </div>
      `).join("");

      gridContainer.querySelectorAll(".directory-card").forEach(card => {
        card.addEventListener("click", () => {
          const id = Number(card.dataset.id);
          selectedWorker = list.find(item => item.id === id);
          renderWorkers();
          renderDetail(selectedWorker);
          detailPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
      });

      if (filtered.length > 0 && (!selectedWorker || !filtered.some(f => f.id === selectedWorker.id))) {
        selectedWorker = filtered[0];
      }
      renderDetail(selectedWorker);
    }

    searchInput?.addEventListener("input", renderWorkers);
    renderGroups();
    renderWorkers();
  }

  // ==========================================
  // 5. SUPPLIERS DIRECTORY PAGE
  // ==========================================
  if (page === "suppliers") {
    const list = window.BUNYORA_DATA.suppliers;
    const groupsContainer = document.getElementById("suppliers-groups");
    const gridContainer = document.getElementById("suppliers-grid");
    const searchInput = document.getElementById("suppliers-search");
    const detailPanel = document.getElementById("supplier-detail-panel");
    const countBadge = document.getElementById("suppliers-count");

    let activeGroup = "الكل";
    let selectedSupplier = list[0];
    const groups = ["الكل", ...new Set(list.map(s => s.group))];

    function renderGroups() {
      groupsContainer.innerHTML = groups.map(g => `
        <button type="button" class="${g === activeGroup ? 'active' : ''}" data-group="${g}">${g}</button>
      `).join("");
      groupsContainer.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", () => {
          activeGroup = btn.dataset.group;
          renderGroups();
          renderSuppliers();
        });
      });
    }

    function renderDetail(s) {
      if (!s || !detailPanel) return;
      detailPanel.innerHTML = `
        <div class="row g-4 align-items-center">
          <div class="col-lg-8">
            <span class="section-kicker">${s.group}</span>
            <h3 class="fw-bold mt-1 mb-2">${s.icon} ${s.name}</h3>
            <p class="text-muted small mb-2">⌖ ${s.city} | 🚚 ${s.delivery}</p>
            <p class="mb-3">${s.summary}</p>
            <div class="d-flex flex-wrap gap-2">
              ${s.tags.map(t => `<span class="badge-status badge-green">${t}</span>`).join("")}
            </div>
          </div>
          <div class="col-lg-4">
            <div class="p-3 rounded-4 border bg-white">
              <b class="d-block mb-1">استفسر عن الأسعار والتوريد</b>
              <p class="text-muted small mb-3">تواصل مع المعرض أو المورد للاستفسار عن الخامات المتاحة وأسعار التوريد للموقع.</p>
              <div class="d-grid gap-2">
                <a href="tel:${s.phone}" class="btn-bunyora btn-bunyora-primary">📞 تواصل مع المورد (${s.phone})</a>
                <a href="register.html?type=supplier" class="btn-bunyora btn-bunyora-outline">سجّل محلك في الدليل</a>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    function renderSuppliers() {
      const q = (searchInput?.value || "").trim().toLowerCase();
      const filtered = list.filter(s => {
        if (activeGroup !== "الكل" && s.group !== activeGroup) return false;
        if (q && !(s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q) || s.summary.toLowerCase().includes(q) || s.city.toLowerCase().includes(q))) return false;
        return true;
      });

      if (countBadge) countBadge.textContent = filtered.length;
      gridContainer.innerHTML = filtered.map(s => `
        <div class="col-md-6 col-lg-4">
          <div class="directory-card ${selectedSupplier?.id === s.id ? 'selected' : ''}" data-id="${s.id}">
            <div class="directory-card-icon">${s.icon}</div>
            <div class="directory-card-copy">
              <b>${s.name}</b>
              <small>${s.category} • ${s.city}</small>
              <span>${s.summary}</span>
              <em>عرض المنتجات وبيانات التواصل ←</em>
            </div>
          </div>
        </div>
      `).join("");

      gridContainer.querySelectorAll(".directory-card").forEach(card => {
        card.addEventListener("click", () => {
          const id = Number(card.dataset.id);
          selectedSupplier = list.find(item => item.id === id);
          renderSuppliers();
          renderDetail(selectedSupplier);
          detailPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
      });

      if (filtered.length > 0 && (!selectedSupplier || !filtered.some(f => f.id === selectedSupplier.id))) {
        selectedSupplier = filtered[0];
      }
      renderDetail(selectedSupplier);
    }

    searchInput?.addEventListener("input", renderSuppliers);
    renderGroups();
    renderSuppliers();
  }

  // ==========================================
  // 6. SERVICE REQUEST WIZARD (3 Steps)
  // ==========================================
  if (page === "request") {
    let currentStep = 1;
    const stepPanes = document.querySelectorAll(".wizard-step");
    const progressBars = document.querySelectorAll(".request-progress span");
    const stepLabel = document.getElementById("wizard-step-label");
    const specSelect = document.getElementById("req-specialty");
    const govSelect = document.getElementById("req-governorate");

    window.BUNYORA_DATA.categories.forEach(c => {
      specSelect?.insertAdjacentHTML("beforeend", `<option value="${c.slug}">${c.name_ar}</option>`);
    });
    window.BUNYORA_DATA.governorates.forEach(g => {
      govSelect?.insertAdjacentHTML("beforeend", `<option value="${g}">${g}</option>`);
    });

    const params = new URLSearchParams(window.location.search);
    if (params.get("specialty") && specSelect) specSelect.value = params.get("specialty");
    if (params.get("service")) {
      const titleInput = document.getElementById("req-title");
      if (titleInput) titleInput.value = params.get("service");
    }

    document.querySelectorAll(".request-option").forEach(opt => {
      opt.addEventListener("click", () => {
        const group = opt.dataset.group;
        document.querySelectorAll(`.request-option[data-group="${group}"]`).forEach(el => el.classList.remove("active"));
        opt.classList.add("active");
        const hiddenInput = document.getElementById(`req-${group}`);
        if (hiddenInput) hiddenInput.value = opt.dataset.value;
      });
    });

    function showStep(step) {
      currentStep = step;
      stepPanes.forEach(pane => {
        pane.hidden = Number(pane.dataset.step) !== currentStep;
      });
      progressBars.forEach((bar, idx) => {
        bar.classList.toggle("active", idx < currentStep);
      });
      if (stepLabel) stepLabel.textContent = `الخطوة ${currentStep} من 3`;
    }

    document.querySelectorAll("[data-next-step]").forEach(btn => {
      btn.addEventListener("click", () => showStep(Number(btn.dataset.nextStep)));
    });
    document.querySelectorAll("[data-prev-step]").forEach(btn => {
      btn.addEventListener("click", () => showStep(Number(btn.dataset.prevStep)));
    });

    const form = document.getElementById("request-wizard-form");
    form?.addEventListener("submit", e => {
      e.preventDefault();
      const specSlug = specSelect.value || "architecture";
      const catObj = window.BUNYORA_DATA.categories.find(c => c.slug === specSlug);
      const newReq = {
        id: Math.floor(200 + Math.random() * 800),
        title: document.getElementById("req-title").value || "طلب خدمة هندسية",
        specialty: specSlug,
        specialty_ar: catObj ? catObj.name_ar : "هندسة معمارية",
        governorate: govSelect.value || "القاهرة",
        city: document.getElementById("req-city").value || "التجمع الخامس",
        area: (document.getElementById("req-area").value || "200") + " م²",
        budget: document.getElementById("req-budget").value || "يحدد بعد المعاينة",
        status: "open",
        created_at: new Date().toISOString().slice(0, 10),
        customer_name: document.getElementById("req-name").value || "عميل BUNYORA",
        description: document.getElementById("req-desc").value || "مطلوب عرض سعر فني ومالي للمشروع.",
        offers: []
      };
      window.BunyoraHelpers.saveRequest(newReq);
      document.getElementById("wizard-form-container").hidden = true;
      document.getElementById("wizard-success-box").hidden = false;
      document.getElementById("created-req-id").textContent = `#${newReq.id}`;
    });
  }

  // ==========================================
  // 7. REGISTER PAGE
  // ==========================================
  if (page === "register") {
    const roleCards = document.querySelectorAll(".role-option");
    const roleFields = document.querySelectorAll(".role-specific-fields");
    const roleTitle = document.getElementById("reg-role-title");
    const specSelect = document.getElementById("reg-specialty");
    const govSelect = document.getElementById("reg-governorate");

    window.BUNYORA_DATA.categories.forEach(c => {
      specSelect?.insertAdjacentHTML("beforeend", `<option value="${c.slug}">${c.name_ar}</option>`);
    });
    window.BUNYORA_DATA.governorates.forEach(g => {
      govSelect?.insertAdjacentHTML("beforeend", `<option value="${g}">${g}</option>`);
    });

    const roleNames = {
      customer: "بيانات حساب العميل",
      engineer: "بيانات حساب المهندس (يتطلب إثبات المؤهل)",
      worker: "بيانات حساب الصنايعي / الفني",
      supplier: "بيانات حساب المحل / المورد"
    };

    function setRole(role) {
      roleCards.forEach(c => c.classList.toggle("active", c.dataset.role === role));
      roleFields.forEach(f => {
        f.hidden = f.dataset.forRole !== role;
      });
      if (roleTitle) roleTitle.textContent = roleNames[role] || "بيانات الحساب";
    }

    roleCards.forEach(card => {
      card.addEventListener("click", () => setRole(card.dataset.role));
    });

    const params = new URLSearchParams(window.location.search);
    const initialRole = params.get("type") || "customer";
    setRole(initialRole);

    const regForm = document.getElementById("register-form");
    regForm?.addEventListener("submit", e => {
      e.preventDefault();
      const activeRole = document.querySelector(".role-option.active")?.dataset.role || "customer";
      const fullName = document.getElementById("reg-name").value || "مستخدم BUNYORA";
      localStorage.setItem("bunyora_user", JSON.stringify({ name: fullName, role: activeRole }));
      window.location.href = `dashboard.html?role=${activeRole}`;
    });
  }

  // ==========================================
  // 8. DASHBOARD PAGE
  // ==========================================
  if (page === "dashboard") {
    const requests = window.BunyoraHelpers.getStoredRequests();
    const tableBody = document.getElementById("dashboard-requests-tbody");
    const offersGrid = document.getElementById("dashboard-offers-grid");
    const tabBtns = document.querySelectorAll(".dashboard-tabs button");
    const tabPanes = document.querySelectorAll(".dashboard-tab-pane");

    tabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.tab;
        tabBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        tabPanes.forEach(pane => {
          pane.hidden = pane.id !== `tab-${target}`;
        });
      });
    });

    if (tableBody) {
      tableBody.innerHTML = requests.map(r => `
        <tr>
          <td class="fw-bold">#${r.id}</td>
          <td class="fw-bold">${r.title}</td>
          <td>${r.specialty_ar}</td>
          <td>${r.city}، ${r.governorate}</td>
          <td>${r.area}</td>
          <td>${r.budget}</td>
          <td>${window.BunyoraHelpers.statusBadge(r.status)}</td>
          <td><span class="badge bg-secondary-subtle text-dark">${(r.offers || []).length} عروض</span></td>
        </tr>
      `).join("");
    }

    if (offersGrid) {
      const allOffers = requests.flatMap(r => (r.offers || []).map(o => ({ ...o, request_title: r.title, request_id: r.id })));
      offersGrid.innerHTML = allOffers.map(o => `
        <div class="col-md-6">
          <div class="panel-card mb-0 h-100">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div>
                <span class="section-kicker">عرض على طلب #${o.request_id}: ${o.request_title}</span>
                <h5 class="fw-bold mb-0 mt-1">${o.engineer_name}</h5>
                <small class="text-muted">${o.specialty_ar}</small>
              </div>
              <span class="badge-status badge-green">${window.BunyoraHelpers.formatMoney(o.price)}</span>
            </div>
            <p class="small text-muted my-2">${o.note}</p>
            <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
              <small class="fw-bold text-secondary">⏱ مدة التنفيذ: ${o.duration}</small>
              <div class="d-flex gap-2">
                <a href="engineer.html?id=${o.engineer_id}" class="btn-bunyora btn-bunyora-soft py-1 px-3">ملف المهندس</a>
                <button type="button" class="btn-bunyora btn-bunyora-primary py-1 px-3" onclick="this.textContent='✓ تم القبول';this.disabled=true;">قبول العرض</button>
              </div>
            </div>
          </div>
        </div>
      `).join("");
    }
  }
});
