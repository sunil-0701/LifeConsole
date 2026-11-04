import { Component } from 'react';
import { RefreshCw, TriangleAlert } from 'lucide-react';

class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  handleReload = () => {
    window.location.reload();
  };

  handleRetry = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;

    if (!error) return this.props.children;

    return (
      <div className="grid min-h-screen place-items-center px-5 py-8">
        <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-amber-400/20 bg-amber-400/10">
              <TriangleAlert
                className="h-5 w-5 text-amber-300"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </span>
            <h1 className="text-base font-semibold text-white">LifeConsole hit an error</h1>
          </div>

          <p role="alert" className="mt-4 text-sm leading-relaxed text-zinc-400">
            The section you opened failed to render. Retrying often clears it;
            reloading rebuilds the session from scratch.
          </p>

          <pre tabIndex={0} aria-label="Error details" className="mt-4 max-h-40 overflow-auto rounded-xl border border-white/[0.08] bg-black/40 p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap text-zinc-400 [overflow-wrap:anywhere]">
            {String(error)}
          </pre>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={this.handleRetry}
              className="glass-control inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-2 text-sm text-zinc-200 hover:text-white"
            >
              <RefreshCw className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              Try again
            </button>
            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex min-h-11 items-center rounded-xl px-4 py-2 text-sm text-zinc-400 transition-colors duration-150 hover:bg-white/[0.04] hover:text-zinc-200"
            >
              Reload
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
