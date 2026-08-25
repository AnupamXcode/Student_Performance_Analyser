/**
 * Sampling Techniques Engine
 * Implements SRS, Systematic, Stratified sampling, and method accuracy comparison.
 */

import { calculateDescriptiveStats } from './statsEngine';

export const simpleRandomSampling = (dataset, sampleSize = 50) => {
  const clean = dataset.filter(row => typeof row.Marks === 'number' && !isNaN(row.Marks));
  const n = Math.min(sampleSize, clean.length);
  
  // Shuffle copy
  const shuffled = [...clean].sort(() => 0.5 - Math.random());
  const sample = shuffled.slice(0, n);
  const stats = calculateDescriptiveStats(sample, 'Marks');

  return { sample, stats };
};

export const systematicSampling = (dataset, k = 5) => {
  const clean = dataset.filter(row => typeof row.Marks === 'number' && !isNaN(row.Marks));
  const sample = [];
  
  for (let i = 0; i < clean.length; i += k) {
    sample.push(clean[i]);
  }
  
  const stats = calculateDescriptiveStats(sample, 'Marks');
  return { sample, stats };
};

export const stratifiedSampling = (dataset, stratifyCol = 'Gender', targetSize = 50) => {
  const clean = dataset.filter(row => typeof row.Marks === 'number' && !isNaN(row.Marks));
  
  const groups = {};
  clean.forEach(row => {
    const val = row[stratifyCol] || 'Other';
    if (!groups[val]) groups[val] = [];
    groups[val].push(row);
  });

  const totalN = clean.length;
  let sampled = [];

  Object.keys(groups).forEach(groupKey => {
    const groupArr = groups[groupKey];
    const prop = groupArr.length / totalN;
    const nGroup = Math.max(1, Math.round(prop * targetSize));
    const shuffled = [...groupArr].sort(() => 0.5 - Math.random());
    sampled = sampled.concat(shuffled.slice(0, nGroup));
  });

  const stats = calculateDescriptiveStats(sampled, 'Marks');
  return { sample: sampled, stats };
};

export const compareSamplingMethods = (dataset, targetSize = 50, k = 5, stratifyCol = 'Gender') => {
  const clean = dataset.filter(row => typeof row.Marks === 'number' && !isNaN(row.Marks));
  const popStats = calculateDescriptiveStats(clean, 'Marks');

  const { stats: srsStats } = simpleRandomSampling(dataset, targetSize);
  const { stats: sysStats } = systematicSampling(dataset, k);
  const { stats: stratStats } = stratifiedSampling(dataset, stratifyCol, targetSize);

  const methods = [
    {
      Method: 'Population',
      SampleSize: popStats.Count,
      Mean: popStats.Mean,
      Median: popStats.Median,
      StdDev: popStats['Standard Deviation'],
      DiffFromPopMean: 0.00
    },
    {
      Method: 'Simple Random Sampling',
      SampleSize: srsStats.Count,
      Mean: srsStats.Mean,
      Median: srsStats.Median,
      StdDev: srsStats['Standard Deviation'],
      DiffFromPopMean: +Math.abs(srsStats.Mean - popStats.Mean).toFixed(2)
    },
    {
      Method: 'Systematic Sampling',
      SampleSize: sysStats.Count,
      Mean: sysStats.Mean,
      Median: sysStats.Median,
      StdDev: sysStats['Standard Deviation'],
      DiffFromPopMean: +Math.abs(sysStats.Mean - popStats.Mean).toFixed(2)
    },
    {
      Method: 'Stratified Sampling',
      SampleSize: stratStats.Count,
      Mean: stratStats.Mean,
      Median: stratStats.Median,
      StdDev: stratStats['Standard Deviation'],
      DiffFromPopMean: +Math.abs(stratStats.Mean - popStats.Mean).toFixed(2)
    }
  ];

  // Best method (smallest diff from pop mean)
  const sampleMethods = methods.filter(m => m.Method !== 'Population');
  const sorted = [...sampleMethods].sort((a, b) => a.DiffFromPopMean - b.DiffFromPopMean);
  const bestMethod = sorted[0].Method;

  return { comparisonTable: methods, bestMethod };
};
