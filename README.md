
# Signal Console

Signal Console is an interactive visual signal laboratory: a browser-based control panel for exploring procedural patterns, sources, parameters, hardware modes, and chromatic themes.

**Live demo:** deployment pending.

## Overview

The console pairs tactile controls with a Canvas-rendered signal monitor. It is a self-contained front-end experiment, not a client project or production service.

### Systems

- **Pattern engines:** Dot Field, Node Mesh, Scanline Field, Echo Trails, and Type Distortion.
- **Signal sources:** Grid, Noise Field, Text Sample, and Image Input.
- **Hardware modes:** Apollo Avionics, Soviet Radar, and Digital Synth Terminal.
- **Parameters:** Density, phase, decay, and frequency.
- **Themes:** Phosphor, Amber, Cobalt, Crimson, and Ghost in light or dark chromatic modes.

## Interaction

Select an engine, source, hardware mode, or theme with the console controls. Drag a knob vertically to adjust a parameter, or focus it and use the arrow keys; Home and End set its minimum and maximum values. Echo Trails and Type Distortion also react to pointer movement in the signal monitor.

Image Input starts with the bundled `/signal-sample.svg`. Remote image URLs must allow CORS for browsers to render them onto the Canvas.

## Technology

- React 18 and TypeScript
- Vite and Tailwind CSS utilities
- Canvas 2D rendering
- Vitest unit coverage and Playwright Chromium end-to-end coverage

## Accessibility and responsive behavior

The controls use native buttons, radio semantics, pressed state, labelled sliders, keyboard parameter controls, visible focus states, and touch-friendly pointer handling. The layout reflows from a three-panel console to compact stacked views, and the renderer honors reduced-motion preferences and pauses work when the document is hidden.

## Local development

```bash
npm install
npm run dev
```

## Verification

```bash
npm run check
npm run test:e2e
npm audit
```

`check` runs TypeScript validation, unit tests, and the production build. `test:e2e` launches the local app and exercises Chromium.

## Project documentation

- [Architecture](docs/architecture.md)
- [Testing](docs/testing.md)
- [Attributions](ATTRIBUTIONS.md)

## Provenance

Signal Console began as a Figma Make prototype. Its exported application was audited and converted into this conventional React/TypeScript/Vite repository; generated scaffold and unused dependencies were removed. Interaction behavior, responsive layout, accessibility, and the Canvas lifecycle were subsequently hardened. The retained source and attribution record are described in [ATTRIBUTIONS.md](ATTRIBUTIONS.md).
  
