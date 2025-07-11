"use client";

import { PresetType } from "@/types";
import { usePresetManager } from "@/lib/hooks/usePresetManager";
import { ShareDialog, ImportDialog } from "@/components/ui/settings";
import { Button } from "@/components/ui/layout";
import { CloudUpload, CloudDownload } from "lucide-react";

interface ShareSettingProps {
  activePreset?: PresetType | null; // Current active preset from preset manager
  onPresetListUpdated?: () => void; // Callback to refresh preset list
}

// Share setting component for preset sharing functionality
export function ShareSetting({
  activePreset,
  onPresetListUpdated,
}: ShareSettingProps) {
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
          <Button
            variant="outline"
            size="sm"
            className="flex-1 justify-center text-xs"
          >
            <CloudUpload className="mr-2 h-3 w-3" />
            分享预设
          </Button>
        </ShareDialog>

        {/* Import shared preset */}
        <ImportDialog onPresetListUpdated={onPresetListUpdated}>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 justify-center text-xs"
          >
            <CloudDownload className="mr-2 h-3 w-3" />
            导入预设
          </Button>
        </ImportDialog>
      </div>
    </div>
  );
}