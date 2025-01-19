import React, { useState } from 'react';
import clsx from 'clsx'; // For conditional classnames
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';

// Default settings for the image transformations
const defaultTransformations = {
  f: 'auto', // Automatic format (WebP, AVIF, etc.)
  q: 'auto', // Automatic quality adjustment
  w: 500, // Default width (can be adjusted based on screen size or container)
  h: 500, // Default height
  c: 'fill', // Fill the container, cropping as necessary
  g: 'auto', // Auto-focus on the image content (e.g., faces)
};

// OptimizedImage Component
const OptimizedImage = ({
  src,
  alt,
  className,
  transformations = {},
  fallbackImage = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
}) => {
  const [isLoading, setIsLoading] = useState(true); // Track image loading state
  const [hasError, setHasError] = useState(false); // Track image error state

  // Merge default transformations with any custom ones passed in
  const imageTransformations = {
    ...defaultTransformations,
    ...transformations,
  };

  // Generate the optimized image URL, only applying transformations if it's a Cloudinary URL
  const optimizedImageUrl = getOptimizedImageUrl(src, imageTransformations);

  // Handle image loading completion
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // Handle image loading error
  const handleImageError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  // Apply conditional styling using clsx
  const imageClasses = clsx(
    'transition-opacity duration-500 ease-in-out', // Smooth transition for opacity
    'object-cover shadow-2xl', // Standard styles
    className, // Custom class passed in
    {
      'opacity-50': isLoading, // Apply opacity when loading
      'blur-sm': isLoading, // Apply blur when loading
      'bg-gray-300': hasError, // Show a background color when image fails
    }
  );

  return (
    <div className="relative">
      <img
        src={isLoading || hasError ? fallbackImage : optimizedImageUrl} // Fallback on error or loading
        alt={alt}
        className={imageClasses}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy" // Lazy loading
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white">Loading...</span>{' '}
          {/* Optional loading text */}
        </div>
      )}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-red-500 shadow-2xl font-extralight text-center text-[0.89rem]">
            Error loading image
          </span>{' '}
          {/* Fallback UI for errors */}
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
