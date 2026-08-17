import { useCallback, useState } from 'react';
import { ToggleSwitch } from './components/ToggleSwitch';
import { RotaryKnob } from './components/RotaryKnob';
import { ThemeSelector, getTheme } from './components/ThemeSelector';
import type { PanelTheme } from './components/ThemeSelector';
import { SignalViewport } from './components/SignalViewport';
import { DEFAULT_PARAMETERS, HARDWARE_MODES, isPointerReactiveEngine, PARAMETER_NAMES, PATTERN_ENGINES, SIGNAL_SOURCES, updateParameter } from './model';
import type { HardwareMode, ParameterName, Parameters, PatternEngine, SignalSource } from './model';

export default function App() {
  const [activeModule, setActiveModule] = useState<PatternEngine>('DOT FIELD');
  const [inputSource, setInputSource] = useState<SignalSource>('GRID');
  const [hardwareMode, setHardwareMode] = useState<HardwareMode>('APOLLO AVIONICS');
  const [showCalibration, setShowCalibration] = useState(true);
  const [signalDrift, setSignalDrift] = useState(false);
  const [imageUrl, setImageUrl] = useState('/signal-sample.svg');
  const [themeName, setThemeName] = useState('PHOSPHOR');
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const [parameters, setParameters] = useState<Parameters>(DEFAULT_PARAMETERS);
  const theme: PanelTheme = getTheme(themeName, themeMode);
  const isLight = themeMode === 'light';
  const isPointerReactive = isPointerReactiveEngine(activeModule);

  const toggleMode = useCallback(() => setThemeMode((mode) => (mode === 'dark' ? 'light' : 'dark')), []);
  const handleParameterChange = useCallback((name: ParameterName, value: number) => setParameters((current) => updateParameter(current, name, value)), []);

  const getPanelStyle = () => hardwareMode === 'SOVIET RADAR'
    ? { background: theme.panelBg, boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8), 0 12px 24px rgba(0,0,0,0.9)', border: `2px solid ${theme.panelBorder}`, borderRadius: '0px' }
    : hardwareMode === 'DIGITAL SYNTH TERMINAL'
      ? { background: theme.panelBgAlt, boxShadow: isLight ? '0 4px 12px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,1)' : '0 4px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.02)', border: `1px solid ${theme.panelBorderLight}`, borderRadius: '4px' }
      : { background: `linear-gradient(135deg, ${theme.panelBg} 0%, ${theme.panelBgAlt} 100%)`, boxShadow: isLight ? '0 12px 48px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6)' : '0 12px 48px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.04)', border: `1px solid ${theme.chassisBorder}`, borderRadius: '6px' };

  const getSubPanelStyle = () => hardwareMode === 'SOVIET RADAR'
    ? { background: theme.panelBgAlt, border: `2px solid ${theme.panelBorder}`, borderRadius: '0px' }
    : hardwareMode === 'DIGITAL SYNTH TERMINAL'
      ? { background: theme.panelBg, border: `1px solid ${theme.panelBorderLight}`, borderRadius: '2px' }
      : { background: `linear-gradient(to bottom, ${theme.panelBg}, ${theme.panelBgAlt})`, boxShadow: isLight ? `inset 0 2px 4px ${theme.insetShadow}, 0 1px 0 rgba(255,255,255,0.5)` : `inset 0 2px 4px ${theme.insetShadow}, 0 1px 0 rgba(255,255,255,0.03)`, border: `1px solid ${theme.panelBorder}`, borderRadius: '4px' };

  const getViewportContainerStyle = () => hardwareMode === 'SOVIET RADAR'
    ? { background: '#000', border: `4px solid ${theme.panelBorder}`, borderRadius: '0px', boxShadow: 'inset 0 0 40px rgba(0,0,0,1)' }
    : hardwareMode === 'DIGITAL SYNTH TERMINAL'
      ? { background: theme.viewportBg, border: `1px solid ${theme.panelBorderLight}`, borderRadius: '2px', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.2)' }
      : { background: isLight ? `linear-gradient(to bottom, ${theme.panelBgAlt}, ${theme.panelBg})` : `linear-gradient(to bottom, ${theme.viewportBg}, #060606)`, boxShadow: isLight ? `inset 0 4px 12px ${theme.insetShadow}, 0 1px 0 rgba(255,255,255,0.5)` : 'inset 0 4px 12px rgba(0,0,0,0.9), 0 1px 0 rgba(255,255,255,0.03)', border: `2px solid ${theme.viewportBorder}`, borderRadius: '4px' };

  const sectionHeading = (text: string, size = '13px') => <div className="console-section-heading" style={{ fontSize: size, color: theme.textSecondary, fontFamily: hardwareMode === 'SOVIET RADAR' ? 'system-ui, sans-serif' : 'monospace', fontWeight: hardwareMode === 'SOVIET RADAR' ? '900' : 'normal', letterSpacing: hardwareMode === 'APOLLO AVIONICS' ? '0.15em' : '0.05em', borderBottom: `1px solid ${theme.divider}` }}>{text}</div>;

  return (
    <main className="console-shell" style={{ background: isLight ? `linear-gradient(145deg, ${theme.chassisBg} 0%, #c8c8c8 100%)` : `linear-gradient(145deg, ${theme.chassisBg} 0%, #0e0e0e 100%)` }}>
      <section className="console-panel" style={{ ...getPanelStyle(), color: theme.textPrimary }} aria-label="Signal Console">
        <header className="console-header" style={{ borderBottom: `2px solid ${theme.divider}` }}>
          <div className="console-title-block">
            <h1 style={{ fontSize: '22px', color: theme.textPrimary, fontFamily: hardwareMode === 'SOVIET RADAR' ? 'system-ui, sans-serif' : 'monospace', fontWeight: hardwareMode === 'SOVIET RADAR' ? '900' : 'bold', textShadow: isLight && hardwareMode === 'APOLLO AVIONICS' ? '0 1px 0 rgba(255,255,255,0.8)' : hardwareMode === 'APOLLO AVIONICS' ? '0 1px 0 rgba(0,0,0,0.8)' : 'none' }}>PATTERN COMPUTER 01</h1>
            <p style={{ fontSize: '10px', color: theme.textSecondary, fontFamily: 'monospace' }}>VISUAL SIGNAL LABORATORY UNIT</p>
          </div>
          <div className="console-status-strip" style={{ background: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.3)', border: `1px solid ${theme.panelBorder}`, boxShadow: `inset 0 1px 4px ${isLight ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.5)'}` }}>
            <div><span>SYNC LOCK</span><strong style={{ color: theme.accent }}>● ACTIVE</strong></div>
            <div><span>INPUT SIGNAL</span><strong>{inputSource}</strong></div>
            <div><span>FIELD MODE</span><strong>{activeModule.replace(' FIELD', '').replace(' TRAILS', '').replace(' DISTORTION', '')}</strong></div>
            <div><span>VECTOR RATE</span><strong>{Math.round(60 + parameters.frequency * 0.4)}Hz</strong></div>
          </div>
        </header>

        <div className="console-layout">
          <aside className="console-section controls-panel" style={{ ...getSubPanelStyle() }}>
            {sectionHeading('Pattern Engines')}
            <div role="radiogroup" aria-label="Pattern engines" className="mt-2">
              {PATTERN_ENGINES.map((name) => <ToggleSwitch key={name} label={name} value={activeModule === name} onChange={() => setActiveModule(name)} theme={theme} hardwareMode={hardwareMode} controlRole="radio" />)}
            </div>
            <div className="console-subgroup" style={{ borderTop: `1px solid ${theme.divider}` }}>
              <div className="console-label" style={{ color: theme.textSecondary }}>OVERLAYS</div>
              <ToggleSwitch label="CALIBRATION" value={showCalibration} onChange={setShowCalibration} theme={theme} hardwareMode={hardwareMode} />
              <ToggleSwitch label="SIGNAL DRIFT" value={signalDrift} onChange={setSignalDrift} theme={theme} hardwareMode={hardwareMode} />
            </div>
            <div className="console-subgroup" style={{ borderTop: `1px solid ${theme.divider}` }}>
              <div className="console-label" style={{ color: theme.textSecondary }}>HARDWARE MODE</div>
              <div className="flex flex-col gap-1.5">
                {HARDWARE_MODES.map((mode) => <button key={mode} type="button" aria-pressed={hardwareMode === mode} onClick={() => setHardwareMode(mode)} className="console-button console-hardware-button" style={{ background: hardwareMode === mode ? (isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.04)') : 'transparent', border: `1px solid ${hardwareMode === mode ? theme.accent : 'transparent'}`, color: hardwareMode === mode ? theme.textPrimary : theme.textDim }}><span aria-hidden="true" style={{ background: hardwareMode === mode ? theme.led : theme.switchTrack, boxShadow: hardwareMode === mode ? `0 0 6px ${theme.accentGlow}` : 'none' }} />{mode}</button>)}
              </div>
              <div className="mt-5"><ThemeSelector activeTheme={themeName} mode={themeMode} onSelect={setThemeName} onToggleMode={toggleMode} /></div>
            </div>
          </aside>

          <section className="console-section viewport-panel" style={{ ...getSubPanelStyle() }} aria-label="Signal visualization and source controls">
            <div className="console-monitor-title" style={{ color: theme.textSecondary }}>{activeModule} | SIGNAL MONITOR</div>
            <div className="signal-viewport" style={{ ...getViewportContainerStyle() }}>
              <SignalViewport activeModule={activeModule} theme={theme} params={parameters} inputSource={inputSource} imageUrl={imageUrl} showCalibration={showCalibration} hardwareMode={hardwareMode} signalDrift={signalDrift} />
              {isPointerReactive && <div className="signal-interaction-hint" aria-hidden="true" style={{ color: theme.textSecondary, borderColor: theme.divider }}><span className="hint-pointer">MOVE POINTER THROUGH FIELD</span><span className="hint-touch">DRAG ACROSS FIELD</span></div>}
            </div>
            <div className="source-panel" style={{ ...getSubPanelStyle() }}>
              <div className="console-label" style={{ color: theme.textSecondary }}>SIGNAL SOURCE</div>
              <div className="signal-source-options">
                {SIGNAL_SOURCES.map((source) => {
                  const active = inputSource === source;
                  return <button key={source} type="button" aria-pressed={active} onClick={() => setInputSource(source)} className="console-button source-button" style={{ background: active ? theme.accent : isLight ? '#e5e5e5' : '#111', color: active ? '#000' : theme.textDim, border: `1px solid ${active ? theme.accent : theme.panelBorder}`, boxShadow: active ? `0 0 8px ${theme.accentGlow}` : 'none' }}>{source}</button>;
                })}
              </div>
              {inputSource === 'IMAGE INPUT' && <div className="image-url-control"><label htmlFor="image-url" style={{ color: theme.textDim }}>IMAGE URL</label><input id="image-url" type="url" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} className="console-input" style={{ background: isLight ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.3)', border: `1px solid ${theme.panelBorder}`, color: theme.textPrimary, boxShadow: `inset 0 1px 3px ${isLight ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.5)'}` }} placeholder="Paste a CORS-enabled image URL" /></div>}
            </div>
            <div className="console-footer" style={{ color: theme.textDim }}><span>∿ ANALOG COMPUTE</span><span>GAIN: 0dB</span></div>
          </section>

          <aside className="console-section parameters-panel" style={{ ...getSubPanelStyle() }}>
            {sectionHeading('Parameters')}
            <div className="parameter-grid">
              {PARAMETER_NAMES.map((name) => <RotaryKnob key={name} label={name} value={parameters[name]} onChange={(value) => handleParameterChange(name, value)} theme={theme} hardwareMode={hardwareMode} />)}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
