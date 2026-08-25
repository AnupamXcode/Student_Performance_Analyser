import React from 'react';
import { compareMeanMedian } from '../services/statsEngine';
import { MetricCard } from '../components/MetricCard';
import { Scale, AlertCircle, CheckCircle2 } from 'lucide-react';

export const MeanVsMedian = ({ dataset }) => {
  const comp = compareMeanMedian(dataset, 'Marks');

  if (!comp) return <div className="p-4">No data available.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Mean vs Median Estimator Evaluation</h2>
        <p className="text-xs text-slate-500">Assess skewness and outlier sensitivity to pick the optimal central tendency measure.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <MetricCard title="Mean Marks" value={comp.Mean} subtitle="Sensitive to outliers" color="brand" />
        <MetricCard title="Median Marks" value={comp.Median} subtitle="Robust to outliers" color="emerald" />
        <MetricCard title="Difference (Mean - Median)" value={comp.Difference} subtitle="Skewness offset" color="purple" />
      </div>

      <div className="glass-panel p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Scale className="w-4 h-4 text-brand-500" /> Distribution Shape & Recommendation
        </h3>

        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 space-y-2 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
            <span className="font-semibold text-slate-600 dark:text-slate-400">Distribution Shape:</span>
            <span className="font-bold text-brand-600 dark:text-brand-400">{comp.DistributionShape}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
            <span className="font-semibold text-slate-600 dark:text-slate-400">Skewness Score:</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{comp.Skewness}</span>
          </div>

          <div className="pt-2 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900 dark:text-slate-100">Recommended Central Tendency Estimator:</p>
              <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{comp.RecommendedEstimator}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
