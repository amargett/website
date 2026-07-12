import { ImageResponse } from 'next/og'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Terminal Garden favicon: a broad little decision-tree with colorful nodes
// on a warm brown-black tile.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#161210',
          borderRadius: '8px',
          border: '1px solid #3a2d22',
        }}
      >
        <svg width="28" height="28" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" stroke="#7f9a52" strokeLinecap="round" strokeLinejoin="round">
            <path strokeWidth="1.7" d="M16 31 V20" />
            <path strokeWidth="1.6" d="M16 20 C16 16 16 11 16 6" />
            <path strokeWidth="1.6" d="M16 20 C13.5 18 12 16 11 14" />
            <path strokeWidth="1.6" d="M16 20 C18.5 18 20 16 21 14" />
            <path strokeWidth="1.2" d="M11 14 C10.5 11.5 10.5 9 10 7" />
            <path strokeWidth="1.2" d="M11 14 C9 13 7 12 5 11" />
            <path strokeWidth="1.2" d="M21 14 C21.5 11.5 21.5 9 22 7" />
            <path strokeWidth="1.2" d="M21 14 C23 13 25 12 27 11" />
          </g>
          <g stroke="#161210" strokeWidth="0.6">
            <circle cx="16" cy="5.5" r="2.4" fill="#e2983f" />
            <circle cx="10" cy="6.5" r="1.9" fill="#cf6a34" />
            <circle cx="22" cy="6.5" r="1.9" fill="#96b85f" />
            <circle cx="5" cy="11" r="1.9" fill="#57a99b" />
            <circle cx="27" cy="11" r="1.9" fill="#57a99b" />
            <circle cx="11" cy="14" r="1.4" fill="#96b85f" />
            <circle cx="21" cy="14" r="1.4" fill="#96b85f" />
          </g>
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
