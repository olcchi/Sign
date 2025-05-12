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
 * 工具栏状态管理钩子
 */
export const useToolbarState = (): ToolbarState => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"menu" | "text" | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // 自动隐藏工具栏逻辑
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

  // 打开面板
  const openPanel = () => {
    setIsOpen(true);
    setActiveTab("menu");
  };

  // 关闭面板
  const closePanel = () => {
    setIsOpen(false);
    setActiveTab(null);
  };

  // 进入编辑模式
  const enterEditMode = (text: string, textInputRef: RefObject<HTMLTextAreaElement>) => {
    setEditMode(true);
    closePanel();
    
    // 聚焦并选中文本输入框
    setTimeout(() => {
      textInputRef.current?.focus();
      textInputRef.current?.select();
    }, 10);
  };

  // 退出编辑模式
  const exitEditMode = (inputText: string, onTextChange: (text: string) => void) => {
    setEditMode(false);
    
    // 确保文本不为空
    const finalText = inputText.trim() === "" ? "Please enter some content..." : inputText;
    onTextChange(finalText);
  };

  // 处理图像更改
  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onImageChange: (url: string | null) => void,
    setPreviewImage: (url: string | null) => void,
    setImageSize: (size: { width: number; height: number } | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // 处理图像文件
      const { backgroundImage, previewImage } = await processImageFile(file);
      
      // 更新状态
      onImageChange(backgroundImage);
      setPreviewImage(previewImage);
      
      // 获取图像尺寸
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