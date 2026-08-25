"""
Probability Distributions Module
Generates random samples and computes metrics for Uniform, Binomial, and Poisson distributions.
"""

import numpy as np
import pandas as pd
from scipy import stats


def generate_uniform(low: float = 0.0, high: float = 100.0, size: int = 1000, seed: int = 42) -> tuple[np.ndarray, dict]:
    """
    Generates uniform distribution data and calculates theoretical vs empirical metrics.
    """
    np.random.seed(seed)
    data = np.random.uniform(low, high, size)
    
    empirical_mean = float(np.mean(data))
    empirical_var = float(np.var(data, ddof=1))
    
    theoretical_mean = (low + high) / 2.0
    theoretical_var = ((high - low) ** 2) / 12.0
    
    metrics = {
        'Low': low,
        'High': high,
        'Sample Size': size,
        'Empirical Mean': round(empirical_mean, 2),
        'Theoretical Mean': round(theoretical_mean, 2),
        'Empirical Variance': round(empirical_var, 2),
        'Theoretical Variance': round(theoretical_var, 2)
    }
    
    return data, metrics


def generate_binomial(n: int = 10, p: float = 0.5, size: int = 1000, seed: int = 42) -> tuple[np.ndarray, dict, pd.DataFrame]:
    """
    Generates binomial distribution data, probability mass function values, and P(X=5).
    """
    np.random.seed(seed)
    data = np.random.binomial(n, p, size)
    
    empirical_mean = float(np.mean(data))
    empirical_var = float(np.var(data, ddof=1))
    
    theoretical_mean = n * p
    theoretical_var = n * p * (1 - p)
    
    # Exact calculation for P(X = 5)
    prob_x_equals_5 = float(stats.binom.pmf(5, n, p))
    empirical_p_5 = float(np.mean(data == 5))
    
    # PMF table for k = 0..n
    k_vals = np.arange(0, n + 1)
    pmf_vals = stats.binom.pmf(k_vals, n, p)
    pmf_df = pd.DataFrame({'k (Successes)': k_vals, 'Theoretical P(X=k)': np.round(pmf_vals, 4)})
    
    metrics = {
        'n (Trials)': n,
        'p (Probability)': p,
        'Sample Size': size,
        'Empirical Mean': round(empirical_mean, 2),
        'Theoretical Mean': round(theoretical_mean, 2),
        'Empirical Variance': round(empirical_var, 2),
        'Theoretical Variance': round(theoretical_var, 2),
        'P(X = 5) [Theoretical]': round(prob_x_equals_5, 4),
        'P(X = 5) [Observed]': round(empirical_p_5, 4)
    }
    
    return data, metrics, pmf_df


def generate_poisson(lam: float = 8.0, size: int = 1000, seed: int = 42) -> tuple[np.ndarray, dict]:
    """
    Generates Poisson distribution data and metrics.
    """
    np.random.seed(seed)
    data = np.random.poisson(lam, size)
    
    empirical_mean = float(np.mean(data))
    empirical_var = float(np.var(data, ddof=1))
    
    theoretical_mean = lam
    theoretical_var = lam
    
    metrics = {
        'Lambda (λ)': lam,
        'Sample Size': size,
        'Empirical Mean': round(empirical_mean, 2),
        'Theoretical Mean': round(theoretical_mean, 2),
        'Empirical Variance': round(empirical_var, 2),
        'Theoretical Variance': round(theoretical_var, 2)
    }
    
    return data, metrics
