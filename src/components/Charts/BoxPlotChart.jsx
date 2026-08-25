import React from 'react';
import { getPercentile } from '../../services/statsEngine';

export const BoxPlotChart = ({ dataset, keyName = 'Marks' }) => {
  const values = dataset
    .map(r => r[keyName])
    .filter(val => typeof val === 'number' && !isNaN(val))
    .sort((a, b) => a - b);

  if (values.length === 0) return null;

  const min = values[0];
  const max = values[values.length - 1];
  const q1 = getPercentile(values, 25);
  const median = getPercentile(values, 50);
  const q3 = getPercentile(values, 75);
  const iqr = q3 - q1;
  
  const lowerWhisker = Math.max(min, q1 - 1.5 * iqr);
  const upperWhisker = Math.min(max, q3 + 1.5 * iqr);
  const outliers = values.filter(v => v < lowerWhisker || v > upperWhisker);

  const range = max - min || 1;
  const toPct = (val) => `${((val - min) / range) * 100}%`;

  return (
    <div className="w-full p-6 glass-card my-4">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Boxplot of {keyName}</h4>
        <div className="flex gap-4 text-xs font-mono">
          <span className="text-slate-500">Min: <strong className="text-slate-800 dark:text-slate-200">{min.toFixed(1)}</strong></span>
          <span className="text-indigo-500">Q1: <strong className="text-indigo-700 dark:text-indigo-300">{q1.toFixed(1)}</strong></span>
          <span className="text-emerald-500">Median: <strong className="text-emerald-700 dark:text-emerald-300">{median.toFixed(1)}</strong></span>
          <span className="text-indigo-500">Q3: <strong className="text-indigo-700 dark:text-indigo-300">{q3.toFixed(1)}</strong></span>
          <span className="text-slate-500">Max: <strong className="text-slate-800 dark:text-slate-200">{max.toFixed(1)}</strong></span>
        </div>
      </div>

      <div className="relative h-20 w-full flex items-center">
        {/* Whisker Line */}
        <div 
          className="absolute h-0.5 bg-slate-400 dark:bg-slate-600 top-1/2 -translate-y-1/2"
          style={{ left: toPct(lowerWhisker), right: `${100 - parseFloat(toPct(upperWhisker))}%` }}
        />

        {/* Lower Whisker End Cap */}
        <div className="absolute h-6 w-0.5 bg-slate-400 dark:bg-slate-600 top-1/2 -translate-y-1/2" style={{ left: toPct(lowerWhisker) }} />

        {/* Upper Whisker End Cap */}
        <div className="absolute h-6 w-0.5 bg-slate-400 dark:bg-slate-600 top-1/2 -translate-y-1/2" style={{ left: toPct(upperWhisker) }} />

        {/* IQR Box */}
        <div 
          className="absolute h-12 bg-indigo-500/20 dark:bg-indigo-500/30 border-2 border-indigo-500 rounded-lg top-1/2 -translate-y-1/2 shadow-inner"
          style={{ left: toPct(q1), width: `${((q3 - q1) / range) * 100}%` }}
        />

        {/* Median Line */}
        <div 
          className="absolute h-12 w-1 bg-emerald-500 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-md"
          style={{ left: toPct(median) }}
        />

        {/* Outlier Dots */}
        {outliers.map((outlier, idx) => (
          <div
            key={idx}
            className="absolute w-3 h-3 bg-red-500 rounded-full top-1/2 -translate-y-1/2 -ml-1.5 shadow-sm hover:scale-150 transition-transform cursor-pointer"
            style={{ left: toPct(outlier) }}
            title={`Outlier: ${outlier}`}
          />
        ))}
      </div>
    </div>
  );
};
