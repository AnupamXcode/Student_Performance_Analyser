import React from 'react';
import { calculateDescriptiveStats, compareMeanMedian } from '../services/statsEngine';
import { compareSamplingMethods } from '../services/samplingEngine';
import { simulateCLT } from '../services/cltEngine';
import { performBootstrap } from '../services/bootstrapEngine';
import { MetricCard } from '../components/MetricCard';
import { Download, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const FinalResults = ({ dataset }) => {
  if (!dataset || dataset.length === 0) {
    return <div className="p-6 text-slate-500">No active dataset available.</div>;
  }

  const stats = calculateDescriptiveStats(dataset, 'Marks') || {};
  const meanMed = compareMeanMedian(dataset, 'Marks') || {};
  const sampling = compareSamplingMethods(dataset, 50) || {};
  const clt = simulateCLT(dataset, [10, 30, 50, 100], 1000) || {};
  const boot = performBootstrap(dataset, 50, 5000) || {};

  const handleConfetti = () => {
    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (err) {
      console.warn('Confetti effect unavailable:', err);
    }
  };

  const handleExportSummaryCSV = () => {
    const summaryData = [
      { Metric: 'Population Mean Marks', Value: stats.Mean ?? '-' },
      { Metric: 'Population Median Marks', Value: stats.Median ?? '-' },
      { Metric: 'Best Sampling Estimator', Value: sampling.bestMethod ?? '-' },
      { Metric: 'CLT Observed SE (N=100)', Value: clt.comparisonTable?.[3]?.ObservedSE ?? '-' },
      { Metric: 'CLT Theoretical SE (N=100)', Value: clt.comparisonTable?.[3]?.TheoreticalSE ?? '-' },
      { Metric: 'Bootstrap Mean Estimate', Value: boot.metrics?.BootstrapMeanEstimate ?? '-' },
      { Metric: 'Bootstrap Standard Error', Value: boot.metrics?.BootstrapStandardError ?? '-' },
      { Metric: 'Bootstrap 95% CI', Value: boot.metrics?.ConfidenceInterval95 ?? '-' }
    ];

    const headers = Object.keys(summaryData[0]).join(',');
    const rows = summaryData.map(r => `"${r.Metric}","${r.Value}"`);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'statistical_final_results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const bestMethodMatch = sampling.comparisonTable?.find(m => m.Method === sampling.bestMethod);
  const bestDiff = bestMethodMatch ? bestMethodMatch.DiffFromPopMean : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Final Statistical Executive Summary</h2>
          <p className="text-xs text-slate-500">Automated conclusion report integrating all statistical evaluation practicals.</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleConfetti}
            className="px-4 py-2 rounded-xl bg-brand-500/10 text-brand-600 font-bold text-xs hover:bg-brand-500/20 transition-all flex items-center gap-2"
          >
            🎉 Celebrate Submission
          </button>
          <button
            onClick={handleExportSummaryCSV}
            className="px-4 py-2 rounded-xl gradient-bg text-white font-bold text-xs shadow-md hover:shadow-brand-500/20 transition-all flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" /> Export Report CSV
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard title="Population Mean" value={stats.Mean ?? '-'} subtitle="True Average Marks" color="brand" />
        <MetricCard title="Population Median" value={stats.Median ?? '-'} subtitle="Middle Value" color="emerald" />
        <MetricCard title="Best Sampler" value={sampling.bestMethod ?? '-'} subtitle="Lowest Error Method" color="purple" />
        <MetricCard title="Bootstrap Estimate" value={boot.metrics?.BootstrapMeanEstimate ?? '-'} subtitle="5000 Resamples" color="amber" />
      </div>

      {/* Final Auto-Generated Conclusion Report */}
      <div className="glass-panel p-6 space-y-4 border-l-4 border-emerald-500">
        <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Automatically Generated Statistical Conclusion
        </h3>

        <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300 font-normal leading-relaxed">
          <p>
            <strong>1. Central Tendency & Distribution:</strong> The population mean mark is <strong>{stats.Mean ?? '-'}</strong>, and median mark is <strong>{stats.Median ?? '-'}</strong>. 
            The distribution shape is classified as <strong>{meanMed.DistributionShape ?? 'Symmetrical'}</strong> with a skewness score of <code>{meanMed.Skewness ?? '0'}</code>. 
            {meanMed.RecommendedEstimator ?? ''}.
          </p>

          <p>
            <strong>2. Sampling Accuracy:</strong> Evaluating sampling performance at N=50, <strong>{sampling.bestMethod ?? 'Sampling'}</strong> provided the most accurate estimate of the population mean 
            with a minimum deviation of <code>{bestDiff}</code>.
          </p>

          <p>
            <strong>3. Central Limit Theorem:</strong> 1,000 sampling iterations demonstrated standard error decay from 
            <code>{clt.comparisonTable?.[0]?.ObservedSE ?? '-'}</code> (N=10) down to <code>{clt.comparisonTable?.[3]?.ObservedSE ?? '-'}</code> (N=100), closely following theoretical $1/\sqrt{N}$ convergence.
          </p>

          <p>
            <strong>4. Non-Parametric Bootstrap:</strong> 5,000 bootstrap resamples generated an empirical mean estimate of <strong>{boot.metrics?.BootstrapMeanEstimate ?? '-'}</strong> 
            with a 95% Confidence Interval of <strong>{boot.metrics?.ConfidenceInterval95 ?? '[-]'}</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
