"use client";

import React, { useState, useEffect, SyntheticEvent } from "react"; // Import SyntheticEvent
import Image, { ImageProps } from "next/image"; // Remove OnError import

interface SafeImageProps extends ImageProps {
  fallbackSrc: string;
  onError?: (event: SyntheticEvent<HTMLImageElement, Event>) => void; // Make onError prop optional and correctly typed
}

export function SafeImage({
  src,
  fallbackSrc,
  onError, // Capture onError passed from props if any, but use internal handler
  ...props
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    // Reset image src if the original src prop changes
    setImgSrc(src);
  }, [src]);

  // Correctly type the event handler parameter
  const handleOnError = (
    errorEvent: SyntheticEvent<HTMLImageElement, Event>
  ) => {
    // Prevent infinite loop if fallback also fails, though unlikely for local placeholder
    const target = errorEvent.currentTarget;
    if (target.src !== fallbackSrc) {
      console.warn(`Image error, falling back: ${String(src)}`); // Ensure src is string for logging
      setImgSrc(fallbackSrc);
      // Call original onError if it was provided
      if (onError) {
        onError(errorEvent);
      }
    } else {
      console.error(`Fallback image failed to load: ${fallbackSrc}`); // Log fallback failure
    }
  };

  return (
    <Image
      src={imgSrc}
      onError={handleOnError}
      {...props} // Spread remaining props (alt, fill, sizes, className, priority, etc.)
    />
  );
}
