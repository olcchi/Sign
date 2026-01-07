// Predefined color palette with Japanese color names
export const colorOptions = [
  {
    name: "GOFUN",
    value: "#FFFFFB",
    bg: "bg-[#FFFFFB]",
    textColor: "text-[#FFFFFB]",
  },
  {
    name: "RURIKON",
    value: "#0B346E",
    bg: "bg-[#0B346E]",
    textColor: "text-[#0B346E]",
  },
  {
    name: "KOHAKU",
    value: "#CA7A2C",
    bg: "bg-[#CA7A2C]",
    textColor: "text-[#CA7A2C]",
  },
  {
    name: "FUJI",
    value: "#8B81C3",
    bg: "bg-[#8B81C3]",
    textColor: "text-[#8B81C3]",
  },
  {
    name: "SYOJYOHI",
    value: "#CC543A",
    bg: "bg-[#CC543A]",
    textColor: "text-[#CC543A]",
  },
  {
    name: "CHITOSEMIDORI",
    value: "#36563C",
    bg: "bg-[#36563C]",
    textColor: "text-[#36563C]",
  },
  {
    name: "TETSUKON",
    value: "#261E47",
    bg: "bg-[#261E47]",
    textColor: "text-[#261E47]",
  },
];

// Typography options - Updated to use Noto Serif font family
export const fontOptions = [
  {
    name: "Noto Sans",
    value: "var(--font-noto-sans)",
    fontFamily: "text-[var(--font-noto-sans)]",
  },
  {
    name: "Noto Serif",
    value: "var(--font-noto-serif)",
    fontFamily: "text-[var(--font-noto-serif)]",
  },
  {
    name: "Noto Sans Mono",
    value: "var(--font-noto-sans-mono)",
    fontFamily: "text-[var(--font-noto-sans-mono)]",
  },
];

export const fontSizeOptions = [
  { name: "S", value: "5rem" },
  { name: "M", value: "8rem" },
  { name: "L", value: "10rem" },
  { name: "XL", value: "15rem" },
  { name: "2XL", value: "min(30rem, 90vh)" },
];

// Text stroke width configuration (using relative units - em)
export const textStrokeConfig = {
  min: 0.002,
  max: 0.01,
  step: 0.001,
  defaultValue: 0.002,
};

// Scroll speed options
export const scrollSpeedOptions = [
  { name: "0.3x", value: "3" },
  { name: "0.5x", value: "5" },
  { name: "1x", value: "10" },
  { name: "1.5x", value: "15" },
  { name: "2x", value: "20" },
];

// Edge blur intensity range configuration
export const edgeBlurConfig = {
  min: 1,
  max: 20,
  step: 1,
  defaultValue: 4,
};

// Noise effect configuration
export const noiseConfig = {
  patternSize: {
    min: 50,
    max: 500,
    step: 10,
    defaultValue: 250,
  },
  patternAlpha: {
    min: 10,
    max: 50,
    step: 2,
    defaultValue: 20,
  },
};

// Star field effect configuration
export const starFieldConfig = {
  density: {
    min: 0.5,
    max: 15,
    step: 0.1,
    defaultValue: 5,
  },
  size: {
    min: 10,
    max: 15,
    step: 0.5,
    defaultValue: 10,
  },
  twinkleSpeed: {
    min: 0.5,
    max: 5,
    step: 0.1,
    defaultValue: 1.0,
  },
};

// Text shadow configuration (using relative units for consistent scaling)
export const textShadowConfig = {
  blur: {
    min: 5,
    max: 10,
    step: 0.5,
    defaultValue: 7.5, // Will be converted to 0.04em in component
  },
  intensity: {
    min: 1,
    max: 5,
    step:0.5,
    defaultValue: 3,
  },
};

// Image processing configuration
export const PREVIEW_IMAGE_QUALITY = 0.2;
export const BACKGROUND_IMAGE_QUALITY = 0.6;
