import React, { useState } from 'react';
import { generateUniformDistribution, generateBinomialDistribution, generatePoissonDistribution } from '../services/distributionsEngine';
import { DistributionPlot } from '../components/Charts/DistributionPlot';
import { MetricCard } from '../components/MetricCard';
import { Dices, Sliders } from 'lucide-react';

export const ProbabilityDistributions = () => {
  const [model, setModel] = useState('binomial');
  const [binomP, setBinomP] = useState(0.5);
  const [poissonLambda, setPoissonLambda] = useState(8);

  const uniformData = generateUniformDistribution(0, 100, 1000);
  const binomData = generateBinomialDistribution(10, binomP, 1000);
  const poissonData = generatePoissonDistribution(poissonLambda, 1000);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Probability Distributions Simulation</h2>
          <p className="text-xs text-slate-500">Uniform, Binomial (exact P(X=5)), and Poisson models with 1,000 observations.</p>
        </div>

        <div className="flex gap-2">
          {['uniform', 'binomial', 'poisson'].map((m) => (
            <button
              key={m}
              onClick={() => setModel(m)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                model === m ? 'gradient-bg text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {model === 'uniform' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <MetricCard title="Empirical Mean" value={uniformData.metrics.EmpiricalMean} subtitle="Observed 1000 Samples" color="brand" />
            <MetricCard title="Theoretical Mean" value={uniformData.metrics.TheoreticalMean} subtitle="(a+b)/2" color="emerald" />
            <MetricCard title="Empirical Variance" value={uniformData.metrics.EmpiricalVariance} subtitle="Observed Variance" color="purple" />
            <MetricCard title="Theoretical Variance" value={uniformData.metrics.TheoreticalVariance} subtitle="(b-a)^2 / 12" color="amber" />
          </div>

          <div className="glass-panel p-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">1,000 Samples Uniform Distribution U(0, 100)</h3>
            <DistributionPlot data={uniformData.bins} xKey="binLabel" barKey="count" />
          </div>
        </div>
      )}

      {model === 'binomial' && (
        <div className="space-y-6">
          <div className="glass-panel p-4 flex flex-col sm:flex-row items-center gap-4">
            <Sliders className="w-5 h-5 text-brand-500" />
            <div className="flex-1 w-full">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Success Probability (p): {binomP}</span>
                <span>n = 10 Trials</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.05"
                value={binomP}
                onChange={(e) => setBinomP(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <MetricCard title="Exact P(X = 5) Theoretical" value={binomData.metrics['P(X = 5) [Theoretical]']} subtitle="Binomial PMF" color="brand" />
            <MetricCard title="Observed P(X = 5)" value={binomData.metrics['P(X = 5) [Observed]']} subtitle="1000 Trials Ratio" color="emerald" />
            <MetricCard title="Theoretical Mean (n*p)" value={binomData.metrics.TheoreticalMean} subtitle="Expected Value" color="purple" />
            <MetricCard title="Empirical Mean" value={binomData.metrics.EmpiricalMean} subtitle="Observed Average" color="amber" />
          </div>

          <div className="glass-panel p-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Binomial PMF B(n=10, p={binomP})</h3>
            <DistributionPlot data={binomData.pmfTable} xKey="k" barKey="observedP" lineKey="theoreticalP" />
          </div>
        </div>
      )}

      {model === 'poisson' && (
        <div className="space-y-6">
          <div className="glass-panel p-4 flex flex-col sm:flex-row items-center gap-4">
            <Sliders className="w-5 h-5 text-purple-500" />
            <div className="flex-1 w-full">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Lambda (λ Rate): {poissonLambda}</span>
                <span>Mean = Variance = λ</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={poissonLambda}
                onChange={(e) => setPoissonLambda(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <MetricCard title="Lambda λ Parameter" value={poissonData.metrics.Lambda} subtitle="Rate Parameter" color="brand" />
            <MetricCard title="Empirical Mean" value={poissonData.metrics.EmpiricalMean} subtitle="Observed Mean" color="emerald" />
            <MetricCard title="Theoretical Variance" value={poissonData.metrics.TheoreticalVariance} subtitle="Equal to λ" color="purple" />
            <MetricCard title="Empirical Variance" value={poissonData.metrics.EmpiricalVariance} subtitle="Observed Variance" color="amber" />
          </div>

          <div className="glass-panel p-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Poisson Distribution Poisson(λ={poissonLambda})</h3>
            <DistributionPlot data={poissonData.freqTable} xKey="k" barKey="observedP" lineKey="theoreticalP" />
          </div>
        </div>
      )}
    </div>
  );
};
