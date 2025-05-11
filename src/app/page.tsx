"use client";
import EnterPageContent from "@/components/ui/setup/SetupGuide/setupGuide";
import NoisyButterflyBackground from "@/components/ui/noisyButterflyBackground/noisyButterflyBackground";
import { useRef, useState } from "react";
import {Olcchi} from "@/components/ui/olcchi";

// Landing page with visually engaging background and setup guide
export default function Home() {
  // Reference for draggable UI elements
  const dragContainer = useRef(null);
  const [showGithub, setShowGithub] = useState(false);
  
  return (
    <main
      ref={dragContainer}
      className="relative w-screen h-[100dvh] overflow-clip flex justify-center items-center"
    >
      {/* Animated background with noise texture and butterfly effect */}
      <NoisyButterflyBackground />
      
      {/* Main content with app introduction and navigation */}
      <EnterPageContent />
      
      {/* Author attribution with external links */}
      <Olcchi
        id="olcchi"
        personalUrl="https://olcchi.me"
        githubUrl="https://github.com/soulsign"
        showGithub={showGithub}
      />
    </main>
  );
}
