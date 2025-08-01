export const dynamic = 'force-static';
export const revalidate = 0;

import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    // ImageResponse JSX element
    <div
      style={{
        fontSize: 24,
        background: 'linear-gradient(to bottom right, #00c8ff, #0060a0)',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        color: 'white',
      }}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Europa Project Favicon"
      >
        <title>Europa Project Favicon</title>
        <path
          d="M8 8H24M8 16H20M8 24H24"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M16 4V28"
          stroke="white"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeDasharray="1 2"
        />
        <circle cx="24" cy="16" r="2.5" fill="white" />
      </svg>
    </div>,
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse width and height.
      ...size,
    }
  );
}
