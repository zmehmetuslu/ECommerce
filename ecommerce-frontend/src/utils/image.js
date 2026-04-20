export const FALLBACK_IMAGE_URL =
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=80";

export const resolveImageSrc = (imageUrl) => {
  if (!imageUrl) return FALLBACK_IMAGE_URL;
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  return `/images/${imageUrl}`;
};
