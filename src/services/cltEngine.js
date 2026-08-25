/**
 * Central Limit Theorem (CLT) & Standard Error Engine
 * Simulates sampling distributions across sample sizes N = [10, 30, 50, 100]
 * and evaluates Observed vs Theoretical Standard Error.
 */

import { calculateDescriptiveStats } from './statsEngine';

export const simulateCLT = (dataset, sampleSizes = [10, 30, 50, 100], numSamples = 1000) => {
  const marks = dataset
    .map(r => r.Marks)
    .filter(val => typeof val === 'number' && !isNaN(val));

  if (marks.length === 0) return null;

  const popStats = calculateDescriptiveStats(marks);
  const popMean = popStats.Mean;
  const popStd = popStats['Standard Deviation'];

  const resultsByN = {};
  const comparisonTable = [];

  sampleSizes.forEach(n => {
    const sampleMeans = [];
    for (let s = 0; s < numSamples; s++) {
      let sum = 0;
      for (let i = 0; i < n; i++) {
        const randIdx = Math.floor(Math.random() * marks.length);
        sum += marks[randIdx];
      }
      sampleMeans.push(sum / n);
    }

    resultsByN[n] = sampleMeans;

    const avgSampleMean = sampleMeans.reduce((a, b) => a + b, 0) / numSamples;
    const observedSE = Math.sqrt(sampleMeans.reduce((a, b) => a + Math.pow(b - avgSampleMean, 2), 0) / (numSamples - 1));
    const theoreticalSE = popStd / Math.sqrt(n);

    comparisonTable.push({
      SampleSize: n,
      SampleMean: +avgSampleMean.toFixed(2),
      ObservedSE: +observedSE.toFixed(4),
      TheoreticalSE: +theoreticalSE.toFixed(4),
      AbsoluteError: +Math.abs(observedSE - theoreticalSE).toFixed(4)
    });
  });

  return {
    popMean,
    popStd,
    sampleSizes,
    resultsByN,
    comparisonTable
  };
};
