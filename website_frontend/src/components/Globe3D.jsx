import React, { useEffect, useRef } from 'react';

export default function Globe3D() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = canvas.width = canvas.parentElement.clientWidth || 600;
    let height = canvas.height = canvas.parentElement.clientHeight || 600;

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const radius = Math.min(width, height) * 0.44;
    const cx = width * 0.52;
    const cy = height * 0.5;
    let rotY = 0.8;
    let rotX = 0.35;
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    // Generate latitude / longitude grid lines
    const latLines = [];
    for (let lat = -75; lat <= 75; lat += 15) {
      const phi = (90 - lat) * (Math.PI / 180);
      const r = Math.sin(phi);
      const y = Math.cos(phi);
      const line = [];
      for (let lon = 0; lon <= 360; lon += 5) {
        const rad = lon * (Math.PI / 180);
        line.push({ x: r * Math.sin(rad), y: y, z: r * Math.cos(rad) });
      }
      latLines.push(line);
    }

    const lonLines = [];
    for (let lon = 0; lon < 360; lon += 20) {
      const rad = lon * (Math.PI / 180);
      const line = [];
      for (let lat = -90; lat <= 90; lat += 5) {
        const phi = (90 - lat) * (Math.PI / 180);
        const r = Math.sin(phi);
        const y = Math.cos(phi);
        line.push({ x: r * Math.sin(rad), y: y, z: r * Math.cos(rad) });
      }
      lonLines.push(line);
    }

    // Dataset cylinder pins floating above surface
    const pins = [
      { lat: 41.5, lon: -73.0, color: '#00d084', height: 0.15 },
      { lat: 53.3, lon: -1.4, color: '#00d084', height: 0.18 },
      { lat: 50.8, lon: 20.6, color: '#00c4cc', height: 0.16 },
      { lat: 50.8, lon: -0.1, color: '#9b51e0', height: 0.14 },
      { lat: 35.6, lon: 139.6, color: '#00c4cc', height: 0.17 },
      { lat: -33.8, lon: 151.2, color: '#9b51e0', height: 0.15 }
    ];

    const onMouseDown = (e) => {
      isDragging = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    };
    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - lastMouseX;
      const deltaY = e.clientY - lastMouseY;
      rotY += deltaX * 0.004;
      rotX += deltaY * 0.004;
      rotX = Math.max(-1.2, Math.min(1.2, rotX));
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    };
    const onMouseUp = () => { isDragging = false; };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    const project = (p) => {
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      let x1 = p.x * cosY - p.z * sinY;
      let z1 = p.x * sinY + p.z * cosY;
      let y1 = p.y * cosX - z1 * sinX;
      let z2 = p.y * sinX + z1 * cosX;

      return {
        sx: cx + x1 * radius,
        sy: cy - y1 * radius,
        sz: z2
      };
    };

    const render = () => {
      if (!isDragging) {
        rotY += 0.002;
      }

      ctx.clearRect(0, 0, width, height);

      // Render Sphere Background Atmosphere Glow
      const glowGrad = ctx.createRadialGradient(cx, cy, radius * 0.6, cx, cy, radius * 1.25);
      glowGrad.addColorStop(0, 'rgba(0, 65, 232, 0.15)');
      glowGrad.addColorStop(0.7, 'rgba(0, 196, 204, 0.05)');
      glowGrad.addColorStop(1, 'rgba(11, 26, 51, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.25, 0, Math.PI * 2);
      ctx.fill();

      // Render Base Sphere Outline
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw Latitude Wireframe Grid Rings
      latLines.forEach(line => {
        ctx.beginPath();
        let started = false;
        line.forEach(pt => {
          const pr = project(pt);
          if (pr.sz > -0.05) {
            if (!started) { ctx.moveTo(pr.sx, pr.sy); started = true; }
            else { ctx.lineTo(pr.sx, pr.sy); }
          } else {
            started = false;
          }
        });
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      // Draw Longitude Wireframe Grid Lines
      lonLines.forEach(line => {
        ctx.beginPath();
        let started = false;
        line.forEach(pt => {
          const pr = project(pt);
          if (pr.sz > -0.05) {
            if (!started) { ctx.moveTo(pr.sx, pr.sy); started = true; }
            else { ctx.lineTo(pr.sx, pr.sy); }
          } else {
            started = false;
          }
        });
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      // Render Floating 3D Vertical Cylinder Markers
      pins.forEach(pin => {
        const phi = (90 - pin.lat) * (Math.PI / 180);
        const theta = (pin.lon + 180) * (Math.PI / 180);

        const px = -Math.sin(phi) * Math.cos(theta);
        const py = Math.cos(phi);
        const pz = Math.sin(phi) * Math.sin(theta);

        const base = project({ x: px, y: py, z: pz });
        const top = project({ x: px * (1 + pin.height), y: py * (1 + pin.height), z: pz * (1 + pin.height) });

        if (base.sz > 0.05) {
          // Vertical 3D line
          ctx.beginPath();
          ctx.moveTo(base.sx, base.sy);
          ctx.lineTo(top.sx, top.sy);
          ctx.strokeStyle = pin.color;
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // Base dot
          ctx.beginPath();
          ctx.arc(base.sx, base.sy, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();

          // Top cylinder cap dot
          ctx.beginPath();
          ctx.arc(top.sx, top.sy, 4, 0, Math.PI * 2);
          ctx.fillStyle = pin.color;
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <div className="w-full h-[450px] sm:h-[540px] lg:h-[600px] relative flex items-center justify-center cursor-grab active:cursor-grabbing">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
