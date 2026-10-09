import { Component } from 'react';
import { RefreshCw, TriangleAlert } from 'lucide-react';

// Catches render crashes anywhere in the tree — including a lazy section
// chunk that fails to download — and swaps the blank screen for a message,
// the underlying error, and two ways out.
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
      <div className="grid min-h-screen place-items-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.04]">
              <TriangleAlert
                className="h-4 w-4 text-zinc-400"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </span>
            <h1 className="text-base font-semibold text-white">LifeConsole hit an error</h1>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-zinc-500">
            The section you opened failed to render. Retrying often clears it;
            reloading rebuilds the session from scratch.
          </p>

          <pre className="mt-4 max-h-40 overflow-auto rounded-lg border border-white/[0.06] bg-black/40 p-3 font-mono text-xs break-words whitespace-pre-wrap text-zinc-500">
            {String(error)}
          </pre>

          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={this.handleRetry}
              className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.05] px-3.5 py-2 text-sm text-zinc-200 transition-colors duration-150 hover:bg-white/[0.09] hover:text-white"
            >
              <RefreshCw className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              Try again
            </button>
            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex items-center rounded-lg px-3.5 py-2 text-sm text-zinc-500 transition-colors duration-150 hover:text-zinc-200"
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
