import React, { ReactNode } from "react";

/**
 * Props for the SettingItem component
 * @property {string} title - The title of the setting
 * @property {ReactNode} children - The content to render inside the setting item
 */
interface SettingItemProps {
  title: string;
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
        <p className="text-zinc-300 text-sm font-medium select-none">
          {title}
        </p>
      </div>
      {children}
    </div>
  );
} 