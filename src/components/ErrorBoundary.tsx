import { Component, ReactNode, ErrorInfo } from 'react';

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { error: Error | null; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Alpha Ultimate Error:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return this.props.fallback ?? (
        <div style={{ background: '#050508', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'sans-serif' }}>
          <div style={{ textAlign: 'center', maxWidth: '480px' }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: 'linear-gradient(135deg,#FFD166,#FF9A3C)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: 28, fontWeight: 900, color: '#050508' }}>A</div>
            <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '0.75rem' }}>Something went wrong</h2>
            <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              {this.state.error.message}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => window.location.reload()}
                style={{ padding: '0.75rem 1.5rem', borderRadius: '9999px', background: 'linear-gradient(135deg,#FFD166,#FF9A3C)', color: '#050508', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                Reload Page
              </button>
              <a href="https://wa.me/966563906822" target="_blank" rel="noreferrer"
                style={{ padding: '0.75rem 1.5rem', borderRadius: '9999px', background: 'transparent', color: '#FFD166', fontWeight: 700, border: '1.5px solid rgba(255,209,102,0.4)', textDecoration: 'none' }}>
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
