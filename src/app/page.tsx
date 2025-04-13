"use client";
import FullScreen from "@/components/ui/layout/fullScreen";
import EnterPageContent from "@/components/ui/setup/SetupGuide/setupGuide";
import NoisyButterflyBackground from "@/components/ui/noisyButterflyBackground/noisyButterflyBackground";
import { useRef } from "react";
export default function Home() {
  const dragContainer = useRef(null);
  return (
    <main
      ref={dragContainer}
      className="relative w-screen h-[100dvh] overflow-clip flex justify-center items-center"
    >
      <NoisyButterflyBackground />
      <FullScreen className="fixed top-4 right-4" />
      <EnterPageContent />
    </main>
  );
}
