// Everything on salmannazari.com/visuals/: every word, photo and video, and how to get in touch. Arabic only.
// The words are placeholders until Salman writes the real ones.
// Media are Cloudinary public IDs, kept under visuals/ in the media library (the portfolio's are under portfolio/).

export type Photo = {
  id: string; // e.g. 'visuals/photos/perfume-01'
  alt: string; // what the photo shows, for screen readers and image search
};

export type Video = {
  id: string; // e.g. 'visuals/videos/perfume-reel'
  title: string; // what it shows, read out by screen readers
  poster?: string; // a photo's public ID to show before it plays; without one, the video's first frame
};

export const visuals = {
  // The browser tab, search results and link previews.
  title: 'سلمان نظري · تصوير المنتجات',
  description: 'تصوير فوتوغرافي وفيديو للمنتجات.',
  // The picture in link previews (WhatsApp, X…); empty: the preview shows the title and description only.
  shareImage: '',

  hero: {
    heading: 'سلمان نظري',
    text: 'تصوير فوتوغرافي وفيديو للمنتجات',
    image: { id: '', alt: '' } as Photo // empty id: no picture
  },

  // A section with no items is left off the page.
  photos: {
    heading: 'الصور',
    items: [
      // { id: 'visuals/photos/perfume-01', alt: 'زجاجة عطر على رخام أبيض' },
    ] as Photo[]
  },

  videos: {
    heading: 'الفيديو',
    items: [
      // { id: 'visuals/videos/perfume-reel', title: 'إعلان قصير لعطر' },
    ] as Video[]
  },

  // Empty ones are left off.
  contact: {
    heading: 'تواصل',
    email: 'salmansaif@live.com',
    whatsapp: '', // international format, digits only, e.g. '9665XXXXXXXX'
    instagram: '', // the handle without @
    labels: { email: 'البريد الإلكتروني', whatsapp: 'واتساب', instagram: 'إنستغرام' }
  }
};
