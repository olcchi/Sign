import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sign - Electronic Cheering Sign',
    short_name: 'Sign',
    description: 'Generate your electronic cheering sign',
    start_url: '/',
    display: 'fullscreen',
    display_override: ['fullscreen', 'standalone', 'minimal-ui'],
    background_color: '#000000',
    theme_color: '#000000',
    orientation: 'any',
    icons: [
      {
        src: '/Sign-Logo-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/Sign-Logo-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    categories: ['entertainment', 'utilities'],
    lang: 'zh-CN',
    scope: '/',
    prefer_related_applications: false,
  }
} 