"""
Descriptive Statistics Module
Calculates central tendency, dispersion, quartiles, IQR, and mean vs median comparison.
"""

import pandas as pd
import numpy as np
from scipy import stats


def calculate_descriptive_stats(series: pd.Series) -> dict:
    """
    Computes comprehensive descriptive statistics for a numeric Pandas series.
    Returns a dictionary of key metric values.
    """
    clean_series = series.dropna()
    if len(clean_series) == 0:
        return {}
    
    mean_val = float(clean_series.mean())
    median_val = float(clean_series.median())
    
    # Mode calculation
    mode_res = stats.mode(clean_series, keepdims=True)
    mode_val = float(mode_res.mode[0]) if len(mode_res.mode) > 0 else mean_val
    
    var_val = float(clean_series.var())
    std_val = float(clean_series.std())
    min_val = float(clean_series.min())
    max_val = float(clean_series.max())
    
    q1 = float(clean_series.quantile(0.25))
    q2 = float(clean_series.quantile(0.50)) # Same as median
    q3 = float(clean_series.quantile(0.75))
    iqr = q3 - q1
    
    skewness = float(clean_series.skew())
    kurtosis = float(clean_series.kurt())
    
    return {
        'Count': len(clean_series),
        'Mean': round(mean_val, 2),
        'Median': round(median_val, 2),
        'Mode': round(mode_val, 2),
        'Variance': round(var_val, 2),
        'Standard Deviation': round(std_val, 2),
        'Minimum': round(min_val, 2),
        'Maximum': round(max_val, 2),
        'Q1 (25%)': round(q1, 2),
        'Q2 (50%)': round(q2, 2),
        'Q3 (75%)': round(q3, 2),
        'IQR': round(iqr, 2),
        'Skewness': round(skewness, 2),
        'Kurtosis': round(kurtosis, 2)
    }


def compare_mean_median(series: pd.Series) -> dict:
    """
    Compares mean vs median to assess skewness and outlier sensitivity.
    """
    clean_series = series.dropna()
    mean_val = float(clean_series.mean())
    median_val = float(clean_series.median())
    diff = mean_val - median_val
    skewness = float(clean_series.skew())
    
    if abs(diff) < 1.0:
        recommendation = "Mean (Distribution is symmetrical, no strong outlier influence)"
        shape = "Approximately Symmetrical"
    elif diff > 0:
        recommendation = "Median (Distribution is right-skewed; median is robust to high score outliers)"
        shape = "Right-Skewed (Positively Skewed)"
    else:
        recommendation = "Median (Distribution is left-skewed; median is robust to low score outliers)"
        shape = "Left-Skewed (Negatively Skewed)"
        
    return {
        'Mean': round(mean_val, 2),
        'Median': round(median_val, 2),
        'Difference (Mean - Median)': round(diff, 2),
        'Skewness': round(skewness, 2),
        'Distribution Shape': shape,
        'Recommended Estimator': recommendation
    }
