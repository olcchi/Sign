import { useState, useCallback, useRef } from 'react';

export function useEditMode(onEditStart?: () => void, onEditEnd?: () => void) {
  const [isEditing, setIsEditing] = useState(false);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);

  const startEditing = useCallback(() => {
    pressTimer.current = setTimeout(() => {
      setIsEditing(true);
      onEditStart?.();
    }, 100);
  }, [onEditStart]);

  const cancelEditing = useCallback(() => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }, []);

  const exitEditMode = useCallback(() => {
    setIsEditing(false);
    onEditEnd?.();
  }, [onEditEnd]);

  return {
    isEditing,
    startEditing,
    cancelEditing,
    exitEditMode
  };
}