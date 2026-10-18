'use client';

import React from 'react';
import { toFeet, formatNumber } from '@/features/calculations/calculations';
import { MATERIALS } from '@/features/calculations/materials';
import { StudioSettings } from '@/features/calculations/types';

interface RoomSvgRendererProps {
  settings: StudioSettings;
  zoom?: number;
  pan?: { x: number; y: number };
  className?: string;
  onPanChange?: (newPan: { x: number; y: number }) => void;
}

export function RoomSvgRenderer({
  settings,
  zoom = 1,
  pan = { x: 0, y: 0 },
  className = '',
}: RoomSvgRendererProps) {
  const w = toFeet(settings.width, settings.unit);
  const h = toFeet(settings.length, settings.unit);
  const isLShape = settings.shape === 'l-shape';
  const cw = isLShape ? toFeet(settings.cutoutWidth || 0, settings.unit) : 0;
  const cl = isLShape ? toFeet(settings.cutoutLength || 0, settings.unit) : 0;

  const isInvalid =
    !Number.isFinite(w) ||
    !Number.isFinite(h) ||
    w <= 0 ||
    h <= 0 ||
    w > 500 ||
    h > 500 ||
    (isLShape && (cw <= 0 || cl <= 0 || cw >= w || cl >= h));

  if (isInvalid) {
    return (
      <svg
        viewBox="0 0 720 510"
        className={className || 'w-full h-auto select-none'}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Room preview placeholder"
      >
        <rect width="720" height="510" fill="#f8f7f4" rx="8" />
        <text x="360" y="240" fill="#76877a" fontFamily="sans-serif" textAnchor="middle" fontSize="15" fontWeight="600">
          Enter valid room dimensions to preview floor plan
        </text>
        <text x="360" y="265" fill="#a0afa3" fontFamily="sans-serif" textAnchor="middle" fontSize="12">
          {isLShape ? 'Ensure corner cutout is smaller than total width and length' : 'Width and length must be between 0.1 and 500'}
        </text>
      </svg>
    );
  }

  const mat = MATERIALS[settings.material] || MATERIALS.vinyl;
  const safeZoom = Math.min(2.0, Math.max(0.5, zoom));
  const scale = Math.min(520 / w, 300 / h) * safeZoom;
  const rw = w * scale;
  const rh = h * scale;
  const x = (720 - rw) / 2 + pan.x;
  const y = (510 - rh) / 2 + pan.y;

  const rcw = cw * scale;
  const rcl = cl * scale;

  const isTile = mat.type === 'tile';
  const unit = settings.unit;
  const pattern = settings.pattern || 'staggered';

  const pieces = isTile ? 44 : 26;

  // L-shape SVG polygon path calculation:
  // Shape outline with top-right cutout:
  // (x, y) -> (x + rw - rcw, y) -> (x + rw - rcw, y + rcl) -> (x + rw, y + rcl) -> (x + rw, y + rh) -> (x, y + rh) -> close
  const lPathD = `M ${x} ${y} ` +
    `L ${x + rw - rcw} ${y} ` +
    `L ${x + rw - rcw} ${y + rcl} ` +
    `L ${x + rw} ${y + rcl} ` +
    `L ${x + rw} ${y + rh} ` +
    `L ${x} ${y + rh} Z`;

  // Pattern identifier unique for combinations
  const patternId = `rf-pat-${settings.material}-${pattern}`;

  return (
    <svg
      id="room-svg"
      viewBox="0 0 720 510"
      className={className || 'w-full h-auto select-none'}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`${settings.shape === 'l-shape' ? 'L-shaped' : 'Rectangular'} ${settings.width} by ${settings.length} ${settings.unit} room floor plan visualizer`}
    >
      <defs>
        {/* Soft realistic architectural drop shadow */}
        <filter id="rf-shadow-modern" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="8" dy="12" stdDeviation="12" floodColor="#1c251f" floodOpacity="0.18" />
        </filter>

        {/* 1. Straight Grid Pattern */}
        {pattern === 'straight' && (
          <pattern id={patternId} width={pieces} height={pieces} patternUnits="userSpaceOnUse">
            <rect width={pieces} height={pieces} fill={mat.light} />
            <path d={`M 0 0 H ${pieces} V ${pieces}`} fill="none" stroke={mat.dark} strokeWidth="1" strokeOpacity="0.4" />
          </pattern>
        )}

        {/* 2. Staggered Running Bond Pattern */}
        {pattern === 'staggered' && (
          <pattern id={patternId} width={pieces * 2} height={pieces} patternUnits="userSpaceOnUse">
            <rect width={pieces * 2} height={pieces} fill={mat.light} />
            <line x1="0" y1="0" x2={pieces * 2} y2="0" stroke={mat.dark} strokeWidth="1.2" strokeOpacity="0.45" />
            <line x1="0" y1={pieces} x2={pieces * 2} y2={pieces} stroke={mat.dark} strokeWidth="1.2" strokeOpacity="0.45" />
            <line x1={pieces} y1="0" x2={pieces} y2={pieces} stroke={mat.dark} strokeWidth="1.2" strokeOpacity="0.45" />
            <line x1="0" y1={pieces / 2} x2={pieces * 2} y2={pieces / 2} stroke={mat.dark} strokeWidth="1" strokeOpacity="0.4" />
            <line x1={pieces / 2} y1={pieces / 2} x2={pieces / 2} y2={pieces} stroke={mat.dark} strokeWidth="1.2" strokeOpacity="0.45" />
            <line x1={(pieces * 3) / 2} y1={pieces / 2} x2={(pieces * 3) / 2} y2={pieces} stroke={mat.dark} strokeWidth="1.2" strokeOpacity="0.45" />
          </pattern>
        )}

        {/* 3. Diagonal 45-degree Pattern */}
        {pattern === 'diagonal' && (
          <pattern id={patternId} width={pieces} height={pieces} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width={pieces} height={pieces} fill={mat.light} />
            <path d={`M 0 0 H ${pieces} V ${pieces}`} fill="none" stroke={mat.dark} strokeWidth="1.2" strokeOpacity="0.45" />
          </pattern>
        )}

        {/* 4. Herringbone / Chevron Parquet Pattern */}
        {pattern === 'herringbone' && (
          <pattern id={patternId} width={36} height={36} patternUnits="userSpaceOnUse">
            <rect width="36" height="36" fill={mat.light} />
            <path d="M 0 0 L 18 18 L 0 36 M 18 0 L 36 18 L 18 36" fill="none" stroke={mat.dark} strokeWidth="1.4" strokeOpacity="0.5" />
            <line x1="0" y1="18" x2="36" y2="18" stroke={mat.color} strokeWidth="1" strokeOpacity="0.3" />
          </pattern>
        )}

        {/* Architectural 1ft/0.5m grid definition */}
        <pattern id="rf-architectural-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#d5ddd6" strokeWidth="0.6" strokeDasharray="2,2" opacity="0.6" />
          <circle cx="24" cy="24" r="0.8" fill="#a8bba9" opacity="0.4" />
        </pattern>
      </defs>

      {/* Blueprint background grid */}
      {settings.showGrid !== false && (
        <rect width="720" height="510" fill="url(#rf-architectural-grid)" />
      )}

      {/* Blueprint Header Label */}
      <text
        x="360"
        y="22"
        fill="#718675"
        textAnchor="middle"
        fontSize="10"
        fontWeight="bold"
        letterSpacing="0.1em"
        className="select-none font-mono"
      >
        SCALED 2D TOP-DOWN ROOM ARCHITECTURE
      </text>

      {/* Main Room Body */}
      {isLShape ? (
        <path
          d={lPathD}
          fill={`url(#${patternId})`}
          stroke="#2d3a30"
          strokeWidth="3.5"
          filter="url(#rf-shadow-modern)"
          className="transition-all duration-150"
        />
      ) : (
        <rect
          x={x}
          y={y}
          width={rw}
          height={rh}
          rx="2"
          fill={`url(#${patternId})`}
          stroke="#2d3a30"
          strokeWidth="3.5"
          filter="url(#rf-shadow-modern)"
          className="transition-all duration-150"
        />
      )}

      {/* Dimension Line & Callout: Top Total Width */}
      <g className="font-mono text-xs select-none">
        <line x1={x} y1={y - 24} x2={x + (isLShape ? rw - rcw : rw)} y2={y - 24} stroke="#2d3a30" strokeWidth="1.5" />
        <line x1={x} y1={y - 30} x2={x} y2={y - 18} stroke="#2d3a30" strokeWidth="1.5" />
        <line x1={x + (isLShape ? rw - rcw : rw)} y1={y - 30} x2={x + (isLShape ? rw - rcw : rw)} y2={y - 18} stroke="#2d3a30" strokeWidth="1.5" />
        <rect
          x={x + (isLShape ? (rw - rcw) / 2 : rw / 2) - 34}
          y={y - 37}
          width="68"
          height="18"
          rx="4"
          fill="#ffffff"
          stroke="#2d3a30"
          strokeWidth="1"
        />
        <text
          x={x + (isLShape ? (rw - rcw) / 2 : rw / 2)}
          y={y - 24}
          fill="#2d3a30"
          textAnchor="middle"
          dominantBaseline="central"
          fontWeight="bold"
          fontSize="10"
        >
          {isLShape ? `${formatNumber(settings.width - settings.cutoutWidth, 1)} ${unit}` : `${formatNumber(settings.width, 1)} ${unit}`}
        </text>
      </g>

      {/* Dimension Line & Callout: Left Total Length */}
      <g className="font-mono text-xs select-none">
        <line x1={x - 24} y1={y} x2={x - 24} y2={y + rh} stroke="#2d3a30" strokeWidth="1.5" />
        <line x1={x - 30} y1={y} x2={x - 18} y2={y} stroke="#2d3a30" strokeWidth="1.5" />
        <line x1={x - 30} y1={y + rh} x2={x - 18} y2={y + rh} stroke="#2d3a30" strokeWidth="1.5" />
        <rect
          x={x - 58}
          y={y + rh / 2 - 9}
          width="68"
          height="18"
          rx="4"
          fill="#ffffff"
          stroke="#2d3a30"
          strokeWidth="1"
        />
        <text
          x={x - 24}
          y={y + rh / 2}
          fill="#2d3a30"
          textAnchor="middle"
          dominantBaseline="central"
          fontWeight="bold"
          fontSize="10"
        >
          {formatNumber(settings.length, 1)} {unit}
        </text>
      </g>

      {/* L-Shape Additional Cutout Dimensions */}
      {isLShape && (
        <g className="font-mono text-xs select-none">
          {/* Cutout width callout */}
          <line x1={x + rw - rcw} y1={y + rcl + 18} x2={x + rw} y2={y + rcl + 18} stroke="#855938" strokeWidth="1.2" strokeDasharray="3,3" />
          <text
            x={x + rw - rcw / 2}
            y={y + rcl + 14}
            fill="#855938"
            textAnchor="middle"
            fontWeight="bold"
            fontSize="9"
          >
            Cut: {formatNumber(settings.cutoutWidth, 1)} {unit}
          </text>

          {/* Cutout length callout */}
          <line x1={x + rw - rcw - 18} y1={y} x2={x + rw - rcw - 18} y2={y + rcl} stroke="#855938" strokeWidth="1.2" strokeDasharray="3,3" />
          <text
            x={x + rw - rcw - 22}
            y={y + rcl / 2}
            fill="#855938"
            textAnchor="end"
            dominantBaseline="central"
            fontWeight="bold"
            fontSize="9"
          >
            {formatNumber(settings.cutoutLength, 1)} {unit}
          </text>
        </g>
      )}

      {/* Architectural Door Swing Indicator (Bottom Entrance) */}
      <g className="door-indicator select-none">
        <line
          x1={x + 30}
          y1={y + rh}
          x2={x + 60}
          y2={y + rh}
          stroke="#f8f7f4"
          strokeWidth="6"
        />
        <line
          x1={x + 30}
          y1={y + rh}
          x2={x + 30}
          y2={y + rh - 28}
          stroke="#3a4a3e"
          strokeWidth="2"
        />
        <path
          d={`M ${x + 30} ${y + rh - 28} A 28 28 0 0 1 ${x + 58} ${y + rh}`}
          fill="none"
          stroke="#718675"
          strokeWidth="1.2"
          strokeDasharray="3,2"
        />
      </g>

      {/* Center Material Badge */}
      <g className="select-none">
        <rect
          x={x + (isLShape ? (rw - rcw) / 2 : rw / 2) - 75}
          y={y + (isLShape ? (rh + rcl) / 2 : rh / 2) - 15}
          width="150"
          height="30"
          rx="15"
          fill="#ffffff"
          fillOpacity="0.94"
          stroke="#2d3a30"
          strokeWidth="1.5"
        />
        <circle
          cx={x + (isLShape ? (rw - rcw) / 2 : rw / 2) - 58}
          cy={y + (isLShape ? (rh + rcl) / 2 : rh / 2)}
          r="6"
          fill={mat.color}
          stroke="#2d3a30"
          strokeWidth="1"
        />
        <text
          x={x + (isLShape ? (rw - rcw) / 2 : rw / 2) + 6}
          y={y + (isLShape ? (rh + rcl) / 2 : rh / 2)}
          fill="#1c251f"
          textAnchor="middle"
          dominantBaseline="central"
          fontWeight="bold"
          fontSize="11"
          fontFamily="sans-serif"
        >
          {mat.short}
        </text>
      </g>
    </svg>
  );
}
