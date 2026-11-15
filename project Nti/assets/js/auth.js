// BUNYORA - Role-Based Access Control (RBAC), Session Manager & Hybrid Cloud API Engine
window.BunyoraAuth = {
  USER_KEY: "bunyora_auth_user",
  TOKEN_KEY: "bunyora_auth_token",

  roleLabels: {
    admin: { title: "مدير المنصة (Admin)", badge: "👑 إدارة المنصة", dashboard: "admin-dashboard.html", navText: "👑 لوحة الإدارة" },
    engineer: { title: "مهندس استشاري", badge: "📐 حساب مهندس", dashboard: "engineer-dashboard.html", navText: "📐 لوحة المهندس" },
    customer: { title: "عميل / صاحب مشروع", badge: "👤 حساب عميل", dashboard: "customer-dashboard.html", navText: "📋 طلباتي وعروضي" },
    worker: { title: "صنايعي / فني محترف", badge: "👷 حساب صنايعي", dashboard: "provider-dashboard.html", navText: "🧰 لوحة الصنايعي" },
    supplier: { title: "معرض / مورد خامات", badge: "🏪 حساب مورد", dashboard: "provider-dashboard.html", navText: "🏪 لوحة المعرض" }
  },

  getUser() {
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  setSession(user, token) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    if (token) localStorage.setItem(this.TOKEN_KEY, token);
  },

  logout() {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    window.location.href = "login.html";
  },

  getDashboardUrl(role) {
    const r = role || this.getUser()?.role;
    return this.roleLabels[r]?.dashboard || "login.html";
  },

  // Enforce strict role permission on protected dashboards
  requireRole(allowedRoles = []) {
    const user = this.getUser();
    if (!user) {
      window.location.replace("login.html?redirect=" + encodeURIComponent(window.location.pathname.split("/").pop()));
      return null;
    }
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      window.location.replace(this.getDashboardUrl(user.role));
      return null;
    }
    return user;
  },

  // Update Navbar & Header Actions across all pages based on logged-in role
  syncNavbar() {
    const user = this.getUser();
    const navLinks = document.querySelector(".nav-links");
    const headerActions = document.querySelector(".header-actions");

    if (navLinks) {
      const dashLinks = navLinks.querySelectorAll('a[href*="dashboard.html"]');
      if (!user) {
        dashLinks.forEach(a => a.remove());
      } else {
        const roleInfo = this.roleLabels[user.role] || this.roleLabels.customer;
        if (dashLinks.length > 0) {
          dashLinks.forEach(a => {
            a.href = roleInfo.dashboard;
            a.textContent = roleInfo.navText;
          });
        } else {
          const currentFile = window.location.pathname.split("/").pop();
          const isActive = currentFile === roleInfo.dashboard ? 'class="active"' : '';
          navLinks.insertAdjacentHTML("beforeend", `<a ${isActive} href="${roleInfo.dashboard}">${roleInfo.navText}</a>`);
        }
      }
    }

    if (headerActions && user) {
      const roleInfo = this.roleLabels[user.role] || this.roleLabels.customer;
      const themeBtn = headerActions.querySelector("#nav-theme-toggle-btn");
      headerActions.innerHTML = "";
      if (themeBtn) headerActions.appendChild(themeBtn);

      headerActions.insertAdjacentHTML("beforeend", `
        <a href="${roleInfo.dashboard}" class="btn-bunyora btn-bunyora-soft py-2 px-3" title="${roleInfo.title}">
          <span>${roleInfo.badge.split(" ")[0]}</span>
          <span class="d-none d-md-inline">${user.full_name}</span>
        </a>
        <button type="button" id="global-logout-btn" class="btn-bunyora btn-bunyora-outline py-2 px-3 text-danger border-danger-subtle">
          خروج ↪
        </button>
      `);

      document.getElementById("global-logout-btn")?.addEventListener("click", () => this.logout());
    }
  }
};

// ============================================================================
// Hybrid Cloud API Engine (Seamless Fallback when hosted on Static/Cloud CDN)
// ============================================================================
(function initHybridCloudApi() {
  const DB_KEY = "bunyora_cloud_db_v2";

  function getInitialCloudDb() {
    return {
      users: [
        { id: 1, full_name: "إدارة منصة بونيرا", email: "admin@bunyora.com", phone: "01000000001", role: "admin", governorate: "القاهرة", city: "التجمع الخامس", status: "approved", is_verified: 1 },
        { id: 2, full_name: "أ. كريم محمود", email: "karim@client.com", phone: "01011112222", role: "customer", governorate: "القاهرة", city: "التجمع الخامس", status: "approved", is_verified: 0 },
        { id: 3, full_name: "م. عمر الشاذلي", email: "omar@bunyora.com", phone: "01010002001", role: "engineer", governorate: "القاهرة", city: "التجمع الخامس", status: "approved", is_verified: 1, specialty_ar: "هندسة معمارية", university: "كلية الهندسة - جامعة عين شمس", syndicate_number: "ENG-2015-8841" },
        { id: 4, full_name: "م. سارة منصور", email: "sara@bunyora.com", phone: "01010002002", role: "engineer", governorate: "الجيزة", city: "الشيخ زايد", status: "approved", is_verified: 1, specialty_ar: "تصميم داخلي", university: "كلية الفنون الجميلة - قسم عمارة داخلية", syndicate_number: "ENG-2018-4412" },
        { id: 5, full_name: "م. أحمد فؤاد", email: "ahmed@bunyora.com", phone: "01010002003", role: "engineer", governorate: "الإسكندرية", city: "سموحة", status: "approved", is_verified: 1, specialty_ar: "هندسة إنشائية", university: "كلية الهندسة - جامعة الإسكندرية", syndicate_number: "ENG-2012-1920" },
        { id: 6, full_name: "م. منة الله عادل", email: "menna@bunyora.com", phone: "01010002004", role: "engineer", governorate: "القاهرة", city: "مدينة نصر", status: "approved", is_verified: 1, specialty_ar: "هندسة كهربائية", university: "كلية الهندسة - جامعة القاهرة", syndicate_number: "ENG-2019-7731" },
        { id: 7, full_name: "م. خالد إبراهيم", email: "khaled@bunyora.com", phone: "01010002005", role: "engineer", governorate: "الشرقية", city: "الزقازيق", status: "approved", is_verified: 1, specialty_ar: "هندسة مدنية", university: "كلية الهندسة - جامعة الزقازيق", syndicate_number: "ENG-2014-3390" },
        { id: 9, full_name: "الحاج محمود الكهربائي", email: "mahmoud.worker@bunyora.com", phone: "01012345678", role: "worker", governorate: "القاهرة", city: "مدينة نصر", status: "approved", trade: "كهرباء" },
        { id: 13, full_name: "معرض الصفوة للسيراميك والبورسلين", email: "safwa@supplier.com", phone: "01001122334", role: "supplier", governorate: "القاهرة", city: "مدينة نصر", status: "approved", business_name: "معرض الصفوة للسيراميك والبورسلين", supplier_category: "سيراميك وأدوات صحية" },
        { id: 17, full_name: "م. طارق عبد العزيز (بانتظار التوثيق)", email: "tarek.pending@bunyora.com", phone: "01099887766", role: "engineer", governorate: "القاهرة", city: "المعادي", status: "pending", is_verified: 0, specialty_ar: "هندسة معمارية", university: "كلية الهندسة - جامعة عين شمس", syndicate_number: "ENG-2021-9920" },
        { id: 18, full_name: "معرض الأندلس للدهانات الحديثة", email: "andalus.paint@bunyora.com", phone: "01122339988", role: "supplier", governorate: "الجيزة", city: "المهندسين", status: "pending", is_verified: 0, business_name: "معرض الأندلس للدهانات الحديثة", supplier_category: "دهانات وديكورات" }
      ],
      engineer_profiles: {
        3: {
          id: 1,
          user_id: 3,
          specialty_ar: "هندسة معمارية",
          university: "كلية الهندسة - جامعة عين شمس",
          syndicate_number: "ENG-2015-8841",
          years_experience: 11,
          is_verified: 1,
          avg_rating: 4.9,
          services: [
            { id: 1, title: "تصميم معماري متكامل (2D & 3D)", description: "مساقط أفقية وواجهات ومناظير ثلاثية الأبعاد", price: 12000 },
            { id: 2, title: "مراجعة وتعديل المخططات المعمارية", description: "تحسين استغلال المساحات وتوزيع الغرف", price: 4500 },
            { id: 3, title: "استشارة معمارية قبل الشراء أو البناء", description: "جلسة فنية لتقييم قطعة الأرض أو الوحدة", price: 1500 }
          ],
          projects: [
            { id: 1, title: "فيلا سكنية مودرن - التجمع الخامس", description: "تصميم معماري وواجهات بمساحة 480 م²", category: "تصميم معماري", area_sqm: 480 },
            { id: 2, title: "مبنى إداري تجاري - الشروق", description: "تخطيط معماري ودراسة حركة ومساحات عمل", category: "مباني تجارية", area_sqm: 950 }
          ]
        }
      },
      worker_profiles: {
        9: { id: 1, user_id: 9, trade: "كهرباء", years_experience: 15, summary: "تأسيس وتشطيب شقق وفيلات، تركيب لوحات التوزيع، سبوتات، بروفايل ليد وأنظمة سمارت.", is_available: 1, tags: ["تأسيس كهرباء", "تشطيب إنارة", "لوحات توزيع", "سمارت هوم"] }
      },
      supplier_profiles: {
        13: { id: 1, user_id: 13, business_name: "معرض الصفوة للسيراميك والبورسلين", category: "سيراميك وأدوات صحية", delivery_info: "يتوفر توصيل للموقع", summary: "تشكيلة واسعة من البورسلين المستورد والمحلي، أطقم الحمامات، الخلاطات المدفونة وبانيوهات الأكريليك.", tags: ["بورسلين ليزر", "خلاطات دفن", "أطقم صحية", "مواد لصق"] }
      },
      specialties: (window.BUNYORA_DATA && window.BUNYORA_DATA.categories) ? JSON.parse(JSON.stringify(window.BUNYORA_DATA.categories)) : [],
      requests: [
        {
          id: 1,
          title: "تصميم معماري وإنشائي لفيلا سكنية",
          specialty_ar: "هندسة معمارية",
          unit_type: "فيلا مستقلة",
          governorate: "القاهرة",
          city: "التجمع الخامس",
          area_sqm: 420,
          budget_range: "15,000 - 25,000 ج.م",
          customer_name: "أ. كريم محمود",
          customer_phone: "01011112222",
          status: "offers_received",
          description: "مطلوب تصميم معماري وإنشائي كامل لقطعة أرض 420 متر بدروم وأرضي وأول ورووف مع واجهات مودرن.",
          offers: [
            { id: 1, request_id: 1, engineer_profile_id: 1, engineer_name: "م. عمر الشاذلي", specialty_ar: "هندسة معمارية", avg_rating: 4.9, offered_price: 18500, duration_text: "14 يوم", proposal_note: "يشمل المساقط الأفقية والواجهات 3D والرسومات التنفيذية الكاملة.", status: "pending" },
            { id: 2, request_id: 1, engineer_profile_id: 3, engineer_name: "م. أحمد فؤاد", specialty_ar: "هندسة إنشائية", avg_rating: 4.9, offered_price: 16000, duration_text: "12 يوم", proposal_note: "يشمل التصميم الإنشائي الكامل والمذكرة الحسابية وتنسيق المعماري.", status: "pending" }
          ]
        },
        {
          id: 2,
          title: "إشراف هندسي على تشطيب شقة 185 متر",
          specialty_ar: "تصميم داخلي",
          unit_type: "شقة سكنية",
          governorate: "الجيزة",
          city: "الشيخ زايد",
          area_sqm: 185,
          budget_range: "يحدد بعد المعاينة",
          customer_name: "أ. كريم محمود",
          customer_phone: "01011112222",
          status: "open",
          description: "الشقة على الطوب الأحمر ومطلوب تصميم داخلي 3D مع باقة إشراف هندسي على مراحل التأسيس والتشطيب.",
          offers: [
            { id: 3, request_id: 2, engineer_profile_id: 2, engineer_name: "م. سارة منصور", specialty_ar: "تصميم داخلي", avg_rating: 4.8, offered_price: 9500, duration_text: "10 أيام للتصميم", proposal_note: "تصميم 3D لكامل الشقة مع جدول خامات ومقايسة تقديرية قبل بدء التنفيذ.", status: "pending" }
          ]
        }
      ],
      subscribers: [
        { id: 1, email: "client.newcairo@gmail.com", created_at: "2026-11-14 14:20" },
        { id: 2, email: "arch.office.eg@gmail.com", created_at: "2026-11-15 09:15" }
      ]
    };
  }

  function loadDb() {
    try {
      const raw = localStorage.getItem(DB_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    const initial = getInitialCloudDb();
    saveDb(initial);
    return initial;
  }

  function saveDb(db) {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(db));
    } catch (e) {}
  }

  function handleVirtualRoute(route, method, bodyObj) {
    const db = loadDb();

    // 1. Login
    if (route === "auth/login" && method === "POST") {
      const email = (bodyObj.email || "").trim().toLowerCase();
      const u = db.users.find(x => x.email.toLowerCase() === email);
      if (!u) return { status: "error", message: "بيانات البريد الإلكتروني غير مسجلة" };
      const userCopy = { ...u };
      if (u.role === "engineer") userCopy.engineer_profile = db.engineer_profiles[u.id] || db.engineer_profiles[3];
      return { status: "success", message: `مرحباً بك يا ${u.full_name}`, token: "cloud_token_" + u.id, user: userCopy };
    }

    // 2. Register
    if (route === "auth/register" && method === "POST") {
      const role = bodyObj.role || "customer";
      const status = role === "customer" ? "approved" : "pending";
      const newId = Date.now();
      const newUser = {
        id: newId,
        full_name: bodyObj.full_name || "مستخدم جديد",
        email: bodyObj.email || `user${newId}@bunyora.com`,
        phone: bodyObj.phone || "01000000000",
        role,
        governorate: bodyObj.governorate || "القاهرة",
        city: bodyObj.city || "القاهرة الجديدة",
        status,
        is_verified: 0,
        specialty_ar: bodyObj.specialty_ar || "هندسة معمارية",
        university: bodyObj.university || "كلية الهندسة",
        syndicate_number: bodyObj.syndicate_number || "ENG-NEW",
        trade: bodyObj.trade || "فني تشطيبات",
        business_name: bodyObj.business_name || bodyObj.full_name,
        supplier_category: bodyObj.category || "مواد بناء وتشطيبات"
      };
      db.users.unshift(newUser);
      saveDb(db);
      return {
        status: "success",
        message: status === "pending"
          ? "تم تسجيل حسابك بنجاح! الحساب الآن قيد مراجعة الإدارة لتوثيق بياناتك."
          : "تم إنشاء حسابك بنجاح!",
        user: newUser,
        token: "cloud_token_" + newId
      };
    }

    // 3. Get User Profile
    if (route.startsWith("auth/user/")) {
      const uid = Number(route.split("/")[2]);
      const u = db.users.find(x => Number(x.id) === uid) || db.users[0];
      const copy = { ...u };
      if (u.role === "engineer") copy.engineer_profile = db.engineer_profiles[u.id] || db.engineer_profiles[3];
      if (u.role === "worker") copy.worker_profile = db.worker_profiles[u.id] || db.worker_profiles[9];
      if (u.role === "supplier") copy.supplier_profile = db.supplier_profiles[u.id] || db.supplier_profiles[13];
      return { status: "success", user: copy };
    }

    // 4. Admin Overview
    if (route === "admin/overview") {
      const allOffers = db.requests.reduce((acc, r) => acc + (r.offers ? r.offers.length : 0), 0);
      return {
        status: "success",
        stats: {
          total_users: db.users.length,
          pending_users: db.users.filter(u => u.status === "pending").length,
          verified_eng: db.users.filter(u => u.role === "engineer" && Number(u.is_verified) === 1).length,
          total_requests: db.requests.length,
          total_offers: allOffers
        },
        users: db.users,
        requests: db.requests.map(r => ({ ...r, offers_count: (r.offers || []).length })),
        specialties: db.specialties,
        subscribers: db.subscribers
      };
    }

    // 5. Admin User Status
    if (route.startsWith("admin/users/") && route.endsWith("/status") && method === "POST") {
      const uid = Number(route.split("/")[2]);
      const action = bodyObj.action;
      const u = db.users.find(x => Number(x.id) === uid);
      if (u) {
        if (action === "approve") { u.status = "approved"; u.is_verified = 1; }
        else if (action === "reject") { u.status = "rejected"; }
        else if (action === "suspend") { u.status = "suspended"; }
        else if (action === "toggle_verify") { u.is_verified = Number(u.is_verified) === 1 ? 0 : 1; }
        saveDb(db);
      }
      return { status: "success", message: "تم تحديث حالة الحساب وتوثيقه بنجاح ✓" };
    }

    // 6. Admin Delete User
    if (route.startsWith("admin/users/") && route.endsWith("/delete") && method === "POST") {
      const uid = Number(route.split("/")[2]);
      db.users = db.users.filter(x => Number(x.id) !== uid || x.role === "admin");
      saveDb(db);
      return { status: "success", message: "تم حذف الحساب بنجاح" };
    }

    // 7. Admin Add Specialty
    if (route === "admin/specialties" && method === "POST") {
      db.specialties.push({
        id: Date.now(),
        name_ar: bodyObj.name_ar,
        slug: bodyObj.slug,
        icon: bodyObj.icon || "⌂",
        engineer_count: 1
      });
      saveDb(db);
      return { status: "success", message: "تمت إضافة التخصص الهندسي الجديد بنجاح ✓" };
    }

    // 8. Admin Delete Request
    if (route.startsWith("admin/requests/") && route.endsWith("/delete") && method === "POST") {
      const rid = Number(route.split("/")[2]);
      db.requests = db.requests.filter(r => Number(r.id) !== rid);
      saveDb(db);
      return { status: "success", message: "تم حذف الطلب بنجاح" };
    }

    // 9. Requests List or Create
    if (route === "requests") {
      if (method === "POST") {
        const newReq = {
          id: Date.now() % 10000,
          title: bodyObj.title || "طلب خدمة هندسية",
          specialty_ar: bodyObj.specialty_ar || "هندسة معمارية",
          unit_type: bodyObj.unit_type || "شقة سكنية",
          governorate: bodyObj.governorate || "القاهرة",
          city: bodyObj.city || "التجمع الخامس",
          area_sqm: bodyObj.area_sqm || 180,
          budget_range: bodyObj.budget_range || "يحدد بعد المعاينة",
          customer_name: bodyObj.customer_name || "أ. كريم محمود",
          customer_phone: bodyObj.customer_phone || "01011112222",
          status: "open",
          description: bodyObj.description || "",
          offers: []
        };
        db.requests.unshift(newReq);
        saveDb(db);
        return { status: "success", message: "تم إرسال طلبك الهندسي بنجاح!", id: newReq.id };
      }
      return { status: "success", count: db.requests.length, requests: db.requests };
    }

    // 10. Engineer Submit Offer
    if (route.startsWith("requests/") && route.endsWith("/offers") && method === "POST") {
      const rid = Number(route.split("/")[1]);
      const req = db.requests.find(r => Number(r.id) === rid);
      if (req) {
        req.offers = req.offers || [];
        req.offers.unshift({
          id: Date.now(),
          request_id: rid,
          engineer_profile_id: bodyObj.engineer_profile_id || 1,
          engineer_name: window.BunyoraAuth.getUser()?.full_name || "م. عمر الشاذلي",
          specialty_ar: "هندسة معمارية",
          avg_rating: 4.9,
          offered_price: Number(bodyObj.offered_price) || 10000,
          duration_text: bodyObj.duration_text || "10 أيام",
          proposal_note: bodyObj.proposal_note || "",
          status: "pending"
        });
        req.status = "offers_received";
        saveDb(db);
      }
      return { status: "success", message: "تم إرسال عرض السعر للعميل بنجاح ✓" };
    }

    // 11. Customer Accept Offer
    if (route.startsWith("offers/") && route.endsWith("/accept") && method === "POST") {
      const oid = Number(route.split("/")[1]);
      db.requests.forEach(r => {
        (r.offers || []).forEach(o => {
          if (Number(o.id) === oid) {
            o.status = "accepted";
            r.status = "selected";
          }
        });
      });
      saveDb(db);
      return { status: "success", message: "تم قبول عرض المهندس واعتماد التعاقد المبدئي بنجاح! 🎉" };
    }

    // 12. Engineer Add/Delete Service & Project
    if (route === "engineer/services" && method === "POST") {
      const ep = db.engineer_profiles[3];
      ep.services.push({ id: Date.now(), title: bodyObj.title, price: bodyObj.price, description: bodyObj.description });
      saveDb(db);
      return { status: "success", message: "تمت إضافة الخدمة الهندسية لملفك الشخصي ✓" };
    }
    if (route.startsWith("engineer/services/") && route.endsWith("/delete")) {
      const sid = Number(route.split("/")[2]);
      const ep = db.engineer_profiles[3];
      ep.services = ep.services.filter(s => Number(s.id) !== sid);
      saveDb(db);
      return { status: "success", message: "تم حذف الخدمة" };
    }
    if (route === "engineer/projects" && method === "POST") {
      const ep = db.engineer_profiles[3];
      ep.projects.push({ id: Date.now(), title: bodyObj.title, category: bodyObj.category, area_sqm: bodyObj.area_sqm, description: bodyObj.description });
      saveDb(db);
      return { status: "success", message: "تمت إضافة المشروع لمعرض أعمالك (Portfolio) ✓" };
    }

    // 13. Provider (Worker / Supplier) Update
    if (route === "provider/update" && method === "POST") {
      if (bodyObj.role === "worker") {
        db.worker_profiles[9] = {
          id: 1,
          user_id: bodyObj.user_id || 9,
          trade: bodyObj.trade,
          years_experience: bodyObj.years_experience,
          summary: bodyObj.summary,
          is_available: bodyObj.is_available ? 1 : 0,
          tags: (bodyObj.tags_str || "").split(/[،,]/).map(s => s.trim()).filter(Boolean)
        };
      } else {
        db.supplier_profiles[13] = {
          id: 1,
          user_id: bodyObj.user_id || 13,
          business_name: bodyObj.business_name,
          category: bodyObj.category,
          delivery_info: bodyObj.delivery_info,
          summary: bodyObj.summary,
          tags: (bodyObj.tags_str || "").split(/[،,]/).map(s => s.trim()).filter(Boolean)
        };
      }
      saveDb(db);
      return { status: "success", message: "تم تحديث ملفك وبيانات نشاطك بنجاح ✓" };
    }

    // 14. Public Endpoints (stats, engineers, workers, suppliers, specialties, newsletter)
    if (route === "stats") {
      return { status: "success", stats: { engineers_count: 6, specialties_count: db.specialties.length, workers_count: 9, suppliers_count: 6, open_requests_count: db.requests.length } };
    }
    if (route === "specialties") {
      return { status: "success", count: db.specialties.length, specialties: db.specialties };
    }
    if (route === "engineers") {
      return { status: "success", count: (window.BUNYORA_DATA?.engineers || []).length, engineers: window.BUNYORA_DATA?.engineers || [] };
    }
    if (route === "workers") {
      return { status: "success", count: (window.BUNYORA_DATA?.workers || []).length, workers: window.BUNYORA_DATA?.workers || [] };
    }
    if (route === "suppliers") {
      return { status: "success", count: (window.BUNYORA_DATA?.suppliers || []).length, suppliers: window.BUNYORA_DATA?.suppliers || [] };
    }
    if (route === "newsletter" && method === "POST") {
      db.subscribers.unshift({ id: Date.now(), email: bodyObj.email, created_at: new Date().toISOString().slice(0, 16).replace("T", " ") });
      saveDb(db);
      return { status: "success", message: "تم اشتراكك في النشرة البريدية لمنصة بونيرا بنجاح!" };
    }

    return { status: "success", message: "BUNYORA Cloud API Ready", route };
  }

  // Intercept window.fetch for api/ calls when running on static hosting
  const nativeFetch = window.fetch.bind(window);
  window.fetch = async function(input, init = {}) {
    const urlStr = typeof input === "string" ? input : (input.url || "");
    if (urlStr.includes("api/index.php") || urlStr.startsWith("api/")) {
      let route = "";
      if (urlStr.includes("route=")) {
        route = decodeURIComponent(urlStr.split("route=")[1].split("&")[0]);
      } else {
        route = urlStr.replace(/^.*api\//, "").split("?")[0];
      }
      const method = (init.method || "GET").toUpperCase();
      let bodyObj = {};
      if (init.body && typeof init.body === "string") {
        try { bodyObj = JSON.parse(init.body); } catch (e) {}
      }

      // Try real PHP MySQL backend first (when on localhost XAMPP)
      try {
        const res = await nativeFetch(input, init);
        const clone = res.clone();
        const text = await clone.text();
        // Verify it is real JSON and not raw PHP source code or 404 HTML
        if (res.ok && text.trim().startsWith("{") && !text.includes("<?php")) {
          return res;
        }
      } catch (e) {
        // Fallback to Cloud Engine
      }

      // Execute Hybrid Cloud API Engine
      const payload = handleVirtualRoute(route, method, bodyObj);
      return new Response(JSON.stringify(payload), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    return nativeFetch(input, init);
  };
})();

document.addEventListener("DOMContentLoaded", () => {
  window.BunyoraAuth.syncNavbar();
});
