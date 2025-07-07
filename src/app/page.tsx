"use client";
import { SettingsProvider } from "@/lib/contexts/settings-context";
import SignFrame from "@/components/ui/sign-frame";
import { PWAWrapper, PWAStateMonitor } from "@/components/ui/pwa";

// Main page component wraps with SettingsProvider to ensure global state availability
export default function SoulSignPage() {
  return (
    <SettingsProvider>
      <SignFrame />
      <PWAWrapper />
      <PWAStateMonitor />
    </SettingsProvider>
  );
}
