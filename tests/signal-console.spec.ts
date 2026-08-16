import { expect, test } from '@playwright/test';

test.describe('Signal Console', () => {
  test('renders without browser errors or warnings', async ({ page }) => {
    const issues: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error' || message.type() === 'warning') issues.push(`${message.type()}: ${message.text()}`);
    });

    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'PATTERN COMPUTER 01' })).toBeVisible();
    await expect(page.getByRole('img', { name: /visualization/i })).toBeVisible();
    expect(issues).toEqual([]);
  });

  test('switches every pattern engine and signal source', async ({ page }) => {
    await page.goto('/');

    for (const engine of ['DOT FIELD', 'NODE MESH', 'SCANLINE FIELD', 'ECHO TRAILS', 'TYPE DISTORTION']) {
      await page.getByRole('radio', { name: engine }).click();
      await expect(page.getByText(`${engine} — SIGNAL MONITOR`)).toBeVisible();
    }

    for (const source of ['GRID', 'NOISE FIELD', 'TEXT SAMPLE', 'IMAGE INPUT']) {
      await page.getByRole('button', { name: source, exact: true }).click();
      await expect(page.getByRole('button', { name: source, exact: true })).toHaveAttribute('aria-pressed', 'true');
    }

    await expect(page.locator('#image-url')).toHaveValue('/signal-sample.svg');
  });

  test('supports keyboard parameter adjustments', async ({ page }) => {
    await page.goto('/');
    const density = page.getByRole('slider', { name: 'density parameter' });

    await density.focus();
    await density.press('Home');
    await expect(density).toHaveAttribute('aria-valuenow', '0');
    await density.press('ArrowRight');
    await expect(density).toHaveAttribute('aria-valuenow', '1');
    await density.press('End');
    await expect(density).toHaveAttribute('aria-valuenow', '100');
  });

  test('changes hardware and theme modes', async ({ page }) => {
    await page.goto('/');

    for (const mode of ['SOVIET RADAR', 'DIGITAL SYNTH TERMINAL', 'APOLLO AVIONICS']) {
      await page.getByRole('button', { name: mode, exact: true }).click();
      await expect(page.getByRole('button', { name: mode, exact: true })).toHaveAttribute('aria-pressed', 'true');
    }

    await page.getByRole('button', { name: 'Activate light chromatic mode' }).click();
    await expect(page.getByRole('button', { name: 'Activate dark chromatic mode' })).toBeVisible();
  });

  test('exposes pointer-reactive interaction guidance', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('radio', { name: 'ECHO TRAILS' }).click();
    await expect(page.getByText('MOVE POINTER THROUGH FIELD')).toBeVisible();

    const viewport = page.getByRole('img', { name: /visualization/i });
    await viewport.hover();
  });

  test('keeps the interface within a compact mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'PATTERN COMPUTER 01' })).toBeVisible();
    await expect(page.getByRole('slider', { name: 'frequency parameter' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });

  test('honors reduced-motion preferences without errors', async ({ page }) => {
    const issues: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') issues.push(message.text());
    });

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.getByRole('img', { name: /visualization/i })).toBeVisible();
    expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true);
    expect(issues).toEqual([]);
  });
});
