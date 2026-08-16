import { useState, useRef, useEffect, type MouseEvent as ReactMouseEvent } from 'react';
import type { PanelTheme } from './ThemeSelector';

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
  const [isDragging, setIsDragging] = useState(false);
  const [pulse, setPulse] = useState(false);
  const knobRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const startValueRef = useRef(0);
  const isLight = theme.mode === 'light';

  const angle = ((value - min) / (max - min)) * 270 - 135;

  useEffect(() => {
    setPulse(true);
    const timer = setTimeout(() => setPulse(false), 200);
    return () => clearTimeout(timer);
  }, [value]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = startYRef.current - e.clientY;
      const change = (delta / 100) * (max - min);
      const newValue = Math.max(min, Math.min(max, startValueRef.current + change));
      onChange(newValue);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, min, max, onChange]);

  const handleMouseDown = (e: ReactMouseEvent) => {
    setIsDragging(true);
    startYRef.current = e.clientY;
    startValueRef.current = value;
  };

  return (
    <div className="flex flex-col items-center gap-2.5 py-4 relative">
      {hardwareMode === 'DIGITAL SYNTH TERMINAL' && (
        <div className="absolute top-2 -left-2 w-4 h-16 border flex flex-col justify-end" style={{ borderColor: theme.panelBorder, background: theme.switchTrack }}>
          <div style={{ height: `${(value - min) / (max - min) * 100}%`, background: theme.accent, opacity: 0.8 }} />
        </div>
      )}
      
      <div className="relative">
        {hardwareMode === 'SOVIET RADAR' ? (
          <div
            ref={knobRef}
            onMouseDown={handleMouseDown}
            className="w-20 h-20 rounded-full cursor-pointer select-none relative"
            style={{
              background: theme.panelBgAlt,
              border: `4px solid ${theme.panelBorder}`,
              boxShadow: pulse ? `0 0 20px ${theme.accentGlow}, inset 0 2px 4px rgba(0,0,0,0.6)` : `0 8px 16px rgba(0,0,0,0.8), inset 0 2px 4px rgba(0,0,0,0.6)`,
              transition: 'box-shadow 0.2s',
            }}
          >
             <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ transform: `rotate(${angle}deg)` }}
            >
              <div
                className="rounded-sm"
                style={{
                  width: '6px',
                  height: '20px',
                  background: theme.accent,
                  position: 'absolute',
                  top: '6px',
                }}
              />
            </div>
          </div>
        ) : hardwareMode === 'DIGITAL SYNTH TERMINAL' ? (
           <div
            ref={knobRef}
            onMouseDown={handleMouseDown}
            className="w-16 h-16 rounded-full cursor-pointer select-none relative"
            style={{
              background: pulse ? theme.accentGlow : theme.chassisBg,
              border: `1px solid ${pulse ? theme.accent : theme.panelBorder}`,
              boxShadow: pulse ? `0 0 10px ${theme.accentGlow}` : 'none',
              transition: 'all 0.2s',
            }}
          >
             <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ transform: `rotate(${angle}deg)` }}
            >
              <div
                className="rounded-full"
                style={{
                  width: '2px',
                  height: '16px',
                  background: theme.textPrimary,
                  position: 'absolute',
                  top: '4px',
                }}
              />
            </div>
          </div>
        ) : (
          <div
            ref={knobRef}
            onMouseDown={handleMouseDown}
            className="w-20 h-20 rounded-full cursor-pointer select-none"
            style={{
              background: `radial-gradient(circle at 35% 35%, ${theme.knobHighlight}, ${theme.knobFace})`,
              boxShadow: pulse 
                ? `0 0 20px ${theme.accentGlow}, ` + (isLight ? `inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 2px rgba(0,0,0,0.1)` : `inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 2px rgba(0,0,0,0.5)`)
                : (isLight
                  ? `0 4px 10px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 2px rgba(0,0,0,0.1)`
                  : `0 4px 10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 2px rgba(0,0,0,0.5)`),
              border: `2px solid ${pulse ? theme.accent : theme.knobBorder}`,
              transition: 'all 0.2s',
            }}
          >
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ transform: `rotate(${angle}deg)` }}
            >
              <div
                className="rounded-full"
                style={{
                  width: '3px',
                  height: '28px',
                  background: `linear-gradient(to bottom, ${theme.knobIndicator}, ${theme.accent})`,
                  boxShadow: `0 0 6px ${theme.accentGlow}, 0 1px 2px rgba(0,0,0,0.5)`,
                  position: 'absolute',
                  top: '10px',
                }}
              />
            </div>
          </div>
        )}

        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 80 80" style={{ transform: 'rotate(-135deg)' }}>
          {hardwareMode === 'DIGITAL SYNTH TERMINAL' ? (
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
              const tickAngle = (i / 10) * 270;
              const radius = 40;
              const isActive = (i / 10) * (max - min) <= value - min;
              const x1 = 40 + (radius - 4) * Math.cos((tickAngle * Math.PI) / 180);
              const y1 = 40 + (radius - 4) * Math.sin((tickAngle * Math.PI) / 180);
              const x2 = 40 + radius * Math.cos((tickAngle * Math.PI) / 180);
              const y2 = 40 + radius * Math.sin((tickAngle * Math.PI) / 180);

              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isActive ? theme.accent : theme.textDim}
                  strokeWidth="2"
                  opacity={0.8}
                />
              );
            })
          ) : hardwareMode === 'SOVIET RADAR' ? (
            [0, 1, 2, 3, 4, 5].map((i) => {
              const tickAngle = (i / 5) * 270;
              const radius = 46;
              const x1 = 40 + (radius - 8) * Math.cos((tickAngle * Math.PI) / 180);
              const y1 = 40 + (radius - 8) * Math.sin((tickAngle * Math.PI) / 180);
              const x2 = 40 + radius * Math.cos((tickAngle * Math.PI) / 180);
              const y2 = 40 + radius * Math.sin((tickAngle * Math.PI) / 180);

              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={theme.textPrimary}
                  strokeWidth="3"
                  opacity={0.9}
                />
              );
            })
          ) : (
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
              const tickAngle = (i / 10) * 270;
              const isMain = i % 5 === 0;
              const radius = 40;
              const startRadius = radius - (isMain ? 7 : 5);
              const endRadius = radius - 2;
              const x1 = 40 + startRadius * Math.cos((tickAngle * Math.PI) / 180);
              const y1 = 40 + startRadius * Math.sin((tickAngle * Math.PI) / 180);
              const x2 = 40 + endRadius * Math.cos((tickAngle * Math.PI) / 180);
              const y2 = 40 + endRadius * Math.sin((tickAngle * Math.PI) / 180);

              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={theme.textSecondary}
                  strokeWidth={isMain ? '1.5' : '1'}
                  opacity={0.6}
                />
              );
            })
          )}
        </svg>
      </div>

      <span
        className="uppercase select-none text-center mt-1"
        style={{
          fontSize: hardwareMode === 'SOVIET RADAR' ? '13px' : '11px',
          color: theme.textSecondary,
          textShadow: isLight && hardwareMode === 'APOLLO AVIONICS' ? '0 1px 0 rgba(255,255,255,0.8)' : (hardwareMode === 'APOLLO AVIONICS' ? '0 1px 0 rgba(0,0,0,0.8)' : 'none'),
          fontFamily: hardwareMode === 'SOVIET RADAR' ? 'system-ui, sans-serif' : hardwareMode === 'APOLLO AVIONICS' ? 'sans-serif' : 'monospace',
          fontWeight: hardwareMode === 'SOVIET RADAR' ? '900' : hardwareMode === 'APOLLO AVIONICS' ? 'bold' : 'normal',
          letterSpacing: hardwareMode === 'APOLLO AVIONICS' ? '0.15em' : '0.05em',
        }}
      >
        {label}
      </span>

      <span
        className="tabular-nums"
        style={{
          fontSize: '13px',
          color: theme.textPrimary,
          fontFamily: hardwareMode === 'DIGITAL SYNTH TERMINAL' ? 'monospace' : hardwareMode === 'SOVIET RADAR' ? 'system-ui, sans-serif' : 'monospace',
          fontWeight: hardwareMode === 'SOVIET RADAR' ? '900' : 'normal',
        }}
      >
        {hardwareMode === 'DIGITAL SYNTH TERMINAL' ? value.toFixed(0).padStart(3, '0') : value.toFixed(0)}
      </span>
    </div>
  );
}
