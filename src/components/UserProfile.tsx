import React, { useState, useEffect } from 'react';
import { User as UserIcon, Calendar, MapPin, Phone, Mail, ShoppingBag, CheckCircle, Package, Truck, Clock, Sparkles } from 'lucide-react';
import { User, Order } from '../types';

interface UserProfileProps {
  currentUser: User | null;
  onUpdateProfile: (updatedData: any) => Promise<boolean>;
  token: string | null;
}

export default function UserProfile({
  currentUser,
  onUpdateProfile,
  token
}: UserProfileProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState({ text: '', isError: false });

  // Fields for profile updates
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [city, setCity] = useState('');

  // Feed profile details on mount
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setPhone(currentUser.phone || '');
      setAddress(currentUser.address || '');
      setZipcode(currentUser.zipcode || '');
      setCity(currentUser.city || '');
      
      // Fetch user's orders
      fetchOrders();
    }
  }, [currentUser]);

  const fetchOrders = async () => {
    if (!token) return;
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error('Error fetching orders:', e);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: '', isError: false });

    try {
      const success = await onUpdateProfile({ name, phone, address, zipcode, city });
      if (success) {
        setMessage({ text: 'Perfil atualizado com sucesso!', isError: false });
        setEditing(false);
      } else {
        setMessage({ text: 'Não foi possível atualizar o perfil.', isError: true });
      }
    } catch {
      setMessage({ text: 'Ocorreu um erro técnico ao guardar as alterações.', isError: true });
    }
  };

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center text-zinc-450">
        <p className="text-sm font-bold uppercase tracking-widest font-mono">Precisas de iniciar sessão para aceder a esta área.</p>
      </div>
    );
  }

  // Render status icon badge
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Pendente':
        return (
          <span className="inline-flex items-center space-x-1.5 rounded-full bg-yellow-950/45 border border-yellow-800/40 px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-yellow-400">
            <Clock className="h-3 w-3 animate-pulse" />
            <span>Pendente</span>
          </span>
        );
      case 'Processando':
        return (
          <span className="inline-flex items-center space-x-1.5 rounded-full bg-blue-950/45 border border-blue-800/40 px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-blue-400">
            <Package className="h-3 w-3" />
            <span>A Processar</span>
          </span>
        );
      case 'Enviado':
        return (
          <span className="inline-flex items-center space-x-1.5 rounded-full bg-purple-950/45 border border-purple-800/40 px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-purple-400">
            <Truck className="h-3 w-3" />
            <span>Enviado</span>
          </span>
        );
      case 'Entregue':
        return (
          <span className="inline-flex items-center space-x-1.5 rounded-full bg-green-950/45 border border-green-800/40 px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-green-400">
            <CheckCircle className="h-3 w-3" />
            <span>Entregue</span>
          </span>
        );
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 text-left" id="user-profile-page">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
        
        {/* Left Column Profile stats details with Glass Panel layout */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl glass-panel p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 h-20 w-20 rounded-full bg-[#ccff00]/5 blur-xl pointer-events-none" />
            
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ccff00]/10 border border-[#ccff00]/30 text-[#ccff00] mb-4">
                <UserIcon className="h-7 w-7 stroke-[2.2]" />
              </div>
              <h2 className="text-lg font-black text-white uppercase font-display">{currentUser.name}</h2>
              <span className="inline-block mt-2 font-mono text-[9px] tracking-widest text-[#ccff00] bg-[#ccff00]/5 px-3 py-1 rounded-full border border-[#ccff00]/20 font-black uppercase text-glow">
                {currentUser.role === 'admin' ? 'ADMINISTRADOR ATIVO' : 'MEMBRO FITFORCE VIP'}
              </span>
            </div>

            {/* Profile Info fields list */}
            {!editing ? (
              <div className="mt-8 space-y-4 text-xs font-medium">
                <div className="flex items-center space-x-3.5 text-zinc-350 p-2.5 rounded-xl bg-zinc-950/20 border border-white/5">
                  <Mail className="h-4.5 w-4.5 text-zinc-550 shrink-0" />
                  <span className="truncate">{currentUser.email}</span>
                </div>
                
                <div className="flex items-center space-x-3.5 text-zinc-350 p-2.5 rounded-xl bg-zinc-950/20 border border-white/5">
                  <Phone className="h-4.5 w-4.5 text-zinc-550 shrink-0" />
                  <span>{currentUser.phone || <em className="text-zinc-650 font-sans">Sem contacto de envio</em>}</span>
                </div>

                <div className="flex items-start space-x-3.5 text-zinc-350 p-2.5 rounded-xl bg-zinc-950/20 border border-white/5">
                  <MapPin className="h-4.5 w-4.5 text-zinc-550 shrink-0 mt-0.5" />
                  <div className="text-left">
                    {currentUser.address ? (
                      <>
                        <p className="font-semibold text-white">{currentUser.address}</p>
                        <p className="mt-1 text-[10px] text-zinc-500 font-mono font-bold">{currentUser.zipcode} {currentUser.city}</p>
                      </>
                    ) : (
                      <em className="text-zinc-650 font-sans">Sem morada de envio registada</em>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setEditing(true)}
                  className="w-full mt-6 glass-button-secondary py-3 rounded-full text-xs font-black uppercase tracking-wider font-mono text-zinc-250"
                >
                  EDITAR INFORMAÇÃO
                </button>
              </div>
            ) : (
              /* Profile Edit form */
              <form onSubmit={handleUpdate} className="mt-6 space-y-3.5 text-left">
                <div className="space-y-1">
                  <label className="font-mono text-[8px] font-black text-zinc-500 uppercase tracking-widest pl-1">Nome Completo</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs glass-input rounded-xl p-3 text-zinc-150 outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[8px] font-black text-zinc-500 uppercase tracking-widest pl-1">Número Telemóvel</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs glass-input rounded-xl p-3 text-zinc-150 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[8px] font-black text-zinc-500 uppercase tracking-widest pl-1">Morada de Entrega</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full text-xs glass-input rounded-xl p-3 text-zinc-150 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="font-mono text-[8px] font-black text-zinc-500 uppercase tracking-widest pl-1">Cód. Postal</label>
                    <input
                      type="text"
                      value={zipcode}
                      onChange={(e) => setZipcode(e.target.value)}
                      className="w-full text-xs glass-input rounded-xl p-3 text-zinc-150 outline-none font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[8px] font-black text-zinc-500 uppercase tracking-widest pl-1">Cidade</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full text-xs glass-input rounded-xl p-3 text-zinc-150 outline-none"
                    />
                  </div>
                </div>

                <div className="flex space-x-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="flex-1 py-3 text-xs font-bold bg-transparent text-zinc-400 border border-white/5 hover:bg-white/5 rounded-full uppercase font-mono"
                  >
                    Retroceder
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 text-xs font-black bg-[#ccff00] text-zinc-950 rounded-full uppercase font-mono"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            )}

            {/* Error / Success alerts */}
            {message.text && (
              <p className={`mt-4 text-xs font-bold text-center p-3 rounded-xl font-mono ${message.isError ? 'text-red-400 border border-red-900/40 bg-red-950/20' : 'text-[#ccff00] border border-lime-900/40 bg-lime-950/20'}`}>
                {message.text}
              </p>
            )}
          </div>
        </div>

        {/* Right Column Order tracking list with Glass Panel layout */}
        <div className="lg:col-span-8 mt-8 lg:mt-0" id="order-history-section">
          <div className="rounded-3xl glass-panel p-6 shadow-xl min-h-[460px] relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-lime-500/5 blur-3xl pointer-events-none" />

            <h2 className="text-xl font-black uppercase text-white tracking-tight flex items-center space-x-2.5 font-display">
              <ShoppingBag className="h-5 w-5 text-[#ccff00]" />
              <span>Estado e Percurso de Encomendas</span>
            </h2>
            <p className="text-[10px] text-zinc-500 font-mono mt-1 uppercase tracking-wider">Histórico detalhado e liquidações directas de cobrança</p>

            <div className="mt-6 border-t border-white/5 pt-6 text-left">
              {loadingOrders ? (
                <div className="flex h-40 items-center justify-center p-4">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#ccff00] border-t-transparent" />
                </div>
              ) : orders.length === 0 ? (
                <div className="flex h-48 flex-col items-center justify-center text-center text-zinc-550 border border-dashed border-white/5 rounded-2xl bg-zinc-950/30">
                  <ShoppingBag className="h-8 w-8 text-zinc-650 mb-3" />
                  <p className="text-sm font-bold text-zinc-300 uppercase font-display tracking-tight">Sem Compras Registadas</p>
                  <p className="text-xs text-zinc-500 mt-1.5 max-w-xs">Navega pelo catálogo e escolhe os melhores compostos para o teu desenvolvimento diário.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div 
                      key={order.id}
                      className="rounded-2xl bg-zinc-950/40 border border-white/5 p-4 md:p-5 text-left transition hover:border-[#ccff00]/10"
                      id={`order-status-${order.id}`}
                    >
                      {/* Encomenda Header info row */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-3.5 gap-2">
                        <div className="flex flex-col md:flex-row items-start md:items-center space-x-0 md:space-x-3 gap-1 md:gap-0">
                          <span className="font-mono text-xs font-black text-[#ccff00] uppercase tracking-widest bg-zinc-950 px-2.5 py-1 rounded border border-white/5">
                            REF: {order.id.slice(-6).toUpperCase()}
                          </span>
                          <span className="hidden md:inline text-zinc-800">|</span>
                          <span className="flex items-center text-[10px] font-bold text-zinc-450 font-mono uppercase tracking-wider">
                            <Calendar className="mr-1.5 h-3.5 w-3.5 text-zinc-500" />
                            {new Date(order.createdAt).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div>
                          {getStatusBadge(order.status)}
                        </div>
                      </div>

                      {/* Products List purchased */}
                      <div className="mt-4 space-y-2.5">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs">
                            <div className="flex items-center space-x-2.5">
                              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-zinc-950 border border-white/5 font-mono font-black text-[9px] text-[#ccff00]">
                                {item.quantity}
                              </span>
                              <div className="flex flex-col text-left">
                                <span className="text-zinc-200 font-bold uppercase tracking-wide text-[11px] font-display">{item.name}</span>
                                {item.option && (
                                  <span className="text-[9px] text-[#ccff00] font-black tracking-widest uppercase mt-0.5">Sabor: {item.option}</span>
                                )}
                              </div>
                            </div>
                            <span className="font-mono font-bold text-zinc-300">{(item.price * item.quantity).toFixed(2)}€</span>
                          </div>
                        ))}
                      </div>

                      {/* Sub footer containing dynamic delivery tracking info */}
                      <div className="mt-5 border-t border-white/5 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="text-xs text-zinc-500 text-left">
                          <p className="flex items-center gap-1.5 bg-zinc-950/70 py-1.5 px-3 rounded-full border border-white/5">
                            <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                            <strong className="text-zinc-400 font-mono text-[9px] uppercase tracking-wider">Destino:</strong> 
                            <span className="text-zinc-300 font-medium truncate max-w-[200px]">{order.address}</span>
                          </p>
                        </div>
                        
                        <div className="flex items-baseline space-x-1.5 shrink-0">
                          <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold tracking-wider leading-none">Total pago:</span>
                          <span className="font-mono text-base font-black text-[#ccff00] text-glow">
                            {order.total.toFixed(2)}€
                          </span>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
