import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { formatResponse } from '../utils/format';
import { API_BASE } from '../config/api';

export default function Roadmap() {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await fetch(`${API_BASE}/roadmap/default_user`);
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        setRoadmap(json.roadmap);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          🗺️ Your Personalized Roadmap
        </h2>
        <p className="text-gray-400 mt-2">AI-generated weekly study plan based on your weak areas</p>
      </motion.div>

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-2xl p-12 flex flex-col items-center justify-center gap-4"
        >
          <Loader2 className="text-primary animate-spin" size={40} />
          <p className="text-gray-400">Analyzing your progress and generating your roadmap…</p>
        </motion.div>
      )}

      {error && (
        <div className="glass rounded-2xl p-8 border border-accent/30 text-accent">
          ⚠️ {error}
        </div>
      )}

      {roadmap && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-8"
        >
          <div
            className="prose-custom text-gray-300 leading-relaxed space-y-3"
            dangerouslySetInnerHTML={{ __html: formatResponse(roadmap) }}
          />
        </motion.div>
      )}
    </div>
  );
}
