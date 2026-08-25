/**
 * Non-Parametric Bootstrap Estimation Engine
 * Performs bootstrap resampling with replacement to construct empirical sampling distribution
 * and 95% Confidence Intervals.
 */

import { calculateDescriptiveStats, getPercentile } from './statsEngine';

export const performBootstrap = (dataset, sampleSize = 50, numIterations = 5000) => {
  const marks = dataset
    .map(r => r.Marks)
    .filter(val => typeof val === 'number' && !isNaN(val));

  if (marks.length === 0) return null;

  const popStats = calculateDescriptiveStats(marks);
  const popMean = popStats.Mean;

  // Draw initial sample without replacement
  const shuffled = [...marks].sort(() => 0.5 - Math.random());
  const initialSample = shuffled.slice(0, Math.min(sampleSize, marks.length));
  const origSampleMean = initialSample.reduce((a, b) => a + b, 0) / initialSample.length;

  // Perform bootstrap iterations with replacement
  const bootMeans = [];
  const n = initialSample.length;

  for (let b = 0; b < numIterations; b++) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      const randIdx = Math.floor(Math.random() * n);
      sum += initialSample[randIdx];
    }
    bootMeans.push(sum / n);
  }

  const sortedMeans = [...bootMeans].sort((a, b) => a - b);
  const bootMeanEst = sortedMeans.reduce((a, b) => a + b, 0) / numIterations;
  
  // Bootstrap SE is the std dev of bootstrap sample means
  const bootStd = Math.sqrt(sortedMeans.reduce((a, b) => a + Math.pow(b - bootMeanEst, 2), 0) / (numIterations - 1));
  
  const ciLower = getPercentile(sortedMeans, 2.5);
  const ciUpper = getPercentile(sortedMeans, 97.5);

  // Frequency bins for chart
  const minM = sortedMeans[0];
  const maxM = sortedMeans[sortedMeans.length - 1];
  const binCount = 25;
  const binWidth = (maxM - minM) / binCount || 1;

  const histogramBins = Array.from({ length: binCount }, (_, i) => ({
    binLabel: (minM + i * binWidth).toFixed(1),
    count: 0
  }));

  sortedMeans.forEach(val => {
    const idx = Math.min(Math.floor((val - minM) / binWidth), binCount - 1);
    histogramBins[idx].count++;
  });

  return {
    bootMeans: sortedMeans,
    histogramBins,
    metrics: {
      PopulationMean: popMean,
      OriginalSampleSize: n,
      OriginalSampleMean: +origSampleMean.toFixed(2),
      BootstrapIterations: numIterations,
      BootstrapMeanEstimate: +bootMeanEst.toFixed(2),
      BootstrapStdDev: +bootStd.toFixed(4),
      BootstrapStandardError: +bootStd.toFixed(4),
      DifferenceFromPopMean: +Math.abs(bootMeanEst - popMean).toFixed(2),
      ConfidenceInterval95: `[${ciLower.toFixed(2)}, ${ciUpper.toFixed(2)}]`,
      CILower: +ciLower.toFixed(2),
      CIUpper: +ciUpper.toFixed(2)
    }
  };
};
