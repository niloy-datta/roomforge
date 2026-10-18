
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { RoomSvgRenderer } from '@/components/shared/RoomSvgRenderer';
import { DEFAULT_SETTINGS } from '@/features/calculations/materials';
import { calculateFlooring } from '@/features/calculations/calculations';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('w=12&l=18&u=ft'),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => '/',
}));

describe('RoomForge Component Tests', () => {
  it('renders RoomSvgRenderer with valid dimensions and material text', () => {
    const { container } = render(
      <RoomSvgRenderer settings={DEFAULT_SETTINGS} zoom={1} />
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('svg')).toHaveAttribute('role', 'img');
    expect(screen.getByText(/SCALED 2D TOP-DOWN ROOM ARCHITECTURE/i)).toBeInTheDocument();
  });

  it('renders placeholder text when given invalid dimensions in RoomSvgRenderer', () => {
    render(
      <RoomSvgRenderer
        settings={{ ...DEFAULT_SETTINGS, width: 0 }}
      />
    );
    expect(screen.getByText(/Enter valid room dimensions/i)).toBeInTheDocument();
  });

  it('validates 10 boxes calculation matches expected 12x18 ft defaults', () => {
    const res = calculateFlooring(DEFAULT_SETTINGS);
    expect(res.valid).toBe(true);
    expect(res.boxes).toBe(10);
    expect(res.areaSqFt).toBe(216);
    expect(res.totalCost).toBe(450);
  });
});
