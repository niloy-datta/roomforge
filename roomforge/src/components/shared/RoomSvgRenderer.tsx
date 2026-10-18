'use client';

import React from 'react';
import { toFeet, formatNumber } from '@/features/calculations/calculations';
import { MATERIALS } from '@/features/calculations/materials';
import { StudioSettings } from '@/features/calculations/types';

interface RoomSvgRendererProps {
  settings: StudioSettings;
  zoom?: number;
  className?: string;
}

export function RoomSvgRenderer({ settings, zoom = 1, className = '' }: RoomSvgRendererProps) {
  const w = toFeet(settings.width, settings.unit);
  const h = toFeet(settings.length, settings.unit);

  if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0 || w > 500 || h > 500) {
    return (
      <svg
        id="room-svg"
        viewBox="0 0 720 510"
        className={className || "w-full h-auto"}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Room preview placeholder"
      >
        <rect width="720" height="510" fill="#f8f7f4" rx="8" />
        <text x="360" y="260" fill="#76877a" fontFamily="sans-serif" textAnchor="middle" fontSize="16">
          Enter valid room dimensions to preview floor plan.
        </text>
      </svg>
    );
  }

  const mat = MATERIALS[settings.material] || MATERIALS.vinyl;
  const safeZoom = Math.min(1.8, Math.max(0.5, zoom));
  const scale = Math.min(540 / w, 310 / h) * safeZoom;
  const rw = w * scale;
  const rh = h * scale;
  const x = (720 - rw) / 2;
  const y = (510 - rh) / 2;

  const c = mat.color;
  const light = mat.light;
  const dark = mat.dark;
  const isTile = mat.type === 'tile';
  const straight = settings.pattern === 'straight';
  const unit = settings.unit;

  const leftLabel = `${formatNumber(settings.length, 2)} ${unit}`;
  const topLabel = `${formatNumber(settings.width, 2)} ${unit}`;

  const pieces = isTile ? 44 : 24;

  const patternId = !isTile && !straight ? 'rf-stagger-modern' : 'rf-pattern-modern';
  const measTop = y - 38;
  const measLeft = x - 40;

  return (
    <svg
      id="room-svg"
      viewBox="0 0 720 510"
      className={className || "w-full h-auto select-none"}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`${settings.width} by ${settings.length} ${settings.unit} room floor plan visualizer`}
    >
      <defs>
        {/* Soft realistic drop shadow */}
        <filter id="rf-shadow-modern" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="10" dy="14" stdDeviation="10" floodColor="#3a4a3e" floodOpacity="0.22" />
        </filter>

        {/* Tile Pattern */}
        {isTile && (
          <pattern id="rf-pattern-modern" width={pieces} height={pieces} patternUnits="userSpaceOnUse">
            <rect width={pieces} height={pieces} fill={light} />
            <path
              d={`M0 0H${pieces} M0 0V${pieces}`}
              fill="none"
              stroke={dark}
              strokeOpacity="0.46"
              strokeWidth="1.8"
            />
            <path d={`M2 2L${pieces - 2} ${pieces - 2}`} stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1" />
          </pattern>
        )}

        {/* Straight Plank Pattern */}
        {!isTile && straight && (
          <pattern id="rf-pattern-modern" width="92" height={pieces} patternUnits="userSpaceOnUse">
            <rect width="92" height={pieces} fill={c} />
            <rect width="92" height="8" fill={light} opacity="0.24" />
            <path d="M0 0 H92 M0 0 V24" fill="none" stroke={dark} strokeWidth="1.2" strokeOpacity="0.7" />
            <path d="M3 12 H89" stroke={light} strokeOpacity="0.2" />
          </pattern>
        )}

        {/* Staggered Plank Pattern */}
        {!isTile && !straight && (
          <pattern id="rf-stagger-modern" width="132" height="48" patternUnits="userSpaceOnUse">
            <rect width="132" height="48" fill={c} />
            <rect y="0" width="132" height="9" fill={light} opacity="0.20" />
            <rect y="24" width="132" height="9" fill={light} opacity="0.17" />
            <path
              d="M0 0H132 M0 24H132 M66 0V24 M0 24V48 M132 24V48"
              stroke={dark}
              strokeWidth="1.3"
              strokeOpacity="0.55"
              fill="none"
            />
          </pattern>
        )}
      </defs>

      {/* Background blueprint grid subtle lines */}
      <g opacity="0.25">
        <line x1="36" y1="0" x2="36" y2="510" stroke="#cad5ca" strokeWidth="0.8" strokeDasharray="3 3" />
        <line x1="684" y1="0" x2="684" y2="510" stroke="#cad5ca" strokeWidth="0.8" strokeDasharray="3 3" />
        <line x1="0" y1="26" x2="720" y2="26" stroke="#cad5ca" strokeWidth="0.8" strokeDasharray="3 3" />
        <line x1="0" y1="484" x2="720" y2="484" stroke="#cad5ca" strokeWidth="0.8" strokeDasharray="3 3" />
      </g>

      {/* Main Room with architectural walls */}
      <g filter="url(#rf-shadow-modern)">
        {/* Exterior Wall Thickness */}
        <rect
          x={x - 8}
          y={y - 8}
          width={rw + 16}
          height={rh + 16}
          rx="2"
          fill="#8d968a"
          stroke="#cad1c5"
          strokeWidth="2"
        />
        {/* Interior Flooring Fill */}
        <rect x={x} y={y} width={rw} height={rh} fill={`url(#${patternId})`} />
        {/* Interior Perimeter border */}
        <rect x={x} y={y} width={rw} height={rh} fill="none" stroke="#718675" strokeOpacity="0.5" strokeWidth="1" />
        {/* Door cutaway illustration on top wall */}
        <path d={`M${x + rw * 0.28} ${y - 9}h${Math.min(75, rw * 0.35)}`} stroke="#f8f7f4" strokeWidth="12" />
        <path d={`M${x + rw * 0.28} ${y - 9}h${Math.min(75, rw * 0.35)}`} stroke="#9eafa9" strokeWidth="1.5" />
      </g>

      {/* Dimension Guides */}
      <g fill="none" stroke="#8fa093" strokeWidth="1.2">
        {/* Top dimension tick marks & horizontal span */}
        <path d={`M${x} ${measTop - 8}v16 M${x + rw} ${measTop - 8}v16 M${x} ${measTop}H${x + rw}`} />
        {/* Left dimension tick marks & vertical span */}
        <path d={`M${measLeft - 8} ${y}h16 M${measLeft - 8} ${y + rh}h16 M${measLeft} ${y}V${y + rh}`} />
      </g>

      {/* Dimension Numeric Callouts */}
      <g fill="#3a4a3e" fontSize="13" fontFamily="sans-serif" fontWeight="700">
        <text x={x + rw / 2} y={measTop - 10} textAnchor="middle">
          {topLabel}
        </text>
        <text
          x={measLeft - 10}
          y={y + rh / 2}
          textAnchor="middle"
          transform={`rotate(-90 ${measLeft - 10} ${y + rh / 2})`}
        >
          {leftLabel}
        </text>
      </g>

      {/* Top-down badge & metadata */}
      <text
        x="360"
        y="498"
        textAnchor="middle"
        fontSize="11"
        fontFamily="sans-serif"
        fill="#718675"
        letterSpacing="1.8"
        fontWeight="600"
      >
        SCALED 2D TOP-DOWN ROOM ARCHITECTURE · {mat.name.toUpperCase()}
      </text>
    </svg>
  );
}
