import { TextLoop } from "@/components/ui/textLoop";
const loopTextVariants = {
  initial: {
    y: 20,
    opacity: 0,
    rotateX: -90,
    filter: "blur(2px)",
  },
  animate: {
    y: 0,
    opacity: 1,
    rotateX: 0,
    filter: "blur(0px)",
  },
  exit: {
    y: -20,
    opacity: 0,
    rotateX: 90,
    filter: "blur(2px)",
  },
};
export default function loopTextTittle() {
  return (
    <TextLoop
      interval={5}
      trigger={true}
      variants={loopTextVariants}
      transition={{
        duration: 0.6,
        ease: "easeInOut",
      }}
      className="text-zinc-200 text-xl font-bold pointer-events-none select-none font-[family-name:var(--font-dm-serif-text)]"
    >
      <span>Soul Sign</span>
      <span>喆式应援</span>
    </TextLoop>
  );
}
