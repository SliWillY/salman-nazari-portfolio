// The brief: Salman on one A4 sheet, at /<lang>/brief/ (src/pages/[lang]/brief.astro, styles in src/styles/brief.css).
// The page is unlisted: nothing on the site links to it and it stays out of the sitemap and of search engines, so
// only people who are given the link see it.
// Its button downloads the sheet as a PDF (public/brief/), which `pnpm brief` renders from the page itself: run it
// again after changing anything here or in the sheet's design, then commit the PDFs.
// Every text is { en, ar }. The sheet is exactly one page, so keep texts about as long as they are: `pnpm brief`
// stops with a message if a language no longer fits.
import type { Lang } from './i18n';

// Where the site lives. Links printed on the sheet are full addresses: a PDF has no site to be relative to.
export const siteUrl = 'https://salmannazari.com';
export const briefPdf = (lang: Lang) => `brief/salman-nazari-brief-${lang}.pdf`;

export const brief = {
  title: { en: 'Brief', ar: 'نبذة مختصرة' },
  description: {
    en: 'Salman Nazari on one page: who I am, what I do and what I have learned.',
    ar: 'سلمان نظري في صفحة واحدة: من أنا، وماذا أعمل، وماذا تعلّمت.'
  },
  // The portrait: a Cloudinary public ID (the same photo as on About).
  photo: { publicId: 'صورة_سلمان_شماغ_yqlxvv', alt: { en: 'Portrait of Salman Nazari', ar: 'صورة سلمان نظري' } },
  hi: { en: "Hi, I'm", ar: 'مرحباً، أنا' },
  // The line under the name. In Arabic it is the home page's headline.
  role: { en: 'Human-Centered Designer', ar: 'أصمم تجارب تبقى في الذاكرة' },

  about: {
    heading: { en: 'A bit about me', ar: 'نبذة عني' },
    text: {
      en: 'I design experiences around how people really think, feel and play. I started with 3D in 2016, studied game design in Istanbul, then learned what moves people by running an online store and a gamified competition for 60 students. Today I take ideas from sketch to working prototype.',
      ar: 'أحب أفهم كيف تعمل الأشياء، وكيف تتحول الأفكار إلى شيء ملموس يمكن للناس تجربته والتفاعل معه. أستمتع ببناء العوالم ثلاثية الأبعاد، والتصوير، وتجربة تقنيات الرسوميات، كما يثير اهتمامي فهم سلوك الناس وما الذي يجذب انتباههم ويحفزهم على التفاعل والاستمرار. أميل إلى ملاحظة التفاصيل،  سواء في تكوين مشهد وإضاءته أو في طريقة عمل تجربة رقمية وسهولة استخدامها. أجمع بين الحس البصري والتفكير المنطقي، وأحب أن أفهم الصورة كاملة ثم أعمل على تفاصيلها، من الفكرة الأولى إلى أن أرى النتيجة تعمل أمامي.'
    }
  },

  // Facts under the introduction: a label, a value and, if wanted, a smaller note under it.
  facts: [
    { label: { en: 'From', ar: 'من' }, value: { en: 'Jeddah, Saudi Arabia', ar: 'جدة، المملكة العربية السعودية' } },
    {
      label: { en: 'Education', ar: 'التعليم' },
      value: { en: "Bachelor's in Game Design", ar: 'بكالوريوس تصميم الألعاب' },
      note: { en: 'Bahçeşehir University, Istanbul · 2023', ar: 'جامعة بهچه شهير، إسطنبول · 2023' }
    }
  ],

  // The three worlds, in the site's order. slug is the world's page: the world takes its colour, shape and number
  // from it.
  worlds: {
    heading: { en: 'My three worlds', ar: 'عوالمي الثلاثة' },
    items: [
      {
        slug: 'ux-and-gamification',
        title: { en: 'Engagement Designer', ar: 'تصميم التفاعل والتلعيب' },
        // label: { en: 'UX & gamification', ar: 'تجربة المستخدم والتلعيب' },
        text: {
          en: 'I study what motivates people, then design journeys, rewards and feedback loops that keep them coming back.',
          ar: 'اقوم بدراسة طبيعة البشر وما يحفزهم لاتخاذ قراراتهم وتفاعلهم مع المنتجات ثم اصمم تجارب تفاعلية حيث يحفزهم في التقدم والإستمرار.'
        }
      },
      {
        slug: 'games-dev',
        title: { en: 'Game Developer', ar: 'تطوير الألعاب' },
        // label: { en: 'Level design, game art & code', ar: 'تصميم المراحل والفن والبرمجة' },
        text: {
          en: 'I build playable prototypes and atmospheric levels, from the design document to the final lighting.',
          ar: 'أبني العاب ونماذج اولية قابلة للعب واصمم التجربة لتكون ممتعة ومسلية من التخطيط و البرمجة حتى التصميم.'
        }
      },
      {
        slug: '3d-renders',
        title: { en: '3D Artist', ar: 'الفن ثلاثي الأبعاد' },
        // label: { en: 'Modeling, lighting & rendering', ar: 'النمذجة والإضاءة والإخراج' },
        text: {
          en: 'I model, texture, light and render products and environments until the picture tells its own story.',
          ar: 'اصمم نماذج ثلاثية الأبعاد وعوالم افتراضية واقوم بإضائة المشهد واحيائها حتى تعكس القصة التي اريد إيصالها.'
        }
      }
    ]
  },

  certificates: {
    heading: { en: 'Certificates', ar: 'الشهادات' },
    items: [
      { issuer: { en: 'Harvard', ar: 'هارفارد' }, name: { en: 'CS50x: Introduction to Computer Science', ar: 'مقدمة في علوم الحاسب (CS50x)' } },
      { issuer: { en: 'Harvard', ar: 'هارفارد' }, name: { en: 'CS50P: Introduction to Programming with Python', ar: 'مقدمة في البرمجة بلغة بايثون (CS50P)' } },
      { issuer: { en: 'University of Pennsylvania', ar: 'جامعة بنسلفانيا' }, name: { en: 'Gamification', ar: 'التلعيب' } },
      { issuer: 'Google', name: { en: 'Foundations of Digital Marketing and E-commerce', ar: 'أساسيات التسويق الرقمي والتجارة الإلكترونية' } },
      { issuer: 'Google', name: { en: 'Attract and Engage Customers with Digital Marketing', ar: 'جذب العملاء والتفاعل معهم عبر التسويق الرقمي' } }
    ]
  },

  // The page's buttons (not on the sheet). short: the label on a phone's top bar.
  download: { en: 'Download PDF', ar: 'تحميل PDF', short: 'PDF' },
  portfolio: { en: 'See my work', ar: 'شاهد أعمالي' },
  // What a screen reader calls the sheet's QR code, which opens the site's home page in the sheet's language.
  qr: { en: 'QR code to salmannazari.com', ar: 'رمز QR لموقع salmannazari.com' }
} as const;
