import React, { useEffect, useRef } from 'react';

/**
 * RefractedGlassBackground: Hyper-Realistic High-Density Architectural Reeded Glass Louvers & Animated Aurora
 * 
 * Aesthetic Architecture:
 * 1. Ultra-High Density Transparent Reeded Glass: 28-70+ vertical glass flutes/slats (responsive to screen width)
 *    with optical prism refraction, crisp seam specular catch-lights, and internal cylindrical shading.
 * 2. Raised Atmospheric Horizon: Balanced elevation where the purple/violet aurora rises gracefully
 *    behind the lower hero region, while the top ~38-42% remains pure, deep pitch jet black (#000000) for floating glass navbar clarity.
 * 3. Smooth, Lively Wave Velocity: Sped up just a little bit (tempo: 0.90) for silky, organic multi-frequency undulation.
 * 4. Non-interactable (pointer-events: none), optimized WebGL fragment shader with micro-grain dither.
 */
export default function RefractedGlassBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { 
      alpha: false, 
      depth: false, 
      stencil: false, 
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance' 
    }) || canvas.getContext('experimental-webgl', { preserveDrawingBuffer: true });

    if (!gl) {
      console.warn('WebGL not supported');
      return;
    }

    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = (a_position + 1.0) * 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      varying vec2 v_uv;
      uniform float u_time;
      uniform vec2 u_resolution;

      // Subtle frosted glass micro-grain to eliminate color banding
      float hash(vec2 p) {
        vec3 p3 = fract(vec3(p.xyx) * 0.1031);
        p3 += dot(p3, p3.yzx + 33.33);
        return fract((p3.x + p3.y) * p3.z);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        // Sped up just a little bit: silky, responsive, organic tempo
        float t = u_time * 0.90;

        // 1. Ultra-High Density Transparent Glass Louvers / Reeded Slat Array
        // Responsive high density: ~26px width per glass flute (~30 panels on mobile/tablet, ~55 on desktop)
        float numPanels = max(28.0, floor(u_resolution.x / 26.0));
        
        float panelCoord = uv.x * numPanels;
        float panelIndex = floor(panelCoord);
        float panelFract = fract(panelCoord); // [0.0, 1.0] across each individual glass slat
        
        // Normalized center X of the current glass panel [0.0, 1.0]
        float panelCenterX = (panelIndex + 0.5) / numPanels;

        // 2. Optical Glass Prism Refraction
        // Real cylindrical curvature across each individual vertical glass flute
        float panelNorm = (panelFract - 0.5) * 2.0; // [-1.0, 1.0]
        float lensDeflect = panelNorm * sqrt(max(0.001, 1.0 - 0.5 * panelNorm * panelNorm)) * 0.015;

        // Gentle lateral sway of the wave behind the glass
        float lateralSway = sin(t * 0.65) * 0.035;
        float smoothCenterX = uv.x - 0.5 - lateralSway;
        float steppedCenterX = panelCenterX - 0.5 - lateralSway;

        // Refracted coordinates passed to the aurora wave
        float refractedX = mix(panelCenterX, uv.x, 0.18) + lensDeflect;
        float distCenter = abs(mix(steppedCenterX, smoothCenterX, 0.20)) * 2.0;

        // 3. Symmetrical U-Shaped Aurora Horizon (Raised up a bit)
        float archHeight = pow(clamp(distCenter, 0.0, 1.0), 1.35) * 0.15;
        
        // 4. Fluid Wave Movement & Multi-Frequency Undulation (Sped up slightly)
        // Primary traveling wave across the panels
        float waveFlow1 = sin(refractedX * 5.3 - t * 1.35) * 0.052;
        // Secondary harmonic wave creating organic liquid interference
        float waveFlow2 = cos(refractedX * 8.8 + t * 0.95) * 0.028;
        // Rhythmic breathing / tidal pulse of the luminous aurora core
        float waveBreathe = sin(t * 0.85 + distCenter * 2.8) * 0.038;
        // Micro-ripple across the vertical glass louvers
        float microRipple = cos(panelFract * 3.14159 - t * 0.95) * 0.012;

        // Combined vertical wave elevation
        float yShift = archHeight + waveFlow1 + waveFlow2 + waveBreathe + microRipple;
        
        // Effective vertical coordinate
        float yEffective = uv.y - yShift;

        // 5. Exact Color Palette from Reference Image
        vec3 c_black      = vec3(0.000, 0.000, 0.000); // #000000 Pure Pitch Black Void
        vec3 c_deepIndigo = vec3(0.100, 0.030, 0.400); // #1a0866 Deep Midnight Indigo-Violet
        vec3 c_violetBlue = vec3(0.320, 0.180, 0.900); // #522ee6 Rich Electric Violet
        vec3 c_periwinkle = vec3(0.480, 0.560, 0.990); // #7a8efc Luminous Periwinkle Blue
        vec3 c_skyBlue    = vec3(0.680, 0.780, 1.000); // #adc7ff Soft Sky Periwinkle
        vec3 c_iceWhite   = vec3(0.850, 0.920, 1.000); // #d9ebff Ethereal Ice-White Blue

        // 6. Raised Color Transitions (Rose up a bit as requested)
        // Lower Region: Luminous ice-white & periwinkle at base (0.00 -> 0.16)
        float centerGlowMask = smoothstep(0.0, 0.82, distCenter);
        vec3 lowerBaseColor = mix(c_periwinkle, c_iceWhite, centerGlowMask * 0.85 + 0.15);
        
        // Transition 1: Base to Mid-Tone (0.00 -> 0.16)
        float t_baseToSky = smoothstep(0.00, 0.16, yEffective);
        vec3 col = mix(lowerBaseColor, mix(c_skyBlue, c_iceWhite, centerGlowMask), t_baseToSky);

        // Transition 2: Mid-Tone to Electric Violet-Blue (0.12 -> 0.27)
        float t_skyToViolet = smoothstep(0.12, 0.27, yEffective);
        col = mix(col, c_violetBlue, t_skyToViolet);

        // Transition 3: Violet-Blue to Deep Indigo Corona (0.22 -> 0.36)
        float t_violetToIndigo = smoothstep(0.22, 0.36, yEffective);
        col = mix(col, c_deepIndigo, t_violetToIndigo);

        // Transition 4: Indigo Corona into Pure Pitch Black Upper Void (0.31 -> 0.45)
        // Sits right below the top navbar void, perfectly balanced across the screen
        float t_indigoToBlack = smoothstep(0.31, 0.45, yEffective);
        col = mix(col, c_black, t_indigoToBlack);

        // 7. Transparent Glass Louver Shading & Specular Catch-Lights
        float lightVisibility = 1.0 - t_indigoToBlack;
        
        // Internal cylindrical shading across each glass slat (gives physical volume)
        float glassBodyShading = 1.0 - 0.11 * (panelNorm * panelNorm);
        col *= mix(1.0, glassBodyShading, lightVisibility * 0.90);

        // Crisp specular reflection catch-light along the left seam edge of each glass slat
        float leftCatch = smoothstep(0.10, 0.0, panelFract) * 0.080;
        // Subtle ambient shadow groove along the right seam edge of each glass slat
        float rightGroove = smoothstep(0.90, 1.0, panelFract) * 0.065;
        
        // Refractive seam shimmer that glints as waves propagate
        float seamShimmer = sin(panelCenterX * 24.0 - t * 1.8) * 0.016;
        
        col += (leftCatch - rightGroove + seamShimmer) * lightVisibility * vec3(0.72, 0.82, 1.0);

        // Subtle frosted micro-grain texture (matches high-end editorial finish)
        float grain = (hash(gl_FragCoord.xy + fract(t) * 100.0) - 0.5) * 0.015;
        col += grain * lightVisibility;

        // Clamp strictly to [0.0, 1.0]
        col = clamp(col, 0.0, 1.0);

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    function createShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile failed:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link failed:', gl.getProgramInfoLog(program));
      return;
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0,
      ]),
      gl.STATIC_DRAW
    );

    const positionLoc = gl.getAttribLocation(program, 'a_position');
    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const resLoc = gl.getUniformLocation(program, 'u_resolution');

    let animationId;
    let startTime = performance.now();

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const displayWidth = Math.floor(window.innerWidth * dpr);
      const displayHeight = Math.floor(window.innerHeight * dpr);

      canvas.width = displayWidth;
      canvas.height = displayHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    window.addEventListener('resize', resize);
    resize();

    function render(now) {
      const elapsed = (now - startTime) * 0.001;

      gl.useProgram(program);

      gl.enableVertexAttribArray(positionLoc);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

      gl.uniform1f(timeLoc, elapsed);
      gl.uniform2f(resLoc, canvas.width, canvas.height);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationId = requestAnimationFrame(render);
    }

    animationId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
      if (gl) {
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteBuffer(positionBuffer);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    />
  );
}
