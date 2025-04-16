import Butterfly from "@/components/ui/noisyButterflyBackground/butterfly";
import { ProgressiveBlur } from "@/components/ui/noisyButterflyBackground/progressiveBlur";
import Noise from "@/components/ui/noisyButterflyBackground/noise";
export default function NoisyButterflyBackground() {
    return (
        <main className="fixed inset-0 w-full h-[100dvh] overflow-clip ">
        <Noise opacity={0.1} density={0.6} dotSize={1} color="#000000" />
        <div className="relative flex justify-center items-center w-full h-full">
          <Butterfly className="h-160 absolute -z-20" />
          <ProgressiveBlur
            className="pointer-events-none absolute h-140 w-full -z-10"
            blurIntensity={5}
          />
        </div>
      </main> 
    )
}