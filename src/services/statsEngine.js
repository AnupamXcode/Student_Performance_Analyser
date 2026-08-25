/**
 * Descriptive Statistics Engine
 * Computes mean, median, mode, variance, std dev, min, max, Q1, Q2, Q3, IQR, skewness, kurtosis.
 */

export const calculateDescriptiveStats = (dataArray, key = 'Marks') => {
  const values = dataArray
    .map(row => (typeof row === 'number' ? row : row[key]))
    .filter(val => typeof val === 'number' && !isNaN(val))
    .sort((a, b) => a - b);

  if (values.length === 0) return null;

  const n = values.length;
  const sum = values.reduce((acc, curr) => acc + curr, 0);
  const mean = sum / n;

  // Median (Q2)
  const median = getPercentile(values, 50);
  const q1 = getPercentile(values, 25);
  const q3 = getPercentile(values, 75);
  const iqr = q3 - q1;

  // Mode
  const counts = {};
  let maxFreq = 0;
  let mode = values[0];
  values.forEach(v => {
    const rounded = Math.round(v * 10) / 10;
    counts[rounded] = (counts[rounded] || 0) + 1;
    if (counts[rounded] > maxFreq) {
      maxFreq = counts[rounded];
      mode = rounded;
    }
  });

  // Variance & Standard Deviation (Sample)
  const variance = values.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0) / (n - 1 || 1);
  const stdDev = Math.sqrt(variance);

  const min = values[0];
  const max = values[n - 1];

  // Skewness (Sample)
  const m3 = values.reduce((acc, curr) => acc + Math.pow(curr - mean, 3), 0) / n;
  const skewness = m3 / Math.pow(stdDev, 3) || 0;

  // Kurtosis
  const m4 = values.reduce((acc, curr) => acc + Math.pow(curr - mean, 4), 0) / n;
  const kurtosis = (m4 / Math.pow(stdDev, 4)) - 3 || 0;

  return {
    Count: n,
    Mean: +mean.toFixed(2),
    Median: +median.toFixed(2),
    Mode: +mode.toFixed(2),
    Variance: +variance.toFixed(2),
    'Standard Deviation': +stdDev.toFixed(2),
    Minimum: +min.toFixed(2),
    Maximum: +max.toFixed(2),
    'Q1 (25%)': +q1.toFixed(2),
    'Q2 (50%)': +median.toFixed(2),
    'Q3 (75%)': +q3.toFixed(2),
    IQR: +iqr.toFixed(2),
    Skewness: +skewness.toFixed(2),
    Kurtosis: +kurtosis.toFixed(2)
  };
};

export const getPercentile = (sortedArr, percentile) => {
  if (sortedArr.length === 0) return 0;
  const index = (percentile / 100) * (sortedArr.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  return sortedArr[lower] * (1 - weight) + sortedArr[upper] * weight;
};

export const compareMeanMedian = (dataArray, key = 'Marks') => {
  const stats = calculateDescriptiveStats(dataArray, key);
  if (!stats) return null;

  const diff = +(stats.Mean - stats.Median).toFixed(2);
  let shape = 'Approximately Symmetrical';
  let recommendation = 'Mean (Distribution is symmetrical, no strong outlier influence)';

  if (diff > 0.8) {
    shape = 'Right-Skewed (Positively Skewed)';
    recommendation = 'Median (Distribution is right-skewed; median is robust to high score outliers)';
  } else if (diff < -0.8) {
    shape = 'Left-Skewed (Negatively Skewed)';
    recommendation = 'Median (Distribution is left-skewed; median is robust to low score outliers)';
  }

  return {
    Mean: stats.Mean,
    Median: stats.Median,
    Difference: diff,
    Skewness: stats.Skewness,
    DistributionShape: shape,
    RecommendedEstimator: recommendation
  };
};
