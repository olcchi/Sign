"use client";
import { SettingsProvider } from "@/lib/contexts/settings-context";
import SignFrame from "@/components/ui/sign-frame";
import { PWAInstallPrompt } from "@/components/ui/pwa-install-prompt";
import { PWAStatusDebug } from "@/components/ui/pwa-status-debug";

// Main page component wraps with SettingsProvider to ensure global state availability
export default function SoulSignPage() {
  return (
    <SettingsProvider>
      <SignFrame />
      <PWAInstallPrompt />
      <PWAStatusDebug />
    </SettingsProvider>
  );
}
