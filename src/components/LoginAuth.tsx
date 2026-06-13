import React, { useState } from 'react';
import { User, Lock, Mail, Phone, MapPin, UserPlus, LogIn, Dumbbell, ShieldAlert } from 'lucide-react';

interface LoginAuthProps {
  onAuthSuccess: (user: any, token: string) => void;
  setView: (view: string) => void;
}

export default function LoginAuth({ onAuthSuccess, setView }: LoginAuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [city, setCity] = useState('');

  const handleToggle = (state: boolean) => {
    setIsLogin(state);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const url = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin 
      ? { email, password } 
      : { email, password, name, phone, address, zipcode, city };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erro na autenticação.');
      }

      // Success callback
      onAuthSuccess(data.user, data.token);
      
      // Redirect to home or previous views
      setView(data.user.role === 'admin' ? 'admin' : 'catalogo');
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-left" id="auth-page">
      {/* Dynamic Background Circle Glow for Atmosphere */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-[#ccff00]/5 blur-[120px] pointer-events-none" />

      <div className="rounded-3xl glass-panel-heavy p-6 md:p-8 shadow-2xl relative overflow-hidden text-left">
        
        {/* Header Logo */}
        <div className="flex flex-col items-center text-center space-y-1 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ccff00] text-zinc-950 shadow-lg shadow-lime-900/10">
            <Dumbbell className="h-5 w-5 stroke-[2.5]" />
          </div>
          <h2 className="text-xl font-black uppercase text-white tracking-widest mt-3 font-display">
            PORTAL FIT<span className="text-[#ccff00] text-glow">FORCE</span>
          </h2>
          <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
            {isLogin ? 'Alimenta o teu progresso' : 'Junta-te ao clube de performance'}
          </p>
        </div>

        {/* Tab Switcher - Sleek designer styling with glass integration */}
        <div className="grid grid-cols-2 p-1 bg-zinc-950 rounded-full border border-white/5 mb-6">
          <button
            type="button"
            onClick={() => handleToggle(true)}
            className={`py-2 rounded-full text-xs font-bold uppercase tracking-wider font-mono transition-all duration-300 ${
              isLogin 
                ? 'bg-[#ccff00] text-zinc-950 font-black' 
                : 'text-zinc-550 hover:text-white'
            }`}
          >
            Aceder
          </button>
          <button
            type="button"
            onClick={() => handleToggle(false)}
            className={`py-2 rounded-full text-xs font-bold uppercase tracking-wider font-mono transition-all duration-300 ${
              !isLogin 
                ? 'bg-[#ccff00] text-zinc-950 font-black' 
                : 'text-zinc-550 hover:text-white'
            }`}
          >
            Registar
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email input */}
          <div className="space-y-1.5 text-left">
            <label className="font-mono text-[9px] font-black text-zinc-500 uppercase tracking-widest pl-1">
              Endereço de Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                placeholder="exemplo@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs glass-input rounded-xl py-3.5 pl-10 pr-4 text-zinc-100 placeholder-zinc-650 outline-none"
                required
              />
            </div>
          </div>

          {/* User Name input (Sign Up only) */}
          {!isLogin && (
            <div className="space-y-1.5 text-left">
              <label className="font-mono text-[9px] font-black text-zinc-500 uppercase tracking-widest pl-1">
                Nome Completo
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  placeholder="Seu Nome Completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs glass-input rounded-xl py-3.5 pl-10 pr-4 text-zinc-100 placeholder-zinc-650 outline-none"
                  required
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div className="space-y-1.5 text-left">
            <label className="font-mono text-[9px] font-black text-zinc-500 uppercase tracking-widest pl-1">
              Palavra-Passe
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs glass-input rounded-xl py-3.5 pl-10 pr-4 text-zinc-100 placeholder-zinc-650 outline-none"
                required
              />
            </div>
          </div>

          {/* EXTRA REGISTRATION FIELDS */}
          {!isLogin && (
            <div className="space-y-4 animate-fade-in text-left">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] font-black text-zinc-500 uppercase tracking-widest pl-1">
                    Telemóvel
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
                      <Phone className="h-4 w-4" />
                    </span>
                    <input
                      type="tel"
                      placeholder="912 345 678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs glass-input rounded-xl py-3.5 pl-10 pr-4 text-zinc-100 placeholder-zinc-650 outline-none"
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] font-black text-zinc-500 uppercase tracking-widest pl-1">
                    Cidade
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      placeholder="Lisboa / Porto..."
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full text-xs glass-input rounded-xl py-3.5 pl-10 pr-4 text-zinc-100 placeholder-zinc-650 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[9px] font-black text-zinc-500 uppercase tracking-widest pl-1">
                  Morada de Envio Directo
                </label>
                <input
                  type="text"
                  placeholder="Rua, número de lote, andar, etc."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs glass-input rounded-xl py-3.5 px-4 text-zinc-100 placeholder-zinc-650 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[9px] font-black text-zinc-500 uppercase tracking-widest pl-1">
                  Código Postal
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1000-023"
                  value={zipcode}
                  onChange={(e) => setZipcode(e.target.value)}
                  className="w-full text-xs glass-input rounded-xl py-3.5 px-4 text-[#ccff00] placeholder-zinc-650 outline-none font-mono"
                />
              </div>
            </div>
          )}

          {/* Error display */}
          {error && (
            <div className="text-xs font-bold text-red-400 border border-red-900/40 bg-red-950/20 p-3.5 rounded-xl text-center font-mono">
              {error}
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 glass-button-primary flex items-center justify-center space-x-2.5 rounded-full py-3.5 text-xs font-black uppercase tracking-widest disabled:opacity-50"
          >
            {isLogin ? <LogIn className="h-4 w-4 stroke-[2.2]" /> : <UserPlus className="h-4 w-4 stroke-[2.2]" />}
            <span>{loading ? 'A verificar credenciais...' : isLogin ? 'INICIAR SESSÃO' : 'CRIAR CONTA ATLETA'}</span>
          </button>
        </form>

        {/* Brand Demo Accounts Info Card */}
        <div className="mt-8 rounded-2xl glass-panel p-4 text-xs tracking-normal">
          <div className="flex items-center space-x-2 text-zinc-300 font-bold uppercase tracking-wider mb-2 font-mono text-[9px]">
            <ShieldAlert className="h-4 w-4 text-[#ccff00]" />
            <span>Acesso para Testes & Avaliação:</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-left font-mono text-[10px] divide-x divide-white/5">
            <div className="pr-1">
              <span className="text-zinc-500 font-bold">CLIENTE DEMO</span><br />
              <span className="text-[#ccff00]">user@fitforce.com</span><br />
              <span className="text-zinc-400">passe: user123</span>
            </div>
            <div className="pl-3.5">
              <span className="text-zinc-500 font-bold">ADMIN DEMO</span><br />
              <span className="text-[#ccff00]">admin@fitforce.com</span><br />
              <span className="text-zinc-400">passe: admin123</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
