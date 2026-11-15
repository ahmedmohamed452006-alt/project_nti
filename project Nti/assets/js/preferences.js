(() => {
  const LANG_KEY = "mohandesly-language";
  const THEME_KEY = "mohandesly-theme";
  const translations = {
    "BUNYORA":"BUNYORA","BUNYORA":"BUNYORA",
    "الرئيسية":"Home","المهندسين":"Engineers","العمال":"Workers",
    "الأدوات والمحلات":"Tools & Stores","اطلب خدمة":"Request a Service",
    "اطلب خدمة هندسية":"Request an Engineering Service","تسجيل الدخول":"Sign in",
    "تسجيل الخروج":"Sign out","إنشاء حساب":"Create Account","إنشاء حساب جديد":"Create your account",
    "حسابي":"My Account","لوحة حسابي":"My Dashboard","لوحة تحكم BUNYORA":"BUNYORA Dashboard",
    "العودة للمهندسين":"Back to Engineers","اكتشف المهندسين":"Explore Engineers",
    "كل المهندسين":"All Engineers","كل العمال":"All Workers","كل المحلات":"All Stores",
    "العمال والصنايعية":"Workers & Tradespeople","الأدوات والخامات":"Tools & Materials",
    "دليل العمال والصنايعية":"Workers & Tradespeople Directory","دليل الأدوات والمحلات":"Tools & Stores Directory",
    "بحث":"Search","ابحث":"Search","تصفية":"Filter","مسح":"Clear","تحديث البيانات":"Refresh Data",
    "إرسال":"Send","إرسال الطلب":"Send Request","حفظ التغييرات":"Save Changes","حفظ":"Save",
    "إلغاء":"Cancel","إغلاق":"Close","عرض التفاصيل":"View Details","عرض الملف":"View Profile",
    "شوف الملف":"View Profile","تواصل":"Contact","تواصل الآن":"Contact Now","اطلب عرض سعر":"Request a Quote",
    "الصفحة الرئيسية":"Home Page","العودة":"Back","التالي":"Continue","السابق":"Back",
    "ابدأ الآن":"Get Started","انضم الآن":"Join Now","سجل الآن":"Register Now","إنشاء الحساب":"Create Account",
    "بياناتك محفوظة وآمنة":"Your information is safe and secure",
    "أهلاً بيك في لوحة التحكم":"Welcome to your dashboard","لوحة التحكم":"Dashboard",
    "صندوق الوارد":"Inbox","ملف نشاطك":"Your Profile",
    "كل طلبات العملاء اللي اتبعتت لحسابك.":"All customer requests sent to your account.",
    "إجمالي الطلبات":"Total Requests","طلبات جديدة":"New Requests",
    "إدارة المنصة":"Platform Administration","صلاحيات مسؤول":"Administrator Access",
    "مهندسون معتمدون للنشر":"Approved Engineers","طلبات مهندسين معلّقة":"Pending Engineer Applications",
    "حسابات العملاء":"Customer Accounts","طلبات مشاريع مفتوحة":"Open Project Requests",
    "طلبات عمال قيد المراجعة":"Worker Applications Pending Review",
    "طلبات محلات قيد المراجعة":"Store Applications Pending Review",
    "إنشاء حساب جديد":"Create a New Account","عندي حساب بالفعل":"I already have an account",
    "ابدأ رحلتك مع BUNYORA":"Start your journey with BUNYORA",
    "اختار نوع الحساب":"Choose your account type","بيانات الحساب":"Account Details",
    "حساب عميل":"Customer Account","حساب مهندس":"Engineer Account",
    "حساب صنايعي / فني":"Tradesperson Account","حساب محل / مورد":"Store / Supplier Account",
    "عميل":"Customer","مهندس":"Engineer","عامل / فني":"Worker / Technician","محل / مورد":"Store / Supplier",
    "لطلب الخدمات ومتابعتها":"To request and track services","لعرض خبرتك واستقبال المشاريع":"Show your expertise and receive projects",
    "لعرض مهنتك واستقبال الشغل":"Show your trade and receive jobs","لعرض المحل والمنتجات":"List your store and products",
    "الاسم بالكامل":"Full Name","الاسم كما في المستندات":"Full name as shown on your documents",
    "اسم الصنايعي أو الفني":"Worker / technician name","اسم صاحب النشاط":"Business owner name",
    "اسم المحل أو الشركة":"Store or company name","اسم المسؤول":"Contact Person",
    "البريد الإلكتروني":"Email Address","رقم الموبايل":"Mobile Number","العنوان":"Address",
    "المحافظة":"Governorate","المدينة / المنطقة":"City / Area","المدينة":"City",
    "التخصص الهندسي":"Engineering Specialization","اختر التخصص":"Choose a specialization",
    "اختر المحافظة":"Choose a governorate","سنوات الخبرة":"Years of Experience",
    "رابط LinkedIn":"LinkedIn Profile URL","الجامعة والمؤهل":"University & Qualification",
    "إثبات المؤهل المهني (مطلوب)":"Professional Qualification Proof (Required)",
    "كارنيه نقابة المهندسين":"Engineers Syndicate Card","شهادة التخرج":"Graduation Certificate",
    "المهارة أو المهنة":"Skill / Trade","نوع النشاط":"Business Category","اختر نوع المحل":"Choose store category",
    "الخامات والمنتجات المتاحة":"Available Materials & Products",
    "نبذة عن خبرتك (اختياري)":"About your experience (optional)",
    "نبذة عن النشاط (اختياري)":"About your business (optional)",
    "اكتب اسمك بالكامل":"Enter your full name","مثال: الزقازيق":"e.g. Zagazig",
    "اكتب نوع الشغل اللي بتقدمه وخبرتك...":"Describe your services and experience...",
    "اكتب أهم المنتجات أو الماركات أو الخدمات اللي بتوفرها":"List your main products, brands or services",
    "ساعات العمل، التوريد، التوصيل، التخصص...":"Working hours, supply, delivery and specialties...",
    "مثال: سباك تأسيس وتشطيب، كهربائي، نقاش...":"e.g. plumber, electrician, painter...",
    "الشارع، المنطقة، المدينة":"Street, area and city","اكتب اسمك":"Enter your name",
    "هنبعتلك كود تأكيد على بريدك الإلكتروني بدل كلمة المرور التقليدية.":"We'll email you a verification code instead of using a password.",
    "حساب العميل يتيح لك إرسال الطلبات ومتابعة الردود والتواصل مع مقدمي الخدمات.":"A customer account lets you send requests, track replies and contact service providers.",
    "كود التأكيد":"Verification Code","تأكيد البريد الإلكتروني":"Verify your email",
    "إعادة إرسال الكود":"Resend Code","تأكيد وإنشاء الحساب ←":"Verify & Create Account →",
    "تم إرسال كود التأكيد إلى بريدك. راجع الوارد والرسائل غير المرغوبة.":"A verification code was sent to your email. Check your inbox and spam folder.",
    "تم إرسال كود جديد.":"A new code has been sent.",
    "مكانك الصح يبدأ من هنا.":"The right place to start.",
    "اختار نوع الحساب المناسب ليك، وكل حساب هيظهر له البيانات والصلاحيات المناسبة لطبيعة شغله.":"Choose the account that fits you. Each account has its own fields and access.",
    "بياناتك بتتسجل بشكل آمن. مستندات المهندس بتكون خاصة ومش بتظهر للزوار.":"Your data is stored securely. Engineer documents remain private and are never shown publicly.",
    "حساب مستقل حسب طبيعة شغلك":"An account built for your role",
    "لوحة تحكم مخصصة ليك":"A dedicated dashboard","متابعة الطلبات والإشعارات":"Request and notification tracking",
    "منصة تجمع المهندسين ومقدمي الخدمات التنفيذية ودليل الخامات والمستلزمات لمساعدتك في كل مراحل مشروعك.":"A platform connecting engineers, tradespeople and material suppliers throughout your project.",
    "طلب خدمة هندسية":"Engineering Service Request","خلّينا نعرف مشروعك محتاج إيه":"Tell us what your project needs",
    "جاوب على كام سؤال بسيط، وإحنا نوصل طلبك للمهندسين المناسبين.":"Answer a few quick questions and we'll connect you with suitable engineers.",
    "تفاصيل الطلب":"Request Details","متابعة الطلب":"Track Request","متابعة طلب المشروع":"Track Project Request",
    "طلبك على BUNYORA":"Your request on BUNYORA","جاري تحميل تفاصيل الطلب...":"Loading request details...",
    "جاري تحميل الملف المهني...":"Loading professional profile...","جاري تحميل الرسائل...":"Loading messages...",
    "جاري تحميل لوحة الإدارة...":"Loading admin dashboard...","جاري تحميل البيانات...":"Loading data...",
    "جاري التحميل":"Loading...","جديد":"New","تمت المشاهدة":"Seen","تم الرد":"Replied","مغلق":"Closed",
    "معتمد":"Approved","قيد المراجعة":"Pending Review","مرفوض":"Rejected",
    "مساحتك المهنية":"Your Professional Space","تابع طلبات العملاء ورسائلك من مكان واحد.":"Manage customer requests and messages in one place.",
    "الموقع الرئيسي":"Main Website","اكتشف":"Explore","تخصصات هندسية":"Engineering Specialties",
    "كل اللي يخص مشروعك في مكان واحد":"Everything for your project in one place",
    "اختار انت محتاج إيه":"What do you need?","المهندسين المحترفين":"Professional Engineers",
    "دليل الخدمات والمستلزمات":"Services & Supplies Directory",
    "من الموقع للمحل، كل حاجة ليها مكان":"From the site to the store, everything has its place",
    "منصتك لكل احتياجات البناء والتشطيب":"Your platform for every building and finishing need",
    "مشروعك في إيد أمينة":"Your project in trusted hands",
    "من أول فكرة لحد التنفيذ.":"From the first idea to completion.",
    "وصل للمهندس المناسب، دور على الصنايعي اللي محتاجه، واكتشف محلات الخامات والمعدات — كل ده من مكان واحد وبخطوات سهلة.":"Find the right engineer, tradesperson, materials and equipment suppliers — all in one place, with simple steps.",
    "ابدأ طلبك":"Start Your Request","اختيارات أوضح":"Clearer Choices","بحث منظم":"Organized Search",
    "احتياجات مشروعك كلها":"Everything Your Project Needs","من التخطيط للتشطيب":"From Planning to Finishing",
    "كل التخصصات في مكان واحد":"Every Specialty in One Place","ابدأ بخطوة بسيطة":"Start with One Simple Step",
    "حدد احتياجك ووصل للخدمة":"Find What You Need and Connect to a Service",
    "BUNYORA — شريك مشروعك":"BUNYORA — Your Project Partner",
    "سواء بتخطط، بتنفّذ، أو بتشتري خامات — ابدأ من القسم المناسب.":"Whether you're planning, building or buying materials, start with the right section.",
    "تصميم، إشراف، استشارات وحصر كميات":"Design, supervision, consulting and quantity surveying",
    "اكتشف المهندسين ←":"Explore Engineers →","استكشف التخصصات ←":"Explore Trades →",
    "كهربائي، سباك، نقاش، نجار وكل الفنيين":"Electricians, plumbers, painters, carpenters and more",
    "خامات، أدوات، معدات، موردين وخدمات للموقع":"Materials, tools, equipment, suppliers and site services",
    "افتح دليل المحلات ←":"Open Store Directory →",
    "الخدمات الهندسية":"Engineering Services","اختار التخصص الهندسي المناسب":"Choose the Right Engineering Specialty",
    "تخصصات مختلفة تساعدك تبدأ مشروعك وتتابع كل تفاصيله بشكل صحيح.":"Explore specialties to plan your project and manage every detail with confidence.",
    "كل المهندسين ←":"All Engineers →","دليل مستقل للصنايعية ودليل للمحلات والخامات والمعدات اللي بتحتاجها في مراحل المشروع.":"Dedicated directories for tradespeople, stores, materials and equipment needed throughout your project.",
    "التنفيذ والتشطيبات":"Execution and Finishing","عمال وصنايعية لكل بند":"Tradespeople for Every Task",
    "كهرباء وسباكة، تكييف، سيراميك، دهانات، جبس بورد، نجارة، ألوميتال، عزل، حدادة وترميمات.":"Electrical and plumbing, air conditioning, tiles, painting, drywall, carpentry, aluminum, insulation, metalwork and repairs.",
    "دليل العمال والصنايعية ←":"Workers Directory →","الخامات والتوريدات":"Materials and Supplies",
    "محلات وموردين ومعدات":"Stores, Suppliers and Equipment",
    "أدوات صحية وكهرباء، سيراميك، دهانات، حديد وأسمنت، أخشاب، عزل، معدات، معامل وطباعة هندسية.":"Plumbing and electrical supplies, tiles, paints, steel, cement, timber, insulation, equipment, labs and engineering printing.",
    "دليل الأدوات والمحلات ←":"Tools and Stores Directory →","خبرات هندسية":"Engineering Expertise",
    "اتعرف على المهندسين":"Meet the Engineers",
    "راجع التخصص والملف المهني والأعمال السابقة قبل ما تبعت طلبك.":"Review specialties, professional profiles and previous work before sending a request.",
    "طريقة استخدام بسيطة":"A Simple Way to Get Started","ابدأ في 3 خطوات":"Get Started in 3 Steps",
    "من غير تعقيد — حدد احتياجك واختار القسم المناسب ليك.":"No complications — identify what you need and choose the right section.",
    "حدد احتياجك":"Define Your Needs","اختار مهندس أو صنايعي أو نوع الخامة والمحل اللي بتدور عليه.":"Choose an engineer, tradesperson, material or store.",
    "راجع التفاصيل":"Review the Details",
    "قارن التخصصات والخدمات والمعلومات المتاحة قبل التواصل أو إرسال الطلب.":"Compare specialties, services and available information before contacting or requesting.",
    "ابدأ مشروعك":"Start Your Project",
    "تواصل مع مقدم الخدمة أو أرسل طلبك الهندسي واستقبل العروض المناسبة.":"Contact a provider or submit your project request to receive suitable offers.",
    "للمهندسين المحترفين":"For Professional Engineers","خلّي خبرتك توصل لعملاء أكتر":"Reach More Clients",
    "أنشئ ملفك المهني واعرض خدماتك وأعمالك السابقة على BUNYORA.":"Create your professional profile and showcase your services and previous work on BUNYORA.",
    "انضم كمهندس ←":"Join as an Engineer →","العودة للأعلى ↑":"Back to Top ↑",
    "منصة تجمع المهندسين ومقدمي الخدمات التنفيذية ودليل الخامات والمستلزمات لمساعدتك في كل مراحل مشروعك.":"A platform connecting engineers, tradespeople and suppliers to support every stage of your project.",
    "اختار أنت محتاج إيه":"Choose What You Need","كل اللي يخص مشروعك في مكان واحد":"Everything for Your Project in One Place",
    "اتعرف على مهندسين وفنيين ومحلات موثوقة لمشروعك.":"Discover engineers, technicians and stores for your project."
  };

  const dynamic = value => {
    let m = value.match(/^الخطوة\s+(\d+)\s+من\s+3$/);
    if (m) return "Step " + m[1] + " of 3";
    if (value.startsWith("بيانات حساب")) return "Account Details";
    if (value.startsWith("عدد النتائج")) return value.replace("عدد النتائج", "Results");
    if (/^\d+\s+سنوات خبرة$/.test(value)) return value.replace("سنوات خبرة", "years of experience");
    return null;
  };

  let language = "ar", theme = "light";
  try { language = localStorage.getItem(LANG_KEY) === "en" ? "en" : "ar"; } catch {}
  try { theme = localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light"; } catch {}
  const textState = new WeakMap(), attrState = new WeakMap();
  const mappedText = value => translations[value] || dynamic(value);

  function applyText(node) {
    let state = textState.get(node), current = node.nodeValue;
    if (!state || current !== state.applied) {
      state = { original: current, applied: null };
      textState.set(node, state);
    }
    const original = state.original, trimmed = original.trim();
    if (!trimmed) return;
    const translated = language === "en" ? mappedText(trimmed) : null;
    const target = translated ? original.replace(trimmed, translated)
      : (language === "ar" ? original : state.applied === null ? current : original);
    if (target !== current) { state.applied = target; node.nodeValue = target; }
    else state.applied = current;
  }

  function applyAttributes(el) {
    const attrs = ["placeholder", "title", "aria-label", "alt"];
    let state = attrState.get(el);
    if (!state) { state = {}; attrState.set(el, state); }
    for (const attr of attrs) {
      if (!el.hasAttribute?.(attr)) continue;
      const current = el.getAttribute(attr);
      if (!Object.prototype.hasOwnProperty.call(state, attr) || current !== state[attr].applied) {
        state[attr] = { original: current, applied: null };
      }
      const original = state[attr].original, translated = language === "en" ? mappedText(original.trim()) : null;
      const target = translated ? original.replace(original.trim(), translated)
        : (language === "ar" ? original : state[attr].applied === null ? current : original);
      if (target !== current) { state[attr].applied = target; el.setAttribute(attr, target); }
      else state[attr].applied = current;
    }
  }

  function walk(root) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) { applyText(root); return; }
    if (root.nodeType === Node.ELEMENT_NODE) applyAttributes(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) applyText(node);
    if (root.querySelectorAll) root.querySelectorAll("*").forEach(applyAttributes);
  }

  function setTheme(next) {
    theme = next;
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    const button = document.getElementById("mh-theme-toggle");
    if (button) {
      button.innerHTML = theme === "dark"
        ? '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.7"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg><span class="mh-pref-mini">☼</span>'
        : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 15.2A8.7 8.7 0 0 1 8.8 3.8 8.9 8.9 0 1 0 20.2 15.2Z"/></svg><span class="mh-pref-mini">◐</span>';
      button.title = theme === "dark" ? (language === "ar" ? "الوضع الفاتح" : "Light mode") : (language === "ar" ? "الوضع الداكن" : "Dark mode");
      button.setAttribute("aria-label", button.title);
    }
    try { localStorage.setItem(THEME_KEY, theme); } catch {}
  }

  function setLanguage(next) {
    language = next;
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.dataset.language = language;
    const button = document.getElementById("mh-language-toggle");
    if (button) {
      button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg><span class="mh-pref-mini">' + (language === "ar" ? "EN" : "ع") + '</span>';
      button.title = language === "ar" ? "Switch to English" : "التبديل إلى العربية";
      button.setAttribute("aria-label", button.title);
    }
    walk(document.body);
    try { localStorage.setItem(LANG_KEY, language); } catch {}
  }

  function mount() {
    if (document.getElementById("mh-site-preferences")) return;
    const dock = document.createElement("div");
    dock.id = "mh-site-preferences";
    dock.setAttribute("aria-label", "Display preferences");
    dock.innerHTML = '<button type="button" class="mh-pref-btn" id="mh-language-toggle"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg><span class="mh-pref-mini">EN</span></button><button type="button" class="mh-pref-btn" id="mh-theme-toggle"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 15.2A8.7 8.7 0 0 1 8.8 3.8 8.9 8.9 0 1 0 20.2 15.2Z"/></svg><span class="mh-pref-mini">◐</span></button>';
    document.body.appendChild(dock);
    document.getElementById("mh-language-toggle").addEventListener("click", () => setLanguage(language === "ar" ? "en" : "ar"));
    document.getElementById("mh-theme-toggle").addEventListener("click", () => setTheme(theme === "light" ? "dark" : "light"));
    setTheme(theme);
    setLanguage(language);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, { once: true });
  else mount();
  const observer = new MutationObserver(records => {
    for (const record of records) {
      if (record.type === "characterData") applyText(record.target);
      else record.addedNodes?.forEach(node => walk(node));
      if (record.type === "attributes") applyAttributes(record.target);
    }
  });
  observer.observe(document.documentElement, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["placeholder","title","aria-label","alt"] });
})();