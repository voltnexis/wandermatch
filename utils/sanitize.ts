// Utility functions for sanitizing user input to prevent XSS attacks

export const sanitizeText = (text: string | undefined | null): string => {
  if (!text) return '';
  
  return text
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/["']/g, '') // Remove quotes
    .replace(/&/g, '&amp;') // Escape ampersands
    .trim();
};

export const sanitizeHtml = (html: string | undefined | null): string => {
  if (!html) return '';
  
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/&/g, '&amp;');
};

export const validateUserId = (userId: string | undefined | null): boolean => {
  if (!userId) return false;
  
  // UUID v4 format validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(userId);
};

export const sanitizeUserProfile = (profile: any) => {
  if (!profile) return null;
  
  return {
    ...profile,
    name: sanitizeText(profile.name),
    bio: sanitizeText(profile.bio),
    current_city: sanitizeText(profile.current_city),
    current_district: sanitizeText(profile.current_district),
  };
};