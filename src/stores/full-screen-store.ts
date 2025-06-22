import { create } from 'zustand';

type FullScreenState = {
  isFull: boolean;
  setIsFull: (value: boolean) => void;
};

export const useFullScreenStore = create<FullScreenState>((set) => ({
  isFull: false,
  setIsFull: (value) => set({ isFull: value }),
}));

if (typeof window !== 'undefined') {
  document.addEventListener('fullscreenchange', () => {
    useFullScreenStore.getState().setIsFull(!!document.fullscreenElement);
  });
}