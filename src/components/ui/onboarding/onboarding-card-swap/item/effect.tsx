import { EdgeBlurEffect, Noise, StarField } from "@/components/ui/filter";


function Effect() {
  return (
    <div className="relative w-full h-full">
      {/* <TextRoll
        duration={0.5}
        infinite={true}
        infiniteDelay={0.5}
        className="absolute flex justify-center items-center text-transparent text-[128px] text-center inset-0 z-1 [-webkit-text-stroke:1px_white] [text-stroke:1px_white]"
      >
        Effect
      </TextRoll> */}
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
