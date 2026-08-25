import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 glass-panel border-l-4 border-red-500 my-6 space-y-4">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
            <AlertTriangle className="w-6 h-6" />
            <h3 className="text-base font-bold">Component Display Notice</h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Something prevented this view from rendering. Please check dataset metrics or reset parameters.
          </p>
          <div className="p-3 bg-slate-900 text-red-400 font-mono text-[11px] rounded-lg overflow-x-auto">
            {this.state.error?.toString()}
          </div>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="px-4 py-2 rounded-xl gradient-bg text-white font-bold text-xs shadow-md flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reload View
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
