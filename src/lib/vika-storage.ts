import { ShareablePreset } from '@/lib/share-api';

// Vika API configuration from environment variables
const VIKA_API_BASE = 'https://api.vika.cn/fusion/v1';
const DATASHEET_ID = process.env.VIKA_DATASHEET_ID;
const VIEW_ID = process.env.VIKA_VIEW_ID;
const API_TOKEN = process.env.VIKA_API_TOKEN;

// Validate required environment variables
if (!DATASHEET_ID || !VIEW_ID || !API_TOKEN) {
  console.error('Missing required Vika environment variables:');
  if (!DATASHEET_ID) console.error('- VIKA_DATASHEET_ID is not set');
  if (!VIEW_ID) console.error('- VIKA_VIEW_ID is not set');
  if (!API_TOKEN) console.error('- VIKA_API_TOKEN is not set');
  console.error('Please check your .env.local file and ensure all Vika variables are configured.');
}

// Vika API response interfaces
interface VikaRecord {
  recordId: string;
  fields: {
    pin: string;
    preset: string;
    type?: string; // 'config' or 'preset'
    createdAt?: string;
    expiresAt?: string;
  };
}

interface VikaResponse {
  success: boolean;
  code: number;
  message: string;
  data: {
    records: VikaRecord[];
  };
}

// Vika-based storage service for share configurations
class VikaConfigStorage {
  private baseUrl = `${VIKA_API_BASE}/datasheets/${DATASHEET_ID}/records`;
  private headers = {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
  };

  // Check if configuration is valid
  private isConfigured(): boolean {
    return !!(DATASHEET_ID && VIEW_ID && API_TOKEN);
  }

  // Save preset to Vika
  async setPreset(pinCode: string, preset: ShareablePreset): Promise<boolean> {
    if (!this.isConfigured()) {
      console.error('Vika storage is not properly configured');
      return false;
    }

    try {
      // Add delay to avoid rate limiting (ensure we don't exceed 2 requests/second)
      await new Promise(resolve => setTimeout(resolve, 600)); // 0.6 second delay

      // Prepare data for Vika - no need to delete first, just overwrite
      const vikaData = {
        records: [
          {
            fields: {
              pin: pinCode,
              preset: JSON.stringify(preset),
              type: 'preset',
              createdAt: preset.createdAt,
              expiresAt: preset.expiresAt,
            }
          }
        ],
        fieldKey: 'name'
      };

      const response = await fetch(`${this.baseUrl}?viewId=${VIEW_ID}&fieldKey=name`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(vikaData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}, body: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const result: VikaResponse = await response.json();
      
      if (result.success && result.code === 200) {
        console.log(`Successfully saved preset with PIN: ${pinCode}`);
        return true;
      } else {
        throw new Error(`Vika API returned error: code=${result.code}, success=${result.success}, message=${result.message}`);
      }
    } catch (error) {
      console.error('Failed to save preset to Vika:', error);
      return false;
    }
  }

  // Get preset from Vika by PIN code
  async getPreset(pinCode: string): Promise<ShareablePreset | undefined> {
    if (!this.isConfigured()) {
      console.error('Vika storage is not properly configured');
      return undefined;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}?viewId=${VIEW_ID}&fieldKey=name&filterByFormula=AND({pin}="${pinCode}",{type}="preset")`,
        {
          method: 'GET',
          headers: this.headers,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: VikaResponse = await response.json();
      
      if (!result.success || result.code !== 200 || !result.data.records.length) {
        return undefined;
      }

      const record = result.data.records[0];
      const preset = JSON.parse(record.fields.preset) as ShareablePreset;
      
      // Check if preset has expired
      if (new Date(preset.expiresAt) < new Date()) {
        // Delete expired preset
        await this.deleteByRecordId(record.recordId);
        return undefined;
      }

      return preset;
    } catch (error) {
      console.error('Failed to get preset from Vika:', error);
      return undefined;
    }
  }

  // Delete preset by PIN code
  async deletePreset(pinCode: string): Promise<boolean> {
    if (!this.isConfigured()) {
      console.error('Vika storage is not properly configured');
      return false;
    }

    try {
      // First find the record
      const response = await fetch(
        `${this.baseUrl}?viewId=${VIEW_ID}&fieldKey=name&filterByFormula=AND({pin}="${pinCode}",{type}="preset")`,
        {
          method: 'GET',
          headers: this.headers,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: VikaResponse = await response.json();
      
      if (!result.success || result.code !== 200 || !result.data.records.length) {
        return false; // Record not found
      }

      const recordId = result.data.records[0].recordId;
      return await this.deleteByRecordId(recordId);
    } catch (error) {
      console.error('Failed to delete preset from Vika:', error);
      return false;
    }
  }

  // Helper method to delete by record ID
  private async deleteByRecordId(recordId: string): Promise<boolean> {
    try {
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 600)); // 0.6 second delay

      const response = await fetch(`${this.baseUrl}?viewId=${VIEW_ID}&recordIds=${recordId}`, {
        method: 'DELETE',
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: VikaResponse = await response.json();
      return result.success && result.code === 200;
    } catch (error) {
      console.error('Failed to delete record from Vika:', error);
      return false;
    }
  }
}

// Export singleton instance
export const vikaConfigStorage = new VikaConfigStorage();