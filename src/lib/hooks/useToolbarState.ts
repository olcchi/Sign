import { useState, useEffect, RefObject } from 'react';
import { processImageFile } from '../image-utils';
import { ImageSize } from '../types/common';

export interface ToolbarState {
  isOpen: boolean;
  isActive: boolean;
  activeTab: "menu" | null;
  openPanel: () => void;
  closePanel: () => void;
  handleImageChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    onImageChange: (url: string | null) => void,
    setPreviewImage: (url: string | null) => void,
    setImageSize: (size: ImageSize | null) => void
  ) => void;
}

/**
 * Hook for managing toolbar visibility, edit modes, and media handling
 * 
 * Centralizes all toolbar interaction states and provides methods for
 * panel visibility, text editing, and image processing.
 */
export const useToolbarState = (): ToolbarState => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"menu" | null>(null);
  const [isActive, setIsActive] = useState(true);

  // Auto-hide toolbar after inactivity
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleUserInteraction = () => {
      setIsActive(true);
      clearTimeout(timeoutId);

      if (isOpen) return;

      timeoutId = setTimeout(() => {
        setIsActive(false);
      }, 3000);
    };

    handleUserInteraction();

    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];
    events.forEach((event) => {
      window.addEventListener(event, handleUserInteraction);
    });

    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) => {
        window.removeEventListener(event, handleUserInteraction);
      });
    };
  }, [isOpen]);

  // Show panel with menu tab active
  const openPanel = () => {
    setIsOpen(true);
    setActiveTab("menu");
  };

  // Hide panel and reset active tab
  const closePanel = () => {
    setIsOpen(false);
    setActiveTab(null);
  };

  // Process and optimize image uploads
  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onImageChange: (url: string | null) => void,
    setPreviewImage: (url: string | null) => void,
    setImageSize: (size: ImageSize | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Convert file to optimized image data
      const { backgroundImage, previewImage } = await processImageFile(file);
      
      // Update state with processed image
      onImageChange(backgroundImage);
      setPreviewImage(previewImage);
      
      // Get dimensions for positioning controls
      const img = new Image();
      img.onload = () => {
        setImageSize({
          width: img.width,
          height: img.height,
        });
      };
      img.src = backgroundImage;
    } catch (error) {
      console.error("Error processing image:", error);
    }
  };

  return {
    isOpen,
    isActive,
    activeTab,
    openPanel,
    closePanel,
    handleImageChange
  };
}; 