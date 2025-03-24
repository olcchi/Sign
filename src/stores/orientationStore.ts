import { create } from "zustand";

type OrientationState = {
  isLandscape: boolean;
  setIsLandscape: (value: boolean) => void;
};

export const useOrientationStore = create<OrientationState>((set) => ({
  isLandscape: false,
  setIsLandscape: (value) => set({ isLandscape: value }),
}));

if (typeof window !== "undefined") {
  const checkOrientation = () => {
    const isLandscape = window.matchMedia("(orientation: landscape)").matches;
    useOrientationStore.getState().setIsLandscape(isLandscape);
  };

  window
    .matchMedia("(orientation: landscape)")
    .addEventListener("change", (e) => {
      useOrientationStore.getState().setIsLandscape(e.matches);
    });

  checkOrientation();
}
