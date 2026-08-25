import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid } from 'recharts';

export const HistogramChart = ({ dataset, keyName = 'Marks', meanVal, medianVal }) => {
  const values = dataset
    .map(r => r[keyName])
    .filter(val => typeof val === 'number' && !isNaN(val));

  if (values.length === 0) return <div className="p-4 text-center text-slate-400">No data available</div>;

  const min = Math.floor(Math.min(...values));
  const max = Math.ceil(Math.max(...values));
  const binCount = 15;
  const binWidth = (max - min) / binCount || 1;

  const bins = Array.from({ length: binCount }, (_, i) => ({
    binLabel: `${Math.round(min + i * binWidth)}-${Math.round(min + (i + 1) * binWidth)}`,
    binCenter: min + (i + 0.5) * binWidth,
    count: 0
  }));

  values.forEach(val => {
    const idx = Math.min(Math.floor((val - min) / binWidth), binCount - 1);
    bins[idx].count++;
  });

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={bins} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
          <XAxis dataKey="binLabel" stroke="#94a3b8" fontSize={12} tickLine={false} />
          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
            formatter={(val) => [`${val} Students`, 'Frequency']}
          />
          <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Frequency" />
          {meanVal && (
            <ReferenceLine x={bins.find(b => meanVal >= parseFloat(b.binLabel.split('-')[0]) && meanVal <= parseFloat(b.binLabel.split('-')[1]))?.binLabel} stroke="#ef4444" strokeWidth={2} label={{ value: `Mean: ${meanVal}`, fill: '#ef4444', fontSize: 12, position: 'top' }} />
          )}
          {medianVal && (
            <ReferenceLine x={bins.find(b => medianVal >= parseFloat(b.binLabel.split('-')[0]) && medianVal <= parseFloat(b.binLabel.split('-')[1]))?.binLabel} stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" label={{ value: `Median: ${medianVal}`, fill: '#10b981', fontSize: 12, position: 'bottom' }} />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
