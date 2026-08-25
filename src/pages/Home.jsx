import React from 'react';
import { MetricCard } from '../components/MetricCard';
import { Users, GraduationCap, Award, BookOpen, ArrowRight, ShieldCheck, Zap, BarChart2 } from 'lucide-react';
import { calculateDescriptiveStats } from '../services/statsEngine';

export const Home = ({ dataset, setActivePage }) => {
  const stats = calculateDescriptiveStats(dataset, 'Marks');

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Banner */}
      <div className="glass-panel p-8 gradient-bg text-white relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" /> Statistical Analytics Platform
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Student Performance Statistical Analysis System
          </h1>
          <p className="text-slate-100 text-sm leading-relaxed font-normal">
            A comprehensive, interactive web environment combining data cleaning, descriptive statistics, 
            probability modeling, sampling theory, Central Limit Theorem (CLT) simulations, and Bootstrap estimation.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setActivePage('stats')}
              className="px-5 py-2.5 rounded-xl bg-white text-brand-700 font-bold text-xs shadow-lg hover:bg-slate-100 transition-all flex items-center gap-2"
            >
              Explore Descriptive Stats <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActivePage('clt')}
              className="px-5 py-2.5 rounded-xl bg-white/10 backdrop-blur-md text-white font-semibold text-xs border border-white/20 hover:bg-white/20 transition-all"
            >
              Test CLT Simulation
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard title="Total Students" value={dataset.length} subtitle="Active Records" icon={Users} color="brand" />
        <MetricCard title="Mean Marks" value={stats?.Mean} subtitle="Population Average" icon={GraduationCap} color="emerald" />
        <MetricCard title="Median Marks" value={stats?.Median} subtitle="50th Percentile" icon={Award} color="amber" />
        <MetricCard title="Standard Deviation" value={stats?.['Standard Deviation']} subtitle="Mark Dispersion" icon={BookOpen} color="purple" />
      </div>

      {/* Problem Statement & Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-500" /> Problem Statement & Objective
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Evaluating student academic performance requires rigorous statistical methodology beyond simple averages. 
            Raw educational data frequently contains missing records, duplicate entries, and out-of-bounds metrics. 
            This system provides an interactive tool to clean dataset anomalies, evaluate distributions, test sampling accuracy, 
            and calculate parameter estimators using probability theory and resampling methods.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Data Cleaning & Stats</h4>
              <p className="text-[11px] text-slate-500">Detects missing values, removes duplicates, handles invalid numbers, and computes quartiles & IQR.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">CLT & Bootstrap Engine</h4>
              <p className="text-[11px] text-slate-500">Simulates 1,000 sample means and 5,000 bootstrap iterations for empirical confidence interval bounds.</p>
            </div>
          </div>
        </div>

        {/* Tech Stack Card */}
        <div className="glass-panel p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-indigo-500" /> Technology Stack
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
            <li className="flex justify-between items-center pb-2 border-b border-slate-200/60 dark:border-slate-800">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Frontend Framework</span>
              <span className="px-2 py-0.5 rounded bg-brand-500/10 text-brand-600 font-mono text-[11px]">React 18 + Vite</span>
            </li>
            <li className="flex justify-between items-center pb-2 border-b border-slate-200/60 dark:border-slate-800">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Styling & UI</span>
              <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 font-mono text-[11px]">Tailwind CSS</span>
            </li>
            <li className="flex justify-between items-center pb-2 border-b border-slate-200/60 dark:border-slate-800">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Data Visualization</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-mono text-[11px]">Recharts</span>
            </li>
            <li className="flex justify-between items-center pb-2 border-b border-slate-200/60 dark:border-slate-800">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Deployment</span>
              <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 font-mono text-[11px]">Vercel</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
