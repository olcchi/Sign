"use client";
import { FontFamilySetting } from "./font-family-setting";
import { FontSizeSetting } from "./font-size-setting";
import { FontWeightSetting } from "./font-weight-setting";
import { TextFillSetting } from "./text-fill-setting";
import { TextStrokeSetting } from "./text-stroke-setting";

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
