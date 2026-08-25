import React from 'react';
import { 
  Home, FolderUp, Sparkles, BarChart3, LineChart, Dices, 
  Target, TrendingDown, RefreshCw, Scale, Globe, Trophy, ChevronRight
} from 'lucide-react';

export const PAGES = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'data', label: 'Data Input', icon: FolderUp },
  { id: 'cleaning', label: 'Data Cleaning', icon: Sparkles },
  { id: 'stats', label: 'Descriptive Stats', icon: BarChart3 },
  { id: 'visualizations', label: 'Visualizations', icon: LineChart },
  { id: 'probability', label: 'Probability Models', icon: Dices },
  { id: 'sampling', label: 'Sampling Methods', icon: Target },
  { id: 'clt', label: 'Central Limit Theorem', icon: TrendingDown },
  { id: 'bootstrap', label: 'Bootstrap Estimation', icon: RefreshCw },
  { id: 'mean-median', label: 'Mean vs Median', icon: Scale },
  { id: 'scraping', label: 'Web Scraping', icon: Globe },
  { id: 'final', label: 'Final Report', icon: Trophy },
];

export const Sidebar = ({ activePage, setActivePage, isOpen, setIsOpen }) => {
  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 glass-panel rounded-none border-r border-slate-200/80 dark:border-slate-800/80 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
      <div className="h-full flex flex-col justify-between p-4">
        <div>
          {/* Logo / Header */}
          <div className="flex items-center gap-3 px-2 py-4 mb-4 border-b border-slate-200/60 dark:border-slate-800/60">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white font-bold text-xl shadow-md">
              S
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight leading-none text-slate-900 dark:text-slate-100">StatSystem</h1>
              <span className="text-[11px] text-slate-500 font-medium">Student Performance</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {PAGES.map((page) => {
              const Icon = page.icon;
              const isActive = activePage === page.id;
              return (
                <button
                  key={page.id}
                  onClick={() => {
                    setActivePage(page.id);
                    if (window.innerWidth < 768) setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'gradient-bg text-white shadow-md shadow-brand-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{page.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60 px-2 text-[11px] text-slate-500">
          <p className="font-semibold text-slate-700 dark:text-slate-300">Vite + React 18 Engine</p>
          <p>Statistical Analysis Suite</p>
        </div>
      </div>
    </aside>
  );
};
