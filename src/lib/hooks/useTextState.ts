import { useState, useEffect, RefObject } from "react";

/**
 * Hook for managing text editing state
 * 
 * Encapsulates the logic for text input handling, synchronization
 * with external state, and text editing mode transitions.
 * Centralizes related text manipulation functionality to reduce
 * complexity in parent components.
 * 
 * @param text - The current text from parent component
 * @param onTextChange - Callback for updating text in parent component
 * @param enterEditModeBase - Base function for entering edit mode
 * @param exitEditModeBase - Base function for exiting edit mode
 * @param textInputRef - Reference to the text input element
 */
export function useTextState(
  text: string,
  onTextChange: (text: string) => void,
  enterEditModeBase: (text: string, ref: RefObject<HTMLTextAreaElement>) => void,
  exitEditModeBase: (text: string, onTextChange: (text: string) => void) => void,
  textInputRef: RefObject<HTMLTextAreaElement | null>
) {
  const [inputText, setInputText] = useState(text);

  // Sync external text with internal state
  useEffect(() => {
    setInputText(text);
  }, [text]);

  // Text editing mode handlers
  const enterEditMode = () => {
    enterEditModeBase(text, textInputRef as RefObject<HTMLTextAreaElement>);
    setInputText(text);
  };

  const exitEditMode = () => {
    exitEditModeBase(inputText, onTextChange);
  };

  return {
    inputText,
    setInputText,
    enterEditMode,
    exitEditMode
  };
} 