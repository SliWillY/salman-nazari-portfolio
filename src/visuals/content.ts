// Everything on salmannazari.com/visuals/: every word, photo and video, and how to get in touch. Arabic only, with
// Western digits (1, 2, 3), the same as the page's big numbers and counts.
// Words in [brackets] are placeholders for the copywriter; the plain ones are working labels, also free to change.
// Media are Cloudinary public IDs, kept under visuals/ in the media library (the portfolio's are under portfolio/).
// An empty id shows a grey box of the same shape, so the layout holds until the photo is uploaded.

export type Ratio = '1:1' | '4:5';

export type Photo = {
  id: string; // e.g. 'visuals/white/sneaker-side'
  alt: string; // what the photo shows, for screen readers and image search
};

export type GalleryPhoto = Photo & { ratio: Ratio };

export const visuals = {
  // The browser tab, search results and link previews.
  title: 'سلمان نظري · تصوير المنتجات',
  description: 'مصور منتجات في جدة، وأغلب عملي أحذية للمتاجر الإلكترونية. أصورها على خلفية بيضاء أو ملونة، ومن كل زاوية يحتاجها المتجر.',
  // The picture in link previews (WhatsApp, X…); empty: the opening's photo, or no picture while that is empty too.
  shareImage: '',
  // false while the page is unfinished: search engines are asked not to index it and it stays out of the sitemap.
  // Set it to true once the photos and words are in; from then on the build fails while any [bracketed] placeholder
  // is left in this file.
  indexed: false,

  header: { name: 'سلمان نظري', tagline: 'تصوير منتجات', contact: 'تواصل' },

  // The opening: the photo leads, then the name and what Salman shoots (together the page's heading), a short intro
  // and the call to action.
  hero: {
    image: { id: '', alt: '' } as Photo, // square on phones, 4:5 beside the name on wide screens: frame the product centrally
    name: ['سلمان', 'نظري'],
    offer: 'تصوير منتجات للمتاجر الإلكترونية',
    intro: 'أغلب ما أصوره أحذية، ومن كل زاوية.\nعلى خلفية بيضاء أو ملونة، هنا في جدة.',
    cta: 'اطلب تصويرا'
  },

  // The band that runs between the opening and the work, separated by small squares.
  marquee: ['تصوير منتجات', 'أحذية', 'خلفية بيضاء', 'زوايا المتجر', 'تعديل', 'تصوير سينمائي'],
  marqueePause: 'إيقاف الشريط المتحرك', // the band's name for screen readers; tapping or focusing it stops it

  // Photos run in two columns on phones (the first half of a group in one, the rest in the other) and four on wide
  // screens. Alternating 4:5 and 1:1 staggers them; keep each half the same mix so the two phone columns end level.
  work: {
    heading: 'الأعمال',
    groupLabel: 'المجموعة',
    groups: [
      {
        name: 'خلفية بيضاء',
        description: 'للصورة الرئيسية في صفحة المنتج.',
        photos: [
          { id: '', alt: '', ratio: '4:5' },
          { id: '', alt: '', ratio: '1:1' },
          { id: '', alt: '', ratio: '1:1' },
          { id: '', alt: '', ratio: '4:5' }
        ] as GalleryPhoto[]
      },
      {
        name: 'خلفية ملونة',
        description: 'لصور الحساب والإعلانات.',
        photos: [
          { id: '', alt: '', ratio: '1:1' },
          { id: '', alt: '', ratio: '4:5' },
          { id: '', alt: '', ratio: '4:5' },
          { id: '', alt: '', ratio: '1:1' }
        ] as GalleryPhoto[]
      },
      {
        name: 'تفاصيل قريبة',
        description: 'الخامة والخياطة عن قرب.',
        photos: [
          { id: '', alt: '', ratio: '4:5' },
          { id: '', alt: '', ratio: '1:1' },
          { id: '', alt: '', ratio: '1:1' },
          { id: '', alt: '', ratio: '4:5' }
        ] as GalleryPhoto[]
      },
      {
        name: 'أزواج ومجموعات',
        description: 'أكثر من قطعة في صورة واحدة.',
        photos: [
          { id: '', alt: '', ratio: '1:1' },
          { id: '', alt: '', ratio: '4:5' },
          { id: '', alt: '', ratio: '4:5' },
          { id: '', alt: '', ratio: '1:1' }
        ] as GalleryPhoto[]
      }
    ]
  },

  // One product from every angle a store listing needs, all 1:1.
  angles: {
    heading: 'كل الزوايا',
    items: [
      { label: 'جانب', id: '', alt: '' },
      { label: 'داخل', id: '', alt: '' },
      { label: 'أمام', id: '', alt: '' },
      { label: 'خلف', id: '', alt: '' },
      { label: 'أعلى', id: '', alt: '' },
      { label: 'نعل', id: '', alt: '' },
      { label: '3/4', id: '', alt: '' },
      { label: 'تفصيل', id: '', alt: '' }
    ]
  },

  // The same shot straight from the camera and after retouching, both 4:5.
  beforeAfter: {
    heading: 'قبل / بعد',
    before: { label: 'من الكاميرا', note: 'بدون أي تعديل', id: '', alt: '' },
    after: { label: 'بعد التعديل', note: 'جاهزة للمتجر', id: '', alt: '' }
  },

  // A short ask between the angles and the retouching, for whoever has seen enough; its button reads like the opening's.
  ask: {
    line: 'أرسل لي نوع منتجاتك وعددها، وأرد عليك بالسعر والموعد.'
  },

  // logo: a one-colour logo's public ID; empty: the name shows instead.
  brands: {
    heading: 'عملت مع',
    items: [
      { name: '[شعار 1]', logo: '' },
      { name: '[شعار 2]', logo: '' },
      { name: '[شعار 3]', logo: '' }
    ]
  },

  // How a shoot runs, each step with one line of what happens in it.
  process: {
    heading: 'طريقة العمل',
    steps: [
      { name: 'الطلب', note: 'ترسل لي نوع المنتجات وعددها، ونتفق على الموعد.' },
      { name: 'التصوير', note: 'أصور في جدة، على الخلفية التي تختارها.' },
      { name: 'التعديل', note: 'أعدل كل صورة قبل التسليم.' },
      { name: 'التسليم', note: 'تصلك الصور جاهزة للرفع خلال [مدة التسليم].' }
    ]
  },

  // What a brand receives, as label and value rows, right before the contact.
  deliverables: {
    heading: 'ما تستلمه',
    items: [
      { label: 'الزوايا', value: '[عدد الزوايا لكل منتج]' },
      { label: 'المقاسات', value: '1:1 و4:5' },
      { label: 'الخلفية والصيغة', value: 'بيضاء أو ملونة، بصيغة [JPG أو PNG]' },
      { label: 'مدة التسليم', value: '[عدد أيام العمل]' },
      { label: 'السعر', value: '[للمنتج الواحد أو للمجموعة]' }
    ]
  },

  // Cinematography: the showreel (a Cloudinary video), and one frame as shot in LOG beside the same frame graded.
  film: {
    heading: 'تصوير سينمائي',
    reel: { id: '', poster: '', title: 'مقاطع من أعمالي' }, // poster: a photo's public ID; empty: the reel's first frame
    log: { label: 'قبل التلوين', id: '', alt: '' } as Photo & { label: string },
    graded: { label: 'بعد التلوين', id: '', alt: '' } as Photo & { label: string },
    caption: 'التلوين على DaVinci Resolve، من LOG إلى Rec.709'
  },

  // Empty WhatsApp or Instagram: that line is left off. A new email or WhatsApp message opens already filled in with
  // the subject and the questions below, so the first message carries what a quote needs.
  contact: {
    heading: 'لنعمل معا',
    email: 'salmansaif@live.com',
    emailSubject: 'طلب تصوير منتجات',
    emailBody: 'اسم المتجر:\nنوع المنتجات وعددها:\nالموعد المطلوب:\n',
    copyLabel: 'نسخ العنوان',
    copiedLabel: 'تم النسخ',
    whatsapp: '', // international format, e.g. '9665XXXXXXXX' (spaces and + are dropped)
    whatsappLabel: 'واتساب',
    whatsappText: 'السلام عليكم، أبغى تصوير لمنتجات متجري.',
    instagram: '', // the handle without @
    instagramLabel: 'إنستغرام',
    note: '[متى ترد عادة على الرسائل]'
  }
};
