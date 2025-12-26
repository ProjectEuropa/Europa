import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

export const dynamic = 'force-static';

export const alt = 'PROJECT EUROPA - OKE Sharing Platform';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default function Image() {
    // 背景画像をBase64エンコード
    const imagePath = join(process.cwd(), 'public', 'main.jpg');
    const imageBuffer = readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const imageDataUrl = `data:image/jpeg;base64,${base64Image}`;

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    fontFamily: 'sans-serif',
                }}
            >
                {/* 背景画像 */}
                <img
                    src={imageDataUrl}
                    alt=""
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                />

                {/* UIオーバーレイ */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        padding: '60px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        zIndex: 10,
                    }}
                >
                    {/* ヘッダー */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: '12px', fontWeight: 900, color: '#00c8ff', letterSpacing: '0.4em', marginBottom: '8px', display: 'flex', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>ORBITAL PHASE: ACTIVE</div>
                            <div style={{ height: '2px', width: '60px', background: 'linear-gradient(90deg, #00c8ff, transparent)', display: 'flex' }} />
                        </div>
                        <div style={{ width: '40px', height: '40px', borderTop: '2px solid rgba(255, 255, 255, 0.25)', borderRight: '2px solid rgba(255, 255, 255, 0.25)', display: 'flex' }} />
                    </div>

                    {/* 中央ロゴ */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div
                            style={{
                                fontSize: '110px',
                                fontWeight: 100,
                                color: 'white',
                                letterSpacing: '0.5em',
                                textAlign: 'center',
                                textShadow: '0 4px 30px rgba(0, 0, 0, 0.9), 0 0 60px rgba(0, 0, 0, 0.5)',
                                paddingLeft: '0.5em',
                                lineHeight: 1,
                                display: 'flex',
                            }}
                        >
                            EUROPA
                        </div>
                        <div
                            style={{
                                fontSize: '14px',
                                fontWeight: 400,
                                color: 'rgba(255, 255, 255, 0.7)',
                                letterSpacing: '0.8em',
                                marginTop: '25px',
                                textTransform: 'uppercase',
                                paddingLeft: '0.8em',
                                display: 'flex',
                                textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
                            }}
                        >
                            OKE Sharing Platform
                        </div>
                    </div>

                    {/* フッター */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div style={{ width: '40px', height: '40px', borderBottom: '2px solid rgba(255, 255, 255, 0.25)', borderLeft: '2px solid rgba(255, 255, 255, 0.25)', display: 'flex' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'monospace', display: 'flex', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>JUPITER_IV // GALILEAN_MOON</div>
                            <div style={{ fontSize: '10px', color: '#00c8ff', fontWeight: 800, marginTop: '5px', letterSpacing: '0.1em', display: 'flex', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>© 2016~{new Date().getFullYear()} PROJECT EUROPA</div>
                        </div>
                    </div>
                </div>

                {/* 軽いビネット */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(0,0,0,0.4) 100%)',
                        pointerEvents: 'none',
                        display: 'flex',
                    }}
                />
            </div>
        ),
        {
            ...size,
        }
    );
}
