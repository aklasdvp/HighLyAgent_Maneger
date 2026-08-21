import { useState } from 'react';
import { useStore } from '../lib/store';
import { useToast } from '../components/toast';
import { Btn, Field, Icon } from '../components/ui';

function LogoMark({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className="drop-shadow-[0_0_18px_rgba(242,169,59,0.35)]">
      <rect width="32" height="32" rx="8" fill="var(--color-ink-800)" stroke="var(--color-ink-600)" />
      <circle cx="16" cy="10" r="3.2" fill="var(--color-signal-400)" />
      <circle cx="9" cy="22" r="2.5" fill="var(--color-pulse-400)" />
      <circle cx="23" cy="22" r="2.5" fill="var(--color-pulse-400)" />
      <path d="M16 13 9.6 20M16 13l6.4 7M11.5 22h9" stroke="var(--color-signal-400)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function Login() {
  const { state, actions } = useStore();
  const { push } = useToast();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(0);

  const fail = (msg: string) => { setErr(msg); setShake((x) => x + 1); };

  const submitLogin = async () => {
    if (!identifier.trim() || !password) {
      fail('Enter your username/email and password.');
      return;
    }
    setLoading(true);
    setErr('');
    try {
      const success = await actions.login(identifier, password);
      if (success) {
        push('Signed in — session secured with JWT');
      } else {
        fail('Invalid credentials. The attempt was written to the audit log.');
      }
    } catch (e) {
      fail('Login failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-[420px]">
        <div className="flex flex-col items-center mb-6 anim-rise">
          <LogoMark />
          <h1 className="font-display font-bold text-[24px] text-mist-100 mt-3 tracking-tight">HighLyAgent</h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mist-500 mt-1">
            Admin Control Center
          </p>
        </div>

        <div key={shake} className={`panel p-6 anim-pop ${shake ? 'shake' : ''}`}>
          <div className="flex items-start gap-2.5 mb-5 p-3 rounded-lg bg-signal-900/60 border border-signal-600/30">
            <Icon name="info" size={15} className="text-signal-300 shrink-0 mt-0.5" />
            <p className="text-[12px] text-signal-300/90 leading-relaxed">
              Admin account is created from environment variables on first boot. If no admin exists, check your server configuration.
            </p>
          </div>
          
          <Field label="Username or email">
            <input 
              className="field" 
              value={identifier} 
              onChange={(e) => { setIdentifier(e.target.value); setErr(''); }} 
              placeholder="opsadmin / you@company.com" 
              autoFocus 
              disabled={loading}
              onKeyDown={(e) => e.key === 'Enter' && submitLogin()}
            />
          </Field>
          
          <Field label="Password">
            <div className="relative">
              <input 
                className="field pr-10" 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => { setPassword(e.target.value); setErr(''); }} 
                placeholder="••••••••" 
                disabled={loading}
                onKeyDown={(e) => e.key === 'Enter' && submitLogin()}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-mist-500 hover:text-mist-300 transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
                disabled={loading}
              >
                <Icon name={showPassword ? 'eye-off' : 'eye'} size={16} />
              </button>
            </div>
          </Field>
          
          {err && <p className="text-[12px] text-alarm-400 mb-3 flex items-center gap-1.5"><Icon name="alert" size={13} /> {err}</p>}
          
          <Btn variant="primary" className="w-full" onClick={submitLogin} disabled={loading}>
            {loading ? (
              <>
                <Icon name="loader" size={14} className="animate-spin" /> Signing in...
              </>
            ) : (
              <>
                <Icon name="lock" size={14} /> Sign in
              </>
            )}
          </Btn>
          
          <p className="text-[11px] text-mist-500 text-center mt-4 leading-relaxed">
            Access token {state.system.sessionTimeoutMin} min · refresh {state.system.refreshValidDays} days ·
            unauthorized access is blocked and audited.
          </p>
        </div>

        <p className="text-center font-mono text-[10.5px] text-mist-600 mt-5 anim-rise" style={{ animationDelay: '150ms' }}>
          console runs on <span className="text-mist-400">127.0.0.1:{state.system.localPort}</span> · agent core on your VPS
        </p>
      </div>
    </div>
  );
}
