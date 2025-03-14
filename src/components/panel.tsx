"use client";
import { PanelLeftClose } from "lucide-react";
import { motion } from "motion/react";
import { TextLoop } from "@/components/ui/text-loop";
import { useState, useRef, useEffect } from "react";
export default function Panel() {
  const [isOpen, setIsOpen] = useState(false);
  const iconRef = useRef(null);
  const panelRef = useRef(null);
  const [closedXValue, setClosedXValue] = useState(0);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (panelRef.current && iconRef.current) {
      const xValue = -(
        panelRef.current.offsetWidth -
        iconRef.current.offsetWidth -
        20
      );
      setClosedXValue(xValue);
    }
  }, []);
  const sidebarVariants = {
    open: {
      transition: {
        ease: ["easeIn", "easeOut"],
        duration: 0.2,
      },
    },
    closed: {
      x: closedXValue,
      transition: {
        ease: ["easeIn", "easeOut"],
        duration: 0.2,
      },
    },
  };
  const iconVariants = {
    open: {
      rotate: 0,
      transition: {
        duration: 0.01,
      },
    },
    closed: {
      rotate: 180,
      transition: {
        duration: 0.01,
      },
    },
  };
  const loopTextVariants = {
    initial: {
      y: 20,
      rotateX: 90,
      opacity: 0,
      filter: "blur(4px)",
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
      filter: "blur(4px)",
    },
  };

  return (
    <motion.div
      variants={sidebarVariants}
      initial="open"
      animate={isOpen ? "closed" : "open"}
      ref={panelRef}
      className="w-1/4 h-full left-0 absolute z-20"
    >
      <div className="w-full h-full relative flex justify-center bg-stone-900 border-solid border-r-2 border-stone-800 rounded-sm ">
        <TextLoop
          interval={5}
          trigger={true}
          variants={loopTextVariants}
          className="absolute top-2 left-2 gap-2 flex  text-white pointer-events-none select-none"
        >
          <span>Soul Sign</span>
          <span>喆式应援</span>
        </TextLoop>

        <motion.div
          ref={iconRef}
          className=" absolute top-2 right-2"
          variants={iconVariants}
          animate={isOpen ? "closed" : "open"}
        >
          <PanelLeftClose color="white" onClick={toggleSidebar} className="" />
        </motion.div>
        <motion.hr
          animate={isOpen ? { opacity: 0 } : { opacity: 100 }}
          transition={{ duration: 0.2 }}
          className="absolute w-full border-stone-700 top-10 h-0.5 z-20 "
        />
      </div>
    </motion.div>
  );
}
