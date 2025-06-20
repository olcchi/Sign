import { Preset } from "@/components/ui/settings/Preset/types";
import { ApiResponse } from "@/types";
import { presetToShareable } from "@/lib/preset-conversion";
import { requestQueue } from "@/services/request-queue";
import { getExpirationTime as getExpirationTimeUtil } from "@/lib/utils";

// Preset sharing interface
export interface ShareablePreset {
  id: string;
  name: string;
  text: string;
  textColor: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  scrollSpeed: number;
  edgeBlurEnabled: boolean;
  edgeBlurIntensity: number;
  shinyTextEnabled: boolean;
  noiseEnabled?: boolean;
  noiseOpacity?: number;
  noiseDensity?: number;
  noiseAnimated?: boolean;
  textStrokeEnabled?: boolean;
  textStrokeWidth?: number;
  textStrokeColor?: string;
  textFillEnabled?: boolean;
}

// API response interface for share operations (deprecated - use ApiResponse instead)
export interface ShareApiResponse extends ApiResponse<void> {}

// Generate a random 6-digit PIN code
export function generatePinCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Calculate expiration time (24 hours from now)
export function getExpirationTime(): string {
  return getExpirationTimeUtil(24);
}

// Create shareable URL for preset
export function createPresetShareUrl(pinCode: string): string {
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  return `${baseUrl}/share-preset/${pinCode}`;
}

// Save shared preset with automatic cleanup
export async function saveSharedPreset(pinCode: string, preset: Preset): Promise<ShareApiResponse> {
  try {
    const shareablePreset = presetToShareable(preset);

    const response = await requestQueue.add(() =>
      fetch('/api/share/save-preset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pinCode, preset: shareablePreset }),
      })
    );

    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` };
    }

    const result = await response.json();
    
    if (result.success) {
      // Trigger supplementary cleanup in background
      try {
        fetch('/api/cron/cleanup-expired', { method: 'POST' }).catch(() => {
          // Silent fail for cleanup
        });
      } catch (error) {
        // Silent fail for cleanup
      }
    }

    return result;
  } catch (error) {
    console.error('Failed to save shared preset:', error);
    return { success: false, error: 'Network error' };
  }
}

// Validate PIN code format
export function isValidPinCode(pinCode: string): boolean {
  return /^\d{6}$/.test(pinCode);
}

// Load shared preset by PIN code
export async function loadSharedPreset(pinCode: string): Promise<{
  success: boolean;
  preset?: ShareablePreset;
  error?: string;
}> {
  if (!isValidPinCode(pinCode)) {
    return { success: false, error: 'Invalid PIN code format' };
  }

  try {
    const response = await requestQueue.add(() =>
      fetch(`/api/share/load-preset/${pinCode}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
    );

    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, error: '预设不存在或已过期' };
      }
      return { success: false, error: `网络错误 ${response.status}` };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Failed to load shared preset:', error);
    return { success: false, error: '网络错误' };
  }
}

// Delete shared preset by PIN code
export async function deleteSharedPreset(pinCode: string): Promise<ShareApiResponse> {
  if (!isValidPinCode(pinCode)) {
    return { success: false, error: '无效的PIN码格式' };
  }

  try {
    const response = await requestQueue.add(() =>
      fetch(`/api/share/delete-preset/${pinCode}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })
    );

    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Failed to delete shared preset:', error);
    return { success: false, error: '网络错误' };
  }
} 