import React, { useState } from 'react';
import { Upload, Database, CheckCircle2, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { parseCSVText, validateColumns, generateDefaultDataset } from '../services/dataService';

export const DataInput = ({ dataset, setDataset }) => {
  const [csvText, setCsvText] = useState('');
  const [statusMsg, setStatusMsg] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = parseCSVText(event.target.result);
        if (parsed.length === 0) {
          setStatusMsg({ type: 'error', text: 'Uploaded CSV is empty or formatted invalidly.' });
          return;
        }
        setDataset(parsed);
        setStatusMsg({ type: 'success', text: `Successfully loaded ${parsed.length} records from uploaded CSV!` });
      } catch (err) {
        setStatusMsg({ type: 'error', text: `CSV Parse Error: ${err.message}` });
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefault = () => {
    const defaultData = generateDefaultDataset();
    setDataset(defaultData);
    setStatusMsg({ type: 'success', text: `Reset to default sample student dataset (${defaultData.length} records).` });
  };

  const validation = validateColumns(dataset);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Dataset Input & Validation</h2>
        <p className="text-xs text-slate-500">Upload a custom CSV file or switch back to the standard sample dataset.</p>
      </div>

      {statusMsg && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
          statusMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-red-500/10 text-red-600 border border-red-500/20'
        }`}>
          {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Upload & Options Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 border-2 border-dashed border-slate-300 dark:border-slate-800 text-center space-y-4 hover:border-brand-500 transition-colors">
          <div className="w-12 h-12 rounded-full bg-brand-500/10 text-brand-600 mx-auto flex items-center justify-center">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Upload Custom CSV File</h4>
            <p className="text-xs text-slate-500">Expected columns: Student_ID, Gender, Department, Attendance, Study_Hours, Marks</p>
          </div>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-500 file:text-white hover:file:bg-brand-600 cursor-pointer"
          />
        </div>

        <div className="glass-panel p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Database className="w-5 h-5 text-indigo-500" />
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Standard Sample Dataset</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Use our pre-configured dataset containing 200 student records across Computer Science, Data Science, Electrical, and Mechanical departments.
            </p>
          </div>
          <button
            onClick={handleResetDefault}
            className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
          >
            Load Standard Dataset
          </button>
        </div>
      </div>

      {/* Dataset Preview Table */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" /> Data Preview (First 10 Rows)
          </h3>
          <span className="text-xs font-mono text-slate-500">Shape: {dataset.length} rows × {Object.keys(dataset[0] || {}).length} cols</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300">
                {Object.keys(dataset[0] || {}).map((col) => (
                  <th key={col} className="p-3 font-semibold">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
              {dataset.slice(0, 10).map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                  {Object.keys(dataset[0] || {}).map((col) => (
                    <td key={col} className="p-3 font-mono text-slate-600 dark:text-slate-400">
                      {row[col] !== null && row[col] !== undefined ? String(row[col]) : <span className="text-red-500 font-bold">null</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
