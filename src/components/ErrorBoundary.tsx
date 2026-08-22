import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  declare props: ErrorBoundaryProps;
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surfaces render-time crashes (including failed lazy-chunk loads after a
    // redeploy) that would otherwise unmount the whole app to a blank screen.
    console.error('KejaFinder crashed:', error, info.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-[100dvh] w-full flex items-center justify-center bg-[#f7fee7] dark:bg-stone-950 px-6">
        <div className="max-w-[320px] w-full text-center space-y-5">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
            <AlertTriangle className="w-6 h-6" strokeWidth={2.25} />
          </div>
          <div className="space-y-1.5">
            <h1 className="font-display font-black text-lg text-neutral-800 dark:text-neutral-100 tracking-tight">
              Something went wrong
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-[13px] leading-relaxed">
              KejaFinder hit an unexpected error. Reloading the page usually fixes it.
            </p>
          </div>
          <button
            type="button"
            onClick={this.handleReload}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm transition-colors"
          >
            <RotateCw className="w-4 h-4" strokeWidth={2.5} />
            Reload page
          </button>
        </div>
      </div>
    );
  }
}
