"use client";
import { SettingsProvider } from "@/lib/contexts/SettingsContext";
import SignFrame from "@/components/ui/layout/SignFrame";

// Main page component wraps with SettingsProvider to ensure global state availability
export default function SoulSignPage() {
  return (
    <SettingsProvider>
      <SignFrame />
    </SettingsProvider>
  );
}
