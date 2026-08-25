import React, { useState } from 'react';
import { fetchAndParseWebTable } from '../services/scrapingEngine';
import { Globe, Download, Loader2, CheckCircle2 } from 'lucide-react';

export const WebScraping = () => {
  const [url, setUrl] = useState('https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_population');
  const [loading, setLoading] = useState(false);
  const [scrapedData, setScrapedData] = useState(null);
  const [statusMsg, setStatusMsg] = useState(null);

  const handleScrape = async () => {
    setLoading(true);
    setStatusMsg(null);

    const res = await fetchAndParseWebTable(url);
    setScrapedData(res.dataset);
    setStatusMsg(res.message);
    setLoading(false);
  };

  const handleDownloadCSV = () => {
    if (!scrapedData || scrapedData.length === 0) return;
    const headers = Object.keys(scrapedData[0]).join(',');
    const rows = scrapedData.map(r => Object.values(r).map(v => `"${v}"`).join(','));
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'scraped_web_table.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Web Scraping Module</h2>
        <p className="text-xs text-slate-500">Extract HTML table data using DOM parsing and export directly to CSV.</p>
      </div>

      <div className="glass-panel p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Globe className="w-4 h-4 text-brand-500" /> Target Webpage URL
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
            placeholder="https://..."
          />
          <button
            onClick={handleScrape}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl gradient-bg text-white font-bold text-xs shadow-md disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Fetch & Extract Table'}
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-xl text-xs font-semibold bg-brand-500/10 text-brand-600 border border-brand-500/20 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{statusMsg}</span>
        </div>
      )}

      {scrapedData && (
        <div className="glass-panel p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Extracted Table Preview</h3>
            <button
              onClick={handleDownloadCSV}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Download className="w-3.5 h-3.5" /> Export to CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300">
                  {Object.keys(scrapedData[0] || {}).map((col) => (
                    <th key={col} className="p-3 font-semibold">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 font-mono">
                {scrapedData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                    {Object.keys(scrapedData[0] || {}).map((col) => (
                      <td key={col} className="p-3">{row[col]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
