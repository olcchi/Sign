"use client";
import { FontFamilySetting } from "./font-family-setting";
import { FontSizeSetting } from "./font-size-setting";
import { FontWeightSetting } from "./font-weight-setting";
import { FontItalicSetting } from "./font-italic-setting";
import { TextFillSetting } from "./text-fill-setting";
import { TextStrokeSetting } from "./text-stroke-setting";
import { TextShadowSetting } from "./text-shadow-setting";

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
    title: "字体",
    component: (
      <div className="space-y-2">
        <FontFamilySetting fontOptions={fontOptions} />
        <div className="grid grid-cols-3 gap-2">
          <FontWeightSetting />
          <FontItalicSetting />
          <FontSizeSetting fontSizeOptions={fontSizeOptions} />
        </div>
        <TextFillSetting colorOptions={colorOptions} />
        <TextStrokeSetting colorOptions={colorOptions} />
        <TextShadowSetting colorOptions={colorOptions} />
      </div>
    ),
  };
}
