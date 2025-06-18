import React from "react";
import { X, Moon, Sun, MessageSquare } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/layout/button";
import { Switch } from "@/components/ui/layout/switch";
import { Separator } from "@/components/ui/layout/separator";
import FeedbackDialog from "@/components/ui/feedback/FeedbackDialog";

interface PanelHeaderProps {
  title: string;
  onClose: () => void;
}

export const PanelHeader: React.FC<PanelHeaderProps> = ({ title, onClose }) => {
  // const { theme, setTheme, resolvedTheme } = useTheme();

  // Use resolvedTheme to get the actual current theme (resolves 'system' to 'light' or 'dark')
  // const isDarkMode = resolvedTheme === "dark";

  // const toggleTheme = () => {
  //   setTheme(theme === "dark" ? "light" : "dark");
  // };

  return (
    <div className="relative h-12 px-4 py-3 flex gap-2 items-center border-b">
      <p className="text-sm select-none font-bold">{title}</p>
      <Separator orientation="vertical" className="bg-border" />
      <div className="flex items-center gap-2">
        {/* <Switch
          checked={isDarkMode}
          onCheckedChange={toggleTheme}
          aria-label={isDarkMode ? "切换亮色模式" : "切换暗色模式"}
        >
          {isDarkMode ? (
            <Moon size={12} className="text-foreground" />
          ) : (
            <Sun size={12} className="text-foreground" />
          )}
        </Switch> */}
        <FeedbackDialog>
          <Button
            variant="ghost"
            size="icon"
            aria-label="意见反馈"
          >
            <MessageSquare size={16} />
          </Button>
        </FeedbackDialog>
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
