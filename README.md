# Student Performance Statistical Analysis System 📊

A complete, beginner-friendly Streamlit web application for statistical analysis of student performance metrics. This application integrates data preprocessing, descriptive statistics, probability distributions, sampling techniques, Central Limit Theorem (CLT) simulations, bootstrap resampling, and web scraping into a unified college practical dashboard.

---

## 🎯 Problem Statement

Evaluating student academic performance requires robust statistical methodology rather than simple descriptive averages. Raw educational data frequently contains missing records, duplicate entries, and out-of-bounds metrics. This system provides a interactive tool to clean dataset anomalies, evaluate distributions, test sampling accuracy, and calculate parameter estimators using probability theory and resampling methods.

## 🚀 Objective

To build an intuitive, zero-configuration Streamlit dashboard that combines the core requirements of college statistical practicals into one clean, deployable project.

---

## 🛠️ Tech Stack & Requirements

| Component | Technology |
| :--- | :--- |
| **Language** | Python 3.11+ |
| **UI Framework** | Streamlit |
| **Data Processing** | Pandas |
| **Numerical Computation** | NumPy |
| **Statistics** | SciPy |
| **Visualization** | Matplotlib & Seaborn |
| **Web Scraping** | Requests & BeautifulSoup4 |
| **Storage** | CSV |
| **Version Control** | Git & GitHub |
| **Deployment Options** | Streamlit Community Cloud / Vercel / GitHub Pages |

---

## 📁 Project Structure

```text
student-performance-analysis/
│
├── app.py                      # Main Streamlit multi-page dashboard
├── requirements.txt            # Python dependencies
├── README.md                   # Complete project documentation & guide
├── .gitignore                  # Git ignore rules
├── index.html                  # WebAssembly (Stlite) wrapper for static deployment
├── vercel.json                 # Vercel deployment configuration
│
├── data/
│   └── student_performance.csv # Synthetic student dataset with cleaning test cases
│
├── src/
│   ├── __init__.py
│   ├── preprocessing.py        # Missing value & duplicate detection/cleaning
│   ├── statistics.py           # Descriptive statistics & mean vs median evaluation
│   ├── distributions.py        # Uniform, Binomial, and Poisson distributions
│   ├── sampling.py             # Simple Random, Systematic, and Stratified sampling
│   ├── clt.py                  # Central Limit Theorem & Standard Error simulation
│   ├── bootstrap.py            # Bootstrap resampling & confidence intervals
│   └── scraping.py             # BeautifulSoup4 table scraper module
│
└── notebooks/
    └── practical_analysis.ipynb # Runnable Jupyter notebook for practical submission
```

---

## 💻 Local Installation & Setup

### 1. Clone or Open Project
```bash
cd student-performance-analysis
```

### 2. Create Virtual Environment (Optional but Recommended)
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run Application
```bash
streamlit run app.py
```
The dashboard will launch automatically at `http://localhost:8501`.

---

## 🌐 Multi-Platform Deployment Guide

### Option 1: Streamlit Community Cloud (Recommended for Python)
1. Push your repository to GitHub (see instructions below).
2. Visit [share.streamlit.io](https://share.streamlit.io/).
3. Connect your GitHub account and click **New App**.
4. Select repository, main branch, and set Main file path to `app.py`.
5. Click **Deploy!**

---

### Option 2: Deploying to Vercel (Instant Static / WebAssembly)
1. Install the Vercel CLI or connect your GitHub account at [vercel.com](https://vercel.com).
2. Select your repository and deploy.
3. Vercel will automatically read `vercel.json` and serve `index.html` (powered by `@stlite/mountable`). The Python environment and Streamlit UI will run client-side inside WebAssembly!

---

### Option 3: Deploying to GitHub Pages
1. Go to your repository settings on GitHub.
2. Select **Pages** from the sidebar menu.
3. Under **Build and deployment**, set Source to **Deploy from a branch**.
4. Select `main` branch and `/ (root)` folder.
5. Click **Save**. GitHub Pages will host `index.html` via Stlite WebAssembly!

---

## 📤 How to Upload Project to GitHub

```bash
# 1. Initialize Git repository
git init

# 2. Add files
git add .

# 3. Commit changes
git commit -m "Initial commit - Student Performance Statistical Analysis System"

# 4. Link to your GitHub repo
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/student-performance-analysis.git

# 5. Push code
git push -u origin main
```

---

## 🖼️ Application Screenshots

> *Add screenshots of your running Streamlit pages below after deployment.*

- **Dashboard Home**: Overview of project metrics and dataset stats.
- **Visualizations**: Histograms, Boxplots, and Department-wise comparative charts.
- **CLT Distributions**: Sampling distribution convergence across sizes 10, 30, 50, 100.
- **Bootstrap Resampling**: 5,000 iteration resampling curve with confidence intervals.

---

## 🔮 Future Improvements

- Add multivariate hypothesis testing ($t$-test, ANOVA) across departments.
- Integrate regression modeling (Linear & Logistic) to predict student marks based on study hours and attendance.
- Support Excel (`.xlsx`) and SQL database inputs.

---

## 🎓 License & Usage
This project is open-source and prepared for academic submission and practical practicals.
