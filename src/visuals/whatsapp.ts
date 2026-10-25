// WhatsApp, the page's main way in (content.ts, contact): the chat link with the greeting already typed, and the
// number as Saudis write it. The calls to action in the opening and mid-page open the chat; without a number they
// jump to the contact section instead.
import { visuals } from './content';

const { whatsapp, whatsappText } = visuals.contact;
const number = whatsapp.replace(/\D/g, '');

export const whatsappHref = number ? `https://wa.me/${number}?text=${encodeURIComponent(whatsappText)}` : '';

// 966532411688 → 053 241 1688
export const whatsappDisplay = number.startsWith('966') ? `0${number.slice(3)}`.replace(/^(\d{3})(\d{3})(\d+)$/, '$1 $2 $3') : number;

export const ctaHref = whatsappHref || '#contact';
// A chat opens in its own tab (or the app on phones), so the page stays where it was.
export const ctaTarget = whatsappHref ? { target: '_blank', rel: 'noopener' } : {};
