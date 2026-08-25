import React, { useState } from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, Trash2, ArrowRight } from 'lucide-react';

export const DataCleaning = ({ dataset, setDataset }) => {
  const [strategy, setStrategy] = useState('median');
  const [fixNegatives, setFixNegatives] = useState(true);
  const [cleaningReport, setCleaningReport] = useState(null);

  // Compute raw anomaly counts
  let rawDuplicates = 0;
  let missingCells = 0;
  let negativeCells = 0;

  const seen = new Set();
  dataset.forEach(row => {
    const str = JSON.stringify(row);
    if (seen.has(str)) rawDuplicates++;
    else seen.add(str);

    ['Attendance', 'Study_Hours', 'Marks'].forEach(col => {
      const val = row[col];
      if (val === null || val === undefined || isNaN(val)) missingCells++;
      if (typeof val === 'number' && val < 0) negativeCells++;
    });
  });

  const handleCleanData = () => {
    let clean = [...dataset];
    const initialCount = clean.length;

    // 1. Deduplicate
    const unique = [];
    const set = new Set();
    clean.forEach(row => {
      const s = JSON.stringify(row);
      if (!set.has(s)) {
        set.add(s);
        unique.push({ ...row });
      }
    });
    clean = unique;

    // 2. Fix invalid negative numbers & compute column medians/means
    const numericCols = ['Attendance', 'Study_Hours', 'Marks'];
    const statsMap = {};

    numericCols.forEach(col => {
      let vals = clean.map(r => r[col]).filter(v => typeof v === 'number' && !isNaN(v));
      if (fixNegatives) {
        vals = vals.map(v => (v < 0 ? null : v)).filter(v => v !== null);
      }
      vals.sort((a, b) => a - b);
      const sum = vals.reduce((a, b) => a + b, 0);
      const mean = sum / (vals.length || 1);
      const median = vals[Math.floor(vals.length / 2)] || 0;
      statsMap[col] = strategy === 'median' ? median : mean;
    });

    // 3. Impute / Clean
    clean = clean.map(row => {
      const r = { ...row };
      numericCols.forEach(col => {
        let val = r[col];
        if (typeof val === 'string') val = parseFloat(val);
        if (fixNegatives && typeof val === 'number' && val < 0) val = null;
        if (val === null || val === undefined || isNaN(val)) {
          val = +statsMap[col].toFixed(1);
        }
        r[col] = val;
      });
      return r;
    });

    setDataset(clean);
    setCleaningReport({
      initialCount,
      finalCount: clean.length,
      duplicatesRemoved: initialCount - clean.length,
      missingImputed: missingCells,
      negativesFixed: negativeCells,
      strategy
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Data Cleaning & Preprocessing</h2>
        <p className="text-xs text-slate-500">Detect anomalies, remove duplicate records, and impute missing numerical metrics.</p>
      </div>

      {/* Detection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-panel p-5 border-l-4 border-amber-500">
          <div className="text-xs font-semibold text-slate-500 uppercase">Duplicate Rows Detected</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">{rawDuplicates}</div>
        </div>

        <div className="glass-panel p-5 border-l-4 border-rose-500">
          <div className="text-xs font-semibold text-slate-500 uppercase">Missing Cell Values</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">{missingCells}</div>
        </div>

        <div className="glass-panel p-5 border-l-4 border-purple-500">
          <div className="text-xs font-semibold text-slate-500 uppercase">Invalid Negative Metrics</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">{negativeCells}</div>
        </div>
      </div>

      {/* Controls & Action */}
      <div className="glass-panel p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-500" /> Interactive Cleaning Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Imputation Strategy for Missing Numbers:</label>
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
            >
              <option value="median">Median Imputation (Robust to outliers)</option>
              <option value="mean">Mean Imputation (Standard average)</option>
            </select>
          </div>

          <div className="space-y-2 flex items-center pt-5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={fixNegatives}
                onChange={(e) => setFixNegatives(e.target.checked)}
                className="w-4 h-4 rounded text-brand-500 focus:ring-brand-500"
              />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Fix invalid negative values (e.g. negative marks/study hours)</span>
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800">
          <button
            onClick={handleCleanData}
            className="px-6 py-3 rounded-xl gradient-bg text-white font-bold text-xs shadow-lg hover:shadow-brand-500/20 transition-all flex items-center gap-2"
          >
            Apply Data Cleaning Rules <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cleaning Report */}
      {cleaningReport && (
        <div className="glass-panel p-6 space-y-4 border-l-4 border-emerald-500">
          <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Cleaning Summary Report
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div>Initial Rows: <strong>{cleaningReport.initialCount}</strong></div>
            <div>Cleaned Rows: <strong>{cleaningReport.finalCount}</strong></div>
            <div>Duplicates Removed: <strong>{cleaningReport.duplicatesRemoved}</strong></div>
            <div>Missing Values Imputed: <strong>{cleaningReport.missingImputed}</strong></div>
          </div>
        </div>
      )}
    </div>
  );
};
