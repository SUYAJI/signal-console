# Testing

## Fast release check

Run the complete fast gate with:

```bash
npm run check
```

This runs `tsc --noEmit`, the Vitest unit suite, and `vite build`.

## Unit tests

```bash
npm run test:unit
```

The unit suite covers the fixed engine/source/hardware catalogs, default parameter values, numeric clamping, immutable parameter updates, and the pointer-reactive engine rule in `src/app/model.ts`.

## Browser tests

```bash
npm run test:e2e
```

Playwright starts Vite and runs Chromium coverage for startup browser errors and warnings, engine/source selection, image-input defaults, keyboard parameters, hardware/theme switching, pointer-reactive guidance, reduced-motion emulation, and a compact mobile viewport. Reports and failure artifacts are intentionally ignored by Git.

The automated suite does not claim to test a browser's hidden-tab animation scheduling; that behavior is covered in the renderer by the `document.hidden` check and should be included in manual browser review when relevant.

## Manual review

For a release candidate, inspect the app at 1440×900, 1280×720, 768×1024, 390×844, and 360×800. Check all pattern engines, sources, themes, and hardware modes; confirm no console errors; and verify pointer interaction and focus visibility.
