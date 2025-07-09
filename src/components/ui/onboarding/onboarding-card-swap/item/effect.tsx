import { EdgeBlurEffect, Noise, StarField } from "@/components/ui/filter";
import { GradientText } from "@/components/ui/onboarding";

function Effect() {
  return (
    <div className="relative w-full h-full">
      <div className="absolute flex justify-center items-center text-[10rem] text-center inset-0 z-0 font-bold">
        <GradientText
          colors={["#211E55", "#060606", "#211E55"]}
          animationSpeed={30}
          showBorder={false}
          noBackground={true}
        >
          Effect
        </GradientText>
      </div>
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
