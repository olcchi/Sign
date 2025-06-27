import React from "react";
import { X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/layout/button";
import { Separator } from "@/components/ui/layout/separator";
import FeedbackDialog from "@/components/ui/feedback/feedback-dialog";

interface PanelHeaderProps {
  title: string;
  onClose: () => void;
}

export const PanelHeader: React.FC<PanelHeaderProps> = ({ title, onClose }) => {
  return (
    <div className="relative h-12 px-4 py-3 flex gap-2 items-center border-b">
      <p className="text-sm select-none font-bold">{title}</p>
      <Separator orientation="vertical" className="bg-border" />
      <div className="flex items-center gap-2">
        <FeedbackDialog>
          <Button variant="ghost" size="icon" aria-label="反馈">
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
