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
  personalUrl = 'https://olcchi.site',
  githubUrl = 'https://github.com/olcchi',
  showGithub = true,
  className,
}: OlcchiProps) {
  return (
    <div className={cn('fixed bottom-4 left-4 z-10 flex items-center gap-3 ', className)}>
      <Link 
        href={personalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs hover:opacity-100 opacity-30 md:opacity-10 hover:underline font-mono"
      >
        @{id}
      </Link>
      
      {showGithub && (
        <Link 
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-zinc-300"
          aria-label="GitHub"
        >
          <Github size={14} />
        </Link>
      )}
    </div>
  );
}
