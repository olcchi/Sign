"use client";

import React, { useState, useEffect } from 'react';
import { colorOptions, fontOptions, fontSizeOptions } from '@/lib/settings-config';

interface AnimatedSignProps {
  text?: string;
  interval?: number; 
}

export function AnimatedSign({ text = "Sign", interval = 1500 }: AnimatedSignProps) {
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
      strokeWidth:1,
      strokeColor: colorOptions[2].value,
      hasFill: false,
    },
    {
      color: colorOptions[1].value,
      fontFamily: fontOptions[0].value,
      fontSize: fontSizeOptions[3].value,
      textStroke: true,
      strokeWidth: 1,
      strokeColor: colorOptions[0].value,
      hasFill: true,
    },
    {
      color: colorOptions[4].value,
      fontFamily: fontOptions[1].value,
      fontSize: fontSizeOptions[3].value,
      textStroke: true,
      strokeWidth: 1,
      strokeColor: colorOptions[2].value,
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
      color: colorOptions[4].value,
      fontFamily: fontOptions[1].value,
      fontSize: fontSizeOptions[3].value,
      textStroke: true,
      strokeWidth: 1,
      strokeColor: colorOptions[0].value,
      hasFill: true,
    },
  ];

  const [currentStyleIndex, setCurrentStyleIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStyleIndex((prevIndex) => {
        let nextIndex;
        do {
          nextIndex = Math.floor(Math.random() * stylePresets.length);
        } while (nextIndex === prevIndex && stylePresets.length > 1);
        return nextIndex;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [interval, stylePresets.length]);

  const currentStyle = stylePresets[currentStyleIndex];

  const textStyle: React.CSSProperties = {
    fontFamily: currentStyle.fontFamily,
    fontSize: currentStyle.fontSize,
    color: currentStyle.hasFill ? currentStyle.color : 'transparent',
    WebkitTextStroke: currentStyle.textStroke 
      ? `${currentStyle.strokeWidth}px ${currentStyle.strokeColor}` 
      : '0px transparent',
    transition: 'all 0.6s ease-in-out',
    display: 'inline-block',
    textAlign: 'center',
    lineHeight: 1.2,
  };

  return (
    <div className="flex items-center justify-center min-h-[200px] p-4">
      <span style={textStyle}>
        {text}
      </span>
    </div>
  );
} 