import { useRef, useEffect } from 'react';
import type { PanelTheme } from './ThemeSelector';

interface SignalViewportProps {
  activeModule: string;
  theme: PanelTheme;
  params: { density: number; phase: number; decay: number; frequency: number };
  inputSource?: string;
  imageUrl?: string;
  showCalibration?: boolean;
  hardwareMode?: string;
  signalDrift?: boolean;
}

export function SignalViewport({ activeModule, theme, params, inputSource = 'GRID', imageUrl, showCalibration, hardwareMode = 'APOLLO AVIONICS', signalDrift = false }: SignalViewportProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const cursorHistoryRef = useRef<{ x: number; y: number; t: number }[]>([]);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const pixelDataRef = useRef<Uint8ClampedArray | null>(null);

  useEffect(() => {
    imgRef.current = null;
    pixelDataRef.current = null;
    if (!imageUrl) return;

    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (cancelled) return;
      imgRef.current = img; 
      const offscreen = document.createElement('canvas');
      offscreen.width = 256;
      offscreen.height = 256;
      const octx = offscreen.getContext('2d', { willReadFrequently: true });
      if (octx) {
        try {
          octx.drawImage(img, 0, 0, 256, 256);
          pixelDataRef.current = octx.getImageData(0, 0, 256, 256).data;
        } catch {
          // Image pixel data is unavailable when a user-provided remote image
          // does not grant the CORS permission required for canvas sampling.
          pixelDataRef.current = null;
        }
      }
    };
    img.onerror = () => {
      if (!cancelled) {
        imgRef.current = null;
        pixelDataRef.current = null;
      }
    };
    img.src = imageUrl;

    return () => {
      cancelled = true;
    };
  }, [imageUrl]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;
    if (!ctx || !parent) return;
    let running = true;
    let animationFrame = 0;
    let devicePixelRatio = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      devicePixelRatio = window.devicePixelRatio || 1;
      canvas.width = Math.round(rect.width * devicePixelRatio);
      canvas.height = Math.round(rect.height * devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(parent);

    const draw = () => {
      if (!running) return;
      const w = canvas.width / devicePixelRatio;
      const h = canvas.height / devicePixelRatio;
      timeRef.current += 0.016;
      const t = timeRef.current;

      const getBrightness = (x: number, y: number): number => {
        if (!pixelDataRef.current || inputSource !== 'IMAGE INPUT') return 1;
        const px = Math.floor((x / w) * 255);
        const py = Math.floor((y / h) * 255);
        const safeX = Math.max(0, Math.min(255, px));
        const safeY = Math.max(0, Math.min(255, py));
        const idx = (safeY * 256 + safeX) * 4;
        const d = pixelDataRef.current;
        return (d[idx] + d[idx+1] + d[idx+2]) / 765;
      };

      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const isSoviet = hardwareMode === 'SOVIET RADAR';
      const isSynth = hardwareMode === 'DIGITAL SYNTH TERMINAL';
      const lineWidthMult = isSoviet ? 1.8 : (isSynth ? 0.6 : 1);

      // --- Substrate Background based on Input Source ---
      if (inputSource === 'GRID') {
        ctx.strokeStyle = theme.gridLine;
        ctx.lineWidth = isSoviet ? 1.5 : (isSynth ? 0.3 : 0.5);
        ctx.globalAlpha = isSoviet ? 0.5 : 0.3;
        const gridSize = isSoviet ? 30 : 20;
        for (let x = 0; x < w; x += gridSize) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (let y = 0; y < h; y += gridSize) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }
      } else if (inputSource === 'NOISE FIELD') {
        ctx.fillStyle = theme.textDim;
        for (let i = 0; i < 800; i++) {
          ctx.globalAlpha = Math.random() * 0.2;
          const nx = Math.random() * w;
          const ny = Math.random() * h;
          ctx.fillRect(nx, ny, 1.5, 1.5);
        }
      } else if (inputSource === 'TEXT SAMPLE') {
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = theme.textSecondary;
        ctx.font = '12px monospace';
        const textSample = `01001101 01100001 01101011 01100101
SYSTEM READY ...
AWAITING INPUT
BUFFER: 0x8F9A
MEMORY: ALLOCATED
SIGNAL: ACQUIRING

> RUN SEQUENCE alpha-09
> INITIALIZING PHASE
> COMPUTE CYCLES: OPTIMAL
> SYNC: ${(t % 100).toFixed(2)}`;
        const lines = textSample.split('\n');
        for (let i = 0; i < lines.length; i++) {
          ctx.fillText(lines[i], 20, 40 + i * 22);
        }
      } else if (inputSource === 'IMAGE INPUT') {
        if (imgRef.current) {
          ctx.globalAlpha = 0.15;
          ctx.drawImage(imgRef.current, 0, 0, w, h);
        }
      }
      ctx.globalAlpha = 1;

      const dens = params.density / 100;
      const ph = (params.phase / 100) * Math.PI * 2;
      const dec = params.decay / 100;
      const freq = (params.frequency / 100) * 6 + 0.5;

      // Introduce both slow drift and high-frequency jitter
      const driftX = signalDrift ? Math.sin(t * 0.4) * 4 : 0;
      const driftY = signalDrift ? Math.cos(t * 0.3) * 3 : 0;
      const jitterX = signalDrift ? driftX + (Math.random() - 0.5) * (freq * 1.8) : 0;
      const jitterY = signalDrift ? driftY + (Math.random() - 0.5) * (freq * 1.8) : 0;

      ctx.save();
      ctx.translate(jitterX, jitterY);

      if (activeModule === 'DOT FIELD') {
        const count = Math.floor(40 + dens * 400);
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        const cursorRadius = 100;

        // Precompute edge fade gradient (radial vignette)
        const cx = w / 2;
        const cy = h / 2;
        const maxEdgeDist = Math.sqrt(cx * cx + cy * cy);

        for (let i = 0; i < count; i++) {
          const seed = i * 1.618033988;
          const baseX = ((seed * 137.508 + t * 8 * (1 - dec)) % w + w) % w;
          const baseY = ((seed * 97.324 + Math.sin(t * freq + i * ph * 0.1) * 30) % h + h) % h;

          // Edge fade: distance from center normalized
          const edgeDx = baseX - cx;
          const edgeDy = baseY - cy;
          const edgeDist = Math.sqrt(edgeDx * edgeDx + edgeDy * edgeDy);
          const edgeFade = Math.max(0, 1 - (edgeDist / maxEdgeDist) * 1.3);

          // Cursor proximity: enlarge dots near mouse
          const mdx = baseX - mx;
          const mdy = baseY - my;
          const mouseDist = Math.sqrt(mdx * mdx + mdy * mdy);
          const cursorInfluence = Math.max(0, 1 - mouseDist / cursorRadius);

          const b = getBrightness(baseX, baseY);
          const baseR = 0.8 + dens * 2;
          let r = baseR + cursorInfluence * 4 + Math.sin(t * 2 + i) * 0.3;
          if (inputSource === 'IMAGE INPUT') r *= (b * 2.5 + 0.2);

          const alpha = (0.15 + dec * 0.5 + cursorInfluence * 0.4) * edgeFade;

          if (alpha < 0.01) continue;

          ctx.beginPath();
          ctx.arc(baseX, baseY, r, 0, Math.PI * 2);
          ctx.fillStyle = theme.led;
          ctx.globalAlpha = Math.min(1, alpha);
          ctx.fill();

          // Glow ring near cursor
          if (cursorInfluence > 0.3) {
            ctx.beginPath();
            ctx.arc(baseX, baseY, r + 2, 0, Math.PI * 2);
            ctx.strokeStyle = theme.accentGlow;
            ctx.lineWidth = 0.5;
            ctx.globalAlpha = cursorInfluence * 0.4 * edgeFade;
            ctx.stroke();
          }
        }
      } else if (activeModule === 'NODE MESH') {
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        const cursorRadius = 120;
        const nodes: [number, number][] = [];
        const count = Math.floor(12 + dens * 50);
        const connectionDist = 40 + ph * 80 / (Math.PI * 2); // PHASE controls max connection distance

        // Generate nodes with organic motion
        for (let i = 0; i < count; i++) {
          const seed1 = ((i * 1.618033988 * 137.508) % 1);
          const seed2 = ((i * 1.618033988 * 97.324) % 1);
          const x = w * 0.05 + (w * 0.9) * seed1
            + Math.sin(t * freq * 0.4 + i * 1.7) * 15;
          const y = h * 0.05 + (h * 0.9) * seed2
            + Math.cos(t * freq * 0.3 + i * 2.1) * 15;
          nodes.push([x, y]);
        }

        // Draw connections with DECAY-based opacity falloff per distance
        ctx.lineWidth = 0.8 * lineWidthMult;
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i][0] - nodes[j][0];
            const dy = nodes[i][1] - nodes[j][1];
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < connectionDist) {
              const distRatio = dist / connectionDist;
              // DECAY controls how aggressively lines fade with distance
              const fadeExponent = 0.5 + dec * 3;
              const lineAlpha = Math.pow(1 - distRatio, fadeExponent) * (0.15 + dec * 0.5);

              // Cursor brightening for nearby connections
              const midX = (nodes[i][0] + nodes[j][0]) / 2;
              const midY = (nodes[i][1] + nodes[j][1]) / 2;
              const mDist = Math.sqrt((midX - mx) ** 2 + (midY - my) ** 2);
              const cursorBoost = Math.max(0, 1 - mDist / cursorRadius) * 0.4;

              ctx.beginPath();
              ctx.moveTo(nodes[i][0], nodes[i][1]);
              ctx.lineTo(nodes[j][0], nodes[j][1]);
              ctx.strokeStyle = theme.waveStroke;
              ctx.globalAlpha = Math.min(1, lineAlpha + cursorBoost);
              ctx.stroke();
            }
          }
        }

        // Draw nodes
        nodes.forEach(([x, y]) => {
          const mDist = Math.sqrt((x - mx) ** 2 + (y - my) ** 2);
          const cursorInfluence = Math.max(0, 1 - mDist / cursorRadius);
          
          const b = getBrightness(x, y);
          let r = 2 + cursorInfluence * 3;
          if (inputSource === 'IMAGE INPUT') r *= (b * 2.5 + 0.2);

          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = theme.led;
          ctx.globalAlpha = 0.5 + cursorInfluence * 0.5;
          ctx.fill();

          if (cursorInfluence > 0.2) {
            ctx.beginPath();
            ctx.arc(x, y, r + 4, 0, Math.PI * 2);
            ctx.strokeStyle = theme.accentGlow;
            ctx.lineWidth = 0.5;
            ctx.globalAlpha = cursorInfluence * 0.3;
            ctx.stroke();
          }
        });
      } else if (activeModule === 'SCANLINE FIELD') {
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        const cursorRadius = 140;
        const lineCount = Math.floor(8 + dens * 40);
        const spacing = h / (lineCount + 1);

        for (let l = 0; l < lineCount; l++) {
          const yBase = spacing * (l + 1);
          ctx.beginPath();

            // Alternating line thickness for depth
          const isHeavy = l % 4 === 0;
          ctx.lineWidth = (isHeavy ? 1.5 : 0.8) * lineWidthMult;

          for (let x = 0; x <= w; x += 1.5) {
            // FREQUENCY controls wave density, PHASE controls wave offset motion over time
            const waveFreq = 0.005 + freq * 0.008;
            const phaseOffset = t * (0.5 + ph * 1.5);
            const waveAmp = 4 + dec * 25;

            // Layered sine distortion
            const sine1 = Math.sin(x * waveFreq + phaseOffset + l * 0.4) * waveAmp;
            const sine2 = Math.sin(x * waveFreq * 2.3 + phaseOffset * 0.7 - l * 0.2) * waveAmp * 0.3;
            const sine3 = Math.sin(x * waveFreq * 0.4 + phaseOffset * 1.3 + l * 0.8) * waveAmp * 0.5;

            const b = getBrightness(x, yBase);
            let imageMod = 0;
            if (inputSource === 'IMAGE INPUT') imageMod = (b - 0.5) * (15 + waveAmp * 2);

            let yOffset = sine1 + sine2 + sine3 + imageMod;

            // Cursor repulsion: push scanlines away from cursor
            const dy = yBase + yOffset - my;
            const dx = x - mx;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const cursorPush = Math.max(0, 1 - dist / cursorRadius);
            yOffset += cursorPush * dy * 0.6;

            const y = yBase + yOffset;

            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }

          // Edge fade for each line
          const edgeFade = Math.min(1, Math.min(yBase, h - yBase) / (h * 0.15));

          // Cursor proximity brightness
          const lineMidDist = Math.abs(yBase - my);
          const cursorBright = Math.max(0, 1 - lineMidDist / cursorRadius) * 0.4;

          ctx.strokeStyle = theme.waveStroke;
          ctx.globalAlpha = Math.min(1, (0.1 + dec * 0.4 + cursorBright) * edgeFade);
          ctx.stroke();

          // Glow pass for heavy lines
          if (isHeavy && edgeFade > 0.3) {
            ctx.shadowColor = theme.accentGlow;
            ctx.shadowBlur = isSoviet ? 8 : 4;
            ctx.globalAlpha *= isSoviet ? 0.8 : 0.5;
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        }

        // Horizontal reference line at center
        ctx.beginPath();
        ctx.moveTo(0, h / 2);
        ctx.lineTo(w, h / 2);
        ctx.strokeStyle = theme.accent;
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = 0.15;
        ctx.setLineDash([4, 8]);
        ctx.stroke();
        ctx.setLineDash([]);
      } else if (activeModule === 'ECHO TRAILS') {
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        
        // Add current mouse position if it's within canvas
        if (mx > -100 && my > -100) {
          cursorHistoryRef.current.push({ x: mx, y: my, t });
        }
        
        // DECAY controls persistence/history length
        const maxAge = 0.2 + dec * 4.8; // 0.2s to 5s
        
        // Filter out old positions
        cursorHistoryRef.current = cursorHistoryRef.current.filter(pt => (t - pt.t) < maxAge);
        
        // DENSITY controls spacing between echoes
        const trailSpacing = Math.max(2, 40 - dens * 38);
        
        let lastDrawn: {x: number, y: number} | null = null;
        
        // Draw the echoes
        for (let i = 0; i < cursorHistoryRef.current.length; i++) {
          const pt = cursorHistoryRef.current[i];
          
          if (lastDrawn) {
            const dist = Math.sqrt((pt.x - lastDrawn.x)**2 + (pt.y - lastDrawn.y)**2);
            if (dist < trailSpacing) continue;
          }
          
          lastDrawn = pt;
          const age = t - pt.t;
          const progress = age / maxAge; // 0 (new) to 1 (old)
          
          const alpha = Math.max(0, 1 - progress);
          const b = getBrightness(pt.x, pt.y);
          let radius = 8 + progress * (20 + (params.phase / 100) * 40); // PHASE adds size expansion
          if (inputSource === 'IMAGE INPUT') radius *= (b * 1.5 + 0.2);
          
          // Draw Outer Ring
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
          ctx.strokeStyle = theme.waveStroke;
          ctx.lineWidth = 1.5 * lineWidthMult;
          ctx.globalAlpha = alpha * (0.4 + dec * 0.6);
          ctx.stroke();
          
          // Draw Crosshair
          ctx.beginPath();
          ctx.moveTo(pt.x - radius - 4, pt.y); ctx.lineTo(pt.x - radius + 4, pt.y);
          ctx.moveTo(pt.x + radius - 4, pt.y); ctx.lineTo(pt.x + radius + 4, pt.y);
          ctx.moveTo(pt.x, pt.y - radius - 4); ctx.lineTo(pt.x, pt.y - radius + 4);
          ctx.moveTo(pt.x, pt.y + radius - 4); ctx.lineTo(pt.x, pt.y + radius + 4);
          ctx.strokeStyle = theme.accentGlow;
          ctx.globalAlpha = alpha * 0.8;
          ctx.stroke();
          
          // Inner core
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, radius * 0.2, 0, Math.PI * 2);
          ctx.fillStyle = theme.led;
          ctx.globalAlpha = alpha * 0.5;
          ctx.fill();
        }
        
      } else if (activeModule === 'TYPE DISTORTION') {
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        const cursorRadius = 180;
        
        const chars = 'ABCDEF0123456789∿◇△▽●○□■/\\|=-+';
        const fontSize = 10 + dens * 14;
        ctx.font = `${fontSize}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const cols = Math.floor(10 + dens * 40);
        const rows = Math.floor(8 + dens * 30);
        
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const baseX = (w / cols) * (c + 0.5);
            const baseY = (h / rows) * (r + 0.5);
            
            const dx = baseX - mx;
            const dy = baseY - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const cursorInfluence = Math.max(0, 1 - dist / cursorRadius);
            
            // Distort position
            const waveX = Math.sin(t * freq * 2 + r * ph * 3 + c) * (2 + dec * 15) * (1 + cursorInfluence * 3);
            const waveY = Math.cos(t * freq * 1.5 + c * ph * 3 + r) * (2 + dec * 15) * (1 + cursorInfluence * 3);
            
            const x = baseX + waveX;
            const y = baseY + waveY;
            
            // Distort char selection
            let charSpeed = t * 3 + r * 7 + c * 3;
            charSpeed += cursorInfluence * 20; // Cursor speeds up char rotation
            let ci = Math.floor(charSpeed % chars.length);
            
            const b = getBrightness(x, y);
            if (inputSource === 'IMAGE INPUT') {
               ci = Math.floor(b * (chars.length - 1));
            }
            
            ctx.fillStyle = theme.led;
            const baseAlpha = 0.15 + dec * 0.6 + Math.sin(t * 4 + r + c) * 0.2;
            ctx.globalAlpha = Math.min(1, baseAlpha + cursorInfluence * 0.8);
            
            ctx.fillText(chars[ci], x, y);
            
            // Add a small box around highly influenced characters
            if (cursorInfluence > 0.3) {
               ctx.strokeStyle = theme.accentGlow;
               ctx.lineWidth = 1;
               ctx.globalAlpha = cursorInfluence * 0.6 * baseAlpha;
               ctx.strokeRect(x - fontSize*0.6, y - fontSize*0.6, fontSize*1.2, fontSize*1.2);
            }
          }
        }
      }

      // Calibration overlay
      if (showCalibration) {
        ctx.strokeStyle = theme.accent;
        ctx.fillStyle = theme.accent;
        ctx.lineWidth = hardwareMode === 'DIGITAL SYNTH TERMINAL' ? 0.5 : (hardwareMode === 'SOVIET RADAR' ? 2 : 1);
        ctx.globalAlpha = hardwareMode === 'SOVIET RADAR' ? 0.6 : 0.4;
        
        if (hardwareMode === 'SOVIET RADAR') {
           // Circular radar sweep
           ctx.beginPath();
           ctx.arc(w/2, h/2, Math.min(w,h)/2.2, 0, Math.PI * 2);
           ctx.stroke();
           ctx.beginPath();
           ctx.arc(w/2, h/2, Math.min(w,h)/3.5, 0, Math.PI * 2);
           ctx.stroke();
           
           // Radar sweep line
           const sweepAngle = (t * 2) % (Math.PI * 2);
           ctx.beginPath();
           ctx.moveTo(w/2, h/2);
           ctx.lineTo(w/2 + Math.cos(sweepAngle) * Math.min(w,h)/2.2, h/2 + Math.sin(sweepAngle) * Math.min(w,h)/2.2);
           ctx.stroke();
           
           // Glow for radar sweep
           ctx.beginPath();
           ctx.moveTo(w/2, h/2);
           ctx.arc(w/2, h/2, Math.min(w,h)/2.2, sweepAngle - 0.2, sweepAngle, false);
           ctx.lineTo(w/2, h/2);
           ctx.fillStyle = theme.accentGlow;
           ctx.globalAlpha = 0.2;
           ctx.fill();
        } else {
          // Center crosshairs
          ctx.beginPath();
          if (hardwareMode === 'APOLLO AVIONICS') ctx.setLineDash([4, 4]);
          ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h);
          ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2);
          ctx.stroke();
          ctx.setLineDash([]);
          
          // Center reticle
          ctx.beginPath();
          ctx.arc(w / 2, h / 2, 30, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(w / 2, h / 2, 2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Measurement ticks
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        for(let i = 0; i < w; i += 50) {
           ctx.moveTo(i, h/2 - 5); ctx.lineTo(i, h/2 + 5);
        }
        for(let i = 0; i < h; i += 50) {
           ctx.moveTo(w/2 - 5, i); ctx.lineTo(w/2 + 5, i);
        }
        ctx.stroke();

        // Corner brackets
        if (hardwareMode !== 'SOVIET RADAR') {
          const cl = 20; 
          ctx.lineWidth = hardwareMode === 'DIGITAL SYNTH TERMINAL' ? 1 : 2;
          ctx.beginPath();
          ctx.moveTo(15, 15 + cl); ctx.lineTo(15, 15); ctx.lineTo(15 + cl, 15);
          ctx.moveTo(w - 15 - cl, 15); ctx.lineTo(w - 15, 15); ctx.lineTo(w - 15, 15 + cl);
          ctx.moveTo(w - 15, h - 15 - cl); ctx.lineTo(w - 15, h - 15); ctx.lineTo(w - 15 - cl, h - 15);
          ctx.moveTo(15 + cl, h - 15); ctx.lineTo(15, h - 15); ctx.lineTo(15, h - 15 - cl);
          ctx.stroke();
        }

        // Text markers
        ctx.globalAlpha = 0.7;
        ctx.font = hardwareMode === 'DIGITAL SYNTH TERMINAL' ? '9px monospace' : '10px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('X-AXIS: SYNC', 25, h / 2 - 10);
        ctx.fillText('Y-AXIS: AMP', w / 2 + 10, 25);
        ctx.textAlign = 'right';
        ctx.fillText(`FRQ: ${(freq * 10).toFixed(1)}Hz`, w - 25, h - 25);
        ctx.fillText(`PHS: ${(ph).toFixed(2)}`, w - 25, h - 40);
        ctx.globalAlpha = 1;
      }
      
      // Hardware-specific ambient overlays
      if (hardwareMode === 'APOLLO AVIONICS') {
        // Faint CRT scanlines
        ctx.globalAlpha = 0.05;
        ctx.fillStyle = '#fff';
        for (let y = 0; y < h; y += 3) {
          ctx.fillRect(0, y, w, 1);
        }
        // CRT Vignette
        const gradient = ctx.createRadialGradient(w/2, h/2, h/3, w/2, h/2, h*0.8);
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(1, 'rgba(0,0,0,0.5)');
        ctx.globalAlpha = 1;
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      } else if (hardwareMode === 'DIGITAL SYNTH TERMINAL') {
        // Pixel grid
        ctx.globalAlpha = 0.02;
        ctx.fillStyle = theme.accent;
        for (let y = 0; y < h; y += 4) ctx.fillRect(0, y, w, 1);
        for (let x = 0; x < w; x += 4) ctx.fillRect(x, 0, 1, h);
        ctx.globalAlpha = 1;
      }
      
      ctx.restore();

      animationFrame = requestAnimationFrame(draw);
    };

    animationFrame = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
      resizeObserver.disconnect();
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [activeModule, theme, params, inputSource, showCalibration, hardwareMode, signalDrift]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ transition: 'opacity 0.5s' }}
    />
  );
}
