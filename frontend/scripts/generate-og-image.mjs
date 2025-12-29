/**
 * OGP画像生成スクリプト
 * 実行: node scripts/generate-og-image.mjs
 */

import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

async function generateOgImage() {
  console.log('Generating OG image...');

  // 背景画像を読み込み
  const backgroundPath = join(ROOT_DIR, 'public', 'main.jpg');

  // SVGでオーバーレイを作成
  const overlaySvg = `
    <svg width="${OG_WIDTH}" height="${OG_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <!-- 暗いオーバーレイ -->
      <rect width="100%" height="100%" fill="rgba(10, 8, 24, 0.6)"/>

      <!-- ビネット効果 -->
      <defs>
        <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stop-color="transparent"/>
          <stop offset="100%" stop-color="rgba(0,0,0,0.5)"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#vignette)"/>

      <!-- 上部のステータス -->
      <text x="60" y="80" font-family="sans-serif" font-size="12" font-weight="900" fill="#00c8ff" letter-spacing="4">ORBITAL PHASE: ACTIVE</text>
      <line x1="60" y1="90" x2="120" y2="90" stroke="#00c8ff" stroke-width="2"/>

      <!-- 右上のコーナー -->
      <path d="M1100 40 L1140 40 L1140 80" stroke="rgba(255,255,255,0.25)" stroke-width="2" fill="none"/>

      <!-- 中央のタイトル -->
      <text x="600" y="290" font-family="sans-serif" font-size="100" font-weight="100" fill="white" text-anchor="middle" letter-spacing="50">EUROPA</text>

      <!-- サブタイトル -->
      <text x="600" y="350" font-family="sans-serif" font-size="14" font-weight="400" fill="rgba(255,255,255,0.7)" text-anchor="middle" letter-spacing="10">OKE SHARING PLATFORM</text>

      <!-- 左下のコーナー -->
      <path d="M60 550 L60 590 L100 590" stroke="rgba(255,255,255,0.25)" stroke-width="2" fill="none"/>

      <!-- 右下のテキスト -->
      <text x="1140" y="560" font-family="monospace" font-size="11" fill="rgba(255,255,255,0.5)" text-anchor="end">JUPITER_IV // GALILEAN_MOON</text>
      <text x="1140" y="580" font-family="sans-serif" font-size="10" font-weight="800" fill="#00c8ff" text-anchor="end" letter-spacing="1">© 2016~${new Date().getFullYear()} PROJECT EUROPA</text>
    </svg>
  `;

  try {
    // 背景画像をリサイズしてOGPサイズに
    const background = await sharp(backgroundPath)
      .resize(OG_WIDTH, OG_HEIGHT, { fit: 'cover' })
      .toBuffer();

    // オーバーレイを合成
    const result = await sharp(background)
      .composite([
        {
          input: Buffer.from(overlaySvg),
          top: 0,
          left: 0,
        },
      ])
      .jpeg({ quality: 90 })
      .toBuffer();

    // 出力
    const outputPath = join(ROOT_DIR, 'public', 'og-image.jpg');
    writeFileSync(outputPath, result);

    console.log(`✅ OG image generated: ${outputPath}`);
    console.log(`   Size: ${OG_WIDTH}x${OG_HEIGHT}`);
    console.log(`   File size: ${(result.length / 1024).toFixed(1)} KB`);
  } catch (error) {
    console.error('❌ Failed to generate OG image:', error);
    process.exit(1);
  }
}

generateOgImage();
