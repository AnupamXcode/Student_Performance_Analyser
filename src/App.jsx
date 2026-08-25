import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { generateDefaultDataset } from './services/dataService';

// Pages
import { Home } from './pages/Home';
import { DataInput } from './pages/DataInput';
import { DataCleaning } from './pages/DataCleaning';
import { DescriptiveStats } from './pages/DescriptiveStats';
import { Visualizations } from './pages/Visualizations';
import { ProbabilityDistributions } from './pages/ProbabilityDistributions';
import { SamplingTechniques } from './pages/SamplingTechniques';
import { CentralLimitTheorem } from './pages/CentralLimitTheorem';
import { BootstrapEstimation } from './pages/BootstrapEstimation';
import { MeanVsMedian } from './pages/MeanVsMedian';
import { WebScraping } from './pages/WebScraping';
import { FinalResults } from './pages/FinalResults';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [darkMode, setDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dataset, setDataset] = useState(generateDefaultDataset());

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Home dataset={dataset} setActivePage={setActivePage} />;
      case 'data':
        return <DataInput dataset={dataset} setDataset={setDataset} />;
      case 'cleaning':
        return <DataCleaning dataset={dataset} setDataset={setDataset} />;
      case 'stats':
        return <DescriptiveStats dataset={dataset} />;
      case 'visualizations':
        return <Visualizations dataset={dataset} />;
      case 'probability':
        return <ProbabilityDistributions />;
      case 'sampling':
        return <SamplingTechniques dataset={dataset} />;
      case 'clt':
        return <CentralLimitTheorem dataset={dataset} />;
      case 'bootstrap':
        return <BootstrapEstimation dataset={dataset} />;
      case 'mean-median':
        return <MeanVsMedian dataset={dataset} />;
      case 'scraping':
        return <WebScraping />;
      case 'final':
        return <FinalResults dataset={dataset} />;
      default:
        return <Home dataset={dataset} setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex font-sans">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          datasetLength={dataset.length}
        />

        <main className="flex-1 px-4 sm:px-8 pb-12 max-w-7xl w-full mx-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
