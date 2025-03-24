import { create } from 'zustand';

type OrientationState = {
  isLandscape: boolean;
  setIsLandscape: (value: boolean) => void;
};

export const useOrientationStore = create<OrientationState>((set) => ({
  isLandscape: false,
  setIsLandscape: (value) => set({ isLandscape: value }),
}));

if (typeof window !== 'undefined') {
  // 初始检查
  const checkOrientation = () => {
    const isLandscape = window.matchMedia('(orientation: landscape)').matches;
    useOrientationStore.getState().setIsLandscape(isLandscape);
  };

  // 监听屏幕旋转
  window.matchMedia('(orientation: landscape)').addEventListener('change', (e) => {
    useOrientationStore.getState().setIsLandscape(e.matches);
  });

  // 初始化检查
  checkOrientation();
}