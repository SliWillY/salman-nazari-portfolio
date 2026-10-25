// Everything on salmannazari.com/visuals/: every word, photo and video, and how to get in touch. Arabic only.
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
  description: '[وصف قصير للصفحة يظهر في نتائج البحث]',
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
    intro: '[سطر تعريفي]\n[سطر ثانٍ]',
    cta: 'اطلب تصويرًا'
  },

  // The band that runs between the opening and the work, separated by small squares.
  marquee: ['تصوير منتجات', 'أحذية', 'خلفية بيضاء', 'زوايا المتجر', 'تعديل', 'سينماتوغرافي'],

  // Photos run in two columns on phones (the first half of a group in one, the rest in the other) and four on wide
  // screens. Alternating 4:5 and 1:1 staggers them; keep each half the same mix so the two phone columns end level.
  work: {
    heading: 'الأعمال',
    groupLabel: 'المجموعة',
    groups: [
      {
        name: 'خلفية بيضاء',
        description: '[وصف قصير]',
        photos: [
          { id: '', alt: '', ratio: '4:5' },
          { id: '', alt: '', ratio: '1:1' },
          { id: '', alt: '', ratio: '1:1' },
          { id: '', alt: '', ratio: '4:5' }
        ] as GalleryPhoto[]
      },
      {
        name: 'خلفية ملوّنة',
        description: '[وصف قصير]',
        photos: [
          { id: '', alt: '', ratio: '1:1' },
          { id: '', alt: '', ratio: '4:5' },
          { id: '', alt: '', ratio: '4:5' },
          { id: '', alt: '', ratio: '1:1' }
        ] as GalleryPhoto[]
      },
      {
        name: 'تفاصيل قريبة',
        description: '[وصف قصير]',
        photos: [
          { id: '', alt: '', ratio: '4:5' },
          { id: '', alt: '', ratio: '1:1' },
          { id: '', alt: '', ratio: '1:1' },
          { id: '', alt: '', ratio: '4:5' }
        ] as GalleryPhoto[]
      },
      {
        name: 'أزواج ومجموعات',
        description: '[وصف قصير]',
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
      { label: '٣/٤', id: '', alt: '' },
      { label: 'تفصيل', id: '', alt: '' }
    ]
  },

  // The same shot straight from the camera and after retouching, both 4:5.
  beforeAfter: {
    heading: 'قبل / بعد',
    tag: 'RAW / FINAL',
    before: { label: 'قبل', note: '[ملاحظة]', id: '', alt: '' },
    after: { label: 'بعد', note: '[ملاحظة]', id: '', alt: '' }
  },

  // logo: a one-colour logo's public ID; empty: the name shows instead.
  brands: {
    heading: 'عملت مع',
    items: [
      { name: '[شعار ١]', logo: '' },
      { name: '[شعار ٢]', logo: '' },
      { name: '[شعار ٣]', logo: '' }
    ]
  },

  process: {
    heading: 'طريقة العمل',
    steps: ['الطلب', 'التصوير', 'التعديل', 'التسليم']
  },

  // Cinematography: the showreel (a Cloudinary video), and one frame as shot in LOG beside the same frame graded.
  film: {
    heading: 'سينماتوغرافي',
    reel: { id: '', poster: '', title: '[عرض الأعمال]' }, // poster: a photo's public ID; empty: the reel's first frame
    log: { label: 'LOG', id: '', alt: '' } as Photo & { label: string },
    graded: { label: 'بعد التلوين', id: '', alt: '' } as Photo & { label: string },
    caption: 'DaVinci Resolve — LOG → Rec.709'
  },

  // Empty WhatsApp or Instagram: that line is left off.
  contact: {
    kicker: '[سطر صغير]',
    heading: 'لنعمل معًا',
    email: 'salmansaif@live.com',
    whatsapp: '', // international format, digits only, e.g. '9665XXXXXXXX'
    whatsappLabel: 'واتساب',
    instagram: '', // the handle without @
    instagramLabel: 'إنستغرام'
  }
};
