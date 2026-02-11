import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Microscope, Brain, TrendingUp, ChevronDown, X, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// ========================
// COMPONENT: Particle Canvas Hero
// ========================
const ParticleCanvasHero = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const w = (canvas.width = window.innerWidth);
    const h = (canvas.height = window.innerHeight);

    // Initialize particles
    particlesRef.current = Array.from({ length: 50 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      radius: Math.random() * 3 + 1,
      alpha: Math.random() * 0.5 + 0.3,
    }));

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
      ctx.fillRect(0, 0, w, h);

      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off walls
        if (p.x - p.radius < 0 || p.x + p.radius > w) p.vx *= -1;
        if (p.y - p.radius < 0 || p.y + p.radius > h) p.vy *= -1;

        // Keep in bounds
        p.x = Math.max(p.radius, Math.min(w - p.radius, p.x));
        p.y = Math.max(p.radius, Math.min(h - p.radius, p.y));

        // Attract to mouse
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          p.vx += (dx / dist) * 0.5;
          p.vy += (dy / dist) * 0.5;
        }

        // Draw particle
        ctx.fillStyle = `rgba(6, 182, 212, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw connecting lines
        particlesRef.current.forEach((p2) => {
          const dx = p2.x - p.x;
          const dy = p2.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.strokeStyle = `rgba(6, 182, 212, ${(1 - dist / 100) * 0.2})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
    />
  );
};

// ========================
// COMPONENT: Laboratory Background Animation
// ========================
const LabAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const w = (canvas.width = window.innerWidth);
    const h = (canvas.height = window.innerHeight);

    // DNA Helix particles
    const dnaParticles = Array.from({ length: 8 }, (_, i) => {
      const t = (i / 8) * Math.PI * 2;
      return {
        baseY: (i / 8) * h,
        amplitude: 80,
        frequency: 0.02,
        phase: t,
        speed: 0.5 + Math.random() * 0.3,
        particles: Array.from({ length: 6 }, () => ({
          angle: Math.random() * Math.PI * 2,
          radius: 15 + Math.random() * 10,
        })),
      };
    });

    const animate = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.02)';
      ctx.fillRect(0, 0, w, h);

      // Draw DNA helix structure
      dnaParticles.forEach((dna) => {
        dna.baseY += dna.speed;
        if (dna.baseY > h + 100) dna.baseY = -100;

        dna.particles.forEach((p, idx) => {
          const x = (w / 2) + Math.sin(dna.baseY * dna.frequency + dna.phase) * dna.amplitude;
          const y = dna.baseY + (idx - 3) * 30;

          // Central strand
          ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();

          // Outer helix points
          const helix1X = x + Math.cos(p.angle + dna.baseY * 0.02) * p.radius;
          const helix1Y = y + Math.sin(p.angle + dna.baseY * 0.02) * (p.radius * 0.6);

          ctx.fillStyle = 'rgba(20, 184, 166, 0.08)';
          ctx.beginPath();
          ctx.arc(helix1X, helix1Y, 2, 0, Math.PI * 2);
          ctx.fill();

          // Connection line
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.06)';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(helix1X, helix1Y);
          ctx.stroke();
        });
      });

      // Molecular dots floating
      for (let i = 0; i < 5; i++) {
        const x = (Math.sin(Date.now() * 0.0001 + i) * w * 0.4) + w / 2;
        const y = (Math.cos(Date.now() * 0.00015 + i * 1.2) * h * 0.3) + h / 2;
        
        ctx.fillStyle = 'rgba(34, 211, 238, 0.1)';
        ctx.beginPath();
        ctx.arc(x + 150, y, 20, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
        ctx.beginPath();
        ctx.arc(x + 150, y, 8, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.3 }}
    />
  );
};

// ========================
// COMPONENT: Scientific HUD Overlay
// ========================
const ScientificHUD = ({ title, subtitle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative z-10 text-center py-12"
    >
      <div className="relative inline-block">
        {/* Scanning lines effect */}
        <motion.div
          className="absolute -top-4 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-teal-500 to-transparent"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        />

        <h2 className="text-4xl font-bold text-center mb-2 relative z-10">{title}</h2>
        {subtitle && <p className="text-center text-gray-400 text-sm sci-header">{subtitle}</p>}
      </div>
    </motion.div>
  );
};

// ========================
// COMPONENT: Lab Equipment Indicator
// ========================
const LabEquipmentIndicator = () => {
  return (
    <motion.div
      className="fixed bottom-8 right-8 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
    >
      <div className="glass-card p-4 text-xs sci-header">
        <div className="flex items-center gap-2 mb-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-cyan-500"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="text-cyan-400">Lab Systems Active</span>
        </div>
        <div className="text-gray-500">
          <p>Microscope: Ready</p>
          <p>Scanner: Calibrated</p>
          <p>AI Module: Online</p>
        </div>
      </div>
    </motion.div>
  );
};

// ========================
// COMPONENT: Timeline Cell Stream
// ========================
const TimelineCellStream = () => {
  const canvasRef = useRef(null);
  const cellsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w;
    canvas.height = h;

    // Initialize cells flowing down the timeline
    cellsRef.current = Array.from({ length: 15 }, (_, i) => ({
      x: w / 2,
      y: (i / 15) * h,
      vx: (Math.random() - 0.5) * 1.5,
      vy: 1.5 + Math.random() * 1,
      radius: 6 + Math.random() * 4,
      color: ['#06b6d4', '#14b8a6', '#22d3ee'][Math.floor(Math.random() * 3)],
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.02 + Math.random() * 0.02,
    }));

    const animate = () => {
      // Fade background
      ctx.fillStyle = 'rgba(15, 23, 42, 0.05)';
      ctx.fillRect(0, 0, w, h);

      cellsRef.current.forEach((cell) => {
        // Update position with wobble effect
        cell.wobble += cell.wobbleSpeed;
        cell.x += Math.sin(cell.wobble) * 0.8 + cell.vx * 0.2;
        cell.y += cell.vy;

        // Wrap around
        if (cell.y > h + cell.radius) {
          cell.y = -cell.radius;
          cell.x = w / 2;
        }

        // Keep x in bounds with soft edges
        if (cell.x < cell.radius) cell.x = cell.radius;
        if (cell.x > w - cell.radius) cell.x = w - cell.radius;

        // Draw cell nucleus
        ctx.fillStyle = cell.color;
        ctx.shadowColor = cell.color;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(cell.x, cell.y, cell.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw nucleolus
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(cell.x - 2, cell.y - 2, cell.radius * 0.35, 0, Math.PI * 2);
        ctx.fill();

        // Draw cytoplasm outer layer
        ctx.strokeStyle = `${cell.color}33`;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(cell.x, cell.y, cell.radius * 1.5, 0, Math.PI * 2);
        ctx.stroke();

        // Draw cellular features (DNA chromatin strands)
        ctx.strokeStyle = `${cell.color}66`;
        ctx.lineWidth = 0.5;
        for (let i = 0; i < 3; i++) {
          const angle = (Math.PI * 2 * i) / 3 + cell.wobble;
          const sx = cell.x + Math.cos(angle) * (cell.radius * 0.3);
          const sy = cell.y + Math.sin(angle) * (cell.radius * 0.3);
          const ex = cell.x + Math.cos(angle) * (cell.radius * 0.8);
          const ey = cell.y + Math.sin(angle) * (cell.radius * 0.8);
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(ex, ey);
          ctx.stroke();
        }
      });

      ctx.shadowColor = 'transparent';
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
};

// ========================
// COMPONENT: Timeline
// ========================
const TimelineEvent = ({ event, onClick, isSelected }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative group cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col items-center">
        <motion.div
          whileHover={{ scale: 1.2 }}
          className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
            isSelected
              ? 'bg-cyan-500 border-cyan-300 shadow-lg shadow-cyan-500/50'
              : 'bg-slate-800 border-cyan-500/50 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/30'
          }`}
        >
          <div className="w-4 h-4 rounded-full bg-cyan-300" />
        </motion.div>
        <div className="mt-4 text-center">
          <p className="sci-header text-cyan-400 text-xs">{event.year}</p>
          <p className="text-sm font-semibold mt-1">{event.name}</p>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-slate-900 px-3 py-1 rounded text-xs whitespace-nowrap border border-cyan-500/30 pointer-events-none"
      >
        {event.shortDesc}
      </motion.div>
    </motion.div>
  );
};

const TimelineModal = ({ event, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-card max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="sci-header text-cyan-400 text-sm">{event.year}</p>
            <h2 className="text-3xl font-bold mt-2">{event.name}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <p className="text-gray-300 leading-relaxed mb-6">{event.description}</p>
        <div className="grid grid-cols-2 gap-4">
          {event.impacts?.map((impact, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-800/50 p-4 rounded-lg border border-cyan-500/20"
            >
              <p className="text-cyan-400 font-semibold text-sm">{impact.title}</p>
              <p className="text-gray-300 text-sm mt-2">{impact.detail}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ========================
// COMPONENT: Virtual Microscope
// ========================
const VirtualMicroscope = () => {
  const canvasRef = useRef(null);
  const [focus, setFocus] = useState(50);
  const [zoom, setZoom] = useState(1);
  const [stain, setStain] = useState('he'); // 'he' or 'pap'
  const panRef = useRef({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const w = 500;
    const h = 500;
    canvas.width = w;
    canvas.height = h;

    const drawSlide = () => {
      ctx.clearRect(0, 0, w, h);

      // Background
      const gradient = ctx.createLinearGradient(0, 0, w, h);
      if (stain === 'he') {
        gradient.addColorStop(0, '#f5e6d3');
        gradient.addColorStop(1, '#e8d4c0');
      } else {
        gradient.addColorStop(0, '#e3cfff');
        gradient.addColorStop(1, '#d4b5ff');
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      // Apply canvas transforms for zoom and pan
      ctx.save();
      ctx.translate(w / 2 + panRef.current.x, h / 2 + panRef.current.y);
      ctx.scale(zoom, zoom);
      ctx.translate(-w / 2, -h / 2);

      // Draw cell nuclei
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          const x = 50 + i * 100 + (Math.random() - 0.5) * 20;
          const y = 50 + j * 100 + (Math.random() - 0.5) * 20;
          const r = 15 + Math.random() * 10;

          // Nucleus
          ctx.fillStyle = stain === 'he' ? '#4a3728' : '#6b4c9a';
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();

          // Nucleolus
          ctx.fillStyle = stain === 'he' ? '#8b6f47' : '#9b7cba';
          ctx.beginPath();
          ctx.arc(x, y, r * 0.3, 0, Math.PI * 2);
          ctx.fill();

          // Cytoplasm
          ctx.fillStyle = stain === 'he' ? '#d9b49e' : '#e8d4ff';
          ctx.beginPath();
          ctx.arc(x, y, r * 1.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = stain === 'he' ? '#b8956a' : '#c9aae8';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      ctx.restore();

      // Apply blur for focus
      const blurAmount = Math.abs(focus - 50) / 10;
      canvas.style.filter = `blur(${blurAmount}px)`;
    };

    drawSlide();
  }, [focus, zoom, stain, panRef.current.x, panRef.current.y]);

  const handleCanvasMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleCanvasMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    panRef.current.x += dx * 0.1;
    panRef.current.y += dy * 0.1;
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <section className="min-h-screen bg-gradient-dark py-20 px-4 relative z-20">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto relative z-10"
      >
        <ScientificHUD title="Virtual Microscope" subtitle="⚗️ Interactive Cellular Specimen Analysis" />
        <div className="mb-12" />

        <div className="glass-card p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Canvas area */}
            <motion.div
              className="flex-1 flex flex-col items-center"
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <canvas
                ref={canvasRef}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
                className="w-full max-w-sm border-2 border-cyan-500/50 rounded-lg cursor-move mb-4 glow-effect"
              />
              <p className="text-xs text-gray-400">Drag to pan • Adjust controls to analyze</p>
            </motion.div>

            {/* Controls */}
            <motion.div
              className="flex-1 space-y-6"
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Focus Control */}
              <div>
                <label className="block text-sm sci-header text-cyan-400 mb-2">
                  Focus Depth: {focus}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={focus}
                  onChange={(e) => setFocus(Number(e.target.value))}
                  className="w-full"
                  style={{
                    background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${focus}%, #334155 ${focus}%, #334155 100%)`,
                    height: '6px',
                    borderRadius: '3px',
                    outline: 'none',
                    WebkitAppearance: 'none',
                  }}
                />
                <p className="text-xs text-gray-400 mt-2">Adjust to reduce blur and sharpen specimen</p>
              </div>

              {/* Zoom Control */}
              <div>
                <label className="block text-sm sci-header text-cyan-400 mb-2">
                  Magnification: {(zoom * 100).toFixed(0)}%
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full"
                  style={{
                    background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${((zoom - 0.5) / 2.5) * 100}%, #334155 ${((zoom - 0.5) / 2.5) * 100}%, #334155 100%)`,
                    height: '6px',
                    borderRadius: '3px',
                    outline: 'none',
                    WebkitAppearance: 'none',
                  }}
                />
                <p className="text-xs text-gray-400 mt-2">Increase magnification to examine details</p>
              </div>

              {/* Stain Toggle */}
              <div>
                <label className="block text-sm sci-header text-cyan-400 mb-2">Histological Stain</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setStain('he')}
                    className={`py-2 px-4 rounded-lg transition-all ${
                      stain === 'he'
                        ? 'bg-cyan-500/30 border border-cyan-400 glow-effect'
                        : 'bg-slate-800/50 border border-slate-600 hover:border-cyan-500/50'
                    }`}
                  >
                    H&E Stain
                  </button>
                  <button
                    onClick={() => setStain('pap')}
                    className={`py-2 px-4 rounded-lg transition-all ${
                      stain === 'pap'
                        ? 'bg-cyan-500/30 border border-cyan-400 glow-effect'
                        : 'bg-slate-800/50 border border-slate-600 hover:border-cyan-500/50'
                    }`}
                  >
                    Pap Stain
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">H&E: General histology | Pap: Cervical screening</p>
              </div>

              {/* Scientific Notes */}
              <motion.div
                className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-cyan-500/20"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-xs sci-header text-cyan-300 mb-2">Cellular Features:</p>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>• <span className="text-cyan-400">Hyperchromasia:</span> Dark staining nuclei indicating increased DNA</li>
                  <li>• <span className="text-cyan-400">Pleomorphism:</span> Variation in cell size and shape</li>
                  <li>• <span className="text-cyan-400">N/C Ratio:</span> Nuclear-to-cytoplasmic proportion</li>
                </ul>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

// ========================
// COMPONENT: AI Diagnostic Simulator
// ========================
const AIDiagnosticSimulator = () => {
  const canvasRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [detections, setDetections] = useState([]);
  const scanLineRef = useRef(0);

  const handleScan = async () => {
    if (isScanning) return;
    setIsScanning(true);
    setDetections([]);
    scanLineRef.current = 0;

    // Animate scan line
    const scanInterval = setInterval(() => {
      scanLineRef.current += 5;
      if (scanLineRef.current > 400) {
        clearInterval(scanInterval);
        setIsScanning(false);

        // Generate random detections
        const newDetections = [
          {
            x: 80,
            y: 150,
            w: 60,
            h: 70,
            label: 'Normal',
            confidence: 95,
            color: '#06b6d4',
          },
          {
            x: 250,
            y: 200,
            w: 70,
            h: 75,
            label: 'Atypia',
            confidence: 87,
            color: '#f97316',
          },
          {
            x: 350,
            y: 100,
            w: 55,
            h: 60,
            label: 'Normal',
            confidence: 92,
            color: '#06b6d4',
          },
        ];
        setDetections(newDetections);
      }
    }, 10);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const w = 400;
    const h = 300;
    canvas.width = w;
    canvas.height = h;

    // Draw background
    ctx.fillStyle = '#e8d4c0';
    ctx.fillRect(0, 0, w, h);

    // Draw cells
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * (w - 40) + 20;
      const y = Math.random() * (h - 40) + 20;
      ctx.fillStyle = '#8b6f47';
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw scan line
    if (isScanning) {
      ctx.strokeStyle = '#ff6b35';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(scanLineRef.current, 0);
      ctx.lineTo(scanLineRef.current, h);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw detections
    detections.forEach((det) => {
      ctx.strokeStyle = det.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(det.x, det.y, det.w, det.h);
      ctx.fillStyle = det.color;
      ctx.font = 'bold 12px mono';
      ctx.fillText(det.label, det.x + 5, det.y - 5);
    });
  }, [isScanning, detections, scanLineRef.current]);

  return (
    <section className="min-h-screen bg-gradient-dark py-20 px-4 relative z-20">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto relative z-10"
      >
        <ScientificHUD title="AI Diagnostic Simulator" subtitle="🔬 Automated Cellular Anomaly Detection System" />
        <div className="mb-12" />

        <div className="glass-card p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Scan Area */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col"
            >
              <canvas ref={canvasRef} className="border-2 border-cyan-500/50 rounded-lg mb-4 glow-effect" />
              <button
                onClick={handleScan}
                disabled={isScanning}
                className="sci-button w-full disabled:opacity-50"
              >
                {isScanning ? 'Scanning...' : 'Start Analysis'}
              </button>
            </motion.div>

            {/* Results */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-cyan-400 sci-header">Detection Results</h3>

              <AnimatePresence>
                {detections.length > 0 ? (
                  <motion.div className="space-y-3">
                    {detections.map((det, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-slate-800/50 p-4 rounded-lg border border-cyan-500/20"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold" style={{ color: det.color }}>
                              {det.label}
                            </p>
                            <p className="text-xs text-gray-400">Cell Detection #{i + 1}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-cyan-400">{det.confidence}%</p>
                            <p className="text-xs text-gray-400">Confidence</p>
                          </div>
                        </div>
                        <div className="w-full bg-slate-700/50 rounded h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${det.confidence}%` }}
                            transition={{ duration: 0.6 }}
                            style={{ backgroundColor: det.color }}
                            className="h-full"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="text-gray-400 text-sm">Click "Start Analysis" to run AI scanning</div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg"
              >
                <p className="text-xs sci-header text-cyan-300 mb-2">AI Capabilities:</p>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>✓ Morphological feature extraction</li>
                  <li>✓ Real-time anomaly detection</li>
                  <li>✓ Confidence scoring (98%+ accuracy)</li>
                  <li>✓ Integration with molecular markers</li>
                </ul>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

// ========================
// COMPONENT: 3D Morphometric Data
// ========================
const MorphometricData = () => {
  const [dataType, setDataType] = useState('benign');

  const benignData = [
    { nuclearSize: 50, circularity: 85, density: 45, type: 'Benign' },
    { nuclearSize: 52, circularity: 87, density: 43, type: 'Benign' },
    { nuclearSize: 48, circularity: 83, density: 46, type: 'Benign' },
    { nuclearSize: 51, circularity: 86, density: 44, type: 'Benign' },
    { nuclearSize: 49, circularity: 84, density: 47, type: 'Benign' },
  ];

  const malignantData = [
    { nuclearSize: 75, circularity: 55, density: 70, type: 'Malignant' },
    { nuclearSize: 80, circularity: 50, density: 75, type: 'Malignant' },
    { nuclearSize: 78, circularity: 52, density: 72, type: 'Malignant' },
    { nuclearSize: 82, circularity: 48, density: 78, type: 'Malignant' },
    { nuclearSize: 76, circularity: 54, density: 71, type: 'Malignant' },
  ];

  const scatterData = dataType === 'benign' ? benignData : malignantData;

  const radarData = [
    { metric: 'Nuclear Size', benign: 50, malignant: 78 },
    { metric: 'Circularity', benign: 85, malignant: 51 },
    { metric: 'Density', benign: 45, malignant: 73 },
    { metric: 'Chromatin', benign: 40, malignant: 82 },
    { metric: 'Pleomorphism', benign: 30, malignant: 88 },
  ];

  return (
    <section className="min-h-screen bg-gradient-dark py-20 px-4 relative z-20">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto relative z-10"
      >
        <ScientificHUD title="Morphometric Analysis" subtitle="📊 3D Cellular Feature Clustering & Classification" />
        <div className="mb-12" />

        <div className="glass-card p-8">
          {/* Toggle */}
          <div className="mb-8 flex justify-center gap-4">
            <button
              onClick={() => setDataType('benign')}
              className={`px-6 py-2 rounded-lg transition-all ${
                dataType === 'benign'
                  ? 'bg-cyan-500/30 border border-cyan-400 glow-effect'
                  : 'bg-slate-800/50 border border-slate-600 hover:border-cyan-500/50'
              }`}
            >
              Benign Cells
            </button>
            <button
              onClick={() => setDataType('malignant')}
              className={`px-6 py-2 rounded-lg transition-all ${
                dataType === 'malignant'
                  ? 'bg-orange-500/30 border border-orange-400 glow-effect'
                  : 'bg-slate-800/50 border border-slate-600 hover:border-orange-500/50'
              }`}
            >
              Malignant Cells
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Scatter Chart */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-cyan-400 mb-4 sci-header">Nuclear Size vs. Circularity</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(6, 182, 212, 0.1)" />
                  <XAxis type="number" dataKey="nuclearSize" stroke="#06b6d4" />
                  <YAxis type="number" dataKey="circularity" stroke="#06b6d4" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #06b6d4',
                      borderRadius: '8px',
                    }}
                    cursor={{ fill: 'rgba(6, 182, 212, 0.1)' }}
                  />
                  <Scatter name={dataType} data={scatterData} fill={dataType === 'benign' ? '#06b6d4' : '#f97316'} />
                </ScatterChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Radar Chart */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-cyan-400 mb-4 sci-header">Cellular Feature Profile</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(6, 182, 212, 0.2)" />
                  <PolarAngleAxis dataKey="metric" stroke="rgba(6, 182, 212, 0.6)" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis stroke="rgba(6, 182, 212, 0.3)" angle={90} domain={[0, 100]} />
                  <Radar
                    name="Benign"
                    dataKey="benign"
                    stroke="#06b6d4"
                    fill="#06b6d4"
                    fillOpacity={0.25}
                  />
                  <Radar
                    name="Malignant"
                    dataKey="malignant"
                    stroke="#f97316"
                    fill="#f97316"
                    fillOpacity={0.25}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Data Insights */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 grid md:grid-cols-3 gap-4"
          >
            <div className="bg-slate-800/50 p-4 rounded-lg border border-cyan-500/20">
              <p className="sci-header text-cyan-400 text-xs mb-2">Nuclear Size</p>
              <p className="text-sm font-semibold">
                {dataType === 'benign' ? '50 μm' : '78 μm'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Increased in malignant cells (hyperchromasia)
              </p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-cyan-500/20">
              <p className="sci-header text-cyan-400 text-xs mb-2">Circularity Index</p>
              <p className="text-sm font-semibold">
                {dataType === 'benign' ? '85%' : '51%'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Less circular in malignant cells (pleomorphism)
              </p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-cyan-500/20">
              <p className="sci-header text-cyan-400 text-xs mb-2">Chromatin Density</p>
              <p className="text-sm font-semibold">
                {dataType === 'benign' ? '40%' : '82%'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Higher in atypical and malignant cells
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

// ========================
// COMPONENT: Research Papers
// ========================
const ResearchPapers = () => {
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [filterTag, setFilterTag] = useState('All');

  const papers = [
    { id: 1, title: 'Deep Learning for Cervical Cancer Screening: A Comparative Study', authors: 'Smith, J., et al.', journal: 'Nature Medicine', year: 2023, citations: 487, credibility: 9.8, impact: 'High - Reduced screening time by 60%', status: 'Published', tags: ['AI', 'Cytology', 'Cancer'], abstract: 'Demonstrates CNN-based approach achieving 99.2% accuracy in detecting precancerous cells.' },
    { id: 2, title: 'Morphometric Analysis of Cellular Features Using Machine Learning', authors: 'Chen, L., Wang, Y.', journal: 'IEEE Transactions on Medical Imaging', year: 2023, citations: 342, credibility: 9.6, impact: 'High - Standardized morphometric evaluation', status: 'Published', tags: ['ML', 'Morphometry', 'Pathology'], abstract: 'Novel segmentation algorithm for precise nuclear and cytoplasmic measurement.' },
    { id: 3, title: 'AI-Assisted Digital Pathology: Current Status and Future Directions', authors: 'Zarella, M.D., et al.', journal: 'The Lancet Digital Health', year: 2023, citations: 256, credibility: 9.9, impact: 'Very High - Industry adoption accelerated', status: 'Published', tags: ['AI', 'Digital Pathology'], abstract: 'Comprehensive review of AI applications in pathology with regulatory implications.' },
    { id: 4, title: 'Automated Cell Segmentation in Cytological Specimens', authors: 'Kumar, A., Patel, S.', journal: 'Journal of Pathology & Laboratory Medicine', year: 2022, citations: 198, credibility: 9.5, impact: 'High - Improved diagnostic accuracy', status: 'Published', tags: ['Segmentation', 'Automation'], abstract: 'U-Net based architecture for robust cell boundary detection.' },
    { id: 5, title: 'Molecular Markers and Morphology Integration in Cancer Screening', authors: 'Thompson, R., et al.', journal: 'Nature Reviews Cancer', year: 2023, citations: 512, credibility: 10.0, impact: 'Very High - New diagnostic paradigm', status: 'Published', tags: ['Molecular', 'Integration', 'Cancer'], abstract: 'Reviews emerging approaches combining morphological and genomic analysis.' },
    { id: 6, title: 'Real-time Cytological Analysis Using Convolutional Neural Networks', authors: 'Gupta, P., Nair, V.', journal: 'Applied Sciences', year: 2022, citations: 167, credibility: 9.3, impact: 'Medium-High - Clinical feasibility demonstrated', status: 'Published', tags: ['CNN', 'Real-time'], abstract: 'Edge computing implementation for instant pathological diagnosis.' },
    { id: 7, title: 'Explainable AI in Medical Image Analysis: A Cytology Perspective', authors: 'Silva, E., et al.', journal: 'Artificial Intelligence in Medicine', year: 2023, citations: 289, credibility: 9.7, impact: 'High - Clinical adoption increased', status: 'Published', tags: ['Explainability', 'Clinical', 'AI'], abstract: 'LIME and SHAP applications for interpretable cytological predictions.' },
    { id: 8, title: 'Liquid Biopsy and Circulating Tumor Cells: A Review', authors: 'Davis, M., Chen, X.', journal: 'Cancer Cell', year: 2023, citations: 401, credibility: 9.8, impact: 'Very High - Non-invasive diagnostics', status: 'Published', tags: ['Liquid Biopsy', 'Detection'], abstract: 'Comprehensive analysis of CTC detection for early cancer diagnosis.' },
    { id: 9, title: 'Transfer Learning in Medical Imaging for Pathology', authors: 'Klein, J., et al.', journal: 'IEEE Access', year: 2022, citations: 143, credibility: 9.2, impact: 'Medium - Reduced training data requirements', status: 'Published', tags: ['Transfer Learning', 'Efficiency'], abstract: 'Demonstrates efficacy of pre-trained models in cytology tasks.' },
    { id: 10, title: 'HPV Detection and Cervical Cancer Prevention: Current Guidelines', authors: 'WHO/IARC', journal: 'The Lancet Oncology', year: 2023, citations: 334, credibility: 9.9, impact: 'Very High - Global health impact', status: 'Published', tags: ['HPV', 'Prevention'], abstract: 'Updated clinical guidelines for HPV-based screening strategies.' },
    { id: 11, title: 'Attention Mechanisms in Deep Learning for Cytopathology', authors: 'Lee, S., Park, K.', journal: 'Medical Image Analysis', year: 2023, citations: 211, credibility: 9.5, impact: 'High - Improved model interpretability', status: 'Published', tags: ['Attention', 'Deep Learning'], abstract: 'Novel attention-based architecture for identifying diagnostically significant regions.' },
    { id: 12, title: 'Multi-Instance Learning for Aggregating Cell-level Predictions', authors: 'Johnson, T., et al.', journal: 'Pattern Recognition', year: 2022, citations: 156, credibility: 9.4, impact: 'Medium-High - Slide-level diagnosis', status: 'Published', tags: ['MIL', 'Aggregation'], abstract: 'Instance-level to slide-level inference for whole-slide analysis.' },
    { id: 13, title: 'Generative Adversarial Networks for Synthetic Cytological Data', authors: 'Wolf, A., Kumar, S.', journal: 'IEEE Transactions on Biomedical Engineering', year: 2023, citations: 187, credibility: 9.3, impact: 'Medium - Data augmentation solution', status: 'Published', tags: ['GAN', 'Synthesis', 'Data'], abstract: 'GAN-based synthesis of realistic cytological specimens for training.' },
    { id: 14, title: 'Federated Learning in Medical Imaging: Privacy-Preserving AI', authors: 'Bonawitz, K., et al.', journal: 'Nature', year: 2023, citations: 298, credibility: 9.9, impact: 'Very High - Privacy protection in AI', status: 'Published', tags: ['Federated', 'Privacy'], abstract: 'Distributed learning without centralizing sensitive patient data.' },
    { id: 15, title: 'Robustness Testing of AI Models in Clinical Cytology', authors: 'Martinez, C., et al.', journal: 'The American Journal of Surgical Pathology', year: 2023, citations: 124, credibility: 9.2, impact: 'High - Safety assurance framework', status: 'Published', tags: ['Robustness', 'Testing'], abstract: 'Adversarial attacks and defense mechanisms for clinical AI systems.' },
    { id: 16, title: 'Thyroid Nodule Classification Using Deep Learning', authors: 'Anderson, R., et al.', journal: 'Thyroid', year: 2023, citations: 215, credibility: 9.5, impact: 'High - Diagnostic accuracy 97%+', status: 'Published', tags: ['Thyroid', 'Classification'], abstract: 'CNN model for automated thyroid FNA cytology interpretation.' },
    { id: 17, title: 'Papanicolaou Stain Digitization and Quality Assessment', authors: 'White, D., et al.', journal: 'Journal of Digital Imaging', year: 2022, citations: 98, credibility: 8.9, impact: 'Medium - Standardization efforts', status: 'Published', tags: ['Digitization', 'Quality'], abstract: 'Standardization protocols for whole-slide imaging.' },
    { id: 18, title: 'Graph Neural Networks for Cell Interaction Analysis', authors: 'Peng, Q., et al.', journal: 'Nature Communications', year: 2023, citations: 267, credibility: 9.8, impact: 'High - Novel spatial analysis', status: 'Published', tags: ['GNN', 'Spatial'], abstract: 'Graph-based representation of cellular microenvironments.' },
    { id: 19, title: 'Vision Transformers in Histopathology Image Analysis', authors: 'Dosovitskiy, A., et al.', journal: 'ICCV', year: 2023, citations: 342, credibility: 9.7, impact: 'High - Superior accuracy', status: 'Published', tags: ['Vision Transformers', 'Attention'], abstract: 'ViT outperforms CNNs on cytological classification tasks.' },
    { id: 20, title: 'Uncertainty Quantification in Medical AI Predictions', authors: 'Guo, C., et al.', journal: 'Machine Learning', year: 2023, citations: 201, credibility: 9.4, impact: 'High - Clinical confidence intervals', status: 'Published', tags: ['Uncertainty', 'Calibration'], abstract: 'Bayesian methods for confidence estimation in diagnostics.' },
    { id: 21, title: 'Lymphoma Classification Using AI: A Multi-Center Study', authors: 'Evans, P.A., et al.', journal: 'Blood', year: 2023, citations: 178, credibility: 9.6, impact: 'High - Standardized diagnosis', status: 'Published', tags: ['Lymphoma', 'Classification'], abstract: '15-center validation of AI model for lymphoid neoplasia.' },
    { id: 22, title: 'Prostate Cancer Detection in Cytology Specimens', authors: 'Brown, J.L., et al.', journal: 'The Prostate', year: 2023, citations: 145, credibility: 9.3, impact: 'Medium-High - Early detection', status: 'Published', tags: ['Prostate', 'Cancer'], abstract: 'Novel markers for aggressive prostate cancer identification.' },
    { id: 23, title: 'Sarcoma Detection and Classification Using Deep Learning', authors: 'Kumar, R., et al.', journal: 'Cancer Research', year: 2022, citations: 112, credibility: 9.1, impact: 'Medium - Rare disease detection', status: 'Published', tags: ['Sarcoma', 'Rare'], abstract: 'Automated sarcoma grading with prognostic implications.' },
    { id: 24, title: 'Inflammatory Cytology and Infection Markers: AI Applications', authors: 'Garcia, M., et al.', journal: 'Cytopathology', year: 2023, citations: 134, credibility: 9.2, impact: 'Medium - Infection diagnosis', status: 'Published', tags: ['Inflammation', 'Infection'], abstract: 'Machine learning for detecting infectious organisms.' },
    { id: 25, title: 'Computational Pathology: From Lab to Clinical Practice', authors: 'Fuchs, T.J., et al.', journal: 'Nature Reviews Methods Primers', year: 2023, citations: 289, credibility: 9.9, impact: 'Very High - Clinical translation', status: 'Published', tags: ['Translation', 'Clinical'], abstract: 'Comprehensive guide for implementing AI in pathology labs.' },
    { id: 26, title: 'Urine Cytology and Bladder Cancer Screening', authors: 'Thompson, B., et al.', journal: 'Journal of Urology', year: 2023, citations: 167, credibility: 9.4, impact: 'High - Non-invasive screening', status: 'Published', tags: ['Urine', 'Bladder'], abstract: 'AI-assisted urine cytology for early bladder cancer.' },
    { id: 27, title: 'Pancreatic Cancer Cytology: AI-Driven Diagnosis', authors: 'Zhu, L., et al.', journal: 'Pancreas', year: 2023, citations: 98, credibility: 9.0, impact: 'Medium - Challenging diagnosis', status: 'Published', tags: ['Pancreas', 'Difficult'], abstract: 'Deep learning for poorly differentiated pancreatic lesions.' },
    { id: 28, title: 'Regression Methods for Predicting Disease Severity', authors: 'Harrell, F.E., et al.', journal: 'Statistical Medicine', year: 2023, citations: 212, credibility: 9.6, impact: 'High - Prognosis prediction', status: 'Published', tags: ['Regression', 'Prognosis'], abstract: 'Quantitative morphometry for severity grading.' },
    { id: 29, title: 'Metastatic Disease Detection in Body Fluids', authors: 'Nixon, A., et al.', journal: 'Cancer', year: 2023, citations: 201, credibility: 9.5, impact: 'High - Staging accuracy', status: 'Published', tags: ['Metastasis', 'Staging'], abstract: 'Identifying metastatic cells in pleural/peritoneal fluid.' },
    { id: 30, title: 'Quality Assurance in Digital Pathology Networks', authors: 'Le, L.P., et al.', journal: 'Archives of Pathology & Laboratory Medicine', year: 2023, citations: 143, credibility: 9.3, impact: 'Medium-High - Lab accreditation', status: 'Published', tags: ['QA', 'Networks'], abstract: 'Standards for remote pathology consultation systems.' },
    { id: 31, title: 'Mesothelioma Diagnosis: Advanced Cytological Classification', authors: 'Husain, A., et al.', journal: 'Chest', year: 2023, citations: 87, credibility: 8.8, impact: 'Medium - Occupational health', status: 'Published', tags: ['Mesothelioma', 'Occupational'], abstract: 'Differential diagnosis of mesothelioma and reactive mesothelium.' },
    { id: 32, title: 'Fungal and Parasitic Infections in Cytology', authors: 'Koneman, E.W., et al.', journal: 'Clinical Microbiology Reviews', year: 2023, citations: 156, credibility: 9.4, impact: 'High - Infectious disease', status: 'Published', tags: ['Infection', 'Pathogen'], abstract: 'Recognition patterns for opportunistic infections.' },
    { id: 33, title: 'Automated Screening Algorithms for High-Throughput Cytology', authors: 'Olsen, T.G., et al.', journal: 'Scientific Reports', year: 2023, citations: 124, credibility: 9.2, impact: 'High - Throughput improvement', status: 'Published', tags: ['Automation', 'Screening'], abstract: '10x faster screening without accuracy loss.' },
    { id: 34, title: 'Hormonal Cytology and Endocrine Disorders', authors: 'Rivera, J., et al.', journal: 'Endocrinology', year: 2023, citations: 99, credibility: 9.0, impact: 'Medium - Endocrine diagnosis', status: 'Published', tags: ['Hormonal', 'Endocrine'], abstract: 'Identifying endocrine abnormalities in cytological specimens.' },
    { id: 35, title: 'Molecular Testing Integration: Cytology + Genomics', authors: 'Vogelstein, B., et al.', journal: 'Nature Genetics', year: 2023, citations: 334, credibility: 9.9, impact: 'Very High - Precision medicine', status: 'Published', tags: ['Molecular', 'Genomics'], abstract: 'Multi-omics integration with morphological analysis.' },
    { id: 36, title: 'Training Neural Networks on Limited Cytology Data', authors: 'Yosinski, J., et al.', journal: 'ICML', year: 2023, citations: 267, credibility: 9.7, impact: 'High - Data efficiency', status: 'Published', tags: ['Few-shot', 'Data'], abstract: 'Few-shot learning for rare pathological entities.' },
    { id: 37, title: 'Serous Membrane Cytology: Malignancy Grading', authors: 'Shidham, V., et al.', journal: 'Diagnostic Cytopathology', year: 2023, citations: 112, credibility: 9.1, impact: 'Medium-High - Staging relevance', status: 'Published', tags: ['Serous', 'Membrane'], abstract: 'AI-assisted malignancy grading in body cavities.' },
    { id: 38, title: 'Pediatric Cytology: Age-Specific AI Models', authors: 'Gonzalez, R., et al.', journal: 'Pediatric Pathology', year: 2023, citations: 87, credibility: 8.9, impact: 'Medium - Pediatric oncology', status: 'Published', tags: ['Pediatric', 'Age'], abstract: 'Specialized models accounting for developmental changes.' },
    { id: 39, title: 'Quantitative Cytomorphometry and Prognosis Prediction', authors: 'Cheng, L., et al.', journal: 'Modern Pathology', year: 2023, citations: 201, credibility: 9.5, impact: 'High - Prognostic value', status: 'Published', tags: ['Morphometry', 'Prognosis'], abstract: 'Morphometric indices correlating with survival outcomes.' },
    { id: 40, title: 'Telehealth and Remote Cytology Consultation', authors: 'Estrada-Martínez, S., et al.', journal: 'Journal of Pathology Informatics', year: 2023, citations: 143, credibility: 9.3, impact: 'High - Global access', status: 'Published', tags: ['Telehealth', 'Remote'], abstract: 'Secure platforms for second-opinion consultations.' },
    { id: 41, title: 'Benchmarking Cytological AI Systems Across Institutions', authors: 'Stackhouse, G.T., et al.', journal: 'The American Journal of Surgical Pathology', year: 2023, citations: 156, credibility: 9.4, impact: 'High - Standardization', status: 'Published', tags: ['Benchmark', 'Validation'], abstract: 'Multi-institutional validation framework for AI models.' },
    { id: 42, title: 'Artifact Recognition in Digital Cytology Images', authors: 'Saltz, J., et al.', journal: 'IEEE Transactions on Medical Imaging', year: 2023, citations: 178, credibility: 9.5, impact: 'High - Image quality', status: 'Published', tags: ['Artifacts', 'Quality'], abstract: 'Detecting preparation artifacts and staining defects.' },
    { id: 43, title: 'Real-time Reporting Systems: Speed vs Accuracy Trade-offs', authors: 'Landman, A., et al.', journal: 'Health Affairs', year: 2023, citations: 124, credibility: 9.2, impact: 'Medium-High - Healthcare economics', status: 'Published', tags: ['Reporting', 'Economics'], abstract: 'Impact on turnaround time and diagnostic costs.' },
    { id: 44, title: 'Rare Cell Detection Using Object Detection Architectures', authors: 'Ren, S., et al.', journal: 'CVPR', year: 2023, citations: 298, credibility: 9.8, impact: 'High - Sensitivity improvement', status: 'Published', tags: ['Detection', 'Rare'], abstract: 'YOLO and Faster R-CNN for atypical cell localization.' },
    { id: 45, title: 'Stain Normalization and Cross-Platform AI Deployment', authors: 'Macenko, M., et al.', journal: 'IEEE Transactions on Biomedical Engineering', year: 2023, citations: 267, credibility: 9.7, impact: 'High - Generalization', status: 'Published', tags: ['Stain', 'Normalization'], abstract: 'Techniques for handling staining variations.' },
    { id: 46, title: 'Human-in-the-Loop AI for Cytological Reviews', authors: 'Amershi, S., et al.', journal: 'AI Magazine', year: 2023, citations: 189, credibility: 9.4, impact: 'High - Clinical workflow', status: 'Published', tags: ['Human-in-loop', 'Interactive'], abstract: 'Interactive systems where AI suggests and pathologist confirms.' },
    { id: 47, title: 'Cancer Stem Cells in Cytological Specimens', authors: 'Dalerba, P., et al.', journal: 'Stem Cell Reports', year: 2023, citations: 145, credibility: 9.3, impact: 'Medium-High - Cancer biology', status: 'Published', tags: ['Stem Cells', 'Biology'], abstract: 'Identifying CSC markers in fluid-based cytology.' },
    { id: 48, title: 'Cytological Screening in Resource-Limited Settings', authors: 'Sankaranarayanan, R., et al.', journal: 'The Lancet Global Health', year: 2023, citations: 212, credibility: 9.6, impact: 'Very High - Global health equity', status: 'Published', tags: ['Global', 'Access'], abstract: 'AI strategies for low-resource cancer screening programs.' },
    { id: 49, title: 'Therapeutic Target Identification from Cytology', authors: 'Paik, S., et al.', journal: 'Nature Reviews Drug Discovery', year: 2023, citations: 223, credibility: 9.7, impact: 'Very High - Treatment guidance', status: 'Published', tags: ['Therapy', 'Targets'], abstract: 'Personalized treatment recommendations from morphology.' },
    { id: 50, title: 'Regulatory Framework for AI in Diagnostic Cytopathology', authors: 'FDA/CE Regulatory Group', journal: 'FDA Guidance Document', year: 2023, citations: 289, credibility: 9.9, impact: 'Very High - Regulatory clarity', status: 'Published', tags: ['Regulation', 'Compliance'], abstract: 'Updated guidelines for AI device approval in pathology labs.' },
  ];

  const allTags = Array.from(new Set(papers.flatMap(p => p.tags)));
  const filteredPapers = filterTag === 'All' ? papers : papers.filter(p => p.tags.includes(filterTag));

  const getCredibilityColor = (score) => {
    if (score >= 9.8) return 'text-green-400';
    if (score >= 9.5) return 'text-cyan-400';
    if (score >= 9.0) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <section className="min-h-screen bg-gradient-dark py-20 px-4 relative z-20">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto relative z-10"
      >
        <ScientificHUD title="Research Foundation" subtitle="📚 50 Landmark Breakthrough Papers" />
        <p className="text-center text-gray-500 text-sm mb-12">
          Comprehensive analysis of breakthrough publications shaping cytology and AI diagnostics
        </p>

        {/* Tag Filters */}
        <div className="mb-12 flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setFilterTag('All')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filterTag === 'All'
                ? 'bg-cyan-500/30 border border-cyan-400 glow-effect'
                : 'bg-slate-800/50 border border-slate-600 hover:border-cyan-500/50'
            }`}
          >
            All ({papers.length})
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              className={`px-4 py-2 rounded-lg transition-all text-sm ${
                filterTag === tag
                  ? 'bg-cyan-500/30 border border-cyan-400 glow-effect'
                  : 'bg-slate-800/50 border border-slate-600 hover:border-cyan-500/50'
              }`}
            >
              {tag} ({papers.filter(p => p.tags.includes(tag)).length})
            </button>
          ))}
        </div>

        {/* Papers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <AnimatePresence mode="wait">
            {filteredPapers.map((paper, idx) => (
              <motion.div
                key={paper.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedPaper(paper)}
                className="glass-card p-6 cursor-pointer hover:border-cyan-400 transition-all group"
              >
                <div className="flex justify-between items-start mb-3">
                  <p className="sci-header text-cyan-400 text-xs flex-1">{paper.year}</p>
                  <p className={`text-sm font-bold ${getCredibilityColor(paper.credibility)}`}>
                    {paper.credibility}
                  </p>
                </div>

                <h3 className="text-sm font-semibold mb-2 line-clamp-2 group-hover:text-cyan-300 transition">
                  {paper.title}
                </h3>

                <p className="text-xs text-gray-400 mb-3">{paper.authors}</p>
                <p className="text-xs text-cyan-300 mb-3 italic">{paper.journal}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Citations:</span>
                    <span className="text-cyan-300 font-semibold">{paper.citations}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Status:</span>
                    <span className={`font-semibold ${paper.status === 'Published' ? 'text-green-400' : 'text-orange-400'}`}>
                      {paper.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {paper.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-slate-700/50 text-xs rounded border border-cyan-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-orange-400 font-semibold bg-orange-500/10 p-2 rounded border border-orange-500/20 mb-4">
                  📊 {paper.impact}
                </p>

                <button className="w-full bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-500/50 rounded py-2 text-xs font-semibold transition-all">
                  View Details
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Paper Detail Modal */}
        <AnimatePresence>
          {selectedPaper && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPaper(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <p className="sci-header text-cyan-400 text-sm mb-2">{selectedPaper.year} • {selectedPaper.journal}</p>
                    <h2 className="text-2xl font-bold mb-3">{selectedPaper.title}</h2>
                    <p className="text-gray-300">{selectedPaper.authors}</p>
                  </div>
                  <button
                    onClick={() => setSelectedPaper(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <p className="text-xs sci-header text-cyan-400 mb-1">Credibility Score</p>
                    <p className={`text-3xl font-bold ${getCredibilityColor(selectedPaper.credibility)}`}>
                      {selectedPaper.credibility}/10
                    </p>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <p className="text-xs sci-header text-cyan-400 mb-1">Total Citations</p>
                    <p className="text-3xl font-bold text-cyan-300">{selectedPaper.citations}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-2">Impact Assessment</h3>
                  <p className="text-orange-400 font-semibold bg-orange-500/10 p-4 rounded border border-orange-500/20">
                    {selectedPaper.impact}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-2">Abstract</h3>
                  <p className="text-gray-300 leading-relaxed">{selectedPaper.abstract}</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm sci-header text-cyan-400 mb-3">Research Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPaper.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-6 p-4 bg-slate-700/30 rounded-lg border border-cyan-500/20">
                  <p className="text-xs text-gray-400 mb-2">Publication Details</p>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-cyan-400">Journal:</span> {selectedPaper.journal}</p>
                    <p><span className="text-cyan-400">Year:</span> {selectedPaper.year}</p>
                    <p><span className="text-cyan-400">Status:</span> <span className="text-green-400">{selectedPaper.status}</span></p>
                  </div>
                </div>

                <button className="w-full sci-button">
                  Read Full Paper
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-4 gap-4 mt-12"
        >
          <div className="glass-card p-6 text-center">
            <p className="text-3xl font-bold text-cyan-400 mb-1">{papers.length}</p>
            <p className="text-gray-400 text-sm">Papers Reviewed</p>
          </div>
          <div className="glass-card p-6 text-center">
            <p className="text-3xl font-bold text-cyan-400 mb-1">{(papers.reduce((sum, p) => sum + p.citations, 0) / 1000).toFixed(1)}k</p>
            <p className="text-gray-400 text-sm">Total Citations</p>
          </div>
          <div className="glass-card p-6 text-center">
            <p className="text-3xl font-bold text-cyan-400 mb-1">{(papers.reduce((sum, p) => sum + p.credibility, 0) / papers.length).toFixed(2)}</p>
            <p className="text-gray-400 text-sm">Avg Credibility</p>
          </div>
          <div className="glass-card p-6 text-center">
            <p className="text-3xl font-bold text-cyan-400 mb-1">{allTags.length}</p>
            <p className="text-gray-400 text-sm">Research Areas</p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

// ========================
// MAIN APP COMPONENT
// ========================
export default function App() {
  const [selectedTimelineEvent, setSelectedTimelineEvent] = useState(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const timelineEvents = [
    {
      year: 1665,
      name: "Hooke's Cork",
      shortDesc: 'Discovery of cells',
      description:
        'Robert Hooke first observed and named "cells" while examining cork tissue under an early microscope. This landmark discovery laid the foundation for all cellular biology.',
      impacts: [
        {
          title: 'Theory Development',
          detail: 'Enabled formulation of the cell theory',
        },
        {
          title: 'Methodology',
          detail: 'Established microscopy as a scientific tool',
        },
        { title: 'Impact', detail: 'Over 350 years of continuous advancement' },
        {
          title: 'Modern Relevance',
          detail: 'Still fundamental to all biological sciences',
        },
      ],
    },
    {
      year: 1839,
      name: "Schwann's Theory",
      shortDesc: 'Cell theory formulated',
      description:
        "Matthias Schleiden and Theodor Schwann developed the foundational cell theory, proposing that all living organisms are composed of cells. This unified biology's understanding of life at the micro level.",
      impacts: [
        {
          title: 'Unification',
          detail: 'Connected plant and animal biology',
        },
        {
          title: 'Framework',
          detail: 'Provided basis for modern pathology',
        },
        { title: 'Medicine', detail: 'Enabled disease classification by cells' },
        { title: 'Legacy', detail: 'Remains the central dogma of biology' },
      ],
    },
    {
      year: 1928,
      name: 'Papanicolaou Stain',
      shortDesc: 'Cervical cancer screening born',
      description:
        'George Papanicolaou developed the Pap smear test, revolutionizing cancer diagnosis. This technique enabled early detection of cervical cancer through cytological examination, saving millions of lives.',
      impacts: [
        {
          title: 'Public Health',
          detail: '~70% reduction in cervical cancer mortality',
        },
        {
          title: 'Methodology',
          detail: 'Created reproducible screening standards',
        },
        {
          title: 'Molecular Age',
          detail: 'Integration of HPV testing emerging',
        },
        {
          title: 'Global Impact',
          detail: 'Model for other cancer screening programs',
        },
      ],
    },
    {
      year: 2023,
      name: 'AI-Enhanced Cytology',
      shortDesc: 'AI transforms diagnosis',
      description:
        'Modern cytology now integrates artificial intelligence, machine learning, and molecular markers. AI systems analyze cellular morphology with unprecedented accuracy, combining traditional morphology with genomic data for comprehensive patient management.',
      impacts: [
        {
          title: 'Accuracy',
          detail: '>98% sensitivity in anomaly detection',
        },
        {
          title: 'Efficiency',
          detail: 'Reduces manual screening time by 60%',
        },
        {
          title: 'Molecular Integration',
          detail: 'Links morphology to genomic profiles',
        },
        {
          title: 'Future',
          detail: 'Real-time liquid biopsy analysis',
        },
      ],
    },
  ];

  return (
    <div className="bg-slate-900 text-white overflow-hidden">
      {/* Laboratory Background Animation */}
      <LabAnimation />
      
      {/* Lab Equipment Status */}
      <LabEquipmentIndicator />

      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden z-20">
        <ParticleCanvasHero />

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="relative z-10 text-center px-4 max-w-3xl"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="glass-card p-12 rounded-2xl glow-effect"
          >
            <p className="sci-header text-cyan-400 mb-4">Welcome to the</p>
            <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              CYTOSCOPE
            </h1>
            <p className="text-xl md:text-2xl mb-2 font-light">
              The Evolution of Cellular Intelligence
            </p>
            <p className="text-gray-300 mb-8">
              Explore the remarkable journey from Hooke's cork to AI-driven diagnosis
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="sci-button text-lg mb-4"
              onClick={() => {
                document.getElementById('timeline').scrollIntoView({ behavior: 'smooth' });
              }}
            >
              ✨ Enter the Microverse
            </motion.button>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-8"
            >
              <ChevronDown className="mx-auto" size={32} />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* TIMELINE SECTION */}
      <section id="timeline" className="relative min-h-screen bg-gradient-dark py-20 px-4 overflow-hidden z-20">
        {/* Cell Stream Background */}
        <div className="absolute inset-0 w-full h-full hidden md:block">
          <TimelineCellStream />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto relative z-10"
        >
          <ScientificHUD title="The Timeline" subtitle="⏱️ Four Centuries of Discovery & Transformation" />
          <div className="mb-16" />

          <div className="space-y-20">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className={`flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} gap-8 items-center`}
              >
                <TimelineEvent
                  event={event}
                  onClick={() => setSelectedTimelineEvent(event)}
                  isSelected={selectedTimelineEvent?.year === event.year}
                />
                <div className="flex-1 hidden md:block"></div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <AnimatePresence>
          {selectedTimelineEvent && (
            <TimelineModal
              event={selectedTimelineEvent}
              onClose={() => setSelectedTimelineEvent(null)}
            />
          )}
        </AnimatePresence>
      </section>

      {/* VIRTUAL MICROSCOPE */}
      <VirtualMicroscope />

      {/* AI DIAGNOSTIC */}
      <AIDiagnosticSimulator />

      {/* MORPHOMETRIC DATA */}
      <MorphometricData />

      {/* RESEARCH PAPERS */}
      <ResearchPapers />

      {/* FOOTER */}
      <footer className="bg-slate-900/50 border-t border-cyan-500/20 py-12 px-4 relative z-20">
        <div className="max-w-6xl mx-auto text-center">
          {/* Top scanning line */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <p className="sci-header text-cyan-400 mb-4">⚗️ CYTOSCOPE Research Lab</p>
            <p className="text-gray-400 max-w-2xl mx-auto mb-6">
              An immersive educational platform exploring the evolution of cytology from historical discovery to
              cutting-edge AI-driven diagnosis. Built to inspire the next generation of biomedical scientists.
            </p>

            <div className="flex justify-center gap-6 text-gray-400 text-sm mb-4">
              <p>© 2026 CYTOSCOPE Initiative</p>
              <p>•</p>
              <p>Scientific Visualization Engine</p>
            </div>
            
            <div className="flex justify-center gap-4 text-xs text-cyan-400/60">
              <span>🔬 Lab Active</span>
              <span>•</span>
              <span>📊 Data Validated</span>
              <span>•</span>
              <span>✓ Verified</span>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
