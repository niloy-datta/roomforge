'use client';

import React, { useState, useRef } from 'react';
import { Rotate3d, Box, Layers, RotateCcw, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StudioSettings } from '@/features/calculations/types';
import { MATERIALS } from '@/features/calculations/materials';
import { toFeet, formatNumber } from '@/features/calculations/calculations';

interface Room3dPerspectiveRendererProps {
  settings: StudioSettings;
  className?: string;
}

export function Room3dPerspectiveRenderer({
  settings,
  className = '',
}: Room3dPerspectiveRendererProps) {
  // Camera state
  const [pitch, setPitch] = useState(55); // vertical tilt in degrees (15 to 85)
  const [yaw, setYaw] = useState(-35); // horizontal rotation in degrees (-180 to 180)
  const [zoom, setZoom] = useState(1);
  const [viewPreset, setViewPreset] = useState<'perspective' | 'isometric' | 'top'>('perspective');
  const [cutawayWalls, setCutawayWalls] = useState(true);

  // Interaction dragging state
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Handle pointer drag for rotating 3D orbit
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    if (containerRef.current) {
      containerRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - lastMousePosRef.current.x;
    const deltaY = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    setYaw((prev) => (prev + deltaX * 0.6) % 360);
    setPitch((prev) => Math.min(85, Math.max(15, prev - deltaY * 0.4)));
    setViewPreset('perspective');
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    if (containerRef.current && containerRef.current.hasPointerCapture(e.pointerId)) {
      containerRef.current.releasePointerCapture(e.pointerId);
    }
  };

  const setPreset = (preset: 'perspective' | 'isometric' | 'top') => {
    setViewPreset(preset);
    if (preset === 'perspective') {
      setPitch(55);
      setYaw(-35);
      setZoom(1);
    } else if (preset === 'isometric') {
      setPitch(35.264);
      setYaw(45);
      setZoom(1);
    } else if (preset === 'top') {
      setPitch(88);
      setYaw(0);
      setZoom(1);
    }
  };

  const handleReset = () => {
    setPreset('perspective');
  };

  if (isInvalid) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[420px] rounded-2xl bg-sand-100/80 border border-sand-300 p-8 text-center ${className}`}>
        <Box className="h-10 w-10 text-muted/60 mb-3 animate-pulse" />
        <h3 className="text-sm font-bold text-forest">3D Spatial Preview Unavailable</h3>
        <p className="text-xs text-muted max-w-sm mt-1">
          {isLShape
            ? 'Ensure corner cutout dimensions are strictly smaller than room width and length.'
            : 'Enter valid room width and length in the left control panel.'}
        </p>
      </div>
    );
  }

  const mat = MATERIALS[settings.material] || MATERIALS.vinyl;
  const isTile = mat.type === 'tile';

  // Normalized aspect ratio for 3D room floor
  const maxDim = Math.max(w, h, 1);
  const floorWidthPx = Math.round((w / maxDim) * 360 * zoom);
  const floorLengthPx = Math.round((h / maxDim) * 360 * zoom);
  const wallHeightPx = Math.round(75 * zoom);
  const cutoutWidthPx = isLShape ? Math.round((cw / maxDim) * 360 * zoom) : 0;
  const cutoutLengthPx = isLShape ? Math.round((cl / maxDim) * 360 * zoom) : 0;

  // Material style colors
  const floorBg = mat.color || '#C69B6B';
  const patternLines = isTile
    ? 'repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1.5px, transparent 1.5px, transparent 24px), repeating-linear-gradient(90deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1.5px, transparent 1.5px, transparent 24px)'
    : settings.pattern === 'herringbone'
    ? 'repeating-linear-gradient(45deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 2px, transparent 2px, transparent 28px), repeating-linear-gradient(-45deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 2px, transparent 2px, transparent 28px)'
    : settings.pattern === 'diagonal'
    ? 'repeating-linear-gradient(45deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 1.5px, transparent 1.5px, transparent 26px)'
    : 'repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 1.5px, transparent 1.5px, transparent 18px), repeating-linear-gradient(90deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 72px)';

  return (
    <div className={`relative flex flex-col rounded-2xl bg-gradient-to-b from-sand-100/90 to-sand-200/90 border border-sand-300 overflow-hidden shadow-xs select-none ${className}`}>
      {/* 3D Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sand-300 bg-white/75 backdrop-blur-xs px-4 py-2.5 z-10">
        <div className="flex items-center space-x-2">
          <Badge variant="sage" className="gap-1 font-mono text-[11px] uppercase tracking-wider">
            <Rotate3d className="h-3.5 w-3.5 text-sage-600 animate-spin-slow" />
            3D Spatial Preview
          </Badge>
          <span className="text-[11px] text-muted hidden sm:inline">
            Drag to orbit · Mousewheel/buttons to zoom
          </span>
        </div>

        {/* View Presets & Controls */}
        <div className="flex items-center space-x-1.5">
          <Button
            size="sm"
            variant={viewPreset === 'perspective' ? 'default' : 'outline'}
            onClick={() => setPreset('perspective')}
            className="h-7 px-2.5 text-xs font-semibold"
            title="Perspective 3D View"
          >
            Perspective
          </Button>
          <Button
            size="sm"
            variant={viewPreset === 'isometric' ? 'default' : 'outline'}
            onClick={() => setPreset('isometric')}
            className="h-7 px-2.5 text-xs font-semibold"
            title="Isometric Architectural View"
          >
            Isometric
          </Button>
          <Button
            size="sm"
            variant={viewPreset === 'top' ? 'default' : 'outline'}
            onClick={() => setPreset('top')}
            className="h-7 px-2.5 text-xs font-semibold"
            title="Top-Down View"
          >
            Top-Down
          </Button>

          <div className="h-4 w-px bg-sand-300 mx-1 hidden sm:block" />

          <Button
            size="sm"
            variant="outline"
            onClick={() => setCutawayWalls(!cutawayWalls)}
            className="h-7 px-2 text-xs text-forest hidden sm:flex items-center gap-1"
            title="Toggle Cutaway vs Full Wall View"
          >
            <Layers className="h-3 w-3 text-clay-600" />
            <span>{cutawayWalls ? 'Cutaway Walls' : 'Full Walls'}</span>
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleReset}
            className="h-7 w-7 p-0 text-muted hover:text-forest"
            title="Reset Camera Angle"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* 3D Canvas Stage */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative w-full h-[460px] flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden touch-none"
        style={{ perspective: '1200px' }}
      >
        {/* 3D World */}
        <div
          style={{
            width: `${floorWidthPx}px`,
            height: `${floorLengthPx}px`,
            transformStyle: 'preserve-3d',
            transform: `rotateX(${pitch}deg) rotateZ(${yaw}deg) scale3d(${zoom}, ${zoom}, ${zoom})`,
            transition: isDraggingRef.current ? 'none' : 'transform 0.25s ease-out',
          }}
          className="relative flex items-center justify-center"
        >
          {/* Ground Grid Base / Subfloor Shadow */}
          <div
            style={{
              position: 'absolute',
              width: `${floorWidthPx + 60}px`,
              height: `${floorLengthPx + 60}px`,
              transform: 'translateZ(-4px)',
              background: 'radial-gradient(ellipse at center, rgba(20,37,31,0.2) 0%, rgba(20,37,31,0) 70%)',
            }}
          />

          {/* Flooring Surface */}
          <div
            style={{
              position: 'absolute',
              width: `${floorWidthPx}px`,
              height: `${floorLengthPx}px`,
              backgroundColor: floorBg,
              backgroundImage: patternLines,
              backgroundSize: '24px 24px, 72px 72px',
              border: '2px solid rgba(20,37,31,0.35)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              clipPath: isLShape
                ? `polygon(0% 0%, ${((w - cw) / w) * 100}% 0%, ${((w - cw) / w) * 100}% ${(cl / h) * 100}%, 100% ${(cl / h) * 100}%, 100% 100%, 0% 100%)`
                : undefined,
            }}
            className="transition-colors duration-300"
          >
            {/* Interior Ambient Highlights */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/20 pointer-events-none" />

            {/* Room Dimensions Tag inside floor */}
            <div className="absolute bottom-3 left-3 bg-forest/85 text-sand-50 backdrop-blur-xs text-[11px] font-mono px-2 py-0.5 rounded shadow-sm border border-forest/40">
              {formatNumber(settings.width, 1)} × {formatNumber(settings.length, 1)} {settings.unit}
            </div>
          </div>

          {/* Back Wall (North) */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: isLShape ? `${floorWidthPx - cutoutWidthPx}px` : `${floorWidthPx}px`,
              height: `${wallHeightPx}px`,
              transformOrigin: 'top center',
              transform: 'rotateX(-90deg)',
              background: 'linear-gradient(to bottom, #eae7dc, #f4f2eb)',
              border: '1px solid #dcd7c9',
              borderBottom: '4px solid #8c7355', // Wood baseboard trim
              boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.06)',
            }}
          />

          {/* West Wall (Left) */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: `${floorLengthPx}px`,
              height: `${wallHeightPx}px`,
              transformOrigin: 'top left',
              transform: 'rotateY(90deg) rotateZ(-90deg)',
              background: 'linear-gradient(to bottom, #dfdbce, #ece9df)',
              border: '1px solid #d3cebf',
              borderBottom: '4px solid #8c7355', // Baseboard trim
              boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.08)',
            }}
          />

          {/* Front / South Wall (Cutaway or Solid) */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: `${floorWidthPx}px`,
              height: cutawayWalls ? `${Math.round(wallHeightPx * 0.25)}px` : `${wallHeightPx}px`,
              transformOrigin: 'bottom center',
              transform: 'rotateX(90deg)',
              background: cutawayWalls
                ? 'linear-gradient(to top, rgba(220,215,201,0.5), rgba(244,242,235,0.2))'
                : 'linear-gradient(to top, #eae7dc, #f4f2eb)',
              border: '1px dashed rgba(200,195,180,0.6)',
              borderTop: '3px solid #8c7355',
              backdropFilter: cutawayWalls ? 'blur(2px)' : undefined,
            }}
          />

          {/* East / Right Wall */}
          <div
            style={{
              position: 'absolute',
              top: isLShape ? `${cutoutLengthPx}px` : 0,
              right: 0,
              width: isLShape ? `${floorLengthPx - cutoutLengthPx}px` : `${floorLengthPx}px`,
              height: cutawayWalls ? `${Math.round(wallHeightPx * 0.35)}px` : `${wallHeightPx}px`,
              transformOrigin: 'top right',
              transform: 'rotateY(-90deg) rotateZ(90deg)',
              background: cutawayWalls
                ? 'linear-gradient(to bottom, rgba(220,215,201,0.5), rgba(244,242,235,0.2))'
                : 'linear-gradient(to bottom, #eae7dc, #f4f2eb)',
              border: '1px dashed rgba(200,195,180,0.6)',
              borderBottom: '3px solid #8c7355',
            }}
          />
        </div>

        {/* Floating Camera Control HUD in Bottom Corner */}
        <div className="absolute bottom-4 right-4 flex flex-col items-center gap-1 bg-white/80 backdrop-blur-md p-1.5 rounded-xl border border-sand-300 shadow-md z-10">
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPitch((p) => Math.min(85, p + 10))}
              className="h-6 w-6 p-0"
              title="Tilt Up"
            >
              <ChevronUp className="h-3 w-3" />
            </Button>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setYaw((y) => (y - 15) % 360)}
              className="h-6 w-6 p-0"
              title="Rotate Left"
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setYaw((y) => (y + 15) % 360)}
              className="h-6 w-6 p-0"
              title="Rotate Right"
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPitch((p) => Math.max(15, p - 10))}
              className="h-6 w-6 p-0"
              title="Tilt Down"
            >
              <ChevronDown className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Material Badge Info Overlay */}
        <div className="absolute top-4 left-4 bg-white/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-sand-300 text-xs shadow-xs pointer-events-none">
          <div className="font-bold text-forest">{mat.name}</div>
          <div className="text-[11px] text-muted capitalize">
            {settings.pattern} layout · {settings.shape === 'l-shape' ? 'L-shaped room' : 'Rectangular space'}
          </div>
        </div>
      </div>
    </div>
  );
}
