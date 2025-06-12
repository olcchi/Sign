"use client";
import { FontFamilySetting } from "./FontFamilySetting";
import { FontSizeSetting } from "./FontSizeSetting";
import { FontWeightSetting } from "./FontWeightSetting";
import { TextFillSetting } from "./TextFillSetting";
import { TextStrokeSetting } from "./TextStrokeSetting";

interface TextRenderingSettingProps {
  colorOptions: Array<{
    name: string;
    value: string;
    bg: string;
    textColor: string;
  }>;
  fontOptions: Array<{
    name: string;
    value: string;
    fontFamily: string;
  }>;
  fontSizeOptions: Array<{
    name: string;
    value: string;
  }>;
}

export function TextRenderingSetting({
  colorOptions,
  fontOptions,
  fontSizeOptions,
}: TextRenderingSettingProps) {
  return {
    title: "字体渲染",
    component: (
      <div className="space-y-2">
        <FontFamilySetting fontOptions={fontOptions} />
        <FontSizeSetting fontSizeOptions={fontSizeOptions} />
        <FontWeightSetting />
        <TextFillSetting colorOptions={colorOptions} />
        <TextStrokeSetting colorOptions={colorOptions} />
      </div>
    ),
  };
}
