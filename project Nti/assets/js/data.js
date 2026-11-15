// BUNYORA - Data Store & API Layer (Ready for Laravel REST API Integration)
window.BUNYORA_DATA = {
  apiBaseUrl: "api",
  useMockFallback: true,

  governorates: [
    "القاهرة", "الجيزة", "الإسكندرية", "الشرقية", "الدقهلية",
    "القليوبية", "الغربية", "المنوفية", "البحيرة", "بورسعيد",
    "الإسماعيلية", "السويس", "دمياط", "كفر الشيخ", "الفيوم",
    "بني سويف", "المنيا", "أسيوط", "سوهاج", "قنا", "الأقصر", "أسوان"
  ],

  categories: [
    { id: 1, slug: "architecture", name_ar: "هندسة معمارية", icon: "⌂", engineer_count: 14 },
    { id: 2, slug: "civil", name_ar: "هندسة مدنية", icon: "▥", engineer_count: 18 },
    { id: 3, slug: "structural", name_ar: "هندسة إنشائية", icon: "⌗", engineer_count: 11 },
    { id: 4, slug: "electrical", name_ar: "هندسة كهربائية", icon: "ϟ", engineer_count: 9 },
    { id: 5, slug: "mechanical", name_ar: "هندسة ميكانيكية", icon: "⚙", engineer_count: 7 },
    { id: 6, slug: "interior", name_ar: "تصميم داخلي", icon: "▧", engineer_count: 16 },
    { id: 7, slug: "hvac", name_ar: "تكييف وتبريد", icon: "❄", engineer_count: 6 },
    { id: 8, slug: "surveying", name_ar: "هندسة مساحة", icon: "⌖", engineer_count: 5 },
    { id: 9, slug: "project-management", name_ar: "إدارة مشروعات", icon: "◷", engineer_count: 8 },
    { id: 10, slug: "quantity-surveying", name_ar: "حصر كميات ومقايسات", icon: "▤", engineer_count: 10 }
  ],

  engineers: [
    {
      id: 1,
      full_name: "م. عمر الشاذلي",
      specialty: "architecture",
      specialty_ar: "هندسة معمارية",
      city: "التجمع الخامس",
      governorate: "القاهرة",
      years_experience: 11,
      verified: true,
      is_demo: false,
      avg_rating: 4.9,
      review_count: 24,
      service_count: 3,
      photo_url: "assets/img/32.jpg",
      university: "كلية الهندسة - جامعة عين شمس",
      bio: "مهندس معماري يهتم بتصميم المباني السكنية والتجارية، وتحويل احتياجات العميل إلى حلول معمارية عملية ومتوازنة.",
      services: [
        { title: "تصميم معماري متكامل (2D & 3D)", desc: "مساقط أفقية وواجهات ومناظير ثلاثية الأبعاد", price: 12000 },
        { title: "مراجعة وتعديل المخططات المعمارية", desc: "تحسين استغلال المساحات وتوزيع الغرف", price: 4500 },
        { title: "استشارة معمارية قبل الشراء أو البناء", desc: "جلسة فنية لتقييم قطعة الأرض أو الوحدة", price: 1500 }
      ],
      projects: [
        { title: "فيلا سكنية مودرن - التجمع الخامس", desc: "تصميم معماري وواجهات بمساحة 480 م²", category: "تصميم معماري" },
        { title: "مبنى إداري تجاري - الشروق", desc: "تخطيط معماري ودراسة حركة ومساحات عمل", category: "مباني تجارية" }
      ],
      reviews: [
        { author: "أ. محمد عبد الرحمن", rating: 5, date: "منذ أسبوعين", comment: "التزام تام بالمواعيد وتصميم عملي جداً استغل كل متر في المساحة." },
        { author: "د. هاني سليم", rating: 5, date: "منذ شهر", comment: "تعامل راقي ورسومات تنفيذية دقيقة سهلت الشغل جداً في الموقع." }
      ]
    },
    {
      id: 2,
      full_name: "م. سارة منصور",
      specialty: "interior",
      specialty_ar: "تصميم داخلي",
      city: "الشيخ زايد",
      governorate: "الجيزة",
      years_experience: 8,
      verified: true,
      is_demo: false,
      avg_rating: 4.8,
      review_count: 19,
      service_count: 3,
      photo_url: "assets/img/44.jpg",
      university: "كلية الفنون الجميلة - قسم عمارة داخلية",
      bio: "مصممة داخلية متخصصة في المساحات السكنية، وتوازن بين الوظيفة والهوية البصرية وجودة الخامات.",
      services: [
        { title: "تصميم داخلي 3D + شوب دروينج", desc: "توزيع الفرش والإضاءة والخامات مع رسومات تنفيذية", price: 9500 },
        { title: "اختيار الخامات والألوان (Moodboard)", desc: "تحديد السيراميك والدهانات والإضاءة والأثاث", price: 3500 },
        { title: "إشراف على التشطيبات الداخلية", desc: "متابعة البنود بالموقع لضمان مطابقة التصميم", price: null }
      ],
      projects: [
        { title: "شقة سكنية نيو كلاسيك - الشيخ زايد", desc: "تصميم داخلي وإشراف تشطيب بمساحة 220 م²", category: "تصميم داخلي" },
        { title: "عيادة طبية متكاملة - المهندسين", desc: "تصميم مريح وعصري للاستقبال والعيادات", category: "مساحات طبية" }
      ],
      reviews: [
        { author: "أ. نهى كامل", rating: 5, date: "منذ 3 أسابيع", comment: "ذوق راقي جداً وساعدتنا في اختيار خامات ممتازة في حدود الميزانية." }
      ]
    },
    {
      id: 3,
      full_name: "م. أحمد فؤاد",
      specialty: "structural",
      specialty_ar: "هندسة إنشائية",
      city: "سموحة",
      governorate: "الإسكندرية",
      years_experience: 14,
      verified: true,
      is_demo: false,
      avg_rating: 4.9,
      review_count: 31,
      service_count: 2,
      photo_url: "assets/img/46.jpg",
      university: "كلية الهندسة - جامعة الإسكندرية",
      bio: "مهندس إنشائي يقدم حلول التصميم والتحليل الإنشائي للمباني، مع اهتمام بالتنسيق بين الرسومات والتنفيذ.",
      services: [
        { title: "تصميم إنشائي كامل ومذكرة حسابية", desc: "تحليل إنشائي ولوحات تسليح اقتصادية وآمنة", price: 11000 },
        { title: "معاينة وتقييم سلامة إنشائية وترميم", desc: "تقرير فني مفصل وطرق التدعيم والترميم", price: 3000 }
      ],
      projects: [
        { title: "برج سكني 11 طابق - سموحة", desc: "تصميم إنشائي كامل وتوفير 12% في نسب التسليح", category: "هندسة إنشائية" },
        { title: "تدعيم وترميم مبنى إداري", desc: "معالجة الشروخ وتدعيم الأعمدة والأسقف", category: "ترميم وتدعيم" }
      ],
      reviews: [
        { author: "مقاول/ طارق السيد", rating: 5, date: "منذ شهر", comment: "لوحات إنشائية واضحة واقتصادية جداً في الحديد والخرسانة." }
      ]
    },
    {
      id: 4,
      full_name: "م. منة الله عادل",
      specialty: "electrical",
      specialty_ar: "هندسة كهربائية",
      city: "مدينة نصر",
      governorate: "القاهرة",
      years_experience: 7,
      verified: true,
      is_demo: false,
      avg_rating: 4.7,
      review_count: 15,
      service_count: 2,
      photo_url: "assets/img/68.jpg",
      university: "كلية الهندسة - جامعة القاهرة",
      bio: "مهندسة كهرباء متخصصة في تصميم مخططات القوى والإضاءة وأنظمة التيار الخفيف للمباني.",
      services: [
        { title: "مخططات كهرباء وإضاءة وتيار خفيف", desc: "توزيع البرايز والإنارة واللوحات وحساب الأحمال", price: 5000 },
        { title: "حصر كميات ومقايسة أعمال الكهرباء", desc: "جدول كميات الأسلاك والقواطع والكشافات بدقة", price: 2200 }
      ],
      projects: [
        { title: "مقر شركة تكنولوجيا - التجمع", desc: "تصميم شبكات القوى والداتا والسمارت هوم", category: "كهرباء وتيار خفيف" }
      ],
      reviews: [
        { author: "م. كريم حسن", rating: 5, date: "منذ أسبوع", comment: "شغل منظم جداً ووفر علينا تكسير وتعديلات كتير وقت التأسيس." }
      ]
    },
    {
      id: 5,
      full_name: "م. خالد إبراهيم",
      specialty: "civil",
      specialty_ar: "هندسة مدنية",
      city: "الزقازيق",
      governorate: "الشرقية",
      years_experience: 12,
      verified: true,
      is_demo: false,
      avg_rating: 4.8,
      review_count: 27,
      service_count: 3,
      photo_url: "assets/img/75.jpg",
      university: "كلية الهندسة - جامعة الزقازيق",
      bio: "مهندس مدني بخبرة في متابعة المشروعات وأعمال البنية التحتية وإدارة الموقع وضبط الجودة.",
      services: [
        { title: "إشراف هندسي كامل على التنفيذ والتشطيب", desc: "استلام البنود وإدارة الصنايعية وضبط الجودة", price: null },
        { title: "حصر كميات وإعداد مقايسة تقديرية", desc: "حساب تكلفة المشروع والخامات قبل البدء", price: 3500 },
        { title: "استلام شقة أو فيلا من المطور العقاري", desc: "فحص هندسي شامل لكل البنود قبل الاستلام", price: 1800 }
      ],
      projects: [
        { title: "تشطيب 6 وحدات سكنية - الزقازيق", desc: "إشراف كامل من المحارة حتى التسليم على المفتاح", category: "إشراف وتنفيذ" }
      ],
      reviews: [
        { author: "أ. محمود عبد الفتاح", rating: 5, date: "منذ 10 أيام", comment: "أمانة عالية جداً ومتابعة يومية بالتقارير والصور." }
      ]
    }
  ],

  workers: [
    { id: 1, name: "الحاج محمود الكهربائي", trade: "كهرباء", group: "كهرباء وإضاءة", icon: "⚡", city: "مدينة نصر، القاهرة", experience: "15 سنة خبرة", phone: "01012345678", rating: 4.9, summary: "تأسيس وتشطيب شقق وفيلات، تركيب لوحات التوزيع، سبوتات، بروفايل ليد وأنظمة سمارت.", tags: ["تأسيس كهرباء", "تشطيب إنارة", "لوحات توزيع", "سمارت هوم"] },
    { id: 2, name: "الأسطى حسن السباك", trade: "سباكة", group: "سباكة وعزل", icon: "🚰", city: "الشيخ زايد، الجيزة", experience: "12 سنة خبرة", phone: "01123456789", rating: 4.8, summary: "تأسيس تغذية وصرف، تركيب خلاطات مدفونة وصندوق طرد دفن، كبس مواسير وعزل حمامات.", tags: ["تأسيس سباكة", "خلاطات دفن", "عزل مائي", "صيانة"] },
    { id: 3, name: "الأسطى سعيد النقاش", trade: "دهانات ونقاشة", group: "دهانات وديكور", icon: "🎨", city: "سموحة، الإسكندرية", experience: "14 سنة خبرة", phone: "01234567890", rating: 4.9, summary: "سحب معجون، دهانات بلاستيك قطيفة ولامع، ورق حائط، بانوهات فيوتك وتأثيرات ديكورية.", tags: ["دهانات حديثة", "بانوهات فيوتك", "ورق حائط", "معجون"] },
    { id: 4, name: "الأسطى طارق للسيراميك والبورسلين", trade: "سيراميك وبورسلين", group: "أرضيات وتكسيات", icon: "🧱", city: "الزقازيق، الشرقية", experience: "16 سنة خبرة", phone: "01098765432", rating: 4.8, summary: "تركيب بورسلين ليزر مقاسات كبيرة بمادة اللصق والكلبسات، سيراميك حمامات ومطابخ بوزنات ليزر.", tags: ["بورسلين مقاسات كبيرة", "ميزان ليزر", "سيراميك حمامات", "رخام"] },
    { id: 5, name: "فني محمد للجبس بورد", trade: "جبس بورد وأسقف", group: "دهانات وديكور", icon: "🏛️", city: "التجمع الخامس، القاهرة", experience: "9 سنوات خبرة", phone: "01555667788", rating: 4.7, summary: "تنفيذ أسقف معلقة جبس بورد، بيوت نور، مكتبات شاشات وكرانيش حديثة ومقاومة للرطوبة.", tags: ["جبس بورد", "بيوت نور", "مكتبات شاشات", "أسقف معلقة"] },
    { id: 6, name: "الأسطى إبراهيم النجار", trade: "نجارة أبواب وأخشاب", group: "نجارة وألوميتال", icon: "🪚", city: "المنصورة، الدقهلية", experience: "18 سنة خبرة", phone: "01022334455", rating: 4.9, summary: "تصنيع وتركيب حلوق وأبواب غرف خشب طبيعي وMDF، تجاليد خشبية ومطابخ ودريسنج روم.", tags: ["تركيب أبواب", "دريسنج روم", "تجاليد خشب", "مطابخ"] },
    { id: 7, name: "ورشة النور للألوميتال والـ UPVC", trade: "ألوميتال وشترات", group: "نجارة وألوميتال", icon: "🪟", city: "المعادي، القاهرة", experience: "11 سنة خبرة", phone: "01144556677", rating: 4.8, summary: "تصنيع وتركيب شبابيك وأبواب ألوميتال قطاعات جامبو وPS وقطاعات UPVC عازلة للصوت والأتربة مع شتر.", tags: ["قطاعات UPVC", "ألوميتال جامبو", "شتر", "كابينة شاور"] },
    { id: 8, name: "فني عمرو للتكييف والتبريد", trade: "تكييف وتهوية", group: "كهرباء وإضاءة", icon: "❄️", city: "مصر الجديدة، القاهرة", experience: "10 سنوات خبرة", phone: "01288990011", rating: 4.8, summary: "تأسيس مواسير نحاس دفن للتكييفات، تركيب وصيانة التكييفات الاسبليت والكونسيلد وشحن الفريون.", tags: ["تأسيس تكييف", "تركيب اسبليت", "كونسيلد", "صيانة"] },
    { id: 9, name: "مجموعة الإخلاص للعزل والترميم", trade: "عزل مائي وحراري", group: "سباكة وعزل", icon: "🛡️", city: "6 أكتوبر، الجيزة", experience: "13 سنة خبرة", phone: "01066778899", rating: 4.9, summary: "عزل الأسطح والحمامات والبدرومات وحمامات السباحة باستخدام الممبرين والبيتومين والعزل الأسمنتي.", tags: ["عزل أسطح", "عزل حمامات", "عزل حراري", "معالجة رطوبة"] }
  ],

  suppliers: [
    { id: 1, name: "معرض الصفوة للسيراميك والبورسلين", category: "سيراميك وأدوات صحية", group: "تشطيبات وأرضيات", icon: "🏺", city: "مدينة نصر، القاهرة", delivery: "يتوفر توصيل للموقع", phone: "01001122334", summary: "تشكيلة واسعة من البورسلين المستورد والمحلي، أطقم الحمامات، الخلاطات المدفونة وبانيوهات الأكريليك.", tags: ["بورسلين ليزر", "خلاطات دفن", "أطقم صحية", "مواد لصق"] },
    { id: 2, name: "مؤسسة النور للكهرباء والإضاءة الحديثة", category: "كهرباء وإضاءة", group: "كهرباء وسباكة", icon: "💡", city: "الشيخ زايد، الجيزة", delivery: "توريد للمشروعات والأفراد", phone: "01112233445", summary: "موزع معتمد للأسلاك والكابلات، لوحات القواطع، المفاتيح والبرايز، البروفايل ليد والنجف والسبوتات.", tags: ["أسلاك معتمدة", "مفاتيح وبرايز", "بروفايل ليد", "سبوتات"] },
    { id: 3, name: "مركز ألوان المستقبل للدهانات", category: "دهانات وديكورات", group: "تشطيبات وأرضيات", icon: "🪣", city: "سموحة، الإسكندرية", delivery: "تلوين بالكمبيوتر وتوصيل", phone: "01223344556", summary: "جميع مواد التأسيس والمعجون والدهانات المائية والزيتية، كرانيش فيوتك وبديل الخشب والرخام.", tags: ["تلوين كمبيوتر", "بديل الرخام", "بديل الخشب", "فيوتك"] },
    { id: 4, name: "شركة البنيان للحديد والأسمنت ومواد البناء", category: "حديد وأسمنت وطوب", group: "مواد بناء أساسية", icon: "🏗️", city: "العاشر من رمضان، الشرقية", delivery: "أوناش وتوريد للموقع", phone: "01033445566", summary: "توريد حديد التسليح، الأسمنت البورتلاندي والمقاوم، الرمل والسن والطوب الأحمر والأسمنتي بأسعار الجملة.", tags: ["حديد تسليح", "أسمنت", "طوب ورمل", "توريد للموقع"] },
    { id: 5, name: "الرواد لمهمات السباكة والعزل", category: "سباكة ومواد عزل", group: "كهرباء وسباكة", icon: "🔧", city: "الزقازيق، الشرقية", delivery: "شحن وتوصيل سريع", phone: "01044556677", summary: "مواسير وقطع تغذية وصرف معتمدة مع شهادة الضمان، لفائف ممبرين وشكاير عزل أسمنتي وكيماويات بناء.", tags: ["مواسير بضمان", "عزل أسمنتي", "كيماويات بناء", "صرف وتغذية"] },
    { id: 6, name: "تكنو تولز للمعدات والعدد الهندسية", category: "معدات وعدد وأجهزة مساحة", group: "معدات وخدمات هندسية", icon: "🧰", city: "وسط البلد، القاهرة", delivery: "بيع وتأجير معدات", phone: "01155667788", summary: "بيع وتأجير المعدات الكهربائية، موازين الليزر، أجهزة المساحة، السقالات ومعدات السلامة المهنية للمواقع.", tags: ["ميزان ليزر", "عدد كهربائية", "تأجير معدات", "مهمات سلامة"] }
  ],

  requests: [
    {
      id: 101,
      title: "تصميم معماري وإنشائي لفيلا سكنية",
      specialty: "architecture",
      specialty_ar: "هندسة معمارية",
      governorate: "القاهرة",
      city: "التجمع الخامس",
      budget: "15,000 - 25,000 ج.م",
      area: "420 م²",
      status: "offers_received",
      created_at: "2026-11-12",
      customer_name: "أ. كريم محمود",
      description: "مطلوب تصميم معماري وإنشائي كامل لقطعة أرض 420 متر بدروم وأرضي وأول ورووف مع واجهات مودرن.",
      offers: [
        { id: 1, engineer_id: 1, engineer_name: "م. عمر الشاذلي", specialty_ar: "هندسة معمارية", price: 18500, duration: "14 يوم", note: "يشمل المساقط الأفقية والواجهات 3D والرسومات التنفيذية الكاملة." },
        { id: 2, engineer_id: 3, engineer_name: "م. أحمد فؤاد", specialty_ar: "هندسة إنشائية", price: 16000, duration: "12 يوم", note: "يشمل التصميم الإنشائي الكامل والمذكرة الحسابية وتنسيق المعماري." }
      ]
    },
    {
      id: 102,
      title: "إشراف هندسي على تشطيب شقة 185 متر",
      specialty: "interior",
      specialty_ar: "تصميم داخلي",
      governorate: "الجيزة",
      city: "الشيخ زايد",
      budget: "يحدد بعد المعاينة",
      area: "185 م²",
      status: "open",
      created_at: "2026-11-14",
      customer_name: "أ. كريم محمود",
      description: "الشقة على الطوب الأحمر ومطلوب تصميم داخلي 3D مع باقة إشراف هندسي على مراحل التأسيس والتشطيب.",
      offers: [
        { id: 3, engineer_id: 2, engineer_name: "م. سارة منصور", specialty_ar: "تصميم داخلي", price: 9500, duration: "10 أيام للتصميم", note: "تصميم 3D لكامل الشقة مع جدول خامات ومقايسة تقديرية قبل بدء التنفيذ." }
      ]
    }
  ]
};

// Helper functions
window.BunyoraHelpers = {
  formatMoney(value) {
    return value == null || value === "" ? "يحدد بعد المعاينة" : Number(value).toLocaleString("ar-EG") + " ج.م";
  },
  statusBadge(status) {
    const map = {
      open: { text: "مفتوح", cls: "badge-blue" },
      offers_received: { text: "وصلت عروض", cls: "badge-green" },
      selected: { text: "تم اختيار مهندس", cls: "badge-green" },
      pending: { text: "قيد المراجعة", cls: "badge-yellow" },
      approved: { text: "معتمد", cls: "badge-green" },
      completed: { text: "مكتمل", cls: "badge-green" },
      rejected: { text: "مرفوض", cls: "badge-red" }
    };
    const item = map[status] || { text: status, cls: "badge-blue" };
    return `<span class="badge-status ${item.cls}">${item.text}</span>`;
  },
  getStoredRequests() {
    try {
      const saved = localStorage.getItem("bunyora_requests");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return window.BUNYORA_DATA.requests;
  },
  saveRequest(newReq) {
    const list = this.getStoredRequests();
    list.unshift(newReq);
    try {
      localStorage.setItem("bunyora_requests", JSON.stringify(list));
    } catch (e) {}
    // Also persist directly to MySQL `bunyora_db` via REST API
    fetch("api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newReq.title,
        specialty: newReq.specialty,
        governorate: newReq.governorate,
        city: newReq.city,
        area_sqm: parseInt(newReq.area, 10) || 180,
        budget_range: newReq.budget,
        description: newReq.description,
        customer_name: newReq.customer_name,
        customer_phone: newReq.customer_phone || "01000000000"
      })
    }).catch(() => {});
    return newReq;
  }
};
