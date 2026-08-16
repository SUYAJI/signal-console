import { describe, expect, it } from 'vitest';
import { DEFAULT_PARAMETERS, HARDWARE_MODES, PATTERN_ENGINES, SIGNAL_SOURCES, clampParameter, isPointerReactiveEngine, updateParameter } from './model';

describe('Signal Console model', () => {
  it('exposes the complete engine, source, and hardware catalog', () => {
    expect(PATTERN_ENGINES).toHaveLength(5);
    expect(SIGNAL_SOURCES).toHaveLength(4);
    expect(HARDWARE_MODES).toHaveLength(3);
  });

  it('preserves the canonical control defaults', () => {
    expect(DEFAULT_PARAMETERS).toEqual({ density: 50, phase: 25, decay: 40, frequency: 50 });
  });

  it('clamps parameters to the supported range', () => {
    expect(clampParameter(-1)).toBe(0);
    expect(clampParameter(101)).toBe(100);
    expect(clampParameter(42.5)).toBe(42.5);
    expect(clampParameter(Number.NaN)).toBe(0);
  });

  it('updates one parameter without mutating the existing state', () => {
    const next = updateParameter(DEFAULT_PARAMETERS, 'phase', 150);
    expect(next).toEqual({ ...DEFAULT_PARAMETERS, phase: 100 });
    expect(DEFAULT_PARAMETERS.phase).toBe(25);
  });

  it('marks only pointer-reactive engines for contextual hints', () => {
    expect(isPointerReactiveEngine('ECHO TRAILS')).toBe(true);
    expect(isPointerReactiveEngine('TYPE DISTORTION')).toBe(true);
    expect(isPointerReactiveEngine('DOT FIELD')).toBe(false);
  });
});
