"""
Bootstrap Estimation Module
Performs non-parametric bootstrap resampling to estimate sample means and standard error.
"""

import pandas as pd
import numpy as np


def perform_bootstrap(population_series: pd.Series, sample_size: int = 50, num_iterations: int = 5000, seed: int = 42) -> tuple[np.ndarray, dict]:
    """
    Draws an initial sample of size `sample_size` from population, then performs `num_iterations`
    bootstrap resampling iterations with replacement to estimate the sample mean distribution.
    """
    clean_pop = population_series.dropna().values
    pop_mean = float(np.mean(clean_pop))
    
    np.random.seed(seed)
    initial_sample = np.random.choice(clean_pop, size=min(sample_size, len(clean_pop)), replace=False)
    original_sample_mean = float(np.mean(initial_sample))
    
    # Resample with replacement from initial_sample
    bootstrap_means = np.zeros(num_iterations)
    for i in range(num_iterations):
        boot_sample = np.random.choice(initial_sample, size=len(initial_sample), replace=True)
        bootstrap_means[i] = np.mean(boot_sample)
        
    bootstrap_mean_est = float(np.mean(bootstrap_means))
    bootstrap_std = float(np.std(bootstrap_means, ddof=1))
    bootstrap_se = bootstrap_std  # In bootstrap, std dev of bootstrap distribution is the bootstrap SE
    
    ci_lower = float(np.percentile(bootstrap_means, 2.5))
    ci_upper = float(np.percentile(bootstrap_means, 97.5))
    
    metrics = {
        'Population Mean': round(pop_mean, 2),
        'Original Sample Size': len(initial_sample),
        'Original Sample Mean': round(original_sample_mean, 2),
        'Bootstrap Iterations': num_iterations,
        'Bootstrap Estimate (Mean)': round(bootstrap_mean_est, 2),
        'Bootstrap Std Dev': round(bootstrap_std, 4),
        'Bootstrap Standard Error': round(bootstrap_se, 4),
        'Difference from Pop Mean': round(abs(bootstrap_mean_est - pop_mean), 2),
        '95% Confidence Interval': f"[{round(ci_lower, 2)}, {round(ci_upper, 2)}]"
    }
    
    return bootstrap_means, metrics
