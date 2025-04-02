// src/hooks/usePhotoManager.js
import { useState } from "react";

const usePhotoManager = () => {
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const openPhotoModal = () => setIsPhotoModalOpen(true);
  const closePhotoModal = () => setIsPhotoModalOpen(false);

  return { isPhotoModalOpen, openPhotoModal, closePhotoModal };
};

export default usePhotoManager;
