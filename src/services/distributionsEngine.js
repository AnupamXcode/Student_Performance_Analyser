/**
 * Probability Distributions Engine
 * Generates Uniform, Binomial (PMF, P(X=5)), and Poisson distribution datasets & analytics.
 */

// Factorial helper
const factorial = (n) => {
  if (n <= 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
};

// Combination nCr
const combinations = (n, r) => {
  if (r < 0 || r > n) return 0;
  return factorial(n) / (factorial(r) * factorial(n - r));
};

export const generateUniformDistribution = (low = 0, high = 100, size = 1000) => {
  const samples = [];
  for (let i = 0; i < size; i++) {
    samples.push(+(low + Math.random() * (high - low)).toFixed(2));
  }

  const sum = samples.reduce((a, b) => a + b, 0);
  const empMean = sum / size;
  const empVar = samples.reduce((a, b) => a + Math.pow(b - empMean, 2), 0) / (size - 1);

  const theoMean = (low + high) / 2;
  const theoVar = Math.pow(high - low, 2) / 12;

  // Histogram bins (20 bins)
  const binWidth = (high - low) / 20;
  const bins = Array.from({ length: 20 }, (_, i) => ({
    binLabel: `${Math.round(low + i * binWidth)}-${Math.round(low + (i + 1) * binWidth)}`,
    count: 0
  }));

  samples.forEach(val => {
    const idx = Math.min(Math.floor((val - low) / binWidth), 19);
    bins[idx].count++;
  });

  return {
    samples,
    bins,
    metrics: {
      Low: low,
      High: high,
      SampleSize: size,
      EmpiricalMean: +empMean.toFixed(2),
      TheoreticalMean: +theoMean.toFixed(2),
      EmpiricalVariance: +empVar.toFixed(2),
      TheoreticalVariance: +theoVar.toFixed(2)
    }
  };
};

export const generateBinomialDistribution = (n = 10, p = 0.5, size = 1000) => {
  const samples = [];
  for (let i = 0; i < size; i++) {
    let successes = 0;
    for (let trial = 0; trial < n; trial++) {
      if (Math.random() < p) successes++;
    }
    samples.push(successes);
  }

  const sum = samples.reduce((a, b) => a + b, 0);
  const empMean = sum / size;
  const empVar = samples.reduce((a, b) => a + Math.pow(b - empMean, 2), 0) / (size - 1);

  const theoMean = n * p;
  const theoVar = n * p * (1 - p);

  // Exact P(X = 5)
  const probX5Theo = combinations(n, 5) * Math.pow(p, 5) * Math.pow(1 - p, n - 5);
  const probX5Observed = samples.filter(s => s === 5).length / size;

  // PMF Table for k = 0..n
  const pmfTable = [];
  for (let k = 0; k <= n; k++) {
    const theoP = combinations(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
    const obsP = samples.filter(s => s === k).length / size;
    pmfTable.push({
      k,
      theoreticalP: +theoP.toFixed(4),
      observedP: +obsP.toFixed(4)
    });
  }

  return {
    samples,
    pmfTable,
    metrics: {
      n,
      p,
      SampleSize: size,
      EmpiricalMean: +empMean.toFixed(2),
      TheoreticalMean: +theoMean.toFixed(2),
      EmpiricalVariance: +empVar.toFixed(2),
      TheoreticalVariance: +theoVar.toFixed(2),
      'P(X = 5) [Theoretical]': +probX5Theo.toFixed(4),
      'P(X = 5) [Observed]': +probX5Observed.toFixed(4)
    }
  };
};

export const generatePoissonDistribution = (lambdaVal = 8, size = 1000) => {
  const samples = [];
  const L = Math.exp(-lambdaVal);

  for (let i = 0; i < size; i++) {
    let k = 0;
    let p = 1;
    do {
      k++;
      p *= Math.random();
    } while (p > L);
    samples.push(k - 1);
  }

  const sum = samples.reduce((a, b) => a + b, 0);
  const empMean = sum / size;
  const empVar = samples.reduce((a, b) => a + Math.pow(b - empMean, 2), 0) / (size - 1);

  // Frequency table for chart
  const maxK = Math.max(...samples, 16);
  const freqTable = [];
  for (let k = 0; k <= maxK; k++) {
    const count = samples.filter(s => s === k).length;
    const theoP = (Math.pow(lambdaVal, k) * Math.exp(-lambdaVal)) / factorial(k);
    freqTable.push({
      k,
      observedFreq: count,
      observedP: +(count / size).toFixed(4),
      theoreticalP: +theoP.toFixed(4)
    });
  }

  return {
    samples,
    freqTable,
    metrics: {
      Lambda: lambdaVal,
      SampleSize: size,
      EmpiricalMean: +empMean.toFixed(2),
      TheoreticalMean: lambdaVal,
      EmpiricalVariance: +empVar.toFixed(2),
      TheoreticalVariance: lambdaVal
    }
  };
};
