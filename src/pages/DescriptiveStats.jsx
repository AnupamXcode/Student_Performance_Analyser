import React, { useState } from 'react';
import { calculateDescriptiveStats } from '../services/statsEngine';
import { MetricCard } from '../components/MetricCard';
import { Calculator, Award, BookOpen, Layers, BarChart } from 'lucide-react';

export const DescriptiveStats = ({ dataset }) => {
  const numericCols = ['Marks', 'Attendance', 'Study_Hours'];
  const [selectedCol, setSelectedCol] = useState('Marks');

  const stats = calculateDescriptiveStats(dataset, selectedCol);

  if (!stats) return <div className="p-4">No data available</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Descriptive Statistics</h2>
          <p className="text-xs text-slate-500">Central tendency, dispersion, quartiles, and IQR metrics.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Target Variable:</span>
          <select
            value={selectedCol}
            onChange={(e) => setSelectedCol(e.target.value)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
          >
            {numericCols.map(col => <option key={col} value={col}>{col}</option>)}
          </select>
        </div>
      </div>

      {/* Top 4 Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard title="Mean" value={stats.Mean} subtitle="Arithmetic Average" icon={Calculator} color="brand" />
        <MetricCard title="Median (Q2)" value={stats.Median} subtitle="50th Percentile" icon={Award} color="emerald" />
        <MetricCard title="Std Deviation" value={stats['Standard Deviation']} subtitle="Data Dispersion" icon={BookOpen} color="purple" />
        <MetricCard title="Interquartile Range (IQR)" value={stats.IQR} subtitle="Q3 - Q1 Spread" icon={Layers} color="amber" />
      </div>

      {/* Detailed Stats Matrix */}
      <div className="glass-panel p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <BarChart className="w-4 h-4 text-brand-500" /> Complete Statistical Summary Table
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300">
                <th className="p-3 font-semibold">Statistical Metric</th>
                <th className="p-3 font-semibold">Calculated Value</th>
                <th className="p-3 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 font-mono">
              {Object.entries(stats).map(([metric, val]) => (
                <tr key={metric} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                  <td className="p-3 font-semibold text-slate-900 dark:text-slate-100 font-sans">{metric}</td>
                  <td className="p-3 font-bold text-brand-600 dark:text-brand-400">{val}</td>
                  <td className="p-3 text-slate-500 font-sans">
                    {metric.includes('Q1') ? '25th Percentile' : metric.includes('Q3') ? '75th Percentile' : metric.includes('IQR') ? 'Middle 50% Range' : 'Population/Sample Statistic'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
