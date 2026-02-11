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
    <section className="min-h-screen bg-gradient-dark py-20 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-4xl font-bold mb-2 text-center">Virtual Microscope</h2>
        <p className="text-center text-gray-400 mb-12">Interactive cellular specimen analysis</p>

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
    <section className="min-h-screen bg-gradient-dark py-20 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-4xl font-bold mb-2 text-center">AI Diagnostic Simulator</h2>
        <p className="text-center text-gray-400 mb-12">Automated cellular anomaly detection system</p>

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
    <section className="min-h-screen bg-gradient-dark py-20 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto"
      >
        <h2 className="text-4xl font-bold mb-2 text-center">Morphometric Analysis</h2>
        <p className="text-center text-gray-400 mb-12">3D cellular feature clustering and classification</p>

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
      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
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
      <section id="timeline" className="relative min-h-screen bg-gradient-dark py-20 px-4 overflow-hidden">
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
          <h2 className="text-4xl font-bold text-center mb-4">The Timeline</h2>
          <p className="text-center text-gray-400 mb-16">
            Four centuries of discovery and transformation
          </p>

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

      {/* FOOTER */}
      <footer className="bg-slate-900/50 border-t border-cyan-500/20 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <p className="sci-header text-cyan-400 mb-4">CYTOSCOPE</p>
            <p className="text-gray-400 max-w-2xl mx-auto mb-6">
              An immersive educational platform exploring the evolution of cytology from historical discovery to
              cutting-edge AI-driven diagnosis. Built to inspire the next generation of biomedical scientists.
            </p>

            <div className="flex justify-center gap-6 text-gray-400 text-sm">
              <p>© 2026 CYTOSCOPE Initiative</p>
              <p>•</p>
              <p>Scientific Visualization Engine</p>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
