import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, Cell
} from 'recharts';
import {
  Target, Activity, BrainCircuit, Code2, AlertTriangle,
  CheckCircle2, TrendingUp, Sparkles
} from 'lucide-react';
import { API_BASE } from '../config/api';

const COLORS = ['#6C63FF', '#FF6584', '#4ADE80', '#FBBF24', '#A78BFA'];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch(`${API_BASE}/progress/default_user`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
          <Sparkles className="text-primary w-12 h-12" />
        </motion.div>
      </div>
    );
  }

  if (!data) return <div className="text-white text-center mt-20">Failed to load data</div>;

  const radarData = Object.entries(data.patternCount).map(([subject, A]) => ({
    subject,
    A,
    fullMark: Math.max(...Object.values(data.patternCount)) + 5,
  }));

  const barData = Object.entries(data.bugCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Attempts', value: data.totalAttempts, icon: Target, color: 'text-primary' },
          { label: 'Problems Solved', value: data.solved, icon: CheckCircle2, color: 'text-green-400' },
          { label: 'Avg Hints / Problem', value: data.avgHintsPerProblem, icon: BrainCircuit, color: 'text-yellow-400' },
          { label: 'Solve Rate', value: `${data.solveRate}%`, icon: TrendingUp, color: 'text-accent' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-6 relative overflow-hidden group hover:border-primary/50 transition-colors duration-300"
          >
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform ${stat.color}`}>
              <stat.icon size={64} />
            </div>
            <p className="text-gray-400 text-sm font-medium mb-2">{stat.label}</p>
            <h3 className="text-4xl font-bold">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Activity className="text-primary" size={20} /> Pattern Mastery Radar
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#232733" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                <Radar name="Patterns" dataKey="A" stroke="#6C63FF" fill="#6C63FF" fillOpacity={0.4} />
                <Tooltip contentStyle={{ backgroundColor: '#171A23', border: '1px solid #232733', borderRadius: '8px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Weak Areas */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl p-6 flex flex-col"
        >
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <AlertTriangle className="text-accent" size={20} /> Top Weak Areas
          </h3>
          {data.weakAreas.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-sm text-center">
              🎉 No weak areas detected yet!<br/>Keep solving more problems.
            </div>
          ) : (
            <div className="flex-1 space-y-6">
              {data.weakAreas.map((area, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300">{area.pattern}</span>
                    <span className={area.successRate < 50 ? 'text-accent' : 'text-yellow-400'}>{area.successRate}%</span>
                  </div>
                  <div className="h-2 w-full bg-dark-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${area.successRate}%` }}
                      transition={{ duration: 1, delay: 0.6 + i * 0.1 }}
                      className={`h-full rounded-full ${area.successRate < 50 ? 'bg-accent' : 'bg-yellow-400'}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Bug Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2 glass rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Code2 className="text-green-400" size={20} /> Most Frequent Bugs
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 0, left: 40, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#232733' }} contentStyle={{ backgroundColor: '#171A23', border: 'none', borderRadius: '8px' }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {barData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass rounded-2xl p-6 overflow-hidden flex flex-col"
        >
          <h3 className="text-lg font-semibold mb-6">Recent Activity</h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {data.recentSessions.map((session, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-dark-700/50 border border-white/5 hover:bg-dark-700 transition-colors">
                <div>
                  <h4 className="font-medium text-sm text-gray-200">{session.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{session.pattern || 'Uncategorized'}</p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <span className="text-xs text-gray-400 bg-dark-800 px-2 py-1 rounded-md">{session.hintsUsed} hints</span>
                  {session.solved
                    ? <CheckCircle2 size={16} className="text-green-400" />
                    : <div className="w-4 h-4 rounded-full border-2 border-dashed border-gray-500" />}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
