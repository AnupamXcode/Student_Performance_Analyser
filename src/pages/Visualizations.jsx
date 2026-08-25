import React, { useState } from 'react';
import { HistogramChart } from '../components/Charts/HistogramChart';
import { BoxPlotChart } from '../components/Charts/BoxPlotChart';
import { BarComparisonChart } from '../components/Charts/BarComparisonChart';
import { ScatterTrendChart } from '../components/Charts/ScatterTrendChart';
import { calculateDescriptiveStats } from '../services/statsEngine';
import { BarChart3, LineChart } from 'lucide-react';

export const Visualizations = ({ dataset }) => {
  const [activeTab, setActiveTab] = useState('histogram');
  const stats = calculateDescriptiveStats(dataset, 'Marks');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Data Visualizations</h2>
        <p className="text-xs text-slate-500">Histograms, Boxplots, Department/Gender comparative bar charts, and scatter plots.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {[
          { id: 'histogram', label: 'Marks Histogram & KDE' },
          { id: 'boxplot', label: 'Boxplot & Outliers' },
          { id: 'department', label: 'Department Average Marks' },
          { id: 'gender', label: 'Gender Average Marks' },
          { id: 'scatter', label: 'Attendance vs Marks Scatter' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? 'gradient-bg text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Visual Content */}
      <div className="glass-panel p-6">
        {activeTab === 'histogram' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Distribution of Marks with Mean & Median Markers</h3>
            <HistogramChart dataset={dataset} keyName="Marks" meanVal={stats?.Mean} medianVal={stats?.Median} />
          </div>
        )}

        {activeTab === 'boxplot' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Boxplot of Marks (Identifying Outliers)</h3>
            <BoxPlotChart dataset={dataset} keyName="Marks" />
          </div>
        )}

        {activeTab === 'department' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Department-wise Average Marks</h3>
            <BarComparisonChart dataset={dataset} groupByCol="Department" targetCol="Marks" />
          </div>
        )}

        {activeTab === 'gender' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Gender-wise Average Marks</h3>
            <BarComparisonChart dataset={dataset} groupByCol="Gender" targetCol="Marks" />
          </div>
        )}

        {activeTab === 'scatter' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Attendance (%) vs Marks Scatter Plot</h3>
            <ScatterTrendChart dataset={dataset} xKey="Attendance" yKey="Marks" />
          </div>
        )}
      </div>
    </div>
  );
};
