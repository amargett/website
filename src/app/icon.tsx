import { ImageResponse } from 'next/og'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Terminal Garden favicon: an abstract circuit fragment — a short diagonal run of
// nodes wired by copper and green traces: a copper via-ring, an amber diamond pad,
// a green node, and a warm accent node, on the warm brown-black tile.
export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <rect x="0.5" y="0.5" width="31" height="31" rx="7" fill="#161210" stroke="#3a2d22" />
          <g fill="none" strokeLinecap="round">
            <path d="M9 11 L16 16" stroke="#c98a3f" strokeWidth="1.7" />
            <path d="M16 16 L23 21" stroke="#96b85f" strokeWidth="1.7" />
            <path d="M16 16 L22.5 10" stroke="#c98a3f" strokeWidth="1.7" />
          </g>
          <circle cx="9" cy="11" r="2" fill="#161210" stroke="#c98a3f" strokeWidth="1.5" />
          <path d="M16 13.4 L18.6 16 L16 18.6 L13.4 16 Z" fill="#e2983f" />
          <circle cx="23" cy="21" r="2" fill="#96b85f" />
          <circle cx="22.5" cy="10" r="1.6" fill="#cf6a34" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
