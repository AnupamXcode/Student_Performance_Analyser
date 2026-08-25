import React from 'react';

export const MetricCard = ({ title, value, subtitle, icon: Icon, trend, color = 'brand' }) => {
  const colorMap = {
    brand: 'border-brand-500 text-brand-600 dark:text-brand-400 bg-brand-500/10',
    emerald: 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
    amber: 'border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-500/10',
    purple: 'border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-500/10',
    rose: 'border-rose-500 text-rose-600 dark:text-rose-400 bg-rose-500/10',
  };

  const badgeStyle = colorMap[color] || colorMap.brand;

  return (
    <div className={`glass-panel p-5 border-l-4 ${badgeStyle.split(' ')[0]} transition-all duration-200 hover:-translate-y-1`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</span>
        {Icon && (
          <div className={`p-2 rounded-xl ${badgeStyle}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">{value !== undefined && value !== null ? value : '-'}</span>
        {trend && <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{trend}</span>}
      </div>
      {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );
};
