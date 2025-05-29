import { useState, useEffect, RefObject } from "react";
import { getImageSliderState } from "@/lib/image-utils";
import { ImageSize } from "@/lib/types/common";

/**
 * Hook for managing background image functionality
 * 
 * Centralizes background image handling logic including:
 * - Image dimensions tracking for proper positioning
 * - Responsive container size monitoring
 * - Upload, preview and removal functionality
 * - Position adjustment controls
 * 
 * Reduces complexity in UI components by abstracting image manipulation
 * and state management into a single location.
 * 
 * @param backgroundImage - Current background image URL
 * @param onBackgroundImageChange - Callback to update the image URL
 * @param previewContainerRef - Reference to the preview container element 
 * @param fileInputRef - Reference to the file input element
 * @param handleImageChange - Function to process image file changes
 * @param backgroundPosition - Current image position coordinates
 * @param onBackgroundPositionChange - Callback to update position
 * @param isOpen - Whether the parent container is open
 */
export function useBackgroundImage(
  backgroundImage: string | null,
  onBackgroundImageChange: (imageUrl: string | null) => void,
  previewContainerRef: RefObject<HTMLDivElement | null>,
  fileInputRef: RefObject<HTMLInputElement | null>,
  handleImageChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    onBackgroundImageChange: (imageUrl: string | null) => void,
    setPreviewImage: React.Dispatch<React.SetStateAction<string | null>>,
    setImageSize: React.Dispatch<React.SetStateAction<ImageSize | null>>
  ) => void,
  backgroundPosition: { x: number; y: number },
  onBackgroundPositionChange: (position: { x: number; y: number }) => void,
  isOpen: boolean
) {
  const [imageSize, setImageSize] = useState<ImageSize | null>(null);
  const [containerSize, setContainerSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Track background image dimensions for position controls
  useEffect(() => {
    if (backgroundImage) {
      const img = new window.Image();
      img.onload = () => {
        setImageSize({
          width: img.width,
          height: img.height,
        });
      };
      img.src = backgroundImage;
    } else {
      setImageSize(null);
    }
  }, [backgroundImage]);

  // Monitor container size changes for responsive adjustments
  useEffect(() => {
    if (previewContainerRef.current && backgroundImage) {
      const updateContainerSize = () => {
        const container = previewContainerRef.current;
        if (container) {
          setContainerSize({
            width: container.clientWidth,
            height: container.clientHeight,
          });
        }
      };

      updateContainerSize();
      window.addEventListener("resize", updateContainerSize);
      window.addEventListener("orientationchange", () => {
        setTimeout(updateContainerSize, 100);
      });

      return () => {
        window.removeEventListener("resize", updateContainerSize);
        window.removeEventListener("orientationchange", updateContainerSize);
      };
    }
  }, [backgroundImage, isOpen, previewContainerRef]);

  // Determine when position sliders should be disabled
  const sliderDisabled = getImageSliderState(imageSize);

  // Handle file upload
  const handleFileChangeWrapped = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageChange(e, onBackgroundImageChange, setPreviewImage, setImageSize);
  };

  // Trigger file upload
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Remove background image
  const removeBackgroundImage = () => {
    onBackgroundImageChange(null);
  };

  // Handle position changes
  const handlePositionChange = (axis: "x" | "y", value: number[]) => {
    const newPosition = { ...backgroundPosition };
    newPosition[axis] = value[0];
    onBackgroundPositionChange(newPosition);
  };

  return {
    imageSize,
    containerSize,
    previewImage,
    sliderDisabled,
    handleFileChangeWrapped,
    triggerFileUpload,
    removeBackgroundImage,
    handlePositionChange
  };
} 