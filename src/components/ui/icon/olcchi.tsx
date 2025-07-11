'use client';

import React from 'react';
import { Github } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface OlcchiProps {
  id?: string;
  personalUrl?: string;
  githubUrl?: string;
  showGithub?: boolean;
  className?: string;
}

export function Olcchi({
  id = 'olcchi',
  personalUrl = 'https://olcchi.me',
  githubUrl = 'https://github.com/olcchi/sign',
  showGithub = true,
  className,
}: OlcchiProps) {
  return (
    <div className={cn(' z-10 flex items-center gap-3 hover:opacity-100 opacity-30 md:opacity-20 hover:underline', className)}>
      <Link 
        href={personalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs font-mono"
      >
        @{id}
      </Link>
      
      {showGithub && (
        <Link 
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <Github size={14} />
        </Link>
      )}
    </div>
  );
}
