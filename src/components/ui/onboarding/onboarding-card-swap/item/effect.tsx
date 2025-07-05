import { EdgeBlurEffect, Noise, StarField } from "@/components/ui/filter";
import { TextRoll } from "@/components/ui/onboarding";

function Effect() {
  return (
    <div className="relative w-full h-full">
      <TextRoll
        duration={1}
        infinite={true}
        infiniteDelay={2}
        className=" absolute flex justify-center items-center text-transparent text-[128px] text-center inset-0 z-1 [-webkit-text-stroke:1px_#F4F2F8] [text-stroke:1px_#212121]"
      >
        Effect
      </TextRoll>
      <div className="absolute inset-0 z-2">
        <EdgeBlurEffect enabled intensity={10} />
      </div>
      <div className="absolute inset-0 z-3">
        <Noise />
      </div>
      <div className="absolute inset-0 z-1">
        <StarField
          enabled={true}
          size={4}
          twinkleSpeed={3}
          color="#ffffff"
          density={50}
        />
      </div>
    </div>
  );
}

export default Effect;
