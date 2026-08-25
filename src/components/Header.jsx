import React from 'react';
import { Sun, Moon, Menu, Github, Database, CheckCircle2 } from 'lucide-react';

export const Header = ({ darkMode, setDarkMode, isSidebarOpen, setIsSidebarOpen, datasetLength }) => {
  return (
    <header className="sticky top-0 z-30 w-full glass-panel rounded-none border-b border-slate-200/80 dark:border-slate-800/80 px-6 py-3.5 mb-6 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Active Dataset: {datasetLength} Rows</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <a
          href="https://github.com/AnupamXcode/Student_Performance_Analyser"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Github className="w-4 h-4" />
          <span className="hidden sm:inline">GitHub Repo</span>
        </a>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          title="Toggle Theme"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>
      </div>
    </header>
  );
};
