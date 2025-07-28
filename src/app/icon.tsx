import { ImageResponse } from 'next/og'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at top right, #ea580c 0%, #f97316 15%, #fb923c 30%, #e0f2fe 30%, #e0f2fe 50%, #0a4a5a 100%)',
          borderRadius: '8px',
        }}
      />
    ),
    {
      ...size,
    }
  )
} 