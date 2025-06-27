"use client";

import React from "react";
import { PresetType } from "@/types";
import { usePresetManager } from "@/lib/hooks/usePresetManager";
import ShareDialog from "@/components/ui/share/share-dialog";
import ImportDialog from "@/components/ui/share/import-dialog";
import { Button } from "@/components/ui/layout/button";
import { CloudUpload, CloudDownload } from "lucide-react";

interface ShareSettingProps {
  activePreset?: PresetType | null; // Current active preset from preset manager
}

// Share setting component for preset sharing functionality
export function ShareSetting({ activePreset }: ShareSettingProps) {
  const { textSettings, effectsSettings } = usePresetManager();

  return (
    <div className="space-y-3 flex-col gap-2">
      <div className="flex gap-2">
        {/* Share current settings */}
        <ShareDialog 
          activePreset={activePreset}
          currentTextSettings={textSettings}
          currentEffectsSettings={effectsSettings}
        >
          <Button variant="outline" size="sm" className="flex-1 justify-center text-xs">
            <CloudUpload className="mr-2 h-3 w-3" />
            分享预设
          </Button>
        </ShareDialog>

        {/* Import shared preset */}
        <ImportDialog onPresetLoaded={() => {}}>
          <Button variant="outline" size="sm" className="flex-1 justify-center text-xs">
            <CloudDownload className="mr-2 h-3 w-3" />
            导入预设
          </Button>
        </ImportDialog>
      </div>
    </div>
  );
}
