"use client";
import EnterPageContent from "@/components/ui/setup/SetupGuide/setupGuide";
import NoisyButterflyBackground from "@/components/ui/noisyButterflyBackground/noisyButterflyBackground";
import { useRef, useState } from "react";
import {Olcchi} from "@/components/ui/olcchi";
export default function Home() {
  const dragContainer = useRef(null);
  const [showGithub, setShowGithub] = useState(false);
  return (
    <main
      ref={dragContainer}
      className="relative w-screen h-[100dvh] overflow-clip flex justify-center items-center"
    >
      <NoisyButterflyBackground />
      <EnterPageContent />
      {/* Author watermark */}
      <Olcchi
        id="olcchi"
        personalUrl="https://olcchi.me"
        githubUrl="https://github.com/soulsign"
        showGithub={showGithub}
      />
    </main>
  );
}
