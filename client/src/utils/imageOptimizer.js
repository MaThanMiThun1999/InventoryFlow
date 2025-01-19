export const getOptimizedImageUrl = (url, transformations = {}) => {
  // Validate that the URL is a valid string
  if (!url || typeof url !== 'string') {
    // console.warn('Invalid URL provided to getOptimizedImageUrl:', url);
    return ''; // Return an empty string or a fallback URL
  }

  // Check if the URL is a Cloudinary URL
  if (!url.includes('res.cloudinary.com')) {
    return url; // If not a Cloudinary URL, return the original URL as is
  }

  const baseCloudinaryUrl = 'https://res.cloudinary.com/dpbmyntdu/image/upload';

  // Extract the public ID and path from the original Cloudinary URL
  const [_, path] = url.split('/upload/');
  if (!path) {
    console.warn('Unable to extract path from Cloudinary URL:', url);
    return url; // Return the original URL if the format is unexpected
  }

  // Apply transformations to the image
  const transformationString = Object.entries(transformations)
    .map(([key, value]) => `${key}_${value}`)
    .join(',');

  return `${baseCloudinaryUrl}/${transformationString}/${path}`;
};
