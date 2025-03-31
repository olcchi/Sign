"use client";
import CanvasDots from "@/components/ui/canvasDots";
import CircularText from "@/components/ui/widgets/circularText";
import FullScreen from "@/components/ui/fullScreen";
import EnterPageContent from "@/components/ui/SetupGuide/setupGuide";
import { EditWrapper } from "@/components/ui/widgets/editableWrapper/editableWrapper";
import ToolBar from "@/components/ui/toolBar";
import ShinyText from "@/components/ui/shinyText/shinyText";
import '@/components/ui/shinyText/shinyText.css';
import ScrollingText from "@/components/ui/widgets/scrollingText/scrollingText";
import TextEditor from "@/components/ui/textEditor";
import { useRef, useState } from "react";

export default function Home() {
  const dragContainer = useRef(null);
  const textRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  

  // Text content state
  const [text, setText] = useState('dt in the house');
  // Text color state
  const [textColor, setTextColor] = useState('white');
  // Editor visibility state
  const [editMode, setEditMode] = useState(false);
  // Text being edited
  const [inputText, setInputText] = useState(text);


  // Handle double-click to edit
  const enterEditMode = () => {
    setEditMode(true);
    setInputText(text);
    setTimeout(() => {
      textInputRef.current?.focus();
      textInputRef.current?.select();
    }, 10);
  };

  const exitEditMode = () => {
    setEditMode(false);
    setText(inputText);
  };

  return (
    <main
      ref={dragContainer}
      className="relative bg-black w-screen h-[100dvh] overflow-hidden font-[family-name:var(--font-dm-serif-text)] italic"
    >
      <EnterPageContent />
      <main className="w-full h-full flex justify-center items-center">
        <div className="relative w-full">
          <ScrollingText 
            className="font-4xl" 
            speed={300} 
            text={text}
            color={textColor}
            onDoubleClick={enterEditMode}
            textRef={textRef as React.RefObject<HTMLDivElement>}
          />
          <TextEditor
            show={editMode}
            text={inputText}
            onTextChange={setInputText}
            onClose={() => setEditMode(false)}
            onSubmit={exitEditMode}
            textColor={textColor}
            onColorChange={setTextColor}
            textInputRef={
              textInputRef as unknown as React.RefObject<HTMLTextAreaElement>
            }
          />
        </div>
        <ToolBar />
        <FullScreen className="fixed top-4 right-4"/>
      </main>
    </main>
  );
}
