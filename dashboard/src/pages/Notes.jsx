import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Loader2, Code2, Sparkles, ClipboardCheck } from 'lucide-react';
import { formatResponse } from '../utils/format';
import { API_BASE } from '../config/api';

const LANGUAGES = ['JavaScript', 'Python', 'Java', 'C++', 'TypeScript', 'Go'];

export default function Notes() {
  const [form, setForm] = useState({ title: '', description: '', pattern: '', language: 'JavaScript', userCode: '' });
  const [notes, setNotes] = useState(null);
  const [review, setReview] = useState(null);
  const [activeTab, setActiveTab] = useState('notes');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!form.title || !form.description) {
      setError('Problem title and description are required.');
      return;
    }
    setError(null);
    setLoading(true);
    setNotes(null);
    setReview(null);

    try {
      const [notesRes, reviewRes] = await Promise.all([
        fetch(`${API_BASE}/notes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }),
        form.userCode ? fetch(`${API_BASE}/review`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: form.title, userCode: form.userCode, language: form.language }),
        }) : Promise.resolve(null),
      ]);

      const notesJson = await notesRes.json();
      if (notesJson.error) throw new Error(notesJson.error);
      setNotes(notesJson.notes);

      if (reviewRes) {
        const reviewJson = await reviewRes.json();
        if (!reviewJson.error) setReview(reviewJson.review);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          📓 Notes & Code Review
        </h2>
        <p className="text-gray-400 mt-2">Auto-generate revision notes and get AI feedback on your solution</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2"><BookOpen size={18} className="text-primary" /> Problem Details</h3>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Problem Title *</label>
            <input
              className="w-full bg-dark-700 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary/60 transition-colors"
              placeholder="e.g. Two Sum"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Problem Description *</label>
            <textarea
              rows={3}
              className="w-full bg-dark-700 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary/60 transition-colors resize-none"
              placeholder="Paste the problem description…"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">DSA Pattern</label>
              <input
                className="w-full bg-dark-700 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary/60 transition-colors"
                placeholder="e.g. Two Pointer"
                value={form.pattern}
                onChange={e => setForm(f => ({ ...f, pattern: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Language</label>
              <select
                className="w-full bg-dark-700 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary/60 transition-colors"
                value={form.language}
                onChange={e => setForm(f => ({ ...f, language: e.target.value }))}
              >
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Your Code (optional — needed for Code Review)</label>
            <textarea
              rows={5}
              className="w-full bg-dark-700 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-primary/60 transition-colors resize-none"
              placeholder="Paste your solution here for AI code review…"
              value={form.userCode}
              onChange={e => setForm(f => ({ ...f, userCode: e.target.value }))}
            />
          </div>

          {error && <p className="text-accent text-sm">⚠️ {error}</p>}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Generating…</> : <><Sparkles size={16} /> Generate Notes & Review</>}
          </button>
        </motion.div>

        {/* Output Panel */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-2xl p-6 flex flex-col">
          {/* Tab switcher */}
          <div className="flex gap-2 mb-5">
            {['notes', 'review'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === tab ? 'bg-primary text-white' : 'bg-dark-700 text-gray-400 hover:text-white'}`}
              >
                {tab === 'notes' ? '📓 Revision Notes' : '🔍 Code Review'}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full gap-3 text-gray-400 py-12">
                  <Loader2 className="animate-spin text-primary" size={32} />
                  <p className="text-sm">AI is thinking…</p>
                </motion.div>
              )}
              {!loading && activeTab === 'notes' && notes && (
                <motion.div key="notes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-400 flex items-center gap-1"><Code2 size={14} /> Revision Note</span>
                    <button onClick={() => handleCopy(notes)} className="text-xs text-primary hover:underline flex items-center gap-1">
                      <ClipboardCheck size={12} /> {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="text-gray-300 text-sm leading-relaxed space-y-1"
                    dangerouslySetInnerHTML={{ __html: formatResponse(notes) }} />
                </motion.div>
              )}
              {!loading && activeTab === 'review' && review && (
                <motion.div key="review" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-400 flex items-center gap-1"><Code2 size={14} /> Code Review</span>
                    <button onClick={() => handleCopy(review)} className="text-xs text-primary hover:underline flex items-center gap-1">
                      <ClipboardCheck size={12} /> {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="text-gray-300 text-sm leading-relaxed space-y-1"
                    dangerouslySetInnerHTML={{ __html: formatResponse(review) }} />
                </motion.div>
              )}
              {!loading && activeTab === 'review' && !review && !notes && (
                <motion.div key="empty-review" className="text-center text-gray-500 py-12 text-sm">
                  Paste your code and click Generate to get a code review.
                </motion.div>
              )}
              {!loading && activeTab === 'notes' && !notes && (
                <motion.div key="empty-notes" className="text-center text-gray-500 py-12 text-sm">
                  Fill in the problem details and click Generate to create revision notes.
                </motion.div>
              )}
              {!loading && activeTab === 'review' && notes && !review && (
                <motion.div key="no-code" className="text-center text-gray-500 py-12 text-sm">
                  No code was provided for review. Paste your solution in the form to get AI feedback.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
