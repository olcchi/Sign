import TextPressure from "@/components/ui/welcome/text-pressure";
import { TextLoop } from "./text-loop";
function AnimatedShare() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <TextPressure
        className="w-full"
        text="{PIN Code}"
        flex={true}
        alpha={false}
        stroke={false}
        width={true}
        weight={true}
        italic={false}
        minFontSize={120}
      />
      <TextLoop
      interval={3}
      className="text-[256px] absolute text-[#211E55] opacity-70 -z-2">
        <p>生成</p>
        <p>分享</p>
        <p>加载</p>
      </TextLoop>
    </div>
  );
}

export default AnimatedShare;
