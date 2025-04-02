// src/hooks/useCarousel.js
import { useState } from "react";

const useCarousel = () => {
  const [carouselImages, setCarouselImages] = useState([]);
  const [openCarousel, setOpenCarousel] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Opens the carousel modal with images from the given property.
  // Expects a showNotification callback to handle empty image arrays.
  const openCarouselWithProperty = (property, showNotification) => {
    let images = [];
    if (property.photo_urls && typeof property.photo_urls === "object") {
      images = Object.values(property.photo_urls).flat();
    }
    if (images.length > 0) {
      setCarouselImages(images);
      setCurrentIndex(0);
      setOpenCarousel(true);
    } else {
      showNotification("No images available for this property.", "info");
    }
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev < carouselImages.length - 1 ? prev + 1 : prev));
  };

  const closeCarousel = () => setOpenCarousel(false);

  return {
    carouselImages,
    openCarousel,
    currentIndex,
    openCarouselWithProperty,
    prevImage,
    nextImage,
    closeCarousel,
  };
};

export default useCarousel;
