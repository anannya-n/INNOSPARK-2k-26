import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const formatCr = (value) => value ? `₹${(value / 10000000).toFixed(2)} Cr` : '₹0 Cr';

const navItems = ['Overview', 'Rankings', 'Analysis'];
const seedling = (`
<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="32" cy="32" r="30" fill="rgba(232,243,237,0.16)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
  <path d="M32 40C32 28 30 22 28 18C26 22 24 28 24 40" stroke="#E8F3ED" stroke-width="3" stroke-linecap="round"/>
  <path d="M24 28C20 24 18 20 18 16" stroke="#A3B68D" stroke-width="3" stroke-linecap="round"/>
  <path d="M28 28C32 24 34 20 36 16" stroke="#A3B68D" stroke-width="3" stroke-linecap="round"/>
  <path d="M32 14C36 12 40 12 44 16" stroke="#E8F3ED" stroke-width="3" stroke-linecap="round"/>
</svg>
`);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

function SuspenseSeedling() {
  return (
    <div className="seedling-loader">
      <div className="seedling-animation" dangerouslySetInnerHTML={{ __html: seedling }} />
      <p className="text-mint/80 mt-4 text-sm">Sprouting ecosystem insights...</p>
    </div>
  );
}

function App() {
  const [data, setData] = useState(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [activeNav, setActiveNav] = useState('Overview');
  const [hoveredNav, setHoveredNav] = useState(null);

  useEffect(() => {
    fetch('/api/impact')
      .then((res) => res.json())
      .then((payload) => setData(payload));
  }, []);

  const cardOrder = useMemo(() => {
    if (!data) return [];
    return data.categories.map((category) => ({
      ...category,
      rank: data.ranking.findIndex((r) => r.id === category.id) + 1
    }));
  }, [data]);

  const allProjects = useMemo(() => {
    if (!data) return [];
    const projects = [];
    data.categories.forEach(cat => {
      if (cat.projects) {
        cat.projects.forEach(p => projects.push(p));
      }
    });
    projects.sort((a, b) => {
      const numA = parseInt(a.name?.replace(/\D/g, '') || '0', 10);
      const numB = parseInt(b.name?.replace(/\D/g, '') || '0', 10);
      return numA - numB;
    });
    return projects;
  }, [data]);

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    setMouse({ x: clientX / window.innerWidth, y: clientY / window.innerHeight });
  };

  const activeCategory = data?.categories?.[0];
  const topRanking = data?.ranking?.slice(0, 3) || [];

  return (
    <div className="min-h-screen overflow-x-hidden text-mint" onMouseMove={handleMouseMove}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="background-layer layer-1" style={{ transform: `translate(${mouse.x * 18}px, ${mouse.y * 18}px)` }} />
        <div className="background-layer layer-2" style={{ transform: `translate(${mouse.x * 12}px, ${mouse.y * 12}px)` }} />
        <div className="background-layer layer-3" style={{ transform: `translate(${mouse.x * 6}px, ${mouse.y * 6}px)` }} />
      </div>

      <header className="relative z-10 px-6 py-8 md:px-10 lg:px-14">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="rounded-[32px] backdrop-blur-xl border border-white/10 bg-forest/30 shadow-glow px-5 py-4 inline-flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-mint shadow-[0_0_16px_rgba(232,243,237,0.35)]" />
                <span className="text-sm tracking-[0.2em] uppercase text-mint/70">Green Bond Impact Reporter</span>
              </div>
            </div>
            <nav className="flex flex-wrap items-center gap-6">
              {navItems.map((item) => (
                <div 
                  key={item} 
                  className="relative"
                  onMouseEnter={() => setHoveredNav(item)}
                  onMouseLeave={() => setHoveredNav(null)}
                >
                  <button
                    className={`text-sm font-medium transition duration-300 ${activeNav === item ? 'text-cream' : 'text-mint/70'}`}
                    onClick={() => setActiveNav(item)}
                  >
                    {item}
                  </button>
                  <motion.div
                    className="absolute bottom-[-6px] left-0 h-0.5 bg-gradient-to-r from-moss to-mint rounded-full"
                    animate={{ width: (activeNav === item || hoveredNav === item) ? '100%' : '0%' }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                </div>
              ))}
            </nav>
          </div>

          {activeNav === 'Overview' && (
            <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-stretch animate-fade-in">
              <div className="rounded-[36px] border border-white/10 bg-forest/40 backdrop-blur-[12px] p-8 shadow-[inset_0_12px_24px_rgba(0,0,0,0.18)] h-full flex flex-col justify-between">
                <p className="uppercase text-xs tracking-[0.32em] text-mint/70">Biophilic Impact Dashboard</p>
                <h1 className="mt-4 text-5xl font-semibold leading-tight font-serif text-cream">Green Bond Impact Reporter</h1>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-mint/85">Explore grouped impact analytics, efficiency ratios, stacked allocation charts, and ranking by computed sustainability metrics in a forest-inspired dashboard design.</p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[30px] bg-white/8 border border-white/10 backdrop-blur-xl p-6 shadow-glow">
                    <p className="text-sm uppercase text-mint/70">Total Funding</p>
                    <p className="mt-3 text-3xl font-semibold">{data ? formatCr(data.overview.totalFunding) : '...'}</p>
                  </div>
                  <div className="rounded-[30px] bg-white/8 border border-white/10 backdrop-blur-xl p-6 shadow-glow">
                    <p className="text-sm uppercase text-mint/70">Impact Score</p>
                    <p className="mt-3 text-3xl font-semibold">{data ? data.overview.totalImpact.toLocaleString() + ' pts' : '...'}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[36px] border border-white/10 bg-moss/20 backdrop-blur-[12px] p-6 shadow-glow h-full flex flex-col justify-center">
                <p className="text-sm uppercase text-mint/70">Current Efficiency Ratio</p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="rounded-full bg-white/10 p-4 shadow-[0_0_28px_rgba(211,235,205,0.22)]">
                    <span className="text-4xl font-semibold text-cream">{data ? data.overview.avgEfficiency : '...'}</span>
                  </div>
                  <div>
                    <p className="text-sm text-mint/80">Total impact delivered per dollar funded across categories.</p>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </header>

      <main className="relative z-10 px-6 pb-16 md:px-10 lg:px-14">
        <section className="mx-auto max-w-7xl">
          {!data ? (
            <div className="mt-20 flex justify-center">
              <SuspenseSeedling />
            </div>
          ) : activeNav === 'Rankings' ? (
            <div className="space-y-10 animate-fade-in">
              <div className="relative rounded-[40px] bg-gradient-to-br from-obsidian via-forest to-[#02180b] p-8 md:p-12 shadow-neonOuter overflow-hidden min-h-[50vh]">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-neonEmerald/20 blur-[100px] rounded-full pointer-events-none" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-forest/80 blur-[120px] rounded-full pointer-events-none" />
                
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-6 mb-12 border-b border-white/5 pb-8">
                  <div>
                    <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cream to-sage font-rajdhani uppercase tracking-wider">Sustainability Impact Scoreboard</h2>
                    <p className="mt-2 text-lg text-mint/60 font-light">Real-time ranking of global green bond categories</p>
                  </div>
                  <div className="flex items-center gap-3 bg-obsidian/60 border border-neonEmerald/30 px-5 py-2.5 rounded-full backdrop-blur-md shadow-[0_0_10px_rgba(0,255,136,0.1)]">
                    <div className="w-3 h-3 bg-neonEmerald rounded-full animate-live-pulse" />
                    <span className="text-neonEmerald text-sm font-semibold tracking-widest uppercase">Live Data</span>
                  </div>
                </div>

                <motion.div 
                  className="relative z-10 flex flex-col gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {data.ranking.map((category, index) => {
                    const isFirst = index === 0;
                    const effValue = Number(category.efficiency) || 0;
                    const efficiencyPercent = Math.min(effValue * 100, 100);
                    
                    return (
                      <motion.div 
                        key={category.id} 
                        variants={itemVariants} 
                        className={`relative flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-[24px] backdrop-blur-xl border transition-all duration-300 hover:scale-[1.01] ${
                          isFirst 
                            ? 'bg-gradient-to-r from-white/10 to-transparent border-transparent shadow-neonOuterGold scale-[1.02] hover:scale-[1.03] p-8' 
                            : 'bg-white/5 border-white/10 shadow-glow hover:bg-white/10'
                        }`}
                        style={isFirst ? {
                          background: 'linear-gradient(90deg, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.2) 100%)',
                        } : {}}
                      >
                        {isFirst && (
                          <div className="absolute inset-0 rounded-[24px] p-[2px] bg-gradient-to-r from-neonGold via-neonEmerald to-transparent" style={{ WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />
                        )}
                        
                        <div className="flex items-center gap-6 md:w-1/3">
                          <div className={`flex items-center justify-center font-rajdhani font-bold ${isFirst ? 'text-6xl text-neonGold drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]' : 'text-4xl text-mint/40'} w-12`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className={`font-semibold tracking-wide ${isFirst ? 'text-3xl text-cream' : 'text-xl text-mint'}`}>{category.title}</p>
                            <p className="text-sm text-mint/50 uppercase tracking-widest mt-1">Category</p>
                          </div>
                        </div>

                        <div className="flex-1 space-y-3">
                          <div className="flex justify-between items-end">
                            <span className="text-xs text-mint/60 uppercase tracking-widest">Efficiency Metric</span>
                            <span className={`font-rajdhani font-bold ${isFirst ? 'text-3xl text-neonEmerald' : 'text-2xl text-sage'}`}>{category.efficiency}</span>
                          </div>
                          <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                            <motion.div 
                              className={`h-full rounded-full ${isFirst ? 'bg-gradient-to-r from-neonEmerald to-neonGold' : 'bg-gradient-to-r from-moss to-sage'}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${efficiencyPercent}%` }}
                              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 + index * 0.1 }}
                            />
                          </div>
                        </div>
                        
                        <div className="md:w-1/4 flex flex-col items-end gap-2 pl-4">
                            <span className="text-xs text-mint/50 uppercase tracking-wider">Sparkline Trend</span>
                            <svg width="120" height="30" viewBox="0 0 120 30" fill="none" className="opacity-80">
                                <path 
                                  d={`M0 ${15 + Math.sin(index)*5} Q 20 ${10 - Math.cos(index)*10}, 40 ${15 + Math.sin(index*2)*5} T 80 ${20 - Math.cos(index)*5} T 120 ${10 - Math.sin(index)*5}`} 
                                  stroke={isFirst ? '#FFD700' : '#A3B68D'} 
                                  strokeWidth="2" 
                                  strokeLinecap="round" 
                                  fill="none" 
                                  style={{ filter: isFirst ? 'drop-shadow(0px 0px 4px rgba(255,215,0,0.5))' : 'none' }}
                                />
                            </svg>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            </div>
          ) : activeNav === 'Analysis' ? (
            <motion.div className="space-y-10 animate-fade-in" variants={containerVariants} initial="hidden" animate="visible">
              <motion.div variants={itemVariants} className="rounded-3xl border border-emerald-800 bg-transparent p-8 shadow-lg font-sans">
                <h2 className="text-2xl font-bold text-emerald-50">Green Bonds Funding Overview</h2>
                <p className="mt-2 text-base font-light text-emerald-50">Funding allocated to individual green bonds (Projects).</p>
                <div className="mt-6 h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={allProjects}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(236,253,245,0.05)" />
                      <XAxis 
                        dataKey="name" 
                        stroke="rgba(236,253,245,0.7)" 
                        angle={-45}
                        textAnchor="end"
                        interval={0}
                        tick={{ fill: 'rgba(236,253,245,0.7)', fontSize: 12, fontFamily: 'Outfit, sans-serif' }}
                      />
                      <YAxis 
                        stroke="rgba(236,253,245,0.7)"
                        tickFormatter={(value) => `₹${value / 10000000}Cr`}
                        tick={{ fill: 'rgba(236,253,245,0.7)', fontSize: 12, fontFamily: 'Outfit, sans-serif' }}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#064e3b', border: '1px solid #065f46', borderRadius: '12px', color: '#ecfdf5' }}
                        itemStyle={{ color: '#ecfdf5', fontWeight: 'bold' }}
                        formatter={(value) => [formatCr(value), 'Funding']}
                      />
                      <Bar dataKey="funding" fill="#8c9689" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <div className="grid gap-10">
                <motion.div variants={itemVariants} className="rounded-3xl border border-emerald-800 bg-transparent p-8 shadow-lg font-sans">
                  <h2 className="text-2xl font-bold text-emerald-50">Efficiency Ratio Metrics</h2>
                  <p className="mt-2 text-base font-light text-emerald-50">Ranked categories by impact-per-funding ratio show the most efficient green bond drivers.</p>
                  <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {data.ranking.map((category, index) => (
                      <div key={category.id} className="rounded-lg bg-emerald-800/50 p-4 flex flex-col justify-between">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-light text-emerald-300">Rank {index + 1}</span>
                            <span className="text-lg font-bold text-emerald-50 mt-1">{category.title}</span>
                          </div>
                          <div className="rounded-full bg-emerald-700/50 px-3 py-1 text-sm font-bold text-emerald-50 border border-emerald-600">{category.efficiency}</div>
                        </div>
                        <div className="mt-4 h-4 rounded-full overflow-hidden bg-emerald-700 flex w-full">
                          <div className="h-full bg-gradient-to-r from-teal-400 to-lime-400" style={{ width: `${Math.min(category.efficiency * 100, 100)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="rounded-3xl border border-emerald-800 bg-transparent p-8 shadow-lg font-sans">
                  <h2 className="text-2xl font-bold text-emerald-50">Stacked Allocation Breakdown</h2>
                  <p className="mt-2 text-base font-light text-emerald-50">A visual breakdown showing Green (teal), Climate (lime), and Social (light blue) allocation ratios for each investment category.</p>
                  <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {data.categories.map((category) => {
                      const project = category.projects?.[0];
                      const allocation = project?.allocation || { green: 35, climate: 45, social: 20 };
                      return (
                        <div key={category.id} className="rounded-lg bg-emerald-800/50 p-4 flex flex-col justify-between">
                          <div className="flex flex-col">
                            <span className="text-lg font-bold text-emerald-50">{category.title}</span>
                            <span className="text-sm font-light text-emerald-300 mt-1">{allocation.green}% / {allocation.climate}% / {allocation.social}%</span>
                          </div>
                          <div className="mt-4 h-6 rounded-full overflow-hidden bg-emerald-700 flex w-full">
                            <div className="h-full bg-gradient-to-r from-teal-400 to-teal-300" style={{ width: `${allocation.green}%` }} />
                            <div className="h-full bg-gradient-to-r from-lime-400 to-lime-300" style={{ width: `${allocation.climate}%` }} />
                            <div className="h-full bg-gradient-to-r from-sky-200 to-sky-100" style={{ width: `${allocation.social}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-10 animate-fade-in">
              <div className="rounded-[36px] border border-white/10 bg-forest/35 backdrop-blur-[12px] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.24)]">
                <h2 className="text-2xl font-semibold text-cream">Grouped Aggregation by Category</h2>
                <p className="mt-2 text-mint/70">Each category is aggregated to show funding, impact and efficiency in one verdant overview.</p>
                <motion.div 
                  className="mt-6 grid gap-6 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {data.categories.map((category) => {
                    const aggregated = category;
                    return (
                      <motion.div key={category.id} variants={itemVariants} className="rounded-[30px] border border-white/10 bg-white/5 p-5 shadow-glow backdrop-blur-xl h-full flex flex-col">
                        <p className="text-sm uppercase tracking-[0.2em] text-mint/70">{category.title}</p>
                        <div className="mt-5 space-y-2">
                          <p className="text-3xl font-semibold text-cream">{aggregated.totalImpact ?? '––'}</p>
                          <p className="text-sm text-mint/80">Impact score</p>
                        </div>
                        <div className="mt-auto pt-5 text-sm text-mint/70">
                          <p>Funding: {formatCr(aggregated.totalFunding)}</p>
                          <p className="mt-1">Efficiency: {aggregated.efficiency}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            </div>
          )}
        </section>
      </main>

      <div className="corner-sticker sticker-leaf" />
      <div className="corner-sticker sticker-stone" />
      <div className="corner-sticker sticker-butterfly" />
    </div>
  );
}

export default App;
