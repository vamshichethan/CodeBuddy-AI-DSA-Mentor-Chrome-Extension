import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Map, BookOpen, Zap } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import Notes from './pages/Notes';

const NAV_ITEMS = [
  { to: '/',        label: 'Analytics',  icon: LayoutDashboard },
  { to: '/roadmap', label: 'Roadmap',    icon: Map             },
  { to: '/notes',   label: 'Notes',      icon: BookOpen        },
];

function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-dark-900 text-white font-sans flex relative overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent/10 blur-[130px] rounded-full pointer-events-none z-0" />

      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-white/5 bg-dark-800/60 backdrop-blur-xl flex flex-col p-6 gap-2 relative z-10">
        {/* Logo */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg leading-none">CodeBuddy</h1>
              <p className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-widest">AI Mentor</p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/15 text-primary border border-primary/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className={isActive ? 'text-primary' : 'text-gray-500'} />
                  {label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Status pill */}
        <div className="mt-auto">
          <div className="flex items-center gap-2 bg-dark-700/60 px-3 py-2 rounded-xl border border-white/5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-xs text-gray-400">Backend Live</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto relative z-10">
        {/* Page header */}
        <header className="mb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-accent">
                {location.pathname === '/'        ? '📊 Analytics Dashboard'
                : location.pathname === '/roadmap' ? '🗺️ Your Personalized Roadmap'
                : location.pathname === '/notes'   ? '📓 Notes & Code Review'
                : 'CodeBuddy AI'}
              </h2>
              <p className="text-gray-500 mt-1 text-sm">
                {location.pathname === '/'        ? 'Track your DSA progress, patterns, and weak areas'
                : location.pathname === '/roadmap' ? 'AI-generated weekly study plan based on your history'
                : location.pathname === '/notes'   ? 'Auto-generate revision notes and get code feedback'
                : ''}
              </p>
            </motion.div>
          </AnimatePresence>
        </header>

        {/* Page transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.22 }}
          >
            <Routes>
              <Route path="/"        element={<Dashboard />} />
              <Route path="/roadmap" element={<Roadmap />}   />
              <Route path="/notes"   element={<Notes />}     />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
