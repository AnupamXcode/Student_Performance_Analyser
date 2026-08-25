import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Line, ComposedChart } from 'recharts';

export const DistributionPlot = ({ data, xKey = 'k', barKey = 'observedP', lineKey = 'theoreticalP', title }) => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
          <XAxis dataKey={xKey} stroke="#94a3b8" fontSize={12} />
          <YAxis stroke="#94a3b8" fontSize={12} />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
          />
          {barKey && <Bar dataKey={barKey} fill="#06b6d4" radius={[4, 4, 0, 0]} name="Observed P" />}
          {lineKey && <Line type="monotone" dataKey={lineKey} stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444' }} name="Theoretical P" />}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
