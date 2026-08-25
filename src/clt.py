"""
Central Limit Theorem (CLT) & Standard Error Module
Simulates sampling distributions across multiple sample sizes (10, 30, 50, 100)
and evaluates observed vs theoretical Standard Errors.
"""

import pandas as pd
import numpy as np


def simulate_clt(population_series: pd.Series, sample_sizes: list = [10, 30, 50, 100], num_samples: int = 1000, seed: int = 42) -> dict:
    """
    Generates sampling distributions of the mean for specified sample sizes.
    Returns dictionary mapping sample size to list of sample means.
    """
    clean_pop = population_series.dropna().values
    np.random.seed(seed)
    
    results = {}
    for n in sample_sizes:
        sample_means = []
        for _ in range(num_samples):
            # Sampling with replacement allows any sample size even if n > population size
            sample = np.random.choice(clean_pop, size=n, replace=True)
            sample_means.append(np.mean(sample))
        results[n] = np.array(sample_means)
        
    return results


def calculate_standard_error_comparison(population_series: pd.Series, sample_sizes: list = [10, 30, 50, 100], num_samples: int = 1000, seed: int = 42) -> tuple[pd.DataFrame, dict]:
    """
    Calculates and compares theoretical vs observed Standard Error for each sample size.
    
    Theoretical SE = Population Std / sqrt(N)
    Observed SE = Standard Deviation of the 1000 Sample Means
    """
    clean_pop = population_series.dropna().values
    pop_mean = float(np.mean(clean_pop))
    pop_std = float(np.std(clean_pop, ddof=1))
    
    clt_results = simulate_clt(population_series, sample_sizes=sample_sizes, num_samples=num_samples, seed=seed)
    
    table_rows = []
    for n in sample_sizes:
        means = clt_results[n]
        avg_sample_mean = float(np.mean(means))
        observed_se = float(np.std(means, ddof=1))
        theoretical_se = pop_std / np.sqrt(n)
        
        table_rows.append({
            'Sample Size (N)': n,
            'Sample Mean': round(avg_sample_mean, 2),
            'Observed SE': round(observed_se, 4),
            'Theoretical SE': round(theoretical_se, 4),
            'Absolute Error': round(abs(observed_se - theoretical_se), 4)
        })
        
    summary_table = pd.DataFrame(table_rows)
    
    population_info = {
        'Population Mean': round(pop_mean, 2),
        'Population Std Dev': round(pop_std, 2),
        'Total Population Count': len(clean_pop)
    }
    
    return summary_table, clt_results, population_info
