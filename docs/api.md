# Share API Documentation

## Overview

This API provides endpoints for managing shareable presets using Supabase as the backend storage. The API supports creating, reading, updating, and deleting preset configurations with PIN-based access control.

## Database Schema

The API uses a Supabase table called `shared_presets` with the following structure:

```sql
CREATE TABLE shared_presets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pin_code VARCHAR(6) NOT NULL,
  preset_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  type VARCHAR(20) DEFAULT 'preset',
  UNIQUE(pin_code)
);

-- Create index for faster PIN code lookups
CREATE INDEX idx_shared_presets_pin_code ON shared_presets(pin_code);
CREATE INDEX idx_shared_presets_expires_at ON shared_presets(expires_at);
```

## Endpoints

### 1. Save Preset

**POST** `/api/share/save-preset`

Saves a new preset or updates an existing one with the given PIN code.

#### Request Body
```json
{
  "pinCode": "123456",
  "preset": {
    "createdAt": "2024-01-01T00:00:00.000Z",
    "expiresAt": "2024-01-08T00:00:00.000Z",
    "data": {
      // Preset configuration data
    }
  }
}
```

#### Response
```json
{
  "success": true,
  "message": "预设保存成功",
  "pinCode": "123456",
  "expiresAt": "2024-01-08T00:00:00.000Z"
}
```

### 2. Load Preset

**GET** `/api/share/load-preset/[pinCode]`

Retrieves a preset by its PIN code.

#### Response
```json
{
  "success": true,
  "preset": {
    "createdAt": "2024-01-01T00:00:00.000Z",
    "expiresAt": "2024-01-08T00:00:00.000Z",
    "data": {
      // Preset configuration data
    }
  }
}
```

### 3. Check Preset

**GET** `/api/share/check-preset/[pinCode]`

Checks if a preset exists for the given PIN code.

#### Response
```json
{
  "success": true,
  "exists": true,
  "message": "PIN码存在"
}
```

### 4. Delete Preset

**DELETE** `/api/share/delete-preset/[pinCode]`

Deletes a preset by its PIN code.

#### Response
```json
{
  "success": true,
  "message": "预设删除成功"
}
```

### 5. Test Storage Connection

**GET** `/api/share/test-storage`

Tests the connection to Supabase storage.

#### Response
```json
{
  "success": true,
  "message": "Supabase连接成功",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Environment Variables

Configure the following environment variables in your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Storage Provider (optional)
NEXT_PUBLIC_STORAGE_PROVIDER=supabase
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message in Chinese",
  "details": "Additional error details (optional)"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad Request (invalid PIN format, missing data)
- `404`: Not Found (PIN code doesn't exist)
- `500`: Internal Server Error

## PIN Code Validation

- PIN codes must be exactly 6 digits
- PIN codes are unique across the system
- Expired presets are automatically cleaned up when accessed

## Security Features

- Row Level Security (RLS) can be enabled in Supabase for additional protection
- Automatic cleanup of expired presets
- Input validation for all endpoints
- Secure cookie-based session management through Supabase SSR

## Migration from Vika

This API has been migrated from Vika to Supabase for better performance, reliability, and integration with the Next.js ecosystem. The API interface remains the same, but the backend storage has been completely replaced.
