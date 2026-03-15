import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { fontFamily } from '../theme';

// ─── Price data generation ─────────────────────────────────────────────────
const NUM_POINTS = 120;

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function generatePriceData(): number[] {
  const vals: number[] = [];
  let v = 0.74;
  for (let i = 0; i < NUM_POINTS; i++) {
    const noise = (pseudoRandom(i) - 0.5) * 0.055;
    // Add some medium-frequency oscillation so it looks like real market data
    const wave1 = Math.sin(i * 0.18) * 0.012;
    const wave2 = Math.sin(i * 0.07) * 0.02;
    const drift = -0.004; // downward bias
    v += noise + wave1 + wave2 + drift;
    v = Math.max(0.15, Math.min(0.92, v));
    vals.push(v);
  }
  return vals;
}

const PRICE_DATA = generatePriceData();

// ─── Smooth SVG path from points ─────────────────────────────────────────────
function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i - 1];
    const c = pts[i];
    const cpx = ((p.x + c.x) / 2).toFixed(2);
    d += ` C ${cpx} ${p.y.toFixed(2)} ${cpx} ${c.y.toFixed(2)} ${c.x.toFixed(2)} ${c.y.toFixed(2)}`;
  }
  return d;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const START_PRICE = 67_432;
const END_PRICE   = 62_880;

const CHART_W  = 980;
const CHART_H  = 520;
const PAD_L    = 20;
const PAD_R    = 20;
const PAD_T    = 30;
const PAD_B    = 50;
const INNER_W  = CHART_W - PAD_L - PAD_R;
const INNER_H  = CHART_H - PAD_T - PAD_B;

// Y-axis price levels to show as grid labels
const PRICE_LEVELS = [66_000, 64_000, 62_000];

export const BitcoinChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = frame / durationInFrames;

  // How many data points are visible (line draws progressively)
  const visibleCount = Math.max(2, Math.ceil(progress * NUM_POINTS));
  const visibleData = PRICE_DATA.slice(0, visibleCount);

  // Compute SVG points
  const points = visibleData.map((v, i) => ({
    x: PAD_L + (i / (NUM_POINTS - 1)) * INNER_W,
    y: PAD_T + (1 - v) * INNER_H,
  }));

  const linePath = smoothPath(points);
  const tip = points[points.length - 1];

  // Fill area under the line
  const fillPath =
    points.length > 1
      ? linePath +
        ` L ${tip.x.toFixed(2)} ${(PAD_T + INNER_H).toFixed(2)}` +
        ` L ${points[0].x.toFixed(2)} ${(PAD_T + INNER_H).toFixed(2)} Z`
      : '';

  // Current price interpolated along the visible price data
  const firstVal = PRICE_DATA[0];
  const lastVal = PRICE_DATA[visibleCount - 1];
  const dataRange = PRICE_DATA[0] - PRICE_DATA[NUM_POINTS - 1];
  const currentPrice =
    START_PRICE - ((firstVal - lastVal) / dataRange) * (START_PRICE - END_PRICE);

  const priceChangePct = ((currentPrice - START_PRICE) / START_PRICE) * 100;

  // Pulsing dot at tip
  const pulse = (Math.sin(frame * 0.25) * 0.5 + 0.5);

  // Map price level to chart Y coordinate
  const priceToY = (price: number) => {
    const normalised =
      (price - END_PRICE) / (START_PRICE - END_PRICE);
    return PAD_T + (1 - normalised) * INNER_H;
  };

  // Fade in the whole composition
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        background: '#E8E8E8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily,
        opacity,
      }}
    >
      {/* ── LIVE badge ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 28,
        }}
      >
        <div
          style={{
            width: 9,
            height: 9,
            borderRadius: '50%',
            background: '#CC3322',
            opacity: 0.6 + pulse * 0.4,
          }}
        />
        <span
          style={{
            color: 'rgba(17,17,17,0.45)',
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: 3,
          }}
        >
          LIVE
        </span>
      </div>

      {/* ── Pair label ── */}
      <div
        style={{
          color: 'rgba(17,17,17,0.35)',
          fontSize: 26,
          letterSpacing: 5,
          fontWeight: 500,
          marginBottom: 10,
        }}
      >
        BTC / USD
      </div>

      {/* ── Price display ── */}
      <div
        style={{
          color: '#111111',
          fontSize: 96,
          fontWeight: 700,
          letterSpacing: -2,
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1,
          marginBottom: 12,
        }}
      >
        ${Math.round(currentPrice).toLocaleString('en-US')}
      </div>

      {/* ── % Change ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          color: '#CC3322',
          fontSize: 34,
          fontWeight: 600,
          marginBottom: 44,
        }}
      >
        <span style={{ fontSize: 26 }}>▼</span>
        {Math.abs(priceChangePct).toFixed(2)}%
      </div>

      {/* ── Chart ── */}
      <div style={{ position: 'relative', width: CHART_W, height: CHART_H }}>
        <svg
          width={CHART_W}
          height={CHART_H}
          viewBox={`0 0 ${CHART_W} ${CHART_H}`}
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Fill gradient */}
            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#CC3322" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#CC3322" stopOpacity="0.0" />
            </linearGradient>

            {/* Clip to chart area */}
            <clipPath id="chartClip">
              <rect x={PAD_L} y={PAD_T} width={INNER_W} height={INNER_H} />
            </clipPath>
          </defs>

          {/* Grid lines + price labels */}
          {PRICE_LEVELS.map((price) => {
            const y = priceToY(price);
            return (
              <g key={price}>
                <line
                  x1={PAD_L}
                  x2={PAD_L + INNER_W}
                  y1={y}
                  y2={y}
                  stroke="rgba(17,17,17,0.1)"
                  strokeWidth="1"
                  strokeDasharray="4 8"
                />
                <text
                  x={PAD_L + INNER_W + 14}
                  y={y + 5}
                  fill="rgba(17,17,17,0.3)"
                  fontSize="20"
                  fontFamily={fontFamily}
                >
                  {(price / 1000).toFixed(0)}k
                </text>
              </g>
            );
          })}

          {/* X-axis baseline */}
          <line
            x1={PAD_L}
            x2={PAD_L + INNER_W}
            y1={PAD_T + INNER_H}
            y2={PAD_T + INNER_H}
            stroke="rgba(17,17,17,0.12)"
            strokeWidth="1"
          />

          {/* Area fill (clipped) */}
          {points.length > 1 && (
            <path
              d={fillPath}
              fill="url(#areaFill)"
              clipPath="url(#chartClip)"
            />
          )}

          {/* ── Main line ── */}
          {points.length > 1 && (
            <path
              d={linePath}
              fill="none"
              stroke="#CC3322"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              clipPath="url(#chartClip)"
            />
          )}

          {/* ── Tip dot ── */}
          {tip && (
            <>
              {/* Outer pulse ring */}
              <circle
                cx={tip.x}
                cy={tip.y}
                r={8 + pulse * 6}
                fill="none"
                stroke="rgba(204,51,34,0.25)"
                strokeWidth="1"
                opacity={0.4 + pulse * 0.6}
              />
              {/* Core dot */}
              <circle cx={tip.x} cy={tip.y} r={3.5} fill="#CC3322" />
            </>
          )}
        </svg>
      </div>

      {/* ── Bottom label ── */}
      <div
        style={{
          color: 'rgba(17,17,17,0.3)',
          fontSize: 20,
          letterSpacing: 4,
          marginTop: 32,
          fontWeight: 500,
        }}
      >
        24H PRICE ACTION
      </div>
    </div>
  );
};
