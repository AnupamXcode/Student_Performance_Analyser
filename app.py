"""
Student Performance Statistical Analysis System
Main Streamlit Dashboard Application
"""

import os
import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Import statistical modules from src/
from src.preprocessing import validate_columns, detect_missing_and_duplicates, clean_dataset
from src.statistics import calculate_descriptive_stats, compare_mean_median
from src.distributions import generate_uniform, generate_binomial, generate_poisson
from src.sampling import (
    simple_random_sampling, systematic_sampling, stratified_sampling, compare_sampling_methods
)
from src.clt import calculate_standard_error_comparison
from src.bootstrap import perform_bootstrap
from src.scraping import scrape_table_data

# Page Configuration
st.set_page_config(
    page_title="Student Performance Statistical Analysis",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for styling
st.markdown("""
<style>
    .main-header {
        font-size: 2.3rem;
        font-weight: 700;
        color: #1E3A8A;
        margin-bottom: 0.5rem;
    }
    .sub-header {
        font-size: 1.1rem;
        color: #4B5563;
        margin-bottom: 1.5rem;
    }
    .metric-card {
        background-color: #F3F4F6;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 4px solid #2563EB;
    }
</style>
""", unsafe_allow_html=True)


# Default dataset path
DEFAULT_DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "student_performance.csv")


@st.cache_data
def load_default_data():
    if os.path.exists(DEFAULT_DATA_PATH):
        return pd.read_csv(DEFAULT_DATA_PATH)
    else:
        # Emergency dummy fallback if file missing
        data = {
            'Student_ID': [f'S100{i}' for i in range(1, 51)],
            'Gender': ['Male', 'Female'] * 25,
            'Department': ['Computer Science', 'Data Science', 'Electrical', 'Mechanical'] * 12 + ['Computer Science', 'Data Science'],
            'Attendance': np.random.uniform(60, 98, 50).round(1),
            'Study_Hours': np.random.uniform(2, 10, 50).round(1),
            'Marks': np.random.uniform(45, 99, 50).round(1)
        }
        return pd.DataFrame(data)


# Initialize Session State
if 'df_raw' not in st.session_state:
    st.session_state['df_raw'] = load_default_data()

if 'df_clean' not in st.session_state or st.session_state['df_clean'] is None:
    cleaned_df, _ = clean_dataset(st.session_state['df_raw'])
    st.session_state['df_clean'] = cleaned_df


# Sidebar Navigation
st.sidebar.title("📌 Navigation")
page = st.sidebar.radio(
    "Select Section:",
    [
        "🏠 Home",
        "📁 Data Input",
        "🧹 Data Cleaning",
        "📊 Descriptive Statistics",
        "📈 Visualizations",
        "🎲 Probability Distributions",
        "🎯 Sampling Techniques",
        "📉 Central Limit Theorem",
        "🔄 Bootstrap Estimation",
        "⚖️ Mean vs Median",
        "🌐 Web Scraping",
        "📋 Final Results"
    ]
)

st.sidebar.markdown("---")
st.sidebar.caption("🎓 **Student Performance System** | Streamlit & SciPy")


# ---------------------------------------------------------
# PAGE 1: HOME
# ---------------------------------------------------------
if page == "🏠 Home":
    st.markdown("<div class='main-header'>Student Performance Statistical Analysis System</div>", unsafe_allow_html=True)
    st.markdown("<div class='sub-header'>A comprehensive statistical evaluation dashboard combining descriptive statistics, probability distributions, sampling methods, CLT simulations, and bootstrap estimation.</div>", unsafe_allow_html=True)
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.subheader("🎯 Project Problem Statement & Objective")
        st.write("""
        Student performance evaluation requires rigorous statistical techniques beyond basic averages. 
        This application provides an interactive suite to analyze student metrics (`Marks`, `Attendance`, `Study Hours`), 
        verify sampling theory, test probability models, and measure estimator stability using Central Limit Theorem (CLT) and Bootstrap Resampling.
        """)
        
        st.markdown("### 🔑 Core Features")
        st.markdown("""
        - **Data Upload & Cleaning**: Missing value detection, duplicate removal, invalid negative value handling.
        - **Descriptive Statistics**: Central tendency (Mean, Median, Mode), Dispersion (Variance, Std Dev), Quartiles, and IQR.
        - **Visualizations**: Histograms, Boxplots, Department/Gender comparative bar charts, and Attendance-Marks scatter plots.
        - **Probability Distributions**: Uniform, Binomial ($P(X=5)$), and Poisson simulations.
        - **Sampling Theory**: Simple Random, Systematic, and Stratified sampling accuracy comparison.
        - **Central Limit Theorem**: Convergence of 1,000 sample means across sizes 10, 30, 50, 100 with Theoretical vs Observed Standard Error.
        - **Bootstrap Estimation**: 5,000 iteration non-parametric resampling for parameter confidence intervals.
        """)
        
    with col2:
        st.markdown("### 🛠️ Tech Stack")
        st.info("""
        - **Frontend**: Streamlit
        - **Data Processing**: Pandas & NumPy
        - **Statistical Computing**: SciPy
        - **Plotting**: Matplotlib & Seaborn
        - **Scraping**: Requests & BeautifulSoup4
        - **Storage**: CSV
        """)
        
        st.markdown("### 📊 Active Dataset Quick Stats")
        df_curr = st.session_state['df_clean']
        st.metric("Total Students", len(df_curr))
        st.metric("Mean Marks", f"{df_curr['Marks'].mean():.2f}")
        st.metric("Median Marks", f"{df_curr['Marks'].median():.2f}")


# ---------------------------------------------------------
# PAGE 2: DATA INPUT
# ---------------------------------------------------------
elif page == "📁 Data Input":
    st.title("📁 Dataset Input & Overview")
    
    data_source = st.radio("Choose Dataset Source:", ["Use Default Sample Dataset", "Upload Custom CSV File"])
    
    if data_source == "Upload Custom CSV File":
        uploaded_file = st.file_uploader("Upload CSV containing student records", type=["csv"])
        if uploaded_file is not None:
            try:
                uploaded_df = pd.read_csv(uploaded_file)
                st.session_state['df_raw'] = uploaded_df
                # Re-clean dataset
                st.session_state['df_clean'], _ = clean_dataset(uploaded_df)
                st.success("Custom CSV successfully loaded and updated!")
            except Exception as e:
                st.error(f"Error loading uploaded file: {str(e)}")
    else:
        st.session_state['df_raw'] = load_default_data()
        
    df_raw = st.session_state['df_raw']
    
    # Column Validation Check
    is_valid, missing_cols = validate_columns(df_raw)
    if not is_valid:
        st.warning(f"⚠️ Warning: Dataset is missing standard columns: {missing_cols}. Standard analyses will apply to available numeric columns.")
    else:
        st.success("✅ Dataset structure validated! All expected columns present.")
        
    st.markdown("---")
    st.subheader("📊 Dataset Overview")
    
    m1, m2, m3 = st.columns(3)
    m1.metric("Total Rows", df_raw.shape[0])
    m2.metric("Total Columns", df_raw.shape[1])
    m3.metric("Numeric Columns", len(df_raw.select_dtypes(include=[np.number]).columns))
    
    st.markdown("### 📋 Column Names")
    st.code(", ".join(df_raw.columns.tolist()))
    
    st.markdown("### 👀 First 5 Rows (Raw Data)")
    st.dataframe(df_raw.head(5), use_container_width=True)


# ---------------------------------------------------------
# PAGE 3: DATA CLEANING
# ---------------------------------------------------------
elif page == "🧹 Data Cleaning":
    st.title("🧹 Data Cleaning & Preprocessing")
    
    df_raw = st.session_state['df_raw']
    
    # Detection stats
    detection = detect_missing_and_duplicates(df_raw)
    
    col1, col2, col3 = st.columns(3)
    col1.metric("Total Rows (Before)", detection['total_rows'])
    col2.metric("Duplicate Rows Detected", detection['duplicate_rows'])
    col3.metric("Missing Cell Values", detection['missing_total'])
    
    st.markdown("---")
    st.subheader("⚙️ Data Cleaning Options")
    
    imp_strategy = st.selectbox("Missing Numeric Value Imputation Strategy:", ["median", "mean", "drop"])
    fix_negs = st.checkbox("Automatically fix invalid negative values (e.g. negative marks/study hours)", value=True)
    
    if st.button("Apply Data Cleaning"):
        cleaned_df, summary = clean_dataset(df_raw, imputation_strategy=imp_strategy, fix_negatives=fix_negs)
        st.session_state['df_clean'] = cleaned_df
        st.success("Data cleaning completed successfully!")
        
        st.json(summary)
        
    df_clean = st.session_state['df_clean']
    
    st.markdown("---")
    st.subheader("🔍 Cleaned Dataset Preview & Summary")
    st.metric("Total Rows (After Cleaning)", len(df_clean))
    st.dataframe(df_clean.head(10), use_container_width=True)


# ---------------------------------------------------------
# PAGE 4: DESCRIPTIVE STATISTICS
# ---------------------------------------------------------
elif page == "📊 Descriptive Statistics":
    st.title("📊 Descriptive Statistics")
    
    df = st.session_state['df_clean']
    num_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    
    if not num_cols:
        st.error("No numeric columns available in the dataset for statistics.")
    else:
        target_col = st.selectbox("Select Target Variable:", num_cols, index=num_cols.index('Marks') if 'Marks' in num_cols else 0)
        
        stats_dict = calculate_descriptive_stats(df[target_col])
        
        st.markdown(f"### 📈 Summary Statistics for **{target_col}**")
        
        # Display key metrics in columns
        c1, c2, c3, c4 = st.columns(4)
        c1.metric("Mean", stats_dict.get('Mean'))
        c2.metric("Median", stats_dict.get('Median'))
        c3.metric("Standard Deviation", stats_dict.get('Standard Deviation'))
        c4.metric("IQR", stats_dict.get('IQR'))
        
        st.markdown("### 📋 Detailed Statistical Metrics Table")
        stats_df = pd.DataFrame(list(stats_dict.items()), columns=['Metric', 'Value'])
        st.dataframe(stats_df, use_container_width=True)


# ---------------------------------------------------------
# PAGE 5: VISUALIZATIONS
# ---------------------------------------------------------
elif page == "📈 Visualizations":
    st.title("📈 Visualizations & Graphical Analysis")
    
    df = st.session_state['df_clean']
    
    if 'Marks' not in df.columns:
        st.error("'Marks' column is required for visualization.")
    else:
        tab1, tab2, tab3, tab4 = st.tabs(["Histogram & KDE", "Boxplot", "Department/Gender Means", "Attendance vs Marks"])
        
        with tab1:
            st.subheader("Marks Distribution Histogram")
            fig, ax = plt.subplots(figsize=(8, 4))
            sns.histplot(df['Marks'], kde=True, color='skyblue', bins=15, ax=ax)
            ax.axvline(df['Marks'].mean(), color='red', linestyle='--', label=f"Mean: {df['Marks'].mean():.2f}")
            ax.axvline(df['Marks'].median(), color='green', linestyle='-', label=f"Median: {df['Marks'].median():.2f}")
            ax.set_title("Distribution of Student Marks")
            ax.set_xlabel("Marks")
            ax.set_ylabel("Frequency")
            ax.legend()
            st.pyplot(fig)
            
        with tab2:
            st.subheader("Boxplot of Marks (Outlier Identification)")
            fig, ax = plt.subplots(figsize=(8, 3))
            sns.boxplot(x=df['Marks'], color='lightgreen', ax=ax)
            ax.set_title("Boxplot of Marks")
            st.pyplot(fig)
            
        with tab3:
            st.subheader("Group-wise Average Marks")
            c1, c2 = st.columns(2)
            
            with c1:
                if 'Department' in df.columns:
                    fig, ax = plt.subplots(figsize=(5, 4))
                    dept_avg = df.groupby('Department')['Marks'].mean().reset_index()
                    sns.barplot(data=dept_avg, x='Department', y='Marks', palette='viridis', ax=ax)
                    ax.set_title("Department-wise Average Marks")
                    plt.xticks(rotation=30)
                    st.pyplot(fig)
                    
            with c2:
                if 'Gender' in df.columns:
                    fig, ax = plt.subplots(figsize=(5, 4))
                    gender_avg = df.groupby('Gender')['Marks'].mean().reset_index()
                    sns.barplot(data=gender_avg, x='Gender', y='Marks', palette='Set2', ax=ax)
                    ax.set_title("Gender-wise Average Marks")
                    st.pyplot(fig)
                    
        with tab4:
            st.subheader("Attendance vs Marks Scatter Plot")
            if 'Attendance' in df.columns:
                fig, ax = plt.subplots(figsize=(8, 4))
                sns.scatterplot(data=df, x='Attendance', y='Marks', hue='Gender' if 'Gender' in df.columns else None, ax=ax)
                sns.regplot(data=df, x='Attendance', y='Marks', scatter=False, ax=ax, color='gray')
                ax.set_title("Attendance (%) vs Marks")
                st.pyplot(fig)


# ---------------------------------------------------------
# PAGE 6: PROBABILITY DISTRIBUTIONS
# ---------------------------------------------------------
elif page == "🎲 Probability Distributions":
    st.title("🎲 Probability Distribution Simulation")
    
    dist_choice = st.selectbox("Select Probability Distribution:", ["Uniform Distribution", "Binomial Distribution", "Poisson Distribution"])
    
    if dist_choice == "Uniform Distribution":
        st.subheader("Uniform Distribution U(0, 100)")
        low, high = 0.0, 100.0
        data, metrics = generate_uniform(low=low, high=high, size=1000)
        
        st.json(metrics)
        fig, ax = plt.subplots(figsize=(8, 4))
        sns.histplot(data, bins=20, kde=True, color='teal', ax=ax)
        ax.set_title("1000 Uniform Distribution Samples U(0, 100)")
        st.pyplot(fig)
        
    elif dist_choice == "Binomial Distribution":
        st.subheader("Binomial Distribution B(n, p)")
        n = 10
        p = st.slider("Select Success Probability (p):", min_value=0.1, max_value=0.9, value=0.5, step=0.05)
        
        data, metrics, pmf_df = generate_binomial(n=n, p=p, size=1000)
        
        col1, col2 = st.columns([1, 1])
        with col1:
            st.markdown("### Metrics & Exact Probabilities")
            st.json(metrics)
            st.info(f"**Exact P(X = 5)**: {metrics['P(X = 5) [Theoretical]']}")
            
        with col2:
            st.markdown("### Theoretical PMF Table")
            st.dataframe(pmf_df, use_container_width=True)
            
        fig, ax = plt.subplots(figsize=(8, 4))
        counts = pd.Series(data).value_counts(normalize=True).sort_index()
        ax.bar(counts.index, counts.values, color='coral', alpha=0.7, label='Empirical')
        ax.plot(pmf_df['k (Successes)'], pmf_df['Theoretical P(X=k)'], 'ro-', label='Theoretical PMF')
        ax.set_title(f"Binomial Distribution B(n={n}, p={p})")
        ax.set_xlabel("Successes (k)")
        ax.set_ylabel("Probability")
        ax.legend()
        st.pyplot(fig)
        
    elif dist_choice == "Poisson Distribution":
        st.subheader("Poisson Distribution Poisson(λ)")
        lam = st.slider("Select Lambda (λ):", min_value=1.0, max_value=20.0, value=8.0, step=0.5)
        
        data, metrics = generate_poisson(lam=lam, size=1000)
        
        st.json(metrics)
        fig, ax = plt.subplots(figsize=(8, 4))
        counts = pd.Series(data).value_counts(normalize=True).sort_index()
        ax.bar(counts.index, counts.values, color='mediumpurple', alpha=0.8)
        ax.set_title(f"Poisson Distribution (λ = {lam})")
        ax.set_xlabel("Events Count (k)")
        ax.set_ylabel("Probability")
        st.pyplot(fig)


# ---------------------------------------------------------
# PAGE 7: SAMPLING TECHNIQUES
# ---------------------------------------------------------
elif page == "🎯 Sampling Techniques":
    st.title("🎯 Sampling Methods & Evaluation")
    
    df = st.session_state['df_clean']
    
    if 'Marks' not in df.columns:
        st.error("'Marks' column required for sampling.")
    else:
        st.subheader("⚙️ Sampling Configurations")
        col1, col2, col3 = st.columns(3)
        sample_size = col1.slider("Sample Size (SRS / Stratified):", min_value=10, max_value=min(150, len(df)), value=min(50, len(df)))
        k_interval = col2.slider("Systematic k-interval:", min_value=2, max_value=10, value=5)
        strat_col = col3.selectbox("Stratification Column:", ['Gender', 'Department'] if 'Department' in df.columns else ['Gender'])
        
        comp_df, best_method = compare_sampling_methods(df, target_size=sample_size, k=k_interval, stratify_col=strat_col)
        
        st.markdown("### 📊 Sampling Comparison Table")
        st.dataframe(comp_df, use_container_width=True)
        
        st.success(f"🏆 **Best Sampling Estimator**: **{best_method}** produced the lowest deviation from the true population mean!")


# ---------------------------------------------------------
# PAGE 8: CENTRAL LIMIT THEOREM
# ---------------------------------------------------------
elif page == "📉 Central Limit Theorem":
    st.title("📉 Central Limit Theorem (CLT) & Standard Error")
    
    df = st.session_state['df_clean']
    
    if 'Marks' not in df.columns:
        st.error("'Marks' column required for CLT simulation.")
    else:
        st.markdown("""
        **Central Limit Theorem Statement**: Regardless of the underlying population distribution, 
        the sampling distribution of the sample mean approaches a Normal Distribution $N(\\mu, \\sigma/\\sqrt{N})$ 
        as the sample size $N$ increases.
        """)
        
        summary_table, clt_results, pop_info = calculate_standard_error_comparison(df['Marks'], sample_sizes=[10, 30, 50, 100])
        
        st.markdown("### 📌 Population Reference")
        st.json(pop_info)
        
        st.markdown("### 📊 Observed vs Theoretical Standard Error")
        st.dataframe(summary_table, use_container_width=True)
        
        st.markdown("### 📈 Visual Convergence of Sampling Distributions")
        fig, axes = plt.subplots(2, 2, figsize=(10, 8))
        sizes = [10, 30, 50, 100]
        colors = ['red', 'orange', 'blue', 'green']
        
        for idx, (n, color) in enumerate(zip(sizes, colors)):
            ax = axes[idx // 2, idx % 2]
            sns.histplot(clt_results[n], kde=True, color=color, ax=ax, bins=20)
            ax.axvline(pop_info['Population Mean'], color='black', linestyle='--', label=f"Pop Mean: {pop_info['Population Mean']}")
            ax.set_title(f"Sample Size N = {n}")
            ax.set_xlabel("Sample Means")
            ax.legend()
            
        plt.tight_layout()
        st.pyplot(fig)


# ---------------------------------------------------------
# PAGE 9: BOOTSTRAP ESTIMATION
# ---------------------------------------------------------
elif page == "🔄 Bootstrap Estimation":
    st.title("🔄 Non-Parametric Bootstrap Estimation")
    
    df = st.session_state['df_clean']
    
    if 'Marks' not in df.columns:
        st.error("'Marks' column required for Bootstrap resampling.")
    else:
        col1, col2 = st.columns(2)
        n_sample = col1.slider("Initial Sample Size:", min_value=20, max_value=min(150, len(df)), value=min(50, len(df)))
        n_boot = col2.slider("Bootstrap Iterations:", min_value=1000, max_value=10000, value=5000, step=1000)
        
        boot_means, boot_metrics = perform_bootstrap(df['Marks'], sample_size=n_sample, num_iterations=n_boot)
        
        st.markdown("### 📋 Bootstrap Summary Metrics")
        st.json(boot_metrics)
        
        st.markdown("### 📉 Bootstrap Distribution of Means")
        fig, ax = plt.subplots(figsize=(8, 4))
        sns.histplot(boot_means, kde=True, color='purple', ax=ax, bins=30)
        ax.axvline(boot_metrics['Population Mean'], color='red', linestyle='--', label=f"True Pop Mean: {boot_metrics['Population Mean']}")
        ax.axvline(boot_metrics['Bootstrap Estimate (Mean)'], color='green', linestyle='-', label=f"Bootstrap Mean: {boot_metrics['Bootstrap Estimate (Mean)']}")
        ax.set_title(f"Bootstrap Distribution ({n_boot} iterations)")
        ax.set_xlabel("Bootstrap Sample Mean Marks")
        ax.legend()
        st.pyplot(fig)


# ---------------------------------------------------------
# PAGE 10: MEAN VS MEDIAN
# ---------------------------------------------------------
elif page == "⚖️ Mean vs Median":
    st.title("⚖️ Estimator Evaluation: Mean vs Median")
    
    df = st.session_state['df_clean']
    
    if 'Marks' not in df.columns:
        st.error("'Marks' column required for comparison.")
    else:
        comp_info = compare_mean_median(df['Marks'])
        
        m1, m2, m3 = st.columns(3)
        m1.metric("Mean Marks", comp_info['Mean'])
        m2.metric("Median Marks", comp_info['Median'])
        m3.metric("Difference (Mean - Median)", comp_info['Difference (Mean - Median)'])
        
        st.markdown("---")
        st.markdown(f"### 🔍 Skewness & Distribution Shape: **{comp_info['Distribution Shape']}**")
        st.markdown(f"**Skewness Index**: `{comp_info['Skewness']}`")
        
        st.info(f"💡 **Recommendation**: {comp_info['Recommended Estimator']}")


# ---------------------------------------------------------
# PAGE 11: WEB SCRAPING
# ---------------------------------------------------------
elif page == "🌐 Web Scraping":
    st.title("🌐 Optional Web Scraping Module")
    st.write("Demonstrates extracting tabular web data using **Requests** and **BeautifulSoup4**.")
    
    target_url = st.text_input("Enter Webpage URL with HTML tables:", value="https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_population")
    
    if st.button("Fetch & Scrape Table"):
        with st.spinner("Scraping webpage table..."):
            scraped_df, status_msg = scrape_table_data(target_url)
            st.info(status_msg)
            
            st.markdown("### 📋 Scraped Table Data Preview")
            st.dataframe(scraped_df, use_container_width=True)
            
            # Export to CSV
            csv_bytes = scraped_df.to_csv(index=False).encode('utf-8')
            st.download_button(
                label="📥 Download Scraped Data as CSV",
                data=csv_bytes,
                file_name="scraped_web_table.csv",
                mime="text/csv"
            )


# ---------------------------------------------------------
# PAGE 12: FINAL RESULTS
# ---------------------------------------------------------
elif page == "📋 Final Results":
    st.title("📋 Final Statistical Dashboard & Conclusion Report")
    
    df = st.session_state['df_clean']
    
    if 'Marks' not in df.columns:
        st.error("Marks data unavailable.")
    else:
        # Re-compute summaries
        pop_mean = round(float(df['Marks'].mean()), 2)
        pop_median = round(float(df['Marks'].median()), 2)
        _, best_method = compare_sampling_methods(df, target_size=min(50, len(df)))
        summary_table, _, _ = calculate_standard_error_comparison(df['Marks'])
        _, boot_metrics = perform_bootstrap(df['Marks'])
        comp_info = compare_mean_median(df['Marks'])
        
        st.markdown("### 🏆 Comprehensive Statistical Findings")
        
        c1, c2, c3 = st.columns(3)
        c1.metric("Population Mean Marks", pop_mean)
        c2.metric("Population Median Marks", pop_median)
        c3.metric("Best Sampling Method", best_method)
        
        st.markdown("---")
        st.markdown("### 📊 Standard Error Summary across Sample Sizes")
        st.dataframe(summary_table, use_container_width=True)
        
        st.markdown("---")
        st.markdown("### 🔄 Bootstrap Estimate vs Population Mean")
        b1, b2, b3 = st.columns(3)
        b1.metric("Bootstrap Estimate", boot_metrics['Bootstrap Estimate (Mean)'])
        b2.metric("Bootstrap Std Error", boot_metrics['Bootstrap Standard Error'])
        b3.metric("Error from True Mean", boot_metrics['Difference from Pop Mean'])
        
        st.markdown("---")
        st.markdown("### 📝 Automatically Generated Statistical Conclusion")
        st.success(f"""
        **Statistical Report Summary**:
        1. **Central Tendency**: The population mean mark is **{pop_mean}**, while the median is **{pop_median}**. The distribution shape is classified as **{comp_info['Distribution Shape']}**.
        2. **Sampling Reliability**: Among simple random, systematic, and stratified sampling methods, **{best_method}** produced the most accurate estimate relative to the population parameter.
        3. **CLT Validation**: As sample size increased from N=10 to N=100, the observed standard error decreased from **{summary_table.loc[0, 'Observed SE']}** to **{summary_table.loc[3, 'Observed SE']}**, closely tracking theoretical $1/\\sqrt{{N}}$ decay.
        4. **Bootstrap Accuracy**: 5,000 bootstrap iterations estimated the mean at **{boot_metrics['Bootstrap Estimate (Mean)']}** with a 95% confidence interval of **{boot_metrics['95% Confidence Interval']}**, demonstrating strong estimation stability.
        """)
