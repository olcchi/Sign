import React from "react";
import { X, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/layout/button";
import { Switch } from "@/components/ui/layout/switch";
import { Separator } from "@/components/ui/layout/separator";
interface PanelHeaderProps {
  title: string;
  onClose: () => void;
}

/**
 * Standard header component for all panel interfaces
 *
 * Creates a consistent header with title and close button for modal/panel UI patterns.
 * Maintains visual hierarchy and provides standard close functionality
 * with appropriate hover states and accessibility considerations.
 */
export const PanelHeader: React.FC<PanelHeaderProps> = ({ title, onClose }) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="relative px-4 py-3 flex gap-2 items-center border-b">
      <p className="text-sm select-none font-bold">{title}</p>
      <Separator orientation="vertical" />
      <div className="flex items-center gap-2">
        <Switch
          checked={theme === "dark"}
          onCheckedChange={toggleTheme}
          aria-label={theme === "dark" ? "切换亮色模式" : "切换暗色模式"}
        >
          {theme === "dark" ? (
            <Moon size={12} className="text-[#FCFAF2]" />
          ) : (
            <Sun size={12} className="text-[#080808]" />
          )}
        </Switch>
        <Button
          className="absolute right-2"
          onClick={onClose}
          variant={"ghost"}
          size={"icon"}
          aria-label="关闭"
        >
          <X size={16} />
        </Button>
      </div>
    </div>
  );
};
