import { create } from 'zustand';

type FullScreenState = {
  isFull: boolean;
  setIsFull: (value: boolean) => void;
};

export const useFullScreenStore = create<FullScreenState>((set) => ({
  isFull: false,
  setIsFull: (value) => set({ isFull: value }),
}));

// Cross-browser fullscreen element detection
const getFullscreenElement = () => {
  return document.fullscreenElement || 
         (document as any).webkitFullscreenElement ||
         (document as any).mozFullScreenElement ||
         (document as any).msFullscreenElement;
};

// Update fullscreen state when browser fullscreen changes
const updateFullscreenState = () => {
  const isCurrentlyFullscreen = !!getFullscreenElement();
  useFullScreenStore.getState().setIsFull(isCurrentlyFullscreen);
};

if (typeof window !== 'undefined') {
  // Listen to all possible fullscreen change events
  const events = [
    'fullscreenchange',
    'webkitfullscreenchange', 
    'mozfullscreenchange',
    'msfullscreenchange'
  ];
  
  events.forEach(event => {
    document.addEventListener(event, updateFullscreenState);
  });
  
  // Also listen for orientation changes on mobile devices
  window.addEventListener('orientationchange', () => {
    // Delay check to allow orientation change to complete
    setTimeout(updateFullscreenState, 100);
  });
}