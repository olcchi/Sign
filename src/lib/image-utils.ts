import { PREVIEW_IMAGE_QUALITY, BACKGROUND_IMAGE_QUALITY } from "./settings-config";

interface ProcessedImage {
  backgroundImage: string;
  previewImage: string;
}

export interface ImageSize {
  width: number;
  height: number;
} 
// Processes uploaded images to create optimized versions for background and preview
export const processImageFile = (file: File): Promise<ProcessedImage> => {
  return new Promise((resolve, reject) => {
    // Create temporary object URL for image loading
    const objectUrl = URL.createObjectURL(file);
    
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        // Fallback to original URL when canvas is unavailable
        resolve({
          backgroundImage: objectUrl,
          previewImage: objectUrl
        });
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.drawImage(img, 0, 0);
      
      // Generate high-quality version for main background
      const backgroundImage = canvas.toDataURL(
        "image/jpeg", 
        BACKGROUND_IMAGE_QUALITY
      );
      
      // Generate low-quality version for preview to improve performance
      const previewImage = canvas.toDataURL(
        "image/jpeg", 
        PREVIEW_IMAGE_QUALITY
      );
      
      // Release object URL to prevent memory leaks
      URL.revokeObjectURL(objectUrl);
      
      resolve({
        backgroundImage,
        previewImage
      });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image"));
    };
    
    img.src = objectUrl;
  });
};

// Determines when position sliders should be disabled based on image dimensions
export const getImageSliderState = (
  imageSize: ImageSize | null
): { x: boolean; y: boolean } => {
  // Default to disabled during server-side rendering
  if (typeof window === "undefined") {
    return { x: true, y: true };
  }
  
  if (!imageSize) return { x: true, y: true };
  
  // Compare image and window aspect ratios to determine overflow directions
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  
  const imageRatio = imageSize.width / imageSize.height;
  const windowRatio = windowWidth / windowHeight;
  
  return {
    x: imageRatio <= windowRatio, // Height-constrained (horizontal scrolling)
    y: imageRatio >= windowRatio, // Width-constrained (vertical scrolling)
  };
}; 