import React from 'react';
import { simulateCLT } from '../services/cltEngine';
import { CLTConvergencePlot } from '../components/Charts/CLTConvergencePlot';
import { TrendingDown, Info, ShieldCheck } from 'lucide-react';

export const CentralLimitTheorem = ({ dataset }) => {
  const clt = simulateCLT(dataset, [10, 30, 50, 100], 1000);

  if (!clt) return <div className="p-4">No data available for CLT simulation.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Central Limit Theorem (CLT) & Standard Error</h2>
        <p className="text-xs text-slate-500">1,000 sampling iterations proving convergence to Normal Distribution N(μ, σ/√N).</p>
      </div>

      {/* Theorem Box */}
      <div className="glass-panel p-5 border-l-4 border-brand-500 flex items-start gap-4">
        <Info className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
          <p className="font-bold text-slate-900 dark:text-slate-100">Central Limit Theorem Principle:</p>
          <p>
            Regardless of the population distribution shape, the sampling distribution of the sample mean approaches a 
            Normal Distribution as sample size $N$ increases. The Standard Error decreases strictly at rate $1/\sqrt{N}$.
          </p>
        </div>
      </div>

      {/* 4 Convergence Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clt.sampleSizes.map((n) => (
          <CLTConvergencePlot key={n} sampleMeans={clt.resultsByN[n]} sampleSize={n} popMean={clt.popMean} />
        ))}
      </div>

      {/* Standard Error Comparison Matrix */}
      <div className="glass-panel p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-brand-500" /> Observed vs Theoretical Standard Error (SE) Decay
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300">
                <th className="p-3 font-semibold">Sample Size (N)</th>
                <th className="p-3 font-semibold">Avg Sample Mean</th>
                <th className="p-3 font-semibold">Observed SE</th>
                <th className="p-3 font-semibold">Theoretical SE (σ/√N)</th>
                <th className="p-3 font-semibold">Absolute Error</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 font-mono">
              {clt.comparisonTable.map((row) => (
                <tr key={row.SampleSize} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                  <td className="p-3 font-bold font-sans">N = {row.SampleSize}</td>
                  <td className="p-3 text-brand-600 dark:text-brand-400 font-bold">{row.SampleMean}</td>
                  <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">{row.ObservedSE}</td>
                  <td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">{row.TheoreticalSE}</td>
                  <td className="p-3 text-slate-500">{row.AbsoluteError}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
