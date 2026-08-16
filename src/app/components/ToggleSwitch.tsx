import type { PanelTheme } from './ThemeSelector';

interface ToggleSwitchProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  theme: PanelTheme;
  hardwareMode?: string;
  controlRole?: 'radio' | 'switch';
}

export function ToggleSwitch({ label, value, onChange, theme, hardwareMode = 'APOLLO AVIONICS', controlRole = 'switch' }: ToggleSwitchProps) {
  const isLight = theme.mode === 'light';
  const fontStyle = hardwareMode === 'SOVIET RADAR' ? 'system-ui, sans-serif' : hardwareMode === 'APOLLO AVIONICS' ? 'sans-serif' : 'monospace';
  const letterSpacing = hardwareMode === 'APOLLO AVIONICS' ? '0.15em' : hardwareMode === 'SOVIET RADAR' ? '0.05em' : '0.05em';
  const fontWeight = hardwareMode === 'SOVIET RADAR' ? '900' : hardwareMode === 'APOLLO AVIONICS' ? 'bold' : 'normal';

  return (
    <button
      type="button"
      role={controlRole}
      aria-checked={value}
      aria-label={label}
      onClick={() => onChange(!value)}
      className="console-switch flex w-full items-center gap-3 py-2.5 text-left"
      style={{ minHeight: '44px' }}
    >
      {hardwareMode !== 'DIGITAL SYNTH TERMINAL' && <span aria-hidden="true" className="shrink-0" style={{ width: hardwareMode === 'SOVIET RADAR' ? '12px' : '10px', height: hardwareMode === 'SOVIET RADAR' ? '12px' : '10px', borderRadius: hardwareMode === 'SOVIET RADAR' ? '2px' : '50%', background: value ? `radial-gradient(circle, ${theme.led} 0%, ${theme.accent} 70%)` : theme.switchTrack, boxShadow: value ? `0 0 8px ${theme.accentGlow}, inset 0 1px 0 rgba(255,255,255,0.3)` : `inset 0 1px 2px ${theme.insetShadow}`, border: `1px solid ${value ? theme.accent : theme.panelBorder}`, transition: 'all 0.3s' }} />}
      <span aria-hidden="true" className="relative shrink-0 transition-all" style={hardwareMode === 'DIGITAL SYNTH TERMINAL' ? { width: '40px', height: '20px', background: value ? theme.accent : theme.switchTrack, border: `1px solid ${value ? theme.accent : theme.panelBorder}`, borderRadius: '2px', display: 'grid', placeItems: 'center' } : hardwareMode === 'SOVIET RADAR' ? { width: '46px', height: '22px', background: theme.switchTrack, border: `2px solid ${theme.panelBorder}`, borderRadius: '1px' } : { width: '52px', height: '26px', background: `linear-gradient(to bottom, ${theme.switchTrack}, ${theme.panelBgAlt})`, boxShadow: isLight ? `inset 0 2px 4px ${theme.insetShadow}, 0 1px 0 rgba(255,255,255,0.6)` : `inset 0 2px 4px ${theme.insetShadow}, 0 1px 0 rgba(255,255,255,0.05)`, border: `1px solid ${theme.panelBorder}`, borderRadius: '2px' }}>
        {hardwareMode === 'DIGITAL SYNTH TERMINAL' ? <span style={{ fontSize: '9px', color: value ? '#fff' : theme.textDim, fontFamily: 'monospace' }}>{value ? 'ON' : 'OFF'}</span> : <span className="absolute transition-all" style={hardwareMode === 'SOVIET RADAR' ? { width: '20px', height: '18px', left: value ? '22px' : '0px', top: '0px', background: value ? theme.led : theme.textDim, borderRadius: '1px' } : { width: '22px', height: '22px', top: '2px', left: value ? 'calc(100% - 24px)' : '2px', backgroundImage: value ? `linear-gradient(to bottom, ${theme.switchThumbActive}, ${theme.switchThumb})` : `linear-gradient(to bottom, ${theme.switchThumb}, ${theme.knobFace})`, boxShadow: isLight ? `0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.4)` : `0 1px 3px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)`, borderRadius: '2px' }} />}
      </span>
      <span className="uppercase select-none" style={{ fontSize: hardwareMode === 'SOVIET RADAR' ? '12px' : '11px', color: value ? theme.textPrimary : theme.textDim, textShadow: value && hardwareMode !== 'DIGITAL SYNTH TERMINAL' ? `0 0 6px ${theme.accentGlow}` : isLight && hardwareMode === 'APOLLO AVIONICS' ? '0 1px 0 rgba(255,255,255,0.8)' : hardwareMode === 'APOLLO AVIONICS' ? '0 1px 0 rgba(0,0,0,0.8)' : 'none', fontFamily: fontStyle, fontWeight, letterSpacing, transition: 'color 0.3s' }}>{label}</span>
    </button>
  );
}
