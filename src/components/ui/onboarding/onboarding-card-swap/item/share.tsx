import TextPressure from "@/components/ui/onboarding/onboarding-card-swap/effect/text-pressure-effect";
import { TextLoop } from "../effect/text-loop-effect";
export default function Share() {
  return (
    <div className="relative w-full h-full flex-center">
      <div className="h-fit w-full ">
        <TextPressure
          text="{PIN Code}"
          flex={true}
          alpha={false}
          stroke={false}
          width={true}
          weight={true}
          italic={false}
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
