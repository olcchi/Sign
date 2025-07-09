import { TextPressureEffect, TextLoop, GradientText } from "@/components/ui/onboarding";
import { tree } from "next/dist/build/templates/app-page";
export default function Share() {
  return (
    <div className="relative w-full h-full p-5 flex-center">
      <div className="h-fit w-full ">
        <TextPressureEffect
          text="{PIN Code}"
          flex={true}
          alpha={true}
          stroke={false}
          width={false}
          weight={false}
          italic={true}
          minFontSize={36}
          simulateMouseMovement
          simulationPadding={-80}
          simulationSpeed={10000}
        />
      </div>

      <TextLoop
        interval={3}
        className="text-[256px] absolute text-[#211E55] opacity-70 -z-2"
      >
        <p>生成</p>
        <p>分享</p>
        <p>加载</p>
      </TextLoop>
    </div>
  );
}
