import { ImageResponse } from 'next/og'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Plotter-sheet favicon: the copper-trace sapling in miniature — tall center
// trunk, a 45° branch to each side, three green leaves, ground line — on the
// warm paper tile. No via rings: too busy at 32px.
export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <rect x="0.5" y="0.5" width="31" height="31" rx="7" fill="#ede4d1" stroke="#2c231a" />
          <g fill="none" stroke="#b0672f" strokeLinecap="round">
            <path d="M16 28 L16 8" strokeWidth="1.8" />
            <path d="M16 24 L10 18 L10 14" strokeWidth="1.6" />
            <path d="M16 17.5 L22 11.5 L22 8.5" strokeWidth="1.6" />
          </g>
          <g fill="#66803c">
            <path d="M10 14 C7 11 7.3 7.6 9.8 6.3 C12.7 8 12.8 11.6 10 14 Z" />
            <path d="M22 8.5 C24.8 6 24.5 3.4 22.3 2.4 C19.8 3.8 19.7 6.6 22 8.5 Z" />
            <path d="M16 8 C13.6 5.4 14 2.6 16 1.7 C18.2 3 18 6 16 8 Z" />
          </g>
          <path d="M11 28 L21 28" stroke="#2c231a" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
