"""
Data Preprocessing Module
Handles dataset validation, missing value detection, duplicate removal,
numeric type conversions, and invalid negative value handling.
"""

import pandas as pd
import numpy as np


REQUIRED_COLUMNS = ['Student_ID', 'Gender', 'Department', 'Attendance', 'Study_Hours', 'Marks']


def validate_columns(df: pd.DataFrame):
    """
    Checks if the dataset contains the essential required columns.
    Returns (is_valid, missing_columns).
    """
    missing = [col for col in REQUIRED_COLUMNS if col not in df.columns]
    is_valid = len(missing) == 0
    return is_valid, missing


def detect_missing_and_duplicates(df: pd.DataFrame) -> dict:
    """
    Inspects missing values per column and duplicate rows count.
    """
    missing_series = df.isnull().sum()
    missing_dict = missing_series[missing_series > 0].to_dict()
    duplicate_count = int(df.duplicated().sum())
    
    return {
        'total_rows': len(df),
        'total_cols': len(df.columns),
        'missing_values': missing_dict,
        'missing_total': int(df.isnull().sum().sum()),
        'duplicate_rows': duplicate_count
    }


def clean_dataset(df: pd.DataFrame, imputation_strategy: str = 'median', fix_negatives: bool = True) -> tuple[pd.DataFrame, dict]:
    """
    Cleans the dataset:
    1. Removes duplicate rows.
    2. Converts numeric columns to float/int.
    3. Handles invalid negative values (e.g., negative Marks or Study_Hours).
    4. Imputes missing numeric values using mean or median, or drops them.
    
    Returns (cleaned_df, cleaning_summary).
    """
    df_clean = df.copy()
    initial_rows = len(df_clean)
    
    # 1. Remove duplicate rows
    duplicates_removed = int(df_clean.duplicated().sum())
    df_clean = df_clean.drop_duplicates().reset_index(drop=True)
    
    # 2. Convert numeric columns
    numeric_cols = ['Attendance', 'Study_Hours', 'Marks']
    for col in numeric_cols:
        if col in df_clean.columns:
            df_clean[col] = pd.to_numeric(df_clean[col], errors='coerce')
            
    # 3. Handle invalid negative values
    invalid_negatives_fixed = 0
    if fix_negatives:
        for col in numeric_cols:
            if col in df_clean.columns:
                negative_mask = df_clean[col] < 0
                count_neg = int(negative_mask.sum())
                if count_neg > 0:
                    invalid_negatives_fixed += count_neg
                    # Convert negative values to NaN so imputation handles them cleanly
                    df_clean.loc[negative_mask, col] = np.nan

    # 4. Handle missing numerical values
    missing_before_impute = int(df_clean[numeric_cols].isnull().sum().sum()) if any(c in df_clean.columns for c in numeric_cols) else 0
    
    if imputation_strategy in ['mean', 'median']:
        for col in numeric_cols:
            if col in df_clean.columns and df_clean[col].isnull().sum() > 0:
                fill_val = df_clean[col].median() if imputation_strategy == 'median' else df_clean[col].mean()
                df_clean[col] = df_clean[col].fillna(round(fill_val, 2))
    elif imputation_strategy == 'drop':
        df_clean = df_clean.dropna(subset=[c for c in numeric_cols if c in df_clean.columns]).reset_index(drop=True)
        
    final_rows = len(df_clean)
    
    summary = {
        'initial_rows': initial_rows,
        'final_rows': final_rows,
        'duplicates_removed': duplicates_removed,
        'invalid_negatives_fixed': invalid_negatives_fixed,
        'missing_imputed_or_dropped': missing_before_impute,
        'imputation_strategy': imputation_strategy
    }
    
    return df_clean, summary
