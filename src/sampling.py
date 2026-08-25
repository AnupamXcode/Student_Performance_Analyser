"""
Sampling Techniques Module
Implements Simple Random, Systematic, and Stratified Sampling,
and evaluates sampling accuracy against population metrics.
"""

import pandas as pd
import numpy as np


def simple_random_sampling(df: pd.DataFrame, sample_size: int = 50, seed: int = 42) -> tuple[pd.DataFrame, dict]:
    """
    Performs Simple Random Sampling without replacement.
    """
    n = min(sample_size, len(df))
    sample_df = df.sample(n=n, random_state=seed).reset_index(drop=True)
    
    marks = sample_df['Marks'].dropna()
    stats = {
        'Sample Size': n,
        'Mean': round(float(marks.mean()), 2),
        'Median': round(float(marks.median()), 2),
        'Std Dev': round(float(marks.std()), 2)
    }
    return sample_df, stats


def systematic_sampling(df: pd.DataFrame, k: int = 5, start_index: int = 0) -> tuple[pd.DataFrame, dict]:
    """
    Performs Systematic Sampling by taking every k-th record.
    """
    indices = np.arange(start_index, len(df), k)
    sample_df = df.iloc[indices].reset_index(drop=True)
    
    marks = sample_df['Marks'].dropna()
    stats = {
        'Sample Size': len(sample_df),
        'k Interval': k,
        'Mean': round(float(marks.mean()), 2),
        'Median': round(float(marks.median()), 2),
        'Std Dev': round(float(marks.std()), 2)
    }
    return sample_df, stats


def stratified_sampling(df: pd.DataFrame, stratify_column: str = 'Gender', target_sample_size: int = 50, seed: int = 42) -> tuple[pd.DataFrame, dict]:
    """
    Performs proportional Stratified Sampling across categories of stratify_column.
    """
    if stratify_column not in df.columns:
        raise ValueError(f"Stratification column '{stratify_column}' not found in dataset.")
        
    group_proportions = df[stratify_column].value_counts(normalize=True)
    sampled_groups = []
    
    for group_val, prop in group_proportions.items():
        sub_df = df[df[stratify_column] == group_val]
        n_group = max(1, int(round(prop * target_sample_size)))
        n_group = min(n_group, len(sub_df))
        sampled_sub = sub_df.sample(n=n_group, random_state=seed)
        sampled_groups.append(sampled_sub)
        
    sample_df = pd.concat(sampled_groups).reset_index(drop=True)
    marks = sample_df['Marks'].dropna()
    
    stats = {
        'Sample Size': len(sample_df),
        'Stratify Column': stratify_column,
        'Mean': round(float(marks.mean()), 2),
        'Median': round(float(marks.median()), 2),
        'Std Dev': round(float(marks.std()), 2)
    }
    return sample_df, stats


def compare_sampling_methods(df: pd.DataFrame, target_size: int = 50, k: int = 5, stratify_col: str = 'Gender', seed: int = 42) -> tuple[pd.DataFrame, str]:
    """
    Generates comparison table for Population, SRS, Systematic, and Stratified sampling.
    Identifies the sampling method closest to population mean.
    """
    pop_marks = df['Marks'].dropna()
    pop_mean = float(pop_marks.mean())
    pop_median = float(pop_marks.median())
    pop_std = float(pop_marks.std())
    
    _, srs_stats = simple_random_sampling(df, sample_size=target_size, seed=seed)
    _, sys_stats = systematic_sampling(df, k=k)
    _, strat_stats = stratified_sampling(df, stratify_column=stratify_col, target_sample_size=target_size, seed=seed)
    
    rows = [
        {
            'Method': 'Population',
            'Sample Size': len(df),
            'Mean': round(pop_mean, 2),
            'Median': round(pop_median, 2),
            'Std Dev': round(pop_std, 2),
            'Difference from Pop Mean': 0.00
        },
        {
            'Method': 'Simple Random Sampling',
            'Sample Size': srs_stats['Sample Size'],
            'Mean': srs_stats['Mean'],
            'Median': srs_stats['Median'],
            'Std Dev': srs_stats['Std Dev'],
            'Difference from Pop Mean': round(abs(srs_stats['Mean'] - pop_mean), 2)
        },
        {
            'Method': 'Systematic Sampling',
            'Sample Size': sys_stats['Sample Size'],
            'Mean': sys_stats['Mean'],
            'Median': sys_stats['Median'],
            'Std Dev': sys_stats['Std Dev'],
            'Difference from Pop Mean': round(abs(sys_stats['Mean'] - pop_mean), 2)
        },
        {
            'Method': 'Stratified Sampling',
            'Sample Size': strat_stats['Sample Size'],
            'Mean': strat_stats['Mean'],
            'Median': strat_stats['Median'],
            'Std Dev': strat_stats['Std Dev'],
            'Difference from Pop Mean': round(abs(strat_stats['Mean'] - pop_mean), 2)
        }
    ]
    
    comp_df = pd.DataFrame(rows)
    
    # Identify method with minimum non-zero error
    sample_rows = comp_df[comp_df['Method'] != 'Population']
    best_row = sample_rows.loc[sample_rows['Difference from Pop Mean'].idxmin()]
    best_method = best_row['Method']
    
    return comp_df, best_method
