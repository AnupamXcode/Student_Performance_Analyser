import React, { useState } from 'react';
import { compareSamplingMethods } from '../services/samplingEngine';
import { MetricCard } from '../components/MetricCard';
import { Target, Trophy, CheckCircle2 } from 'lucide-react';

export const SamplingTechniques = ({ dataset }) => {
  const [sampleSize, setSampleSize] = useState(50);
  const [kInterval, setKInterval] = useState(5);
  const [stratCol, setStratCol] = useState('Gender');

  const { comparisonTable, bestMethod } = compareSamplingMethods(dataset, sampleSize, kInterval, stratCol);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Sampling Techniques & Accuracy Evaluation</h2>
        <p className="text-xs text-slate-500">Compare Simple Random Sampling, Systematic Sampling, and Stratified Sampling against Population parameters.</p>
      </div>

      {/* Controls */}
      <div className="glass-panel p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Target Sample Size (N): {sampleSize}</label>
          <input
            type="range"
            min="10"
            max={Math.min(150, dataset.length)}
            value={sampleSize}
            onChange={(e) => setSampleSize(parseInt(e.target.value))}
            className="w-full accent-brand-500"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Systematic k-Interval: {kInterval}</label>
          <input
            type="range"
            min="2"
            max="10"
            value={kInterval}
            onChange={(e) => setKInterval(parseInt(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Stratification Column:</label>
          <select
            value={stratCol}
            onChange={(e) => setStratCol(e.target.value)}
            className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
          >
            <option value="Gender">Gender</option>
            <option value="Department">Department</option>
          </select>
        </div>
      </div>

      {/* Highlight Best Method */}
      <div className="glass-panel p-5 border-l-4 border-emerald-500 flex items-center gap-4">
        <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600">
          <Trophy className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase">Most Accurate Sampling Estimator</h4>
          <p className="text-base font-extrabold text-slate-900 dark:text-slate-100">
            <span className="text-emerald-600 dark:text-emerald-400">{bestMethod}</span> produced the lowest absolute error relative to the true population mean!
          </p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="glass-panel p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Target className="w-4 h-4 text-brand-500" /> Sampling Methods Comparison Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300">
                <th className="p-3 font-semibold">Sampling Method</th>
                <th className="p-3 font-semibold">Sample Size</th>
                <th className="p-3 font-semibold">Sample Mean</th>
                <th className="p-3 font-semibold">Sample Median</th>
                <th className="p-3 font-semibold">Std Dev</th>
                <th className="p-3 font-semibold">Diff from Pop Mean</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 font-mono">
              {comparisonTable.map((row) => {
                const isBest = row.Method === bestMethod;
                return (
                  <tr key={row.Method} className={`hover:bg-slate-50 dark:hover:bg-slate-900/40 ${isBest ? 'bg-emerald-500/10 font-bold' : ''}`}>
                    <td className="p-3 font-sans text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      {row.Method}
                      {isBest && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                    </td>
                    <td className="p-3">{row.SampleSize}</td>
                    <td className="p-3 text-brand-600 dark:text-brand-400 font-bold">{row.Mean}</td>
                    <td className="p-3">{row.Median}</td>
                    <td className="p-3">{row.StdDev}</td>
                    <td className={`p-3 font-bold ${row.DiffFromPopMean === 0 ? 'text-slate-400' : isBest ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600'}`}>
                      {row.DiffFromPopMean}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
