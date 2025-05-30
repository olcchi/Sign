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
  preset: Preset;
  createdAt: string;
  expiresAt: string;
}

// API response interface for share operations
export interface ShareApiResponse {
  success: boolean;
  data?: any;
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

// Save preset with PIN code
export async function saveSharedPreset(
  pinCode: string,
  preset: Preset
): Promise<ShareApiResponse> {
  return requestQueue.execute(async () => {
    try {
      const shareablePreset: ShareablePreset = {
        preset,
        createdAt: new Date().toISOString(),
        expiresAt: getExpirationTime(),
      };

      const response = await fetch('/api/share/save-preset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pinCode,
          preset: shareablePreset,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Occasionally trigger cleanup (10% chance) as supplementary mechanism
      if (Math.random() < 0.1) {
        console.log('Triggering supplementary cleanup...');
        // Fire and forget - don't wait for cleanup to complete
        fetch('/api/cron/cleanup-expired', {
          method: 'GET',
          headers: {
            'User-Agent': 'vercel-cron/1.0', // Mimic cron user agent
          },
        }).catch(error => {
          console.log('Supplementary cleanup failed:', error);
        });
      }
      
      return { success: true, data: result };
    } catch (error) {
      console.error('Failed to save shared preset:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  });
}

// Load preset by PIN code
export async function loadSharedPreset(pinCode: string): Promise<ShareApiResponse> {
  try {
    const response = await fetch(`/api/share/load-preset/${pinCode}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, error: 'PIN码不存在或已过期' };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    // Check if preset has expired
    const presetData = result.preset as ShareablePreset;
    if (new Date(presetData.expiresAt) < new Date()) {
      // Delete expired preset
      await deleteSharedPreset(pinCode);
      return { success: false, error: 'PIN码已过期' };
    }

    return { success: true, data: presetData };
  } catch (error) {
    console.error('Failed to load shared preset:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Delete preset by PIN code
export async function deleteSharedPreset(pinCode: string): Promise<ShareApiResponse> {
  try {
    const response = await fetch(`/api/share/delete-preset/${pinCode}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to delete shared preset:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Validate PIN code format
export function isValidPinCode(pinCode: string): boolean {
  return /^\d{6}$/.test(pinCode);
}

// Create shareable URL for preset
export function createPresetShareUrl(pinCode: string): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseUrl}/share-preset/${pinCode}`;
} 