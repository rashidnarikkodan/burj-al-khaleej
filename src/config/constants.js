/**
 * Centralized Application Constants & Configuration
 * Values are read from environment variables (import.meta.env.VITE_*) with fallback defaults.
 */

export const BRAND = {
  NAME: 'Burj Al Khaleej',
  NAME_AR: 'برج الخليج',
  TAGLINE_EN: 'Premium Bakery & Confectionery',
  TAGLINE_AR: 'مخبز وحلويات راقية',
};

export const CONTACT_INFO = {
  PHONE: import.meta.env.VITE_CONTACT_PHONE || '+968 97668570',
  EMAIL: import.meta.env.VITE_CONTACT_EMAIL || 'contact@burjalkhaleej.com',
  SUPPORT_EMAIL: import.meta.env.VITE_SUPPORT_EMAIL || 'burjalkhaleej@gmail.com',
  WHATSAPP_NUMBERS: {
    OM: import.meta.env.VITE_WHATSAPP_OM || '96897668570',
    UAE: import.meta.env.VITE_WHATSAPP_UAE || '971500000000',
    IND: import.meta.env.VITE_WHATSAPP_IND || '919000000000',
    DEFAULT: import.meta.env.VITE_WHATSAPP_DEFAULT || '96897668570'
  }
};

export const SOCIAL_LINKS = {
  INSTAGRAM: import.meta.env.VITE_INSTAGRAM_URL || 'https://www.instagram.com/burj__alkhaleej/',
  FACEBOOK: import.meta.env.VITE_FACEBOOK_URL || 'https://facebook.com',
  TWITTER: import.meta.env.VITE_TWITTER_URL || 'https://twitter.com'
};

export const MAP_DEFAULTS = {
  LAT: parseFloat(import.meta.env.VITE_DEFAULT_LAT) || 21.0,
  LNG: parseFloat(import.meta.env.VITE_DEFAULT_LNG) || 57.0,
  ZOOM: parseFloat(import.meta.env.VITE_DEFAULT_ZOOM) || 6.2
};

/**
 * Returns the appropriate WhatsApp phone number for a given region
 * @param {string} region - Region code (e.g., 'OM', 'UAE')
 * @returns {string} Phone number string
 */
export const getWhatsAppNumber = (region) => {
  return CONTACT_INFO.WHATSAPP_NUMBERS[region] || CONTACT_INFO.WHATSAPP_NUMBERS.DEFAULT;
};

/**
 * Generates a full WhatsApp order link with pre-filled message
 * @param {string} region - Region code
 * @param {string} message - Order message
 * @returns {string} WhatsApp URL string
 */
export const getWhatsAppOrderUrl = (region, message = '') => {
  const phone = getWhatsAppNumber(region);
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${phone}${encodedMsg ? `?text=${encodedMsg}` : ''}`;
};
