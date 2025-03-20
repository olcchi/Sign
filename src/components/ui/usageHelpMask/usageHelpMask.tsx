`use client`;
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TextLoop } from "@/components/ui/textLoop";
import { Separator } from "@/components/ui/separator";
import { type CarouselApi } from "@/components/ui/carousel";
import FullScreen from "@/components/ui/fullScreen";
import './uhm.css'
import classNames from "embla-carousel-class-names";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  // CarouselNext,
  // CarouselPrevious,
} from "@/components/ui/carousel";
import { useFullScreenStore } from "@/stores/fullScreenStore";
export default function VerticalScreenMask() {
  const [showMask, setShowMask] = useState(false);
  const { isFull } = useFullScreenStore();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(
      navigator.userAgent
    );
    api?.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
    const checkOrientation = () => {
      const isPortrait = window.matchMedia("(orientation: portrait)").matches;
      setShowMask((isMobile && isPortrait) || !isFull);
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, [isFull, api]);

  const loopTextVariants = {
    initial: {
      y: 20,
      rotateX: 90,
      opacity: 0,
      filter: "blur(8px)",
    },
    animate: {
      y: 0,
      rotateX: 0,
      opacity: 1,
      filter: "blur(0px)",
    },
    exit: {
      y: -20,
      rotateX: -90,
      opacity: 0,
      filter: "blur(8px)",
    },
  };
  return (
    <AnimatePresence>
      {showMask && (
        <motion.div
          initial={{ opacity: 0, filter: "blur(8px)", scale: 1.1 }}
          animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)", scale: 1.1 }}
          className="fixed select-none pointer-events-auto inset-0 w-screen h-screen flex justify-center items-center bg-black/80 z-999 backdrop-blur-lg"
        >
          <motion.div
            layout
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
            className="relative flex flex-col w-full p-2 h-full md:w-3/4 md:h-3/4 lg:w-1/2 lg:h-1/2 xl:w-1/3 xl:h-1/3 bg-black border-1 border-neutral-900 rounded-lg shadow-lg  transition-all ease-in duration-200"
          >
            {/* <FullScreen className="" /> */}
            <div className="flex items-center w-full h-fit p-2">
              <TextLoop
                interval={5}
                trigger={true}
                variants={loopTextVariants}
                className=" gap-2 flex text-md md:text-lg lg:text-xl xl:text-xl text-white pointer-events-none select-none"
              >
                <span>Soul Sign</span>
                <span>喆式应援</span>
              </TextLoop>
            </div>
            <Separator className="bg-neutral-900" />

            <Carousel
              plugins={[
                classNames()
              ]}
              setApi={setApi}
              className="text-white! h-full transition-opacity ease-in duration-500"
            >
              <CarouselContent className="CarouselContent">
                <CarouselItem className="carousel__slide">
                  <div className=" p-2 text-white h-full text-lg leading-8 font-sans">
                    <span>
                      Hi! 欢迎来到Soul Sign .<br />{" "}
                      这是一款为DT粉丝准备的电子应援牌构建器 ,
                      你可以很简单构建出美观的电子应援牌 ,
                      它诞生于我在DT演唱会上使用手机作为应援牌的需求,
                    </span>
                  </div>
                </CarouselItem>
                <CarouselItem className="carousel__slide ">Page two</CarouselItem>
                <CarouselItem className="carousel__slide ">Page three</CarouselItem>
              </CarouselContent>
            </Carousel>
            <div className="flex gap-2 justify-end text-3xl min-h-fit!">
              {Array.from({ length: 3 }).map((_, index) => (
                <p
                  key={index}
                  className={`transition-colors ${
                    current === index ? "text-neutral-200" : "text-neutral-800"
                  }`}
                  onClick={() => api?.scrollTo(index)}
                >
                  {index + 1}
                </p>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
