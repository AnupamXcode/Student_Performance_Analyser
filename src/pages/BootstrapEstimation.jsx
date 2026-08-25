import React, { useState } from 'react';
import { performBootstrap } from '../services/bootstrapEngine';
import { BootstrapChart } from '../components/Charts/BootstrapChart';
import { MetricCard } from '../components/MetricCard';
import { RefreshCw, Sliders } from 'lucide-react';

export const BootstrapEstimation = ({ dataset }) => {
  const [sampleSize, setSampleSize] = useState(50);
  const [numIterations, setNumIterations] = useState(5000);

  const boot = performBootstrap(dataset, sampleSize, numIterations);

  if (!boot) return <div className="p-4">No data available for Bootstrap resampling.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Non-Parametric Bootstrap Estimation</h2>
        <p className="text-xs text-slate-500">Resampling with replacement (up to 5,000 iterations) for empirical 95% Confidence Intervals.</p>
      </div>

      {/* Controls */}
      <div className="glass-panel p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Initial Sample Size: {sampleSize}</label>
          <input
            type="range"
            min="20"
            max={Math.min(150, dataset.length)}
            value={sampleSize}
            onChange={(e) => setSampleSize(parseInt(e.target.value))}
            className="w-full accent-purple-500"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Bootstrap Resampling Iterations: {numIterations}</label>
          <input
            type="range"
            min="1000"
            max="10000"
            step="1000"
            value={numIterations}
            onChange={(e) => setNumIterations(parseInt(e.target.value))}
            className="w-full accent-brand-500"
          />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard title="Original Sample Mean" value={boot.metrics.OriginalSampleMean} subtitle={`Initial N=${sampleSize}`} color="brand" />
        <MetricCard title="Bootstrap Mean Estimate" value={boot.metrics.BootstrapMeanEstimate} subtitle={`${numIterations} Resamples`} color="emerald" />
        <MetricCard title="Bootstrap Standard Error" value={boot.metrics.BootstrapStandardError} subtitle="Distribution Std Dev" color="purple" />
        <MetricCard title="95% Confidence Interval" value={boot.metrics.ConfidenceInterval95} subtitle="[2.5%, 97.5%] Percentiles" color="amber" />
      </div>

      {/* Bootstrap Distribution Chart */}
      <div className="glass-panel p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-purple-500" /> Bootstrap Sampling Distribution of Means
        </h3>
        <BootstrapChart histogramBins={boot.histogramBins} metrics={boot.metrics} />
      </div>
    </div>
  );
};
