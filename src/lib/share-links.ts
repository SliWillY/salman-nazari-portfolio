// Short links for sharing the site from different places, so Google Analytics shows where each visitor came from.
// Every entry becomes   https://sliwilly.github.io/salman-nazari-portfolio/go/<name>/
// which opens the home page tagged ?utm_source=<name>&utm_medium=<medium>&utm_campaign=share_link.
// In GA: Reports → Acquisition → Traffic acquisition, then pick "Session source" (name) or "Session medium".
//
// Add one line per place you share the link. Names: lowercase, no spaces; names with a - need quotes ('email-signature').
// medium groups similar places: social, document, email, qr, message, referral…
// lang: 'ar' to open the Arabic home page instead of the English one.

export type ShareLink = { medium: string; lang?: 'en' | 'ar' };

export const shareLinks: Record<string, ShareLink> = {
   linkedin: { medium: 'social' },
   linktree: { medium: 'social' },
   cv6: { medium: 'document' },
  // 'email-signature': { medium: 'email' },
  // 'business-card': { medium: 'qr' },
};
