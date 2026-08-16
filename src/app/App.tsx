import { useState, useCallback } from 'react';
import { ToggleSwitch } from './components/ToggleSwitch';
import { RotaryKnob } from './components/RotaryKnob';
import { ThemeSelector, getTheme } from './components/ThemeSelector';
import type { PanelTheme } from './components/ThemeSelector';
import { SignalViewport } from './components/SignalViewport';

export default function App() {
  const PATTERN_ENGINES = [
    'DOT FIELD',
    'NODE MESH',
    'SCANLINE FIELD',
    'ECHO TRAILS',
    'TYPE DISTORTION',
  ] as const;

  const SIGNAL_SOURCES = [
    'GRID',
    'NOISE FIELD',
    'TEXT SAMPLE',
    'IMAGE INPUT',
  ] as const;

  const HARDWARE_MODES = [
    'APOLLO AVIONICS',
    'SOVIET RADAR',
    'DIGITAL SYNTH TERMINAL',
  ] as const;

  const [activeModule, setActiveModule] = useState<string>('DOT FIELD');
  const [inputSource, setInputSource] = useState<string>('GRID');
  const [hardwareMode, setHardwareMode] = useState<string>('APOLLO AVIONICS');
  const [showCalibration, setShowCalibration] = useState<boolean>(true);
  const [signalDrift, setSignalDrift] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>('/signal-sample.svg');
  const [themeName, setThemeName] = useState('PHOSPHOR');
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const theme: PanelTheme = getTheme(themeName, themeMode);

  const [parameters, setParameters] = useState({
    density: 50,
    phase: 25,
    decay: 40,
    frequency: 50,
  });

  const toggleMode = useCallback(() => {
    setThemeMode((m) => (m === 'dark' ? 'light' : 'dark'));
  }, []);

  const isLight = themeMode === 'light';

  const getPanelStyle = () => {
    if (hardwareMode === 'SOVIET RADAR') {
      return {
        background: theme.panelBg,
        boxShadow: `inset 0 0 20px rgba(0,0,0,0.8), 0 12px 24px rgba(0,0,0,0.9)`,
        border: `2px solid ${theme.panelBorder}`,
        borderRadius: '0px',
      };
    } else if (hardwareMode === 'DIGITAL SYNTH TERMINAL') {
      return {
        background: theme.panelBgAlt,
        boxShadow: isLight
          ? `0 4px 12px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,1)`
          : `0 4px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.02)`,
        border: `1px solid ${theme.panelBorderLight}`,
        borderRadius: '4px',
      };
    }
    // APOLLO AVIONICS
    return {
      background: `linear-gradient(135deg, ${theme.panelBg} 0%, ${theme.panelBgAlt} 100%)`,
      boxShadow: isLight
        ? `0 12px 48px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6)`
        : `0 12px 48px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.04)`,
      border: `1px solid ${theme.chassisBorder}`,
      borderRadius: '6px',
    };
  };

  const getSubPanelStyle = () => {
    if (hardwareMode === 'SOVIET RADAR') {
      return {
        background: theme.panelBgAlt,
        border: `2px solid ${theme.panelBorder}`,
        borderRadius: '0px',
      };
    } else if (hardwareMode === 'DIGITAL SYNTH TERMINAL') {
      return {
        background: theme.panelBg,
        border: `1px solid ${theme.panelBorderLight}`,
        borderRadius: '2px',
      };
    }
    // APOLLO AVIONICS
    return {
      background: `linear-gradient(to bottom, ${theme.panelBg}, ${theme.panelBgAlt})`,
      boxShadow: isLight
        ? `inset 0 2px 4px ${theme.insetShadow}, 0 1px 0 rgba(255,255,255,0.5)`
        : `inset 0 2px 4px ${theme.insetShadow}, 0 1px 0 rgba(255,255,255,0.03)`,
      border: `1px solid ${theme.panelBorder}`,
      borderRadius: '4px',
    };
  };

  const getViewportContainerStyle = () => {
    if (hardwareMode === 'SOVIET RADAR') {
      return {
        background: '#000',
        border: `4px solid ${theme.panelBorder}`,
        borderRadius: '0px',
        boxShadow: `inset 0 0 40px rgba(0,0,0,1)`,
      };
    } else if (hardwareMode === 'DIGITAL SYNTH TERMINAL') {
      return {
        background: theme.viewportBg,
        border: `1px solid ${theme.panelBorderLight}`,
        borderRadius: '2px',
        boxShadow: `inset 0 2px 8px rgba(0,0,0,0.2)`,
      };
    }
    // APOLLO AVIONICS
    return {
      background: isLight
        ? `linear-gradient(to bottom, ${theme.panelBgAlt}, ${theme.panelBg})`
        : `linear-gradient(to bottom, ${theme.viewportBg}, #060606)`,
      boxShadow: isLight
        ? `inset 0 4px 12px ${theme.insetShadow}, 0 1px 0 rgba(255,255,255,0.5)`
        : `inset 0 4px 12px rgba(0,0,0,0.9), 0 1px 0 rgba(255,255,255,0.03)`,
      border: `2px solid ${theme.viewportBorder}`,
      borderRadius: '4px',
    };
  };

  return (
    <div
      className="size-full flex items-center justify-center overflow-auto p-4"
      style={{
        background: isLight
          ? `linear-gradient(145deg, ${theme.chassisBg} 0%, #c8c8c8 100%)`
          : `linear-gradient(145deg, ${theme.chassisBg} 0%, #0e0e0e 100%)`,
        transition: 'background 0.6s',
      }}
    >
      <div
        className="flex flex-col gap-3 p-7"
        style={{
          ...getPanelStyle(),
          transition: 'all 0.6s',
        }}
      >
        {/* Top Title Plate & Status Strip */}
        <div
          className="flex justify-between items-end px-2 pb-4 mb-2"
          style={{
            borderBottom: `2px solid ${theme.divider}`,
            transition: 'all 0.6s',
          }}
        >
          <div className="flex flex-col gap-1">
            <div
              className="font-bold uppercase tracking-[0.2em]"
              style={{
                fontSize: '22px',
                color: theme.textPrimary,
                fontFamily: hardwareMode === 'SOVIET RADAR' ? 'system-ui, sans-serif' : 'monospace',
                fontWeight: hardwareMode === 'SOVIET RADAR' ? '900' : 'bold',
                textShadow: isLight && hardwareMode === 'APOLLO AVIONICS' ? '0 1px 0 rgba(255,255,255,0.8)' : (hardwareMode === 'APOLLO AVIONICS' ? '0 1px 0 rgba(0,0,0,0.8)' : 'none'),
              }}
            >
              PATTERN COMPUTER 01
            </div>
            <div
              className="uppercase tracking-[0.3em]"
              style={{
                fontSize: '10px',
                color: theme.textSecondary,
                fontFamily: 'monospace',
              }}
            >
              VISUAL SIGNAL LABORATORY UNIT
            </div>
          </div>

          <div
            className="flex gap-8 px-6 py-2 rounded-sm"
            style={{
              background: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.3)',
              border: `1px solid ${theme.panelBorder}`,
              boxShadow: `inset 0 1px 4px ${isLight ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.5)'}`,
            }}
          >
            <div className="flex flex-col items-center gap-1">
              <span style={{ fontSize: '9px', color: theme.textDim, fontFamily: 'monospace', letterSpacing: '0.1em' }}>SYNC LOCK</span>
              <span className="flex items-center gap-1.5" style={{ fontSize: '11px', color: theme.accent, fontFamily: 'monospace', letterSpacing: '0.1em', textShadow: `0 0 8px ${theme.accentGlow}` }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: theme.accent, boxShadow: `0 0 6px ${theme.accentGlow}` }}></div>
                ACTIVE
              </span>
            </div>
            
            <div className="w-px" style={{ background: theme.divider }}></div>

            <div className="flex flex-col items-center gap-1">
              <span style={{ fontSize: '9px', color: theme.textDim, fontFamily: 'monospace', letterSpacing: '0.1em' }}>INPUT SIGNAL</span>
              <span style={{ fontSize: '11px', color: theme.textPrimary, fontFamily: 'monospace', letterSpacing: '0.1em' }}>
                {inputSource}
              </span>
            </div>

            <div className="w-px" style={{ background: theme.divider }}></div>

            <div className="flex flex-col items-center gap-1">
              <span style={{ fontSize: '9px', color: theme.textDim, fontFamily: 'monospace', letterSpacing: '0.1em' }}>FIELD MODE</span>
              <span style={{ fontSize: '11px', color: theme.textPrimary, fontFamily: 'monospace', letterSpacing: '0.1em' }}>
                {activeModule.replace(' FIELD', '').replace(' TRAILS', '').replace(' DISTORTION', '')}
              </span>
            </div>

            <div className="w-px" style={{ background: theme.divider }}></div>

            <div className="flex flex-col items-center gap-1">
              <span style={{ fontSize: '9px', color: theme.textDim, fontFamily: 'monospace', letterSpacing: '0.1em' }}>VECTOR RATE</span>
              <span className="tabular-nums flex items-center gap-1" style={{ fontSize: '11px', color: theme.textPrimary, fontFamily: 'monospace', letterSpacing: '0.1em' }}>
                {Math.round(60 + (parameters.frequency * 0.4))}Hz
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-1.5">
        {/* Left Panel - Module Selector */}
        <div
          className="flex flex-col p-6"
          style={{
            ...getSubPanelStyle(),
            width: '260px',
            transition: 'all 0.6s',
          }}
        >
          <div
            className="mb-5 pb-3 uppercase tracking-wider"
            style={{
              fontSize: '13px',
              color: theme.textSecondary,
              textShadow: isLight && hardwareMode === 'APOLLO AVIONICS' ? '0 1px 0 rgba(255,255,255,0.8)' : (hardwareMode === 'APOLLO AVIONICS' ? '0 1px 0 rgba(0,0,0,0.8)' : 'none'),
              fontFamily: hardwareMode === 'SOVIET RADAR' ? 'system-ui, sans-serif' : 'monospace',
              fontWeight: hardwareMode === 'SOVIET RADAR' ? '900' : 'normal',
              letterSpacing: hardwareMode === 'APOLLO AVIONICS' ? '0.15em' : '0.05em',
              borderBottom: `1px solid ${theme.divider}`,
              transition: 'all 0.6s',
            }}
          >
            Pattern Engines
          </div>

          <div className="flex flex-col gap-0.5">
            {PATTERN_ENGINES.map((name) => (
              <ToggleSwitch
                key={name}
                label={name}
                value={activeModule === name}
                onChange={() => setActiveModule(name)}
                theme={theme}
                hardwareMode={hardwareMode}
              />
            ))}
          </div>

          <div
            className="mt-5 pt-4"
            style={{
              borderTop: `1px solid ${theme.divider}`,
              transition: 'border-color 0.6s',
            }}
          >
            <div
              className="mb-3 uppercase tracking-wider"
              style={{
                fontSize: '11px',
                color: theme.textSecondary,
                fontFamily: 'monospace',
                letterSpacing: '0.1em',
              }}
            >
              Overlays
            </div>
            <ToggleSwitch
              label="CALIBRATION"
              value={showCalibration}
              onChange={() => setShowCalibration(!showCalibration)}
              theme={theme}
              hardwareMode={hardwareMode}
            />
            <ToggleSwitch
              label="SIGNAL DRIFT"
              value={signalDrift}
              onChange={() => setSignalDrift(!signalDrift)}
              theme={theme}
              hardwareMode={hardwareMode}
            />
          </div>

          <div
            className="mt-5 pt-4"
            style={{
              borderTop: `1px solid ${theme.divider}`,
              transition: 'border-color 0.6s',
            }}
          >
            <div
              className="mb-3 uppercase tracking-wider"
              style={{
                fontSize: '11px',
                color: theme.textSecondary,
                fontFamily: 'monospace',
                letterSpacing: '0.1em',
              }}
            >
              Hardware Mode
            </div>
            <div className="flex flex-col gap-1.5 mb-5">
              {HARDWARE_MODES.map((mode) => (
                <button
                  key={mode}
                  onClick={() => setHardwareMode(mode)}
                  className="flex items-center gap-2 py-1.5 px-2 rounded-sm transition-all"
                  style={{
                    background: hardwareMode === mode 
                      ? (isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.04)') 
                      : 'transparent',
                    border: `1px solid ${hardwareMode === mode ? theme.accent : 'transparent'}`,
                  }}
                >
                  <div 
                    className="w-1.5 h-1.5 rounded-full" 
                    style={{ 
                      background: hardwareMode === mode ? theme.led : theme.switchTrack,
                      boxShadow: hardwareMode === mode ? `0 0 6px ${theme.accentGlow}` : 'none' 
                    }} 
                  />
                  <span
                    style={{
                      fontSize: '10px',
                      fontFamily: 'monospace',
                      letterSpacing: '0.05em',
                      color: hardwareMode === mode ? theme.textPrimary : theme.textDim,
                    }}
                  >
                    {mode}
                  </span>
                </button>
              ))}
            </div>

            <ThemeSelector
              activeTheme={themeName}
              mode={themeMode}
              onSelect={setThemeName}
              onToggleMode={toggleMode}
            />
          </div>
        </div>

        {/* Center Panel - Display Viewport */}
        <div
          className="flex flex-col p-6"
          style={{
            ...getSubPanelStyle(),
            width: '520px',
            transition: 'all 0.6s',
          }}
        >
          <div
            className="mb-4 uppercase tracking-wider text-center"
            style={{
              fontSize: '12px',
              color: theme.textSecondary,
              textShadow: isLight && hardwareMode === 'APOLLO AVIONICS' ? '0 1px 0 rgba(255,255,255,0.8)' : (hardwareMode === 'APOLLO AVIONICS' ? '0 1px 0 rgba(0,0,0,0.8)' : 'none'),
              fontFamily: hardwareMode === 'SOVIET RADAR' ? 'system-ui, sans-serif' : 'monospace',
              fontWeight: hardwareMode === 'SOVIET RADAR' ? '900' : 'normal',
              letterSpacing: hardwareMode === 'APOLLO AVIONICS' ? '0.15em' : '0.05em',
              transition: 'color 0.6s',
            }}
          >
            {activeModule} — Signal Monitor
          </div>

          <div
            className="flex-1 relative overflow-hidden"
            style={{
              ...getViewportContainerStyle(),
              minHeight: '420px',
              transition: 'all 0.6s',
            }}
          >
            <SignalViewport 
              activeModule={activeModule} 
              theme={theme} 
              params={parameters} 
              inputSource={inputSource} 
              imageUrl={imageUrl}
              showCalibration={showCalibration}
              hardwareMode={hardwareMode}
              signalDrift={signalDrift}
            />
          </div>

          <div
            className="mt-4 p-3"
            style={{
              ...getSubPanelStyle(),
              transition: 'all 0.6s',
            }}
          >
            <div
              className="mb-2 uppercase tracking-wider"
              style={{
                fontSize: '11px',
                color: theme.textSecondary,
                fontFamily: 'monospace',
                letterSpacing: '0.1em',
              }}
            >
              Signal Source
            </div>
            <div className="flex gap-2">
              {SIGNAL_SOURCES.map((src) => {
                const isActive = inputSource === src;
                return (
                  <button
                    key={src}
                    onClick={() => setInputSource(src)}
                    className="flex-1 py-1.5 rounded-[2px] uppercase transition-all duration-300"
                    style={{
                      fontSize: '10px',
                      fontFamily: 'monospace',
                      letterSpacing: '0.05em',
                      background: isActive
                        ? theme.accent
                        : isLight
                        ? '#e5e5e5'
                        : '#111',
                      color: isActive ? '#000' : theme.textDim,
                      border: `1px solid ${isActive ? theme.accent : theme.panelBorder}`,
                      boxShadow: isActive ? `0 0 8px ${theme.accentGlow}` : 'none',
                    }}
                  >
                    {src}
                  </button>
                );
              })}
            </div>
            
            {inputSource === 'IMAGE INPUT' && (
              <div className="mt-3 flex items-center gap-2">
                <div style={{ fontSize: '10px', color: theme.textDim, fontFamily: 'monospace', letterSpacing: '0.1em' }}>URL:</div>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1 px-2 py-1 rounded-[2px] outline-none"
                  style={{
                    background: isLight ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.3)',
                    border: `1px solid ${theme.panelBorder}`,
                    color: theme.textPrimary,
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    boxShadow: `inset 0 1px 3px ${isLight ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.5)'}`,
                    transition: 'all 0.6s'
                  }}
                  placeholder="Paste image URL here..."
                />
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-between items-center px-2">
            <span
              style={{
                fontSize: '11px',
                color: theme.textDim,
                fontFamily: 'monospace',
                letterSpacing: '0.1em',
                transition: 'color 0.6s',
              }}
            >
              ∿ ANALOG COMPUTE
            </span>
            <span
              style={{
                fontSize: '11px',
                color: theme.textDim,
                fontFamily: 'monospace',
                transition: 'color 0.6s',
              }}
            >
              GAIN: 0dB
            </span>
          </div>
        </div>

        {/* Right Panel - Parameter Controls */}
        <div
          className="flex flex-col p-6"
          style={{
            ...getSubPanelStyle(),
            width: '240px',
            transition: 'all 0.6s',
          }}
        >
          <div
            className="mb-5 pb-3 uppercase tracking-wider"
            style={{
              fontSize: '13px',
              color: theme.textSecondary,
              textShadow: isLight && hardwareMode === 'APOLLO AVIONICS' ? '0 1px 0 rgba(255,255,255,0.8)' : (hardwareMode === 'APOLLO AVIONICS' ? '0 1px 0 rgba(0,0,0,0.8)' : 'none'),
              fontFamily: hardwareMode === 'SOVIET RADAR' ? 'system-ui, sans-serif' : 'monospace',
              fontWeight: hardwareMode === 'SOVIET RADAR' ? '900' : 'normal',
              letterSpacing: hardwareMode === 'APOLLO AVIONICS' ? '0.15em' : '0.05em',
              borderBottom: `1px solid ${theme.divider}`,
              transition: 'all 0.6s',
            }}
          >
            Parameters
          </div>

          <div className="grid grid-cols-2 gap-3">
            {Object.entries(parameters).map(([key, value]) => (
              <RotaryKnob
                key={key}
                label={key}
                value={value}
                onChange={(newValue) => setParameters({ ...parameters, [key]: newValue })}
                theme={theme}
                hardwareMode={hardwareMode}
              />
            ))}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
