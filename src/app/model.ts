export const PATTERN_ENGINES = ['DOT FIELD', 'NODE MESH', 'SCANLINE FIELD', 'ECHO TRAILS', 'TYPE DISTORTION'] as const;
export const SIGNAL_SOURCES = ['GRID', 'NOISE FIELD', 'TEXT SAMPLE', 'IMAGE INPUT'] as const;
export const HARDWARE_MODES = ['APOLLO AVIONICS', 'SOVIET RADAR', 'DIGITAL SYNTH TERMINAL'] as const;
export const PARAMETER_NAMES = ['density', 'phase', 'decay', 'frequency'] as const;

export type PatternEngine = (typeof PATTERN_ENGINES)[number];
export type SignalSource = (typeof SIGNAL_SOURCES)[number];
export type HardwareMode = (typeof HARDWARE_MODES)[number];
export type ParameterName = (typeof PARAMETER_NAMES)[number];
export type Parameters = Record<ParameterName, number>;

export const DEFAULT_PARAMETERS: Parameters = {
  density: 50,
  phase: 25,
  decay: 40,
  frequency: 50,
};

export function clampParameter(value: number, min = 0, max = 100): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function updateParameter(parameters: Parameters, name: ParameterName, value: number): Parameters {
  return { ...parameters, [name]: clampParameter(value) };
}

export function isPointerReactiveEngine(engine: PatternEngine): boolean {
  return engine === 'ECHO TRAILS' || engine === 'TYPE DISTORTION';
}
