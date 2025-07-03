"use client";

import React, { useState, useEffect } from "react";
import {
  colorOptions,
  fontOptions,
  fontSizeOptions,
} from "@/lib/settings-config";
import { Variant } from "../icon/variant";
import { motion } from "motion/react";

interface SignProps {
  text?: string;
  interval?: number;
}

export default function Sign({
  text = "Sign",
  interval = 2000,
}: SignProps) {
  const stylePresets = [
    {
      color: colorOptions[0].value,
      fontFamily: fontOptions[0].value,
      fontSize: fontSizeOptions[3].value,
      textStroke: true,
      strokeWidth: 1,
      strokeColor: colorOptions[1].value,
      hasFill: true,
    },
    {
      color: colorOptions[1].value,
      fontFamily: fontOptions[1].value,
      fontSize: fontSizeOptions[3].value,
      textStroke: true,
      strokeWidth: 1,
      strokeColor: colorOptions[2].value,
      hasFill: false,
    },
    {
      color: colorOptions[6].value,
      fontFamily: fontOptions[0].value,
      fontSize: fontSizeOptions[3].value,
      textStroke: true,
      strokeWidth: 1,
      strokeColor: colorOptions[0].value,
      hasFill: true,
    },
    {
      color: colorOptions[5].value,
      fontFamily: fontOptions[1].value,
      fontSize: fontSizeOptions[3].value,
      textStroke: true,
      strokeWidth: 1,
      strokeColor: colorOptions[5].value,
      hasFill: false,
    },
    {
      color: colorOptions[1].value,
      fontFamily: fontOptions[0].value,
      fontSize: fontSizeOptions[3].value,
      textStroke: true,
      strokeWidth: 1,
      strokeColor: colorOptions[1].value,
      hasFill: false,
    },
    {
      color: colorOptions[2].value,
      fontFamily: fontOptions[1].value,
      fontSize: fontSizeOptions[3].value,
      textStroke: true,
      strokeWidth: 1,
      strokeColor: colorOptions[0].value,
      hasFill: true,
    },
  ];

  const [currentStyleIndex, setCurrentStyleIndex] = useState(0);
  const [isBlurred, setIsBlurred] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      // Start blur effect
      setIsBlurred(true);

      // Change style after blur begins
      setTimeout(() => {
        setCurrentStyleIndex((prevIndex) => {
          return (prevIndex + 1) % stylePresets.length;
        });

        // Clear blur effect after style change
        setTimeout(() => {
          setIsBlurred(false);
        }, 200);
      }, 200);
    }, interval);

    return () => clearInterval(timer);
  }, [interval, stylePresets.length]);

  const currentStyle = stylePresets[currentStyleIndex];

  const textStyle: React.CSSProperties = {
    fontFamily: currentStyle.fontFamily,
    fontSize: currentStyle.fontSize,
    color: currentStyle.hasFill ? currentStyle.color : "transparent",
    WebkitTextStroke: currentStyle.textStroke
      ? `${currentStyle.strokeWidth}px ${currentStyle.strokeColor}`
      : "0px transparent",
    transition: "all 0.3s ease-in-out, filter 0.15s ease-in-out",
    display: "inline-block",
    textAlign: "center",
    lineHeight: 1.2,
    filter: isBlurred ? "blur(5px)" : "blur(0px)",
  };

  return (
    <div className="relative p-5 flex justify-center items-center w-full h-full">
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 180 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 1,
        }}
        style={{
          transformOrigin: "center center",
        }}
        className="absolute h-fit w-fit"
      >
        <Variant className="w-70 h-70 text-[#211E55] opacity-80 z-0" />
      </motion.div>
      <p className=" p-5 whitespace-nowrap" style={textStyle}>
        {text}
      </p>
    </div>
  );
}
