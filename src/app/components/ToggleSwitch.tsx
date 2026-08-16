import type { PanelTheme } from './ThemeSelector';

interface ToggleSwitchProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  theme: PanelTheme;
  hardwareMode?: string;
}

export function ToggleSwitch({ label, value, onChange, theme, hardwareMode = 'APOLLO AVIONICS' }: ToggleSwitchProps) {
  const isLight = theme.mode === 'light';
  
  let fontStyle = 'monospace';
  let letterSpacing = '0.1em';
  let fontWeight = 'normal';
  
  if (hardwareMode === 'APOLLO AVIONICS') {
    fontStyle = 'sans-serif';
    letterSpacing = '0.15em';
    fontWeight = 'bold';
  } else if (hardwareMode === 'SOVIET RADAR') {
    fontStyle = 'system-ui, sans-serif';
    letterSpacing = '0.05em';
    fontWeight = '900';
  } else if (hardwareMode === 'DIGITAL SYNTH TERMINAL') {
    fontStyle = 'monospace';
    letterSpacing = '0.05em';
    fontWeight = 'normal';
  }

  const renderSwitch = () => {
    if (hardwareMode === 'DIGITAL SYNTH TERMINAL') {
      return (
        <button
          onClick={() => onChange(!value)}
          className="relative rounded-[2px] transition-all flex items-center justify-center"
          style={{
            width: '40px',
            height: '20px',
            background: value ? theme.accent : theme.switchTrack,
            border: `1px solid ${value ? theme.accent : theme.panelBorder}`,
          }}
        >
           <span style={{ fontSize: '9px', color: value ? '#fff' : theme.textDim, fontFamily: 'monospace' }}>
             {value ? 'ON' : 'OFF'}
           </span>
        </button>
      );
    }

    if (hardwareMode === 'SOVIET RADAR') {
      return (
        <button
          onClick={() => onChange(!value)}
          className="relative transition-all"
          style={{
            width: '46px',
            height: '22px',
            background: theme.switchTrack,
            border: `2px solid ${theme.panelBorder}`,
            borderRadius: '1px',
          }}
        >
          <div
            className="absolute top-0 transition-all duration-150"
            style={{
              width: '20px',
              height: '18px',
              left: value ? '22px' : '0px',
              background: value ? theme.led : theme.textDim,
              borderRadius: '1px',
            }}
          />
        </button>
      );
    }

    // APOLLO AVIONICS (default)
    return (
      <button
        onClick={() => onChange(!value)}
        className="relative rounded-sm transition-all"
        style={{
          width: '52px',
          height: '26px',
          background: `linear-gradient(to bottom, ${theme.switchTrack}, ${theme.panelBgAlt})`,
          boxShadow: isLight
            ? `inset 0 2px 4px ${theme.insetShadow}, 0 1px 0 rgba(255,255,255,0.6)`
            : `inset 0 2px 4px ${theme.insetShadow}, 0 1px 0 rgba(255,255,255,0.05)`,
          border: `1px solid ${theme.panelBorder}`,
        }}
      >
        <div
          className="absolute top-0.5 rounded-[2px] transition-all duration-200"
          style={{
            width: '22px',
            height: '22px',
            left: value ? 'calc(100% - 24px)' : '2px',
            backgroundImage: value
              ? `linear-gradient(to bottom, ${theme.switchThumbActive}, ${theme.switchThumb})`
              : `linear-gradient(to bottom, ${theme.switchThumb}, ${theme.knobFace})`,
            boxShadow: isLight
              ? `0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.4)`
              : `0 1px 3px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)`,
          }}
        />
      </button>
    );
  };

  return (
    <div className="flex items-center gap-3 py-2.5">
      {/* Indicator LED - varies by mode */}
      {hardwareMode !== 'DIGITAL SYNTH TERMINAL' && (
        <div
          className="shrink-0"
          style={{
            width: hardwareMode === 'SOVIET RADAR' ? '12px' : '10px',
            height: hardwareMode === 'SOVIET RADAR' ? '12px' : '10px',
            borderRadius: hardwareMode === 'SOVIET RADAR' ? '2px' : '50%',
            background: value
              ? `radial-gradient(circle, ${theme.led} 0%, ${theme.accent} 70%)`
              : theme.switchTrack,
            boxShadow: value
              ? `0 0 8px ${theme.accentGlow}, inset 0 1px 0 rgba(255,255,255,0.3)`
              : `inset 0 1px 2px ${theme.insetShadow}`,
            border: `1px solid ${value ? theme.accent : theme.panelBorder}`,
            transition: 'all 0.3s',
          }}
        />
      )}
      
      {renderSwitch()}

      <span
        className="uppercase select-none"
        style={{
          fontSize: hardwareMode === 'SOVIET RADAR' ? '12px' : '11px',
          color: value ? theme.textPrimary : theme.textDim,
          textShadow: value && hardwareMode !== 'DIGITAL SYNTH TERMINAL'
            ? `0 0 6px ${theme.accentGlow}`
            : (isLight && hardwareMode === 'APOLLO AVIONICS' ? '0 1px 0 rgba(255,255,255,0.8)' : (hardwareMode === 'APOLLO AVIONICS' ? '0 1px 0 rgba(0,0,0,0.8)' : 'none')),
          fontFamily: fontStyle,
          fontWeight: fontWeight,
          letterSpacing: letterSpacing,
          transition: 'color 0.3s',
        }}
      >
        {label}
      </span>
    </div>
  );
}
