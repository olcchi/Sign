import { Preset } from "@/components/ui/settings/Preset";

// Simple request queue to avoid rate limiting
class RequestQueue {
  private lastRequestTime = 0;
  private readonly minInterval = 600; // 0.6 seconds between requests

  async execute<T>(requestFn: () => Promise<T>): Promise<T> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minInterval) {
      const delay = this.minInterval - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    this.lastRequestTime = Date.now();
    return requestFn();
  }
}

const requestQueue = new RequestQueue();

// Preset sharing interface
export interface ShareablePreset {
  id: string;
  name: string;
  text: string;
  textColor: string;
  fontFamily: string;
  fontSize: string;
  scrollSpeed: number;
  edgeBlurEnabled: boolean;
  edgeBlurIntensity: number;
  shinyTextEnabled: boolean;
  noiseEnabled?: boolean;
  noiseOpacity?: number;
  noiseDensity?: number;
  textStrokeEnabled?: boolean;
  textStrokeWidth?: number;
  textStrokeColor?: string;
  textFillEnabled?: boolean;
}

// API response interface for share operations
export interface ShareApiResponse {
  success: boolean;
  error?: string;
}

// Generate a random 6-digit PIN code
export function generatePinCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Calculate expiration time (24 hours from now)
export function getExpirationTime(): string {
  const now = new Date();
  const expiration = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
  return expiration.toISOString();
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
    const shareablePreset: ShareablePreset = {
      id: preset.id,
      name: preset.name,
      text: preset.text,
      textColor: preset.textColor,
      fontFamily: preset.fontFamily,
      fontSize: preset.fontSize,
      scrollSpeed: preset.scrollSpeed,
      edgeBlurEnabled: preset.edgeBlurEnabled,
      edgeBlurIntensity: preset.edgeBlurIntensity,
      shinyTextEnabled: preset.shinyTextEnabled,
      noiseEnabled: preset.noiseEnabled,
      noiseOpacity: preset.noiseOpacity,
      noiseDensity: preset.noiseDensity,
      textStrokeEnabled: preset.textStrokeEnabled,
      textStrokeWidth: preset.textStrokeWidth,
      textStrokeColor: preset.textStrokeColor,
      textFillEnabled: preset.textFillEnabled,
    };

    const response = await requestQueue.execute(() =>
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
    const response = await requestQueue.execute(() =>
      fetch(`/api/share/load-preset/${pinCode}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
    );

    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, error: 'Preset not found or expired' };
      }
      return { success: false, error: `HTTP ${response.status}` };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Failed to load shared preset:', error);
    return { success: false, error: 'Network error' };
  }
}

// Delete shared preset by PIN code
export async function deleteSharedPreset(pinCode: string): Promise<ShareApiResponse> {
  if (!isValidPinCode(pinCode)) {
    return { success: false, error: 'Invalid PIN code format' };
  }

  try {
    const response = await requestQueue.execute(() =>
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
    return { success: false, error: 'Network error' };
  }
} 