# Architecture

## Application structure

`src/main.tsx` mounts the application. `src/app/App.tsx` owns the console's selected engine, source, hardware mode, overlays, image URL, theme, and parameter state. `src/app/model.ts` is the small domain layer: it exports fixed control catalogs, default parameters, bounded updates, and the pointer-reactive engine rule.

The UI controls are split into focused components: `ToggleSwitch`, `RotaryKnob`, and `ThemeSelector`. `RotaryKnob` provides pointer drag and keyboard slider interactions while preserving its accessible slider semantics.

## Signal monitor

`SignalViewport` owns the Canvas drawing loop and rendering-only refs. It receives the current application state as props, draws the selected procedural engine and source, and keeps transient pointer input outside React state so that pointer motion does not trigger layout work. The image source is drawn only after a load event; externally hosted images must be CORS-enabled before Canvas can use them.

## Rendering and motion

The viewport uses `requestAnimationFrame`, limits device-pixel-ratio scaling, throttles pointer updates, pauses rendering while the document is hidden, and observes `prefers-reduced-motion`. Responsive CSS moves the console from three columns through compact layouts to a single-column mobile view.

## Public boundaries

The app is deliberately self-contained: it has no API, analytics, authentication, remote default imagery, or client data. The bundled sample SVG is the only default image asset. See [ATTRIBUTIONS.md](../ATTRIBUTIONS.md) for provenance.
