import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

export const BarComparisonChart = ({ dataset, groupByCol = 'Department', targetCol = 'Marks' }) => {
  const clean = dataset.filter(r => typeof r[targetCol] === 'number' && !isNaN(r[targetCol]));
  
  const groups = {};
  clean.forEach(row => {
    const key = row[groupByCol] || 'Unknown';
    if (!groups[key]) groups[key] = { sum: 0, count: 0 };
    groups[key].sum += row[targetCol];
    groups[key].count++;
  });

  const data = Object.keys(groups).map(key => ({
    group: key,
    average: +(groups[key].sum / groups[key].count).toFixed(2),
    count: groups[key].count
  }));

  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
          <XAxis dataKey="group" stroke="#94a3b8" fontSize={12} tickLine={false} />
          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} domain={[0, 100]} />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
            formatter={(val) => [`${val} Marks`, 'Average']}
          />
          <Bar dataKey="average" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
