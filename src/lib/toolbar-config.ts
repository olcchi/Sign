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
];

// Responsive positioning for toolbar at different screen sizes
export const toolBarPosition = {
  sm: "w-[80vw] top-16 right-4 h-fit max-h-[70vh]",
  md: "md:w-[40vw] md:top-4 md:right-16 md:h-[90vh] md:max-h-[90dvh]",
  lg: "lg:w-100 lg:top-16 lg:right-4 lg:h-fit",
};

// Typography options
export const fontOptions = [
  {
    name: "Sans",
    value: "var(--font-geist-sans)",
    fontFamily: "text-[var(--font-geist-sans)]",
  },
  // {
  //   name: "Brush",
  //   value: "var(--font-kolker-brush)",
  //   fontFamily: "text-[var(--font-kolker-brush)]",
  // },
  {
    name: "Serif",
    value: "var(--font-dm-serif-text)",
    fontFamily: "text-[var(--font-dm-serif-text)]",
  },
];

export const fontSizeOptions = [
  { name: "S", value: "5rem" },
  { name: "M", value: "8rem" },
  { name: "L", value: "10rem" },
  { name: "XL", value: "16rem" },
];

// Image processing configuration
export const PREVIEW_IMAGE_QUALITY = 0.2;
export const BACKGROUND_IMAGE_QUALITY = 0.6;

// Animation configuration for toolbar transitions
export const transition = {
  type: "spring",
  duration: 0.25,
  debounce:0.2,
  delay: 0,
}; 