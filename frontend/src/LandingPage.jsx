import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Animated particle system ─── */
function ParticleField() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    const PARTICLE_COUNT = 80;
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 243, 237, ${p.opacity})`;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(163, 182, 141, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="landing-particles"
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  );
}

/* ─── Floating SDG badges ─── */
const sdgBadges = [
  { number: 7, title: 'Affordable & Clean Energy', color: '#FCC30B' },
  { number: 13, title: 'Climate Action', color: '#3F7E44' },
];

/* ─── Feature cards ─── */
const features = [
  {
    icon: '📊',
    title: 'Impact Analytics',
    description: 'Track and visualize the real-world impact of green bond investments across multiple sustainability categories.',
  },
  {
    icon: '🌱',
    title: 'Sustainability Scoring',
    description: 'Advanced efficiency metrics rank categories by impact-per-funding ratio for informed decision-making.',
  },
  {
    icon: '📈',
    title: 'Allocation Insights',
    description: 'Interactive stacked charts reveal Green, Climate, and Social allocation breakdowns for every category.',
  },
];

/* ─── Main Landing Page ─── */
export default function LandingPage({ onLaunch }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="landing-root">
      <ParticleField />

      {/* ─── Background decorative blobs ─── */}
      <div className="landing-blob landing-blob-1" />
      <div className="landing-blob landing-blob-2" />
      <div className="landing-blob landing-blob-3" />

      {/* ─── Hero Section ─── */}
      <motion.section
        className="landing-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 1.2 }}
      >
        <motion.div
          className="landing-badge"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <span className="landing-badge-dot" />
          <span>Green Bond Impact Reporter</span>
        </motion.div>

        <motion.h1
          className="landing-title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          Empowering
          <br />
          <span className="landing-title-accent">Sustainable Finance</span>
        </motion.h1>

        <motion.p
          className="landing-subtitle"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          Track, analyze, and report the real-world impact of green bond investments
          with cutting-edge data visualization and sustainability metrics.
        </motion.p>

        <motion.button
          className="landing-cta"
          onClick={onLaunch}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          whileHover={{ scale: 1.06, boxShadow: '0 0 40px rgba(0,255,136,0.35)' }}
          whileTap={{ scale: 0.97 }}
        >
          <span>Launch Dashboard</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </motion.button>
      </motion.section>

      {/* ─── Features Section ─── */}
      <motion.section
        className="landing-features"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 60 }}
        transition={{ delay: 1.4, duration: 0.9 }}
      >
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            className="landing-feature-card"
            whileHover={{ y: -8, boxShadow: '0 20px 60px rgba(0,255,136,0.12)' }}
            transition={{ duration: 0.3 }}
          >
            <span className="landing-feature-icon">{feature.icon}</span>
            <h3 className="landing-feature-title">{feature.title}</h3>
            <p className="landing-feature-desc">{feature.description}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* ─── SDG Section ─── */}
      <motion.section
        className="landing-sdg-section"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 40 }}
        transition={{ delay: 1.8, duration: 0.8 }}
      >
        <h2 className="landing-sdg-heading">Aligned with UN SDGs</h2>
        <div className="landing-sdg-badges">
          {sdgBadges.map((sdg) => (
            <motion.div
              key={sdg.number}
              className="landing-sdg-badge"
              style={{ borderColor: sdg.color, boxShadow: `0 0 20px ${sdg.color}33` }}
              whileHover={{ scale: 1.08, boxShadow: `0 0 30px ${sdg.color}55` }}
            >
              <span className="landing-sdg-number" style={{ color: sdg.color }}>{sdg.number}</span>
              <span className="landing-sdg-title">{sdg.title}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ─── Project Info Panel (bottom-right) ─── */}
      <motion.div
        className="landing-info-panel"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: isLoaded ? 1 : 0, x: isLoaded ? 0 : 40 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <div className="landing-info-header">Project Details</div>
        <div className="landing-info-row">
          <span className="landing-info-label">Project Title</span>
          <span className="landing-info-value">GREEN BOND IMPACT REPORTER</span>
        </div>
        <div className="landing-info-row">
          <span className="landing-info-label">Division</span>
          <span className="landing-info-value">COMPS-C</span>
        </div>
        <div className="landing-info-row">
          <span className="landing-info-label">Batch</span>
          <span className="landing-info-value">B</span>
        </div>
        <div className="landing-info-divider" />
        <div className="landing-info-header" style={{ marginTop: '0.5rem' }}>Team</div>
        <div className="landing-info-member">Aaryan Mohite <span>C-34</span></div>
        <div className="landing-info-member">Ananya Narhe <span>C-35</span></div>
        <div className="landing-info-member">Yuvraj Pal <span>C-36</span></div>
        <div className="landing-info-member">Harish Parihar <span>C-37</span></div>
        <div className="landing-info-divider" />
        <div className="landing-info-header" style={{ marginTop: '0.5rem' }}>SDGs</div>
        <div className="landing-info-sdg">
          <span style={{ color: '#FCC30B' }}>7</span> — Clean and Affordable Energy
        </div>
        <div className="landing-info-sdg">
          <span style={{ color: '#3F7E44' }}>13</span> — Climate Action
        </div>
      </motion.div>
    </div>
  );
}
