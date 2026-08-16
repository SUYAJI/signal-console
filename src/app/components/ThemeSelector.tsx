
export interface PanelTheme {
  name: string;
  mode: 'dark' | 'light';
  // Viewport / signal colors
  accent: string;
  accentDim: string;
  accentGlow: string;
  led: string;
  gridLine: string;
  waveStroke: string;
  label: string;
  labelActive: string;
  // Hardware panel colors
  panelBg: string;
  panelBgAlt: string;
  panelBorder: string;
  panelBorderLight: string;
  chassisBg: string;
  chassisBorder: string;
  viewportBg: string;
  viewportBorder: string;
  textPrimary: string;
  textSecondary: string;
  textDim: string;
  knobFace: string;
  knobHighlight: string;
  knobBorder: string;
  knobIndicator: string;
  switchTrack: string;
  switchThumb: string;
  switchThumbActive: string;
  divider: string;
  insetShadow: string;
}

interface ThemeBase {
  name: string;
  dark: Omit<PanelTheme, 'name' | 'mode'>;
  light: Omit<PanelTheme, 'name' | 'mode'>;
}

const THEME_BASES: ThemeBase[] = [
  {
    name: 'PHOSPHOR',
    dark: {
      accent: '#3a7a3a', accentDim: '#1a3a1a', accentGlow: 'rgba(80,200,80,0.3)',
      led: '#70c070', gridLine: '#1a3a1a', waveStroke: '#3a7a3a',
      label: '#5a8a5a', labelActive: '#90d090',
      panelBg: '#232823', panelBgAlt: '#1e231e', panelBorder: '#2e382e', panelBorderLight: '#3a4a3a',
      chassisBg: '#1a1e1a', chassisBorder: '#2a352a',
      viewportBg: '#080a08', viewportBorder: '#1a2a1a',
      textPrimary: '#8aaa8a', textSecondary: '#5a7a5a', textDim: '#3a5a3a',
      knobFace: '#2a322a', knobHighlight: '#3a4a3a', knobBorder: '#3a4a3a', knobIndicator: '#70c070',
      switchTrack: '#1a221a', switchThumb: '#4a5a4a', switchThumbActive: '#5a7a5a',
      divider: '#2a3a2a', insetShadow: 'rgba(0,20,0,0.6)',
    },
    light: {
      accent: '#2a8a2a', accentDim: '#c0e0c0', accentGlow: 'rgba(40,160,40,0.25)',
      led: '#30a030', gridLine: '#c0d8c0', waveStroke: '#2a8a2a',
      label: '#5a8a5a', labelActive: '#1a6a1a',
      panelBg: '#e8ece8', panelBgAlt: '#dfe4df', panelBorder: '#c8d4c8', panelBorderLight: '#b8c8b8',
      chassisBg: '#d8ddd8', chassisBorder: '#c0ccc0',
      viewportBg: '#f0f4f0', viewportBorder: '#c0d0c0',
      textPrimary: '#2a4a2a', textSecondary: '#5a7a5a', textDim: '#8aaa8a',
      knobFace: '#d8e0d8', knobHighlight: '#e8f0e8', knobBorder: '#b8c8b8', knobIndicator: '#30a030',
      switchTrack: '#c8d4c8', switchThumb: '#b0bab0', switchThumbActive: '#8aaa8a',
      divider: '#c8d8c8', insetShadow: 'rgba(0,40,0,0.12)',
    },
  },
  {
    name: 'AMBER',
    dark: {
      accent: '#8a6a2a', accentDim: '#3a2a0a', accentGlow: 'rgba(220,170,50,0.3)',
      led: '#d0a030', gridLine: '#3a2a0a', waveStroke: '#9a7a30',
      label: '#8a7a4a', labelActive: '#d0b060',
      panelBg: '#282420', panelBgAlt: '#231f1a', panelBorder: '#38302a', panelBorderLight: '#4a3e30',
      chassisBg: '#1e1a16', chassisBorder: '#352e24',
      viewportBg: '#0a0906', viewportBorder: '#2a2418',
      textPrimary: '#aa9a70', textSecondary: '#7a6a4a', textDim: '#5a4a2a',
      knobFace: '#2e2820', knobHighlight: '#4a3e2a', knobBorder: '#4a3e30', knobIndicator: '#d0a030',
      switchTrack: '#201c16', switchThumb: '#5a4e3a', switchThumbActive: '#7a6a4a',
      divider: '#3a3020', insetShadow: 'rgba(20,10,0,0.6)',
    },
    light: {
      accent: '#8a6a1a', accentDim: '#e8dcc0', accentGlow: 'rgba(180,140,30,0.25)',
      led: '#a07a10', gridLine: '#d8ccb0', waveStroke: '#8a6a1a',
      label: '#7a6a3a', labelActive: '#5a4a10',
      panelBg: '#ece8e0', panelBgAlt: '#e4dfd6', panelBorder: '#d4ccc0', panelBorderLight: '#c4b8a8',
      chassisBg: '#ddd8d0', chassisBorder: '#ccc4b8',
      viewportBg: '#f4f0e8', viewportBorder: '#d0c8b8',
      textPrimary: '#4a3a10', textSecondary: '#7a6a3a', textDim: '#aa9a7a',
      knobFace: '#e0d8cc', knobHighlight: '#f0e8dc', knobBorder: '#c4b8a8', knobIndicator: '#a07a10',
      switchTrack: '#d4ccbc', switchThumb: '#bab0a0', switchThumbActive: '#9a8a6a',
      divider: '#d0c4b0', insetShadow: 'rgba(40,20,0,0.12)',
    },
  },
  {
    name: 'COBALT',
    dark: {
      accent: '#2a4a8a', accentDim: '#0a1a3a', accentGlow: 'rgba(60,120,220,0.3)',
      led: '#5090d0', gridLine: '#0a1a3a', waveStroke: '#3060a0',
      label: '#4a6a8a', labelActive: '#70a0d0',
      panelBg: '#202428', panelBgAlt: '#1a1e23', panelBorder: '#2a3038', panelBorderLight: '#30404a',
      chassisBg: '#161a1e', chassisBorder: '#242e35',
      viewportBg: '#06080a', viewportBorder: '#182a3a',
      textPrimary: '#708aaa', textSecondary: '#4a6a8a', textDim: '#2a4a6a',
      knobFace: '#202830', knobHighlight: '#2a3a4a', knobBorder: '#304050', knobIndicator: '#5090d0',
      switchTrack: '#161c22', switchThumb: '#3a4a5a', switchThumbActive: '#4a6a8a',
      divider: '#202a3a', insetShadow: 'rgba(0,10,30,0.6)',
    },
    light: {
      accent: '#1a4aaa', accentDim: '#c0d0e8', accentGlow: 'rgba(30,90,200,0.25)',
      led: '#2060b0', gridLine: '#b8c8e0', waveStroke: '#1a4aaa',
      label: '#4a6a9a', labelActive: '#0a3a8a',
      panelBg: '#e4e8ee', panelBgAlt: '#dbe0e8', panelBorder: '#c4ccd8', panelBorderLight: '#b0bcd0',
      chassisBg: '#d4d8e0', chassisBorder: '#bcc4d4',
      viewportBg: '#eef0f4', viewportBorder: '#bcc8d8',
      textPrimary: '#1a3a6a', textSecondary: '#4a6a9a', textDim: '#8aa0ba',
      knobFace: '#d4dae4', knobHighlight: '#e4eaf4', knobBorder: '#b0bcd0', knobIndicator: '#2060b0',
      switchTrack: '#c4ccd8', switchThumb: '#a8b4c4', switchThumbActive: '#7a8eaa',
      divider: '#c0cad8', insetShadow: 'rgba(0,20,60,0.12)',
    },
  },
  {
    name: 'CRIMSON',
    dark: {
      accent: '#8a2a2a', accentDim: '#3a0a0a', accentGlow: 'rgba(220,60,60,0.3)',
      led: '#d05050', gridLine: '#3a0a0a', waveStroke: '#a03030',
      label: '#8a4a4a', labelActive: '#d07070',
      panelBg: '#282020', panelBgAlt: '#231a1a', panelBorder: '#382828', panelBorderLight: '#4a3030',
      chassisBg: '#1e1616', chassisBorder: '#352424',
      viewportBg: '#0a0606', viewportBorder: '#2a1818',
      textPrimary: '#aa7070', textSecondary: '#7a4a4a', textDim: '#5a2a2a',
      knobFace: '#2e2020', knobHighlight: '#4a2a2a', knobBorder: '#4a3030', knobIndicator: '#d05050',
      switchTrack: '#201616', switchThumb: '#5a3a3a', switchThumbActive: '#7a4a4a',
      divider: '#3a2020', insetShadow: 'rgba(20,0,0,0.6)',
    },
    light: {
      accent: '#aa2020', accentDim: '#e8c0c0', accentGlow: 'rgba(200,40,40,0.25)',
      led: '#c03030', gridLine: '#e0c0c0', waveStroke: '#aa2020',
      label: '#8a4040', labelActive: '#7a1010',
      panelBg: '#ece4e4', panelBgAlt: '#e4dbdb', panelBorder: '#d8c8c8', panelBorderLight: '#c8b0b0',
      chassisBg: '#ddd4d4', chassisBorder: '#ccc0c0',
      viewportBg: '#f4f0f0', viewportBorder: '#d8c0c0',
      textPrimary: '#5a1a1a', textSecondary: '#8a4a4a', textDim: '#aa8080',
      knobFace: '#e0d4d4', knobHighlight: '#f0e4e4', knobBorder: '#c8b0b0', knobIndicator: '#c03030',
      switchTrack: '#d4c8c8', switchThumb: '#bab0b0', switchThumbActive: '#9a7a7a',
      divider: '#d4c0c0', insetShadow: 'rgba(40,0,0,0.12)',
    },
  },
  {
    name: 'GHOST',
    dark: {
      accent: '#6a6a7a', accentDim: '#1a1a2a', accentGlow: 'rgba(180,180,220,0.25)',
      led: '#b0b0c0', gridLine: '#1a1a2a', waveStroke: '#6a6a8a',
      label: '#7a7a8a', labelActive: '#b0b0c0',
      panelBg: '#242426', panelBgAlt: '#1f1f22', panelBorder: '#303035', panelBorderLight: '#40404a',
      chassisBg: '#1a1a1d', chassisBorder: '#2a2a30',
      viewportBg: '#08080a', viewportBorder: '#1a1a24',
      textPrimary: '#9090a0', textSecondary: '#6a6a7a', textDim: '#4a4a5a',
      knobFace: '#28282e', knobHighlight: '#3a3a44', knobBorder: '#3a3a44', knobIndicator: '#b0b0c0',
      switchTrack: '#1a1a20', switchThumb: '#4a4a54', switchThumbActive: '#6a6a7a',
      divider: '#2a2a34', insetShadow: 'rgba(0,0,20,0.6)',
    },
    light: {
      accent: '#6a6a80', accentDim: '#d0d0dc', accentGlow: 'rgba(100,100,150,0.2)',
      led: '#5a5a70', gridLine: '#c8c8d4', waveStroke: '#6a6a80',
      label: '#7a7a8a', labelActive: '#3a3a50',
      panelBg: '#e8e8ec', panelBgAlt: '#e0e0e5', panelBorder: '#ccccda', panelBorderLight: '#babac8',
      chassisBg: '#dcdce2', chassisBorder: '#c4c4d0',
      viewportBg: '#f0f0f4', viewportBorder: '#c4c4d0',
      textPrimary: '#2a2a3a', textSecondary: '#6a6a7a', textDim: '#9a9aaa',
      knobFace: '#d8d8e0', knobHighlight: '#eaeaf0', knobBorder: '#babac8', knobIndicator: '#5a5a70',
      switchTrack: '#ccccda', switchThumb: '#b0b0bc', switchThumbActive: '#8888a0',
      divider: '#c8c8d4', insetShadow: 'rgba(0,0,30,0.1)',
    },
  },
];

export function getTheme(name: string, mode: 'dark' | 'light'): PanelTheme {
  const base = THEME_BASES.find((t) => t.name === name) || THEME_BASES[0];
  return { name: base.name, mode, ...base[mode] };
}

export const THEME_NAMES = THEME_BASES.map((t) => t.name);

// For backwards compat
export const THEMES = THEME_BASES.map((t) => getTheme(t.name, 'dark'));

interface ThemeSelectorProps {
  activeTheme: string;
  mode: 'dark' | 'light';
  onSelect: (name: string) => void;
  onToggleMode: () => void;
}

export function ThemeSelector({ activeTheme, mode, onSelect, onToggleMode }: ThemeSelectorProps) {
  const isLight = mode === 'light';
  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="mb-2 pb-2 uppercase tracking-wider flex items-center justify-between"
        style={{
          fontSize: '11px',
          color: isLight ? '#7a7a7a' : '#6a6a6a',
          fontFamily: 'monospace',
          letterSpacing: '0.15em',
          borderBottom: `1px solid ${isLight ? '#c8c8c8' : '#2a2a2a'}`,
        }}
      >
        <span>Chromatic Mode</span>
      </div>

      {/* Light / Dark toggle */}
      <button
        onClick={onToggleMode}
        className="flex items-center gap-3 py-2 px-2 rounded-sm mb-1"
        style={{
          background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${isLight ? '#d0d0d0' : '#333'}`,
          transition: 'all 0.4s',
        }}
      >
        <div
          className="relative rounded-sm overflow-hidden"
          style={{
            width: '36px',
            height: '18px',
            background: isLight
              ? 'linear-gradient(to right, #e0e0e0, #c0c0c0)'
              : 'linear-gradient(to right, #1a1a1a, #2a2a2a)',
            border: `1px solid ${isLight ? '#b0b0b0' : '#444'}`,
            transition: 'all 0.4s',
          }}
        >
          <div
            className="absolute top-0.5 rounded-[2px] transition-all duration-300"
            style={{
              width: '15px',
              height: '14px',
              left: isLight ? '18px' : '2px',
              background: isLight
                ? 'linear-gradient(to bottom, #f8f8f8, #e0e0e0)'
                : 'linear-gradient(to bottom, #5a5a5a, #3a3a3a)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
            }}
          />
        </div>
        <span
          style={{
            fontSize: '10px',
            fontFamily: 'monospace',
            letterSpacing: '0.12em',
            color: isLight ? '#555' : '#888',
            transition: 'color 0.4s',
          }}
        >
          {isLight ? 'LIGHT' : 'DARK'}
        </span>
      </button>

      {THEME_NAMES.map((name) => {
        const active = activeTheme === name;
        const t = getTheme(name, mode);
        return (
          <button
            key={name}
            onClick={() => onSelect(name)}
            className="flex items-center gap-3 py-2 px-2 rounded-sm"
            style={{
              background: active
                ? isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.04)'
                : 'transparent',
              transition: 'background 0.3s',
            }}
          >
            <div
              className="w-3.5 h-3.5 rounded-full shrink-0"
              style={{
                background: active
                  ? `radial-gradient(circle, ${t.led} 0%, ${t.accent} 70%)`
                  : t.accentDim,
                boxShadow: active ? `0 0 8px ${t.accentGlow}` : `inset 0 1px 2px ${t.insetShadow}`,
                border: `1px solid ${active ? t.accent : isLight ? '#ccc' : '#333'}`,
                transition: 'all 0.5s',
              }}
            />
            <span
              style={{
                fontSize: '11px',
                fontFamily: 'monospace',
                letterSpacing: '0.1em',
                color: active ? t.textPrimary : t.textDim,
                transition: 'color 0.5s',
              }}
            >
              {name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
