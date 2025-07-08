import { EdgeBlurEffect, Noise, StarField } from "@/components/ui/filter";
import { TextRoll } from "@/components/ui/onboarding";

function Effect() {
  return (
    <div className="relative w-full h-full">
      <TextRoll
        duration={1}
        infinite={true}
        infiniteDelay={2}
        className=" absolute flex justify-center items-center text-[130px] text-center inset-0 z-1 bg-gradient-to-br from-[#504c9b] to-[#060606] bg-clip-text text-transparent [-webkit-text-stroke:1px_rgba(33,30,85,0.8)]"
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
