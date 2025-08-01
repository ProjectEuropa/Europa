export const dynamic = 'force-static';
export const revalidate = 0;

import { ImageResponse } from 'next/og';

// Route segment config

// Image metadata
export const size = {
  width: 180,
  height: 180,
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
        borderRadius: 45,
        color: 'white',
      }}
    >
      <svg
        width="180"
        height="180"
        viewBox="0 0 180 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Europa Project Logo"
      >
        <title>Europa Project Logo</title>
        <path
          d="M45 45H135M45 90H112.5M45 135H135"
          stroke="white"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M90 22.5V157.5"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="5 10"
        />
        <circle cx="135" cy="90" r="12" fill="white" />
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
