import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] bg-amber-500 items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-dm-serif-text)] italic">
      <div className="fixed top-2 left-2 gap-2 flex pointer-events-none">
      <p className="">Soul Sign</p>
      <span>|</span>
      <p className="">喆是应援</p>
      </div>
    </div>
  );
}
