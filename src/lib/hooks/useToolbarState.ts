import { useState, useEffect, RefObject } from 'react';
import { processImageFile } from '../image-utils';

export interface ToolbarState {
  isOpen: boolean;
  isActive: boolean;
  activeTab: "menu" | "text" | null;
  editMode: boolean;
  openPanel: () => void;
  closePanel: () => void;
  enterEditMode: (text: string, textInputRef: RefObject<HTMLTextAreaElement>) => void;
  exitEditMode: (inputText: string, onTextChange: (text: string) => void) => void;
  handleImageChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    onImageChange: (url: string | null) => void,
    setPreviewImage: (url: string | null) => void,
    setImageSize: (size: { width: number; height: number } | null) => void
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
  const [activeTab, setActiveTab] = useState<"menu" | "text" | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Auto-hide toolbar after inactivity unless in edit mode
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleUserInteraction = () => {
      setIsActive(true);
      clearTimeout(timeoutId);

      if (isOpen || editMode) return;

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
  }, [isOpen, editMode]);

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

  // Enable text editing mode and prepare textarea
  const enterEditMode = (text: string, textInputRef: RefObject<HTMLTextAreaElement>) => {
    setEditMode(true);
    closePanel();
    
    // Focus and select text for immediate editing
    setTimeout(() => {
      textInputRef.current?.focus();
      textInputRef.current?.select();
    }, 10);
  };

  // Complete editing and update content
  const exitEditMode = (inputText: string, onTextChange: (text: string) => void) => {
    setEditMode(false);
    
    // Prevent empty content by using default placeholder
    const finalText = inputText.trim() === "" ? "Please enter some content..." : inputText;
    onTextChange(finalText);
  };

  // Process and optimize image uploads
  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onImageChange: (url: string | null) => void,
    setPreviewImage: (url: string | null) => void,
    setImageSize: (size: { width: number; height: number } | null) => void
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
    editMode,
    openPanel,
    closePanel,
    enterEditMode,
    exitEditMode,
    handleImageChange
  };
}; 