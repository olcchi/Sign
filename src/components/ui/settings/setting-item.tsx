import React, { ReactNode } from "react";

/**
 * Props for the SettingItem component
 * @property {ReactNode} title - The title of the setting
 * @property {ReactNode} children - The content to render inside the setting item
 */
interface SettingItemProps {
  title: ReactNode;
  children: ReactNode;
}

/**
 * A component that renders a setting item with a title and content
 * Used to provide consistent styling for settings in the toolbar
 */
export function SettingItem({ title, children }: SettingItemProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className=" text-sm font-bold select-none w-full">
          {title}
        </div>
      </div>
      {children}
    </div>
  );
} 