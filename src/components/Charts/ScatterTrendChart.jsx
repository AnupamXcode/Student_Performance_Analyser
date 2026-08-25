import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip, CartesianGrid, ZAxis } from 'recharts';

export const ScatterTrendChart = ({ dataset, xKey = 'Attendance', yKey = 'Marks' }) => {
  const data = dataset
    .filter(r => typeof r[xKey] === 'number' && !isNaN(r[xKey]) && typeof r[yKey] === 'number' && !isNaN(r[yKey]))
    .map(r => ({
      x: r[xKey],
      y: r[yKey],
      student: r.Student_ID,
      dept: r.Department
    }));

  if (data.length === 0) return null;

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
          <XAxis type="number" dataKey="x" name={xKey} unit="%" stroke="#94a3b8" fontSize={12} domain={['dataMin - 5', 100]} />
          <YAxis type="number" dataKey="y" name={yKey} stroke="#94a3b8" fontSize={12} domain={['dataMin - 5', 100]} />
          <ZAxis type="number" range={[50, 50]} />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
            formatter={(value, name) => [value, name === 'x' ? 'Attendance (%)' : 'Marks']}
          />
          <Scatter name="Students" data={data} fill="#8b5cf6" opacity={0.7} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};
