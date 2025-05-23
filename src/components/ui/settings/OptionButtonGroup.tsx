import React from "react";
import { Button } from "@/components/ui/layout/button";
import { cn } from "@/lib/utils";

/**
 * Base option interface with required properties
 * @property {string} name - Display name of the option
 * @property {string} value - Value of the option
 * @property {any} [key: string] - Additional properties can be added
 */
interface Option {
  name: string;
  value: string;
  [key: string]: any;
}

/**
 * Props for the OptionButtonGroup component
 * @template T - Type extending Option interface
 * @property {T[]} options - Array of options to display as buttons
 * @property {string} selectedValue - Currently selected option value
 * @property {Function} onChange - Handler for option selection change
 * @property {string} [buttonSize] - Size of the buttons
 * @property {string} [className] - Additional CSS classes
 * @property {Function} [renderOption] - Custom renderer for option content
 */
interface OptionButtonGroupProps<T extends Option> {
  options: T[];
  selectedValue: string;
  onChange: (value: string) => void;
  buttonSize?: "sm" | "default" | "lg" | "icon";
  className?: string;
  renderOption?: (option: T) => React.ReactNode;
}

/**
 * A component that renders a group of option buttons
 * Used for selectable options like font family, font size, colors, etc.
 */
export function OptionButtonGroup<T extends Option>({
  options,
  selectedValue,
  onChange,
  buttonSize = "sm",
  className = "",
  renderOption,
}: OptionButtonGroupProps<T>) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((option) => {
        const isActive = option.value === selectedValue;
        return (
          <Button
            size={buttonSize}
            variant={"secondary"}
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-md text-xs font-sans",
              isActive ? "ring-1 ring-[#787D7B] dark:ring-[#BDC0BA]" : ""
            )}
            title={option.name}
          >
            {renderOption ? renderOption(option) : option.name}
          </Button>
        );
      })}
    </div>
  );
}
