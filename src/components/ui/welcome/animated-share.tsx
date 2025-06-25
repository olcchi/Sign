import { TextMorph } from "./morph-text";
import { useState, useEffect } from "react";
import { Cursor } from "./icon/cursor";
import { LoadingCircle } from "./icon/loading-circle";
import { motion } from "motion/react";
import { Button } from "@/components/ui/layout/button";
import { Braces } from "./icon/braces";
import { ArrowRight } from "lucide-react";
import { Star } from "@/components/ui/welcome/icon/star";
import { TextLoop } from "./text-loop";
function AnimatedShare() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <Braces className="">
        <div className="relative flex flex-col items-center justify-center">
          {/* <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 1,
        }}
        className="absolute -top-10 left-5"
        style={{
          transformOrigin: "center center",
        }}
      >
        <Star className=" w-10 h-10" />
      </motion.div> */}
          <div className="flex items-center">
            <TextLoop className="text-[64px] font-bold">
              <p>生成</p>
              <p>分享</p>
              <p>加载</p>
            </TextLoop>
            <p className="text-white text-[64px] font-bold ml-2">PIN码</p>
          </div>
        </div>
      </Braces>
    </div>
  );
}

export default AnimatedShare;
