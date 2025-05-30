import { createClient } from '@/lib/supabase/server'
import { ShareablePreset } from '@/lib/share-api'

// Database table interface for presets - updated to match actual table structure
interface PresetRecord {
  pin_code: number
  preset_data: any
  created_at?: string
  expires_at: string // Now using timestamptz (ISO string)
}

// Supabase-based storage service for share configurations
class SupabaseConfigStorage {
  private tableName = 'shared_presets'

  // Save preset to Supabase
  async setPreset(pinCode: string, preset: ShareablePreset): Promise<boolean> {
    try {
      const supabase = await createClient()

      console.log('Attempting to save preset with PIN:', pinCode)
      console.log('Preset data:', JSON.stringify(preset, null, 2))

      // Check if preset with this PIN already exists
      const { data: existingPreset, error: selectError } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('pin_code', parseInt(pinCode))
        .single()

      console.log('Existing preset check:', { existingPreset, selectError })

      const presetData: PresetRecord = {
        pin_code: parseInt(pinCode),
        preset_data: preset,
        created_at: preset.createdAt,
        expires_at: preset.expiresAt // Direct ISO string assignment
      }

      console.log('Data to insert/update:', JSON.stringify(presetData, null, 2))

      let result

      if (existingPreset && !selectError) {
        // Update existing preset
        console.log('Updating existing preset')
        result = await supabase
          .from(this.tableName)
          .update(presetData)
          .eq('pin_code', parseInt(pinCode))
      } else {
        // Insert new preset
        console.log('Inserting new preset')
        result = await supabase
          .from(this.tableName)
          .insert(presetData)
      }

      console.log('Operation result:', JSON.stringify(result, null, 2))

      if (result.error) {
        console.error('Supabase error:', result.error)
        return false
      }

      console.log(`Successfully saved preset with PIN: ${pinCode}`)
      return true
    } catch (error) {
      console.error('Failed to save preset to Supabase:', error)
      return false
    }
  }

  // Get preset from Supabase by PIN code
  async getPreset(pinCode: string): Promise<ShareablePreset | undefined> {
    try {
      const supabase = await createClient()

      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('pin_code', parseInt(pinCode))
        .single()

      if (error || !data) {
        console.log('No preset found for PIN:', pinCode, 'Error:', error)
        return undefined
      }

      const preset = data.preset_data as ShareablePreset

      // Check if preset has expired (using timestamptz comparison)
      if (new Date(data.expires_at) < new Date()) {
        // Delete expired preset
        await this.deletePreset(pinCode)
        return undefined
      }

      return preset
    } catch (error) {
      console.error('Failed to get preset from Supabase:', error)
      return undefined
    }
  }

  // Delete preset by PIN code
  async deletePreset(pinCode: string): Promise<boolean> {
    try {
      const supabase = await createClient()

      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('pin_code', parseInt(pinCode))

      if (error) {
        console.error('Supabase delete error:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Failed to delete preset from Supabase:', error)
      return false
    }
  }

  // Check if preset exists (for validation)
  async checkPreset(pinCode: string): Promise<boolean> {
    try {
      const supabase = await createClient()

      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('pin_code', parseInt(pinCode))
        .single()

      if (error || !data) {
        return false
      }

      // Check if preset has expired (using timestamptz comparison)
      if (new Date(data.expires_at) < new Date()) {
        // Delete expired preset
        await this.deletePreset(pinCode)
        return false
      }

      return true
    } catch (error) {
      console.error('Failed to check preset in Supabase:', error)
      return false
    }
  }

  // Clean up expired presets (utility function)
  async cleanupExpiredPresets(): Promise<number> {
    try {
      const supabase = await createClient()

      // Use PostgreSQL's NOW() function for server-side comparison
      const { data, error } = await supabase
        .from(this.tableName)
        .delete()
        .lt('expires_at', new Date().toISOString())
        .select('*')

      if (error) {
        console.error('Failed to cleanup expired presets:', error)
        return 0
      }

      return data?.length || 0
    } catch (error) {
      console.error('Failed to cleanup expired presets:', error)
      return 0
    }
  }
}

// Export singleton instance
export const supabaseConfigStorage = new SupabaseConfigStorage() 