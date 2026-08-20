import React from 'react';
import { RELOAD_KEY } from '../utils/lazyWithRetry';

const isChunkError = (error) => {
  const msg = error?.message || '';
  return (
    error?.name === 'ChunkLoadError' ||
    /ChunkLoadError|Loading chunk|Loading CSS chunk|dynamically imported module|Importing a module script failed/i.test(msg)
  );
};

const getFlag = () => {
  try { return window.sessionStorage.getItem(RELOAD_KEY) === 'true'; } catch { return false; }
};
const setFlag = (v) => {
  try { v ? window.sessionStorage.setItem(RELOAD_KEY, 'true') : window.sessionStorage.removeItem(RELOAD_KEY); } catch { /* ignore */ }
};

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    // A stale chunk after a redeploy: reload once to pick up fresh assets.
    if (isChunkError(error) && !getFlag()) {
      setFlag(true);
      window.location.reload();
    }
  }

  handleRefresh = () => {
    setFlag(false);
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '70vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center',
          padding: '2rem', fontFamily: 'sans-serif',
        }}>
          <h1 style={{ color: '#435817', fontSize: '1.75rem', marginBottom: '0.75rem' }}>
            Something went wrong
          </h1>
          <p style={{ color: '#4b5563', marginBottom: '1.5rem', maxWidth: '28rem' }}>
            The page couldn't load. Please refresh to continue.
          </p>
          <button
            onClick={this.handleRefresh}
            style={{
              background: '#435817', color: '#fff', padding: '0.75rem 2rem',
              borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '1rem',
            }}
          >
            Refresh
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
