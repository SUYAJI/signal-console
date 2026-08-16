import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import type { PanelTheme } from './ThemeSelector';
import { clampParameter } from '../model';

interface RotaryKnobProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  theme: PanelTheme;
  hardwareMode?: string;
}

export function RotaryKnob({ label, value, onChange, min = 0, max = 100, theme, hardwareMode = 'APOLLO AVIONICS' }: RotaryKnobProps) {
  const [pulse, setPulse] = useState(false);
  const startYRef = useRef(0);
  const startValueRef = useRef(0);
  const activePointerRef = useRef<number | null>(null);
  const isLight = theme.mode === 'light';
  const angle = ((value - min) / (max - min)) * 270 - 135;
  const step = Math.max(1, Math.round((max - min) / 100));

  useEffect(() => {
    setPulse(true);
    const timer = window.setTimeout(() => setPulse(false), 200);
    return () => window.clearTimeout(timer);
  }, [value]);

  const setClampedValue = (nextValue: number) => onChange(clampParameter(nextValue, min, max));

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    activePointerRef.current = event.pointerId;
    startYRef.current = event.clientY;
    startValueRef.current = value;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (activePointerRef.current !== event.pointerId) return;
    event.preventDefault();
    const delta = startYRef.current - event.clientY;
    setClampedValue(startValueRef.current + (delta / 100) * (max - min));
  };

  const finishPointerInteraction = (event: PointerEvent<HTMLDivElement>) => {
    if (activePointerRef.current !== event.pointerId) return;
    activePointerRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowRight':
        event.preventDefault();
        setClampedValue(value + step);
        break;
      case 'ArrowDown':
      case 'ArrowLeft':
        event.preventDefault();
        setClampedValue(value - step);
        break;
      case 'Home':
        event.preventDefault();
        setClampedValue(min);
        break;
      case 'End':
        event.preventDefault();
        setClampedValue(max);
        break;
    }
  };

  const knobFace = hardwareMode === 'SOVIET RADAR'
    ? { background: theme.panelBgAlt, border: `4px solid ${theme.panelBorder}`, boxShadow: pulse ? `0 0 20px ${theme.accentGlow}, inset 0 2px 4px rgba(0,0,0,0.6)` : `0 8px 16px rgba(0,0,0,0.8), inset 0 2px 4px rgba(0,0,0,0.6)` }
    : hardwareMode === 'DIGITAL SYNTH TERMINAL'
      ? { background: pulse ? theme.accentGlow : theme.chassisBg, border: `1px solid ${pulse ? theme.accent : theme.panelBorder}`, boxShadow: pulse ? `0 0 10px ${theme.accentGlow}` : 'none' }
      : { background: `radial-gradient(circle at 35% 35%, ${theme.knobHighlight}, ${theme.knobFace})`, border: `2px solid ${pulse ? theme.accent : theme.knobBorder}`, boxShadow: pulse ? `0 0 20px ${theme.accentGlow}, ${isLight ? 'inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 2px rgba(0,0,0,0.1)' : 'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 2px rgba(0,0,0,0.5)'}` : isLight ? '0 4px 10px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 2px rgba(0,0,0,0.1)' : '0 4px 10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 2px rgba(0,0,0,0.5)' };

  return (
    <div className="rotary-control flex flex-col items-center gap-2.5 py-4 relative">
      {hardwareMode === 'DIGITAL SYNTH TERMINAL' && <div className="absolute top-2 -left-2 w-4 h-16 border flex flex-col justify-end" style={{ borderColor: theme.panelBorder, background: theme.switchTrack }} aria-hidden="true"><div style={{ height: `${((value - min) / (max - min)) * 100}%`, background: theme.accent, opacity: 0.8 }} /></div>}
      <div role="slider" tabIndex={0} aria-label={`${label} parameter`} aria-valuemin={min} aria-valuemax={max} aria-valuenow={Math.round(value)} aria-valuetext={`${Math.round(value)} percent`} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={finishPointerInteraction} onPointerCancel={finishPointerInteraction} onKeyDown={handleKeyDown} className={`rotary-knob relative cursor-grab select-none touch-none ${hardwareMode === 'DIGITAL SYNTH TERMINAL' ? 'w-16 h-16' : 'w-20 h-20'} rounded-full`} style={{ ...knobFace, transition: 'box-shadow 0.2s, border-color 0.2s, background 0.2s' }}>
        <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `rotate(${angle}deg)` }} aria-hidden="true"><div className={hardwareMode === 'SOVIET RADAR' ? 'rounded-sm' : 'rounded-full'} style={{ width: hardwareMode === 'SOVIET RADAR' ? '6px' : hardwareMode === 'DIGITAL SYNTH TERMINAL' ? '2px' : '3px', height: hardwareMode === 'SOVIET RADAR' ? '20px' : hardwareMode === 'DIGITAL SYNTH TERMINAL' ? '16px' : '28px', background: hardwareMode === 'SOVIET RADAR' ? theme.accent : hardwareMode === 'DIGITAL SYNTH TERMINAL' ? theme.textPrimary : `linear-gradient(to bottom, ${theme.knobIndicator}, ${theme.accent})`, boxShadow: hardwareMode === 'APOLLO AVIONICS' ? `0 0 6px ${theme.accentGlow}, 0 1px 2px rgba(0,0,0,0.5)` : 'none', position: 'absolute', top: hardwareMode === 'SOVIET RADAR' ? '6px' : hardwareMode === 'DIGITAL SYNTH TERMINAL' ? '4px' : '10px' }} /></div>
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 80 80" style={{ transform: 'rotate(-135deg)' }} aria-hidden="true">
          {Array.from({ length: hardwareMode === 'SOVIET RADAR' ? 6 : 11 }, (_, index) => {
            const total = hardwareMode === 'SOVIET RADAR' ? 5 : 10;
            const tickAngle = (index / total) * 270;
            const radius = hardwareMode === 'SOVIET RADAR' ? 46 : 40;
            const isMain = index % 5 === 0;
            const isActive = hardwareMode === 'DIGITAL SYNTH TERMINAL' && (index / total) * (max - min) <= value - min;
            const startRadius = hardwareMode === 'SOVIET RADAR' ? radius - 8 : hardwareMode === 'DIGITAL SYNTH TERMINAL' ? radius - 4 : radius - (isMain ? 7 : 5);
            const endRadius = hardwareMode === 'SOVIET RADAR' || hardwareMode === 'DIGITAL SYNTH TERMINAL' ? radius : radius - 2;
            return <line key={index} x1={40 + startRadius * Math.cos((tickAngle * Math.PI) / 180)} y1={40 + startRadius * Math.sin((tickAngle * Math.PI) / 180)} x2={40 + endRadius * Math.cos((tickAngle * Math.PI) / 180)} y2={40 + endRadius * Math.sin((tickAngle * Math.PI) / 180)} stroke={hardwareMode === 'DIGITAL SYNTH TERMINAL' ? (isActive ? theme.accent : theme.textDim) : hardwareMode === 'SOVIET RADAR' ? theme.textPrimary : theme.textSecondary} strokeWidth={hardwareMode === 'DIGITAL SYNTH TERMINAL' ? '2' : hardwareMode === 'SOVIET RADAR' ? '3' : isMain ? '1.5' : '1'} opacity={hardwareMode === 'SOVIET RADAR' ? 0.9 : hardwareMode === 'DIGITAL SYNTH TERMINAL' ? 0.8 : 0.6} />;
          })}
        </svg>
      </div>
      <span className="uppercase select-none text-center mt-1" style={{ fontSize: hardwareMode === 'SOVIET RADAR' ? '13px' : '11px', color: theme.textSecondary, textShadow: isLight && hardwareMode === 'APOLLO AVIONICS' ? '0 1px 0 rgba(255,255,255,0.8)' : hardwareMode === 'APOLLO AVIONICS' ? '0 1px 0 rgba(0,0,0,0.8)' : 'none', fontFamily: hardwareMode === 'SOVIET RADAR' ? 'system-ui, sans-serif' : hardwareMode === 'APOLLO AVIONICS' ? 'sans-serif' : 'monospace', fontWeight: hardwareMode === 'SOVIET RADAR' ? '900' : hardwareMode === 'APOLLO AVIONICS' ? 'bold' : 'normal', letterSpacing: hardwareMode === 'APOLLO AVIONICS' ? '0.15em' : '0.05em' }}>{label}</span>
      <span className="tabular-nums" style={{ fontSize: '13px', color: theme.textPrimary, fontFamily: hardwareMode === 'DIGITAL SYNTH TERMINAL' ? 'monospace' : hardwareMode === 'SOVIET RADAR' ? 'system-ui, sans-serif' : 'monospace', fontWeight: hardwareMode === 'SOVIET RADAR' ? '900' : 'normal' }}>{hardwareMode === 'DIGITAL SYNTH TERMINAL' ? value.toFixed(0).padStart(3, '0') : value.toFixed(0)}</span>
    </div>
  );
}
