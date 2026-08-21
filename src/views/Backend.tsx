import { useEffect, useState } from 'react';
import { useStore } from '../lib/store';
import { useToast } from '../components/toast';
import { Badge, Btn, Icon, SectionHead, StatusDot } from '../components/ui';

export function Backend() {
  const { state } = useStore();
  const toast = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 bg-surface rounded animate-pulse w-1/3"></div>
        <div className="h-4 bg-surface rounded animate-pulse w-full"></div>
        <div className="h-4 bg-surface rounded animate-pulse w-2/3"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <SectionHead
        title="Backend Architecture"
        subtitle="HighLyAgent Backend is now a separate repository"
      />

      <div className="card p-6 space-y-4">
        <div className="flex items-start gap-3 p-4 bg-info/10 border border-info/20 rounded-lg">
          <Icon name="info" className="w-5 h-5 text-info mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-semibold text-ink">Backend Separated</h3>
            <p className="text-sm text-dusk">
              The backend code has been moved to a separate repository for better modularity and independent deployment.
              This frontend connects to the backend via REST API and WebSocket.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 card border border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="server" className="w-5 h-5 text-primary" />
              <h4 className="font-medium text-ink">Backend Repository</h4>
            </div>
            <p className="text-sm text-dusk mb-3">
              Contains FastAPI server, agent logic, database models, and AI integrations.
            </p>
            <Badge variant="primary">FastAPI</Badge>{" "}
            <Badge variant="secondary">PostgreSQL</Badge>{" "}
            <Badge variant="outline">Redis</Badge>
          </div>

          <div className="p-4 card border border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="layout-grid" className="w-5 h-5 text-success" />
              <h4 className="font-medium text-ink">Frontend (This Repo)</h4>
            </div>
            <p className="text-sm text-dusk mb-3">
              Admin dashboard for managing projects, users, tools, and monitoring.
            </p>
            <Badge variant="primary">React</Badge>{" "}
            <Badge variant="secondary">TypeScript</Badge>{" "}
            <Badge variant="outline">Vite</Badge>
          </div>
        </div>

        <div className="p-4 card border border-border/50">
          <h4 className="font-medium text-ink mb-3 flex items-center gap-2">
            <Icon name="link" className="w-5 h-5" />
            API Connection
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-border/50">
              <span className="text-dusk">API URL:</span>
              <code className="text-primary font-mono">{import.meta.env.VITE_API_URL || 'http://localhost:8000'}</code>
            </div>
            <div className="flex justify-between py-2 border-b border-border/50">
              <span className="text-dusk">WebSocket:</span>
              <code className="text-primary font-mono">{import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws'}</code>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-dusk">Status:</span>
              <div className="flex items-center gap-2">
                <StatusDot status="active" />
                <span className="text-success">Ready to connect</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 card border border-border/50">
          <h4 className="font-medium text-ink mb-3">Environment Setup</h4>
          <p className="text-sm text-dusk mb-3">
            Configure your <code className="bg-surface px-2 py-0.5 rounded">.env</code> file with backend URLs:
          </p>
          <pre className="bg-surface p-4 rounded-lg overflow-x-auto text-xs font-mono text-dusk">
{`VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws
VITE_MANAGEMENT_KEY=hl_mgmt_your_key_here`}
          </pre>
          <Btn
            className="mt-4"
            onClick={() => {
              navigator.clipboard.writeText(
                `VITE_API_URL=http://localhost:8000\nVITE_WS_URL=ws://localhost:8000/ws\nVITE_MANAGEMENT_KEY=hl_mgmt_your_key_here`
              );
              toast.show("Environment template copied!", "success");
            }}
          >
            <Icon name="copy" className="w-4 h-4 mr-2" />
            Copy .env Template
          </Btn>
        </div>
      </div>
    </div>
  );
}
