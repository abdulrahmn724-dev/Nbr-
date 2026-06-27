/* ============================================================
   NBR — site content (single source of truth for client-rendered data)
   Loaded as a blocking script BEFORE app.js so window.SITE is ready.
   Phase 1: static bridge. Phase 2: this payload is produced from the
   Supabase-backed admin (same shape), so app.js never changes.
   ============================================================ */
window.SITE = {
  gallery: [
    { cat: "أثاث",   title: "طاولة طعام زجاجية",   cap: "رحبة لثمانية أشخاص على قاعدة من الجوز",        ar: "1/1",        img: "/images/g-dining.jpeg" },
    { cat: "مغاسل",  title: "مغسلة بحافة طبيعية",   cap: "لوح خشبي واحد يحتضن حوضين حجريين",              ar: "1200/1600", img: "/images/g-bath-burl.jpeg" },
    { cat: "معماري", title: "جدار شرائح مُضاء",     cap: "شرائح جوز تبرز جمالها إضاءة خلفية مخفية",       ar: "1200/1600", img: "/images/g-slatwall.jpeg" },
    { cat: "أثاث",   title: "كونسول حجر وبرونز",    cap: "سطح ترافرتين فاخر على قاعدة فولاذية متينة",     ar: "1200/1600", img: "/images/g-console-stone.jpeg" },
    { cat: "زخرفي",  title: "لوحة مناظر متدرّجة",   cap: "فن التطعيم بمزيج من خشب الجوز والبلوط",         ar: "1200/1600", img: "/images/g-relief.jpeg" },
    { cat: "مغاسل",  title: "مغسلة رخامية",         cap: "أرجل خشبية مخروطة ضمن إطار من البلوط",          ar: "960/1280",  img: "/images/g-vanity-green.jpeg" },
    { cat: "تجاري",  title: "تجهيز «مقهى رتوة»",    cap: "مقاعد، فواصل خشبية، ونجارة متكاملة",            ar: "1600/1066", img: "/images/g-cafe-ratwah.jpeg" },
    { cat: "معماري", title: "درجات سلّمٍ معلّقة",   cap: "خشب صلب متين يكسو هيكلاً فولاذياً مخفياً",       ar: "900/1600",  img: "/images/g-stair.jpeg" },
    { cat: "زخرفي",  title: "مزهريات نحتية",        cap: "طقم من أربع قطع، نُحتت من أخشاب متنوعة",        ar: "904/1600",  img: "/images/g-vases.jpeg" },
    { cat: "أثاث",   title: "طاولة قهوة مقوّسة",    cap: "أرجل بلوط تحمل سطحاً زجاجياً بشفافية تامة",     ar: "900/1600",  img: "/images/g-coffee.jpeg" },
    { cat: "مغاسل",  title: "مغسلة كونسول",         cap: "رف مفتوح عملي وسطح رخامي أنيق",                 ar: "960/1280",  img: "/images/g-vanity-yellow.jpeg" },
    { cat: "خزائن",  title: "وحدة تلفاز جدارية",    cap: "مزيج البلوط والخيزران محاط بإطار داكن",         ar: "1200/1600", img: "/images/g-media-wall.jpeg" },
    { cat: "تجاري",  title: "كاونتر خدمة مقهى",     cap: "واجهة خشبية مبطّنة ومُضاءة بعناية",             ar: "1600/1066", img: "/images/g-cafe-bar.jpeg" },
    { cat: "معماري", title: "باب خشبي شرائحي",      cap: "صنوبر معالج حرارياً بتصميم عمودي أنيق",         ar: "900/1600",  img: "/images/g-door.jpeg" },
    { cat: "زخرفي",  title: "مخطوطة عربية محفورة",  cap: "حروف من البلوط، شُكلت يدوياً بدقة",             ar: "1200/1600", img: "/images/g-calligraphy.jpeg" },
    { cat: "أثاث",   title: "طاولة ومقاعد (بنش)",   cap: "من خشب البلوط الداكن والصلب",                   ar: "1/1",       img: "/images/g-refectory.jpeg" },
    { cat: "مغاسل",  title: "مغسلتا بلوط متجاورتان", cap: "تصميم ركني ذكي مع تجهيزات نحاسية عتيقة",       ar: "1600/1336", img: "/images/g-vanity-blue.jpeg" },
    { cat: "خزائن",  title: "وحدة غرفة ألعاب",      cap: "قطعة مدمجة وعملية تضفي مرحاً على مساحة الأطفال", ar: "1200/1600", img: "/images/g-playroom.jpeg" },
    { cat: "تجاري",  title: "محل حلويات",           cap: "جدار دافئ من الشرائح الخشبية",                  ar: "1200/1600", img: "/images/g-dessert-bar.jpeg" },
    { cat: "معماري", title: "فاصل بارتفاع طابقين",  cap: "واجهة مهيبة من شرائح خشب الأرز",                ar: "720/1280",  img: "/images/g-facade.jpeg" },
    { cat: "زخرفي",  title: "جوائز تذكارية",        cap: "كؤوس خشبية صُممت وحُفرت خصيصاً للمناسبة",       ar: "1200/1600", img: "/images/g-awards.jpeg" }
  ],

  woods: [
    { name: "الجوز",     latin: "Walnut",   best: "الأثاث الفاخر · النجارة المميزة",
      note: "بلونه البني الداكن المائل للشوكولاتة وتوشيحاته الرمادية والبنفسجية — خشب غني، أنيق، وجريء لقطع تخطف الأنظار.",
      grad: "linear-gradient(155deg,#7A5331 0%,#5A3A20 50%,#3C2614 100%)" },
    { name: "البلوط",    latin: "Oak",      best: "الطاولات · الأرضيات · الأبواب",
      note: "قوي بعروقه الواضحة ولونه الذهبي الفاتح الذي يعتّق بمرور الزمن ليصبح بلون العسل الدافئ. خيارك الأمثل للقوة والأصالة.",
      grad: "linear-gradient(155deg,#DBB67E 0%,#C49A5C 45%,#A87C40 100%)" },
    { name: "التيك (الساج)", latin: "Teak", best: "الأثاث الخارجي · الحمامات",
      note: "غني بالزيوت الطبيعية بلون ذهبي مائل للبني، يتحدى الرطوبة وعوامل الطقس — رفيقك الدائم للمساحات الداخلية والخارجية.",
      grad: "linear-gradient(155deg,#B58451 0%,#9A6B3C 50%,#7B5028 100%)" },
    { name: "الماهوجني", latin: "Mahogany", best: "الطاولات · القطع المميزة",
      note: "أحمر بنّي فاخر بلمعان دافئ وعروق ناعمة منتظمة — خيار راقٍ يمنح القطعة حضوراً كلاسيكياً ثرياً.",
      grad: "linear-gradient(155deg,#9C4A2E 0%,#7E3520 50%,#5A2415 100%)" },
    { name: "الدردار",   latin: "Ash",      best: "الأشكال المنحنية · الكراسي",
      note: "خشب فاتح بمرونة استثنائية وعروق ساحرة؛ ينحني ولا ينكسر. مريح للعين وأصلب مما تتخيل.",
      grad: "linear-gradient(155deg,#E2D2B2 0%,#CDBA92 50%,#B19E76 100%)" },
    { name: "القيقب",    latin: "Maple",    best: "الخزائن · الديكور العصري",
      note: "فاتح وناعم بعروق دقيقة يمنح مظهراً عصرياً نظيفاً — مثالي للمساحات الحديثة والتفاصيل الراقية.",
      grad: "linear-gradient(155deg,#EAD9B8 0%,#DBC59B 50%,#C7AC78 100%)" },
    { name: "الزان",     latin: "Beech",    best: "القطع المخروطة · أدوات المطبخ",
      note: "ناعم، متجانس، ولونه كريمي هادئ. صديق الحرفيين؛ متين، ودود لليد، ومريح في الاستخدام اليومي.",
      grad: "linear-gradient(155deg,#ECD6AC 0%,#D8BC8B 50%,#BE9F69 100%)" },
    { name: "الأرز",     latin: "Cedar",    best: "الخزائن · التكسيات · الأعمال الخارجية",
      note: "عطري ومقاوم للحشرات بطبيعته، بلون دافئ محمرّ — مثالي للتكسيات والخزائن وكل ما يدوم.",
      grad: "linear-gradient(155deg,#C98A5A 0%,#A96B3E 50%,#834B27 100%)" }
  ],

  works: [
      { img: "/images/g-bath-burl.jpeg",    cat: "مغاسل وحمامات", title: "مغسلة بحافة طبيعية" },
      { img: "/images/g-slatwall.jpeg",     cat: "أعمال معمارية", title: "جدار شرائح مُضاء" },
      { img: "/images/g-dining.jpeg",       cat: "أثاث",          title: "طاولة طعام زجاجية" },
      { img: "/images/g-relief.jpeg",       cat: "قطع ديكور",     title: "لوحة مناظر متدرّجة" },
      { img: "/images/g-cafe-ratwah.jpeg",  cat: "مساحات تجارية", title: "تجهيز «مقهى رتوة»" },
      { img: "/images/g-stair.jpeg",        cat: "أعمال معمارية", title: "درجات سلّمٍ معلّقة" }
    ]
};
window.SITE.text = window.SITE.text || {};
