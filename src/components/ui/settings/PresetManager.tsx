import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button/button";
import { Save, Download, Trash2 } from "lucide-react";

/**
 * Preset interface defining the structure of saved presets
 */
export interface Preset {
  id: string;
  name: string;
  text: string;
  textColor: string;
  fontFamily: string;
  fontSize: string;
  scrollSpeed: number;
  // backgroundColor?: string;
  backgroundImage?: string | null;
  overlayEnabled?: boolean;
}

/**
 * Props for the PresetManager component
 */
interface PresetManagerProps {
  text: string;
  textColor: string;
  fontFamily: string;
  fontSize: string;
  scrollSpeed: number;
  // backgroundColor?: string;
  backgroundImage?: string | null;
  onLoadPreset: (preset: Preset) => void;
}

/**
 * Component for managing text display presets
 * Handles saving, loading, and deleting presets
 */
export function PresetManager({
  text,
  textColor,
  fontFamily,
  fontSize,
  scrollSpeed,
  // backgroundColor,
  backgroundImage,
  onLoadPreset,
}: PresetManagerProps) {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [presetName, setPresetName] = useState("");
  const [showPresetInput, setShowPresetInput] = useState(false);
  const presetInputRef = useRef<HTMLInputElement>(null);

  // Load saved presets
  useEffect(() => {
    const savedPresets = localStorage.getItem("soulsign-presets");
    if (savedPresets) {
      try {
        setPresets(JSON.parse(savedPresets));
      } catch (e) {
        console.error("Failed to parse saved presets", e);
      }
    }
  }, []);

  // Save preset to localStorage
  const savePreset = () => {
    if (!presetName.trim()) return;
    
    const newPreset: Preset = {
      id: Date.now().toString(),
      name: presetName,
      text,
      textColor,
      fontFamily,
      fontSize,
      scrollSpeed,
      // backgroundColor,
      backgroundImage,
    };
    
    const updatedPresets = [...presets, newPreset];
    setPresets(updatedPresets);
    localStorage.setItem("soulsign-presets", JSON.stringify(updatedPresets));
    
    setPresetName("");
    setShowPresetInput(false);
  };

  // Delete preset
  const deletePreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedPresets = presets.filter(preset => preset.id !== id);
    setPresets(updatedPresets);
    localStorage.setItem("soulsign-presets", JSON.stringify(updatedPresets));
  };

  return (
    <div className="space-y-2 pt-2 border-t border-zinc-800">
      <div className="flex items-center justify-between">
        <p className="text-zinc-300 text-sm font-medium select-none">
          预设管理
        </p>
        <Button
          size="sm"
          onClick={() => {
            setShowPresetInput(true);
            setTimeout(() => presetInputRef.current?.focus(), 10);
          }}
          className="px-2 py-1 rounded-md text-xs font-sans bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 transition-colors"
        >
          <Save size={14} className="mr-1" />
          保存当前
        </Button>
      </div>
      <AnimatePresence>
        {showPresetInput && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex gap-2 mt-2"
          >
            <input
              ref={presetInputRef}
              type="text"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && savePreset()}
              placeholder="预设名称..."
              className="flex-1 px-2 py-1 text-sm bg-zinc-900 border border-zinc-800 rounded-md text-zinc-300 focus:outline-none focus:border-zinc-700"
            />
            <Button
              size="sm"
              onClick={savePreset}
              className="px-2 py-1 rounded-md text-xs bg-zinc-100 hover:bg-white text-black"
            >
              保存
            </Button>
            <Button
              size="sm"
              onClick={() => setShowPresetInput(false)}
              className="px-2 py-1 rounded-md text-xs bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300"
            >
              取消
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mt-2 space-y-2 max-h-40 overflow-y-auto pr-1">
        {presets.length === 0 ? (
          <p className="text-zinc-500 text-xs italic">暂无保存的预设</p>
        ) : (
          presets.map((preset) => (
            <div
              key={preset.id}
              onClick={() => onLoadPreset(preset)}
              className="px-3 py-2 bg-zinc-800/50 hover:bg-zinc-800 rounded-md text-zinc-200 text-sm transition-colors flex justify-between items-center cursor-pointer"
            >
              <div className="flex items-center gap-1">
                <Download size={14} />
                <span className="truncate max-w-40">{preset.name}</span>
              </div>
              <button
                onClick={(e) => deletePreset(preset.id, e)}
                className="text-zinc-400 hover:text-zinc-200 transition-colors"
                title="删除预设"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 