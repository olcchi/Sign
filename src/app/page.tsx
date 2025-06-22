"use client";
import { SettingsProvider } from "@/lib/contexts/settings-context";
import SignFrame from "@/components/ui/sign-frame";

// Main page component wraps with SettingsProvider to ensure global state availability
export default function SoulSignPage() {
  return (
    <SettingsProvider>
      <SignFrame />
    </SettingsProvider>
  );
}
