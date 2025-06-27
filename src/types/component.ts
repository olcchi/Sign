import React from 'react';

// Base Props interfaces for common UI patterns
export interface BaseDialogProps {
  children: React.ReactNode;
  className?: string;
}

export interface BaseComponentProps {
  className?: string;
}

export interface BaseSettingProps extends BaseComponentProps {
  isOpen?: boolean;
} 