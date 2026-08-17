# Architecture

## Application structure

`src/main.tsx` mounts the application. `src/app/App.tsx` owns selected engine, source, hardware mode, overlays, image URL, theme, and parameter state. `src/app/model.ts` defines the control catalogs, default parameters, bounded updates, and pointer-reactive engines.

The UI controls are split into focused components: `ToggleSwitch`, `RotaryKnob`, and `ThemeSelector`. `RotaryKnob` provides pointer drag and keyboard slider interactions while preserving its accessible slider semantics.

## Signal monitor

`SignalViewport` owns the Canvas drawing loop and rendering refs. It receives application state as props, draws the selected engine and source, and keeps transient pointer input outside React state to avoid rendering the page on every pointer move. The image source is drawn after it loads; external images must allow CORS before Canvas can sample them.

## Rendering and motion

The viewport uses `requestAnimationFrame`, caps device-pixel-ratio scaling, throttles pointer updates, pauses while the document is hidden, and observes `prefers-reduced-motion`. Responsive CSS moves the console from three columns to compact and single-column layouts.

## Public boundaries

The app has no API, analytics, authentication, remote default imagery, or client data. The bundled sample SVG is the only default image asset. See [ATTRIBUTIONS.md](../ATTRIBUTIONS.md) for provenance.
