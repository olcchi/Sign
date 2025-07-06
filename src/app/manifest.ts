import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sign - Electronic Cheering Sign',
    short_name: 'Sign',
    description: 'Generate your electronic cheering sign',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    orientation: 'any',
    icons: [
      {
        src: '/Sign-Logo.png',
        sizes: 'any',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/Sign-Logo.png',
        sizes: 'any',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['entertainment', 'utilities'],
    lang: 'en',
    scope: '/',
    prefer_related_applications: false,
  }
} 