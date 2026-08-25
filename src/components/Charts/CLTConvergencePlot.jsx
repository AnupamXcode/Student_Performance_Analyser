import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid } from 'recharts';

export const CLTConvergencePlot = ({ sampleMeans, sampleSize, popMean }) => {
  if (!sampleMeans || sampleMeans.length === 0) return null;

  const min = Math.floor(Math.min(...sampleMeans));
  const max = Math.ceil(Math.max(...sampleMeans));
  const binCount = 20;
  const binWidth = (max - min) / binCount || 1;

  const bins = Array.from({ length: binCount }, (_, i) => ({
    binLabel: `${(min + i * binWidth).toFixed(1)}-${(min + (i + 1) * binWidth).toFixed(1)}`,
    count: 0
  }));

  sampleMeans.forEach(val => {
    const idx = Math.min(Math.floor((val - min) / binWidth), binCount - 1);
    if (bins[idx]) {
      bins[idx].count++;
    }
  });

  const colors = {
    10: '#ef4444',
    30: '#f59e0b',
    50: '#3b82f6',
    100: '#10b981'
  };

  const midBinLabel = bins[Math.floor(binCount / 2)]?.binLabel;

  return (
    <div className="w-full h-52 glass-card p-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Sample Size N = {sampleSize}</span>
        <span className="text-[10px] font-mono text-slate-500">1,000 Sample Means</span>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={bins} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis dataKey="binLabel" stroke="#94a3b8" fontSize={9} tickLine={false} />
          <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px', fontSize: '11px', color: '#fff' }} />
          <Bar dataKey="count" fill={colors[sampleSize] || '#8b5cf6'} radius={[2, 2, 0, 0]} />
          {popMean !== undefined && popMean !== null && midBinLabel && (
            <ReferenceLine x={midBinLabel} stroke="#ffffff" strokeWidth={1.5} strokeDasharray="2 2" />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
