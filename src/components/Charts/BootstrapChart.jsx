import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid } from 'recharts';

export const BootstrapChart = ({ histogramBins, metrics }) => {
  if (!histogramBins || histogramBins.length === 0 || !metrics) return null;

  const popMeanBin = metrics.PopulationMean !== undefined
    ? histogramBins.find(b => parseFloat(b.binLabel) >= metrics.PopulationMean)?.binLabel
    : null;

  const bootMeanBin = metrics.BootstrapMeanEstimate !== undefined
    ? histogramBins.find(b => parseFloat(b.binLabel) >= metrics.BootstrapMeanEstimate)?.binLabel
    : null;

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={histogramBins} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
          <XAxis dataKey="binLabel" stroke="#94a3b8" fontSize={12} />
          <YAxis stroke="#94a3b8" fontSize={12} />
          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
          <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Bootstrap Means" />
          
          {popMeanBin && (
            <ReferenceLine x={popMeanBin} stroke="#ef4444" strokeWidth={2} label={{ value: `True Pop Mean: ${metrics.PopulationMean}`, fill: '#ef4444', fontSize: 12, position: 'top' }} />
          )}
          
          {bootMeanBin && (
            <ReferenceLine x={bootMeanBin} stroke="#10b981" strokeWidth={2} strokeDasharray="3 3" label={{ value: `Boot Mean: ${metrics.BootstrapMeanEstimate}`, fill: '#10b981', fontSize: 12, position: 'bottom' }} />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
