import React, { useState, useEffect } from 'react';
import { X, Trash2, ShoppingBag, Truck, CreditCard, ShieldCheck, MapPin } from 'lucide-react';
import { CartItem, User, OrderItem } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, option: string | undefined, quantity: number) => void;
  onRemoveItem: (productId: string, option: string | undefined) => void;
  currentUser: User | null;
  onCheckout: (address: string, phone: string, items: OrderItem[], total: number) => Promise<boolean>;
  onClearCart: () => void;
  setView: (view: string) => void;
}

export default function Cart({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  currentUser,
  onCheckout,
  onClearCart,
  setView
}: CartProps) {
  // Checkout Form Details
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [city, setCity] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  // Pre-fill fields from current user profile
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setPhone(currentUser.phone || '');
      setAddress(currentUser.address || '');
      setZipcode(currentUser.zipcode || '');
      setCity(currentUser.city || '');
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  // Calculators
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const shippingThreshold = 40;
  const shippingCost = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 4.90;
  const total = subtotal + shippingCost;

  const handleSubmitCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    if (!currentUser) {
      setFormError('Precisa de iniciar sessão para finalizar a encomenda.');
      return;
    }

    if (!name || !phone || !address || !zipcode || !city) {
      setFormError('Por favor preencha todos os campos de entrega obrigatórios.');
      return;
    }

    setIsSubmitting(true);
    
    const formattedAddress = `${address}, ${city}, ${zipcode}`;
    const orderItems: OrderItem[] = cart.map(item => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      option: item.selectedOption
    }));

    try {
      const success = await onCheckout(formattedAddress, phone, orderItems, total);
      if (success) {
        setCheckoutSuccess('order_placed');
        onClearCart();
      } else {
        setFormError('Erro ao submeter encomenda. Por favor verifique o stock ou tente novamente.');
      }
    } catch {
      setFormError('Lamentamos, ocorreu um erro ao registar a sua encomenda.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-55 flex justify-end bg-zinc-950/80 backdrop-blur-md" id="cart-drawer-container">
      {/* Overlay back click */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      <div className="flex h-full w-full max-w-lg flex-col glass-panel-heavy p-6 shadow-2xl animate-fade-in border-l border-white/10 text-left">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center space-x-2.5">
            <ShoppingBag className="h-5 w-5 text-[#ccff00]" />
            <h2 className="text-base font-black text-white uppercase tracking-wider font-display">O Teu Pedido</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full glass-button-secondary text-zinc-400 hover:text-white"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Content Body */}
        {checkoutSuccess ? (
          /* ORDER PLACED SCREEN */
          <div className="flex flex-1 flex-col items-center justify-center p-6 text-center" id="checkout-success-screen">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ccff00]/10 border border-[#ccff00]/40 text-[#ccff00] mb-5 animate-pulse">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-black text-white uppercase font-display">Pedido Confirmado!</h3>
            <p className="mt-2.5 text-xs text-zinc-400 max-w-sm leading-relaxed">
              Recebemos os teus dados de envio. A nossa equipa farmacêutica e de logística já se encontra a preparar os teus artigos.
            </p>
            <p className="mt-1.5 text-[11px] text-zinc-500 font-mono uppercase tracking-wider">
              Acompanha o estado das tuas encomendas no teu perfil.
            </p>
            
            <div className="mt-10 flex flex-col gap-3 w-full">
              <button
                onClick={() => {
                  setCheckoutSuccess(null);
                  onClose();
                  setView('perfil');
                }}
                className="w-full glass-button-primary py-3.5 rounded-full text-xs font-black uppercase tracking-widest"
              >
                VER COBRANÇAS E ESTADOS
              </button>
              
              <button
                onClick={() => {
                  setCheckoutSuccess(null);
                  onClose();
                  setView('catalogo');
                }}
                className="w-full glass-button-secondary py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-zinc-300"
              >
                VOLTAR PARA O CATÁLOGO
              </button>
            </div>
          </div>
        ) : cart.length === 0 ? (
          /* EMPTY CART SCREEN */
          <div className="flex flex-1 flex-col items-center justify-center py-12 text-center" id="empty-cart-screen">
            <div className="flex h-12 w-12 items-center justify-center rounded-full glass-panel text-zinc-500 mb-4">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold text-zinc-300 uppercase tracking-tight font-display">Sem artigos no carrinho</p>
            <p className="text-xs text-zinc-500 mt-1.5 max-w-xs">Encontra os melhores suplementos puros e eleva a tua musculatura.</p>
            
            <button
              onClick={() => {
                onClose();
                setView('catalogo');
              }}
              className="mt-6 glass-button-primary px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest"
            >
              COMPRAR ATIVOS
            </button>
          </div>
        ) : (
          /* CART CONTENT AND CHECKOUT FORM */
          <div className="flex flex-1 flex-col overflow-hidden text-left">
            {/* Scrollable list of items */}
            <div className="flex-1 overflow-y-auto pr-1 py-4 space-y-3 custom-scrollbar">
              {cart.map((item) => (
                <div 
                  key={`${item.product.id}-${item.selectedOption}`}
                  className="flex items-center space-x-3.5 rounded-2xl glass-panel p-3.5 border border-white/5"
                  id={`cart-item-${item.product.id}`}
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="h-14 w-14 shrink-0 rounded-xl object-contain bg-zinc-950 p-1 border border-white/5"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="truncate text-xs font-bold text-white uppercase tracking-tight font-display">
                      {item.product.name}
                    </h4>
                    {item.selectedOption && (
                      <span className="inline-block mt-0.5 font-mono text-[9px] text-[#ccff00] uppercase font-black tracking-widest">
                        {item.selectedOption}
                      </span>
                    )}
                    <div className="mt-1.5 flex items-center space-x-2 font-mono text-[11px] font-bold text-zinc-400">
                      <span>{item.product.price.toFixed(2)}€</span>
                      <span className="text-zinc-650">/</span>
                      <span className="text-[#ccff00]">qtd: {item.quantity}</span>
                    </div>
                  </div>
                  
                  {/* Item Qty controllers and Trash */}
                  <div className="flex flex-col items-end space-y-2 shrink-0">
                    <span className="font-mono text-xs font-black text-white text-right leading-none">
                      {(item.product.price * item.quantity).toFixed(2)}€
                    </span>
                    
                    <div className="flex items-center space-x-1.5">
                      <div className="flex items-center rounded-lg bg-zinc-950 border border-white/5 p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.selectedOption, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="px-2 text-zinc-500 hover:text-white text-xs disabled:opacity-20"
                        >
                          -
                        </button>
                        <span className="px-1 text-[11px] font-mono font-bold text-zinc-300">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.selectedOption, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="px-2 text-zinc-500 hover:text-white text-xs disabled:opacity-20"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id, item.selectedOption)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg glass-button-secondary border-none text-zinc-500 hover:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="border-t border-white/5 pt-4 bg-transparent">
              <div className="space-y-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
                <div className="flex justify-between">
                  <span className="font-mono text-[10px]">Subtotal líquido</span>
                  <span className="font-mono text-zinc-200">{subtotal.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between items-center text-zinc-550 font-mono text-[10px]">
                  <span className="flex items-center gap-1">
                    <Truck className="h-3 w-3 text-[#ccff00]" />
                    <span>Custos de Portes</span>
                  </span>
                  <span>
                    {shippingCost === 0 ? (
                      <span className="text-[#ccff00] font-black tracking-widest text-glow">GRÁTIS</span>
                    ) : (
                      `${shippingCost.toFixed(2)}€`
                    )}
                  </span>
                </div>
                {shippingCost > 0 && (
                  <p className="text-[9px] text-[#ccff00]/80 lowercase tracking-normal pl-0.5 leading-none">
                    Adiciona mais <strong className="font-bold text-white uppercase font-mono">{(shippingThreshold - subtotal).toFixed(2)}€</strong> para ganhares portes grátis!
                  </p>
                )}
                <div className="flex justify-between border-t border-white/5 pt-3 text-xs font-black text-white uppercase tracking-widest">
                  <span className="font-display">Total Final</span>
                  <span className="font-mono text-[#ccff00] text-lg text-glow">{(total).toFixed(2)}€</span>
                </div>
              </div>
            </div>

            {/* CHECKOUT DELIVERABLES FORM */}
            <div className="border-t border-white/5 mt-4 pt-4 overflow-y-auto max-h-[220px] custom-scrollbar pr-1">
              <h3 className="text-[10px] font-black font-mono tracking-widest uppercase text-[#ccff00]/90 flex items-center gap-2 mb-3">
                <MapPin className="h-3.5 w-3.5" />
                <span>Endereço de Entrega Directa</span>
              </h3>
              
              {!currentUser ? (
                <div className="rounded-2xl glass-panel p-4 text-center my-1 border border-white/5">
                  <p className="text-xs text-zinc-400">Precisas de ter sessão iniciada para processar compras.</p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      setView('auth');
                    }}
                    className="mt-2 text-xs font-bold text-[#ccff00] hover:underline uppercase tracking-wider font-mono"
                  >
                    Fazer Login Agora
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitCheckout} className="space-y-3 text-left">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <input
                        type="text"
                        placeholder="Nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full text-xs bg-zinc-950 border border-white/5 rounded-xl p-3 text-zinc-100 placeholder-zinc-500 focus:border-[#ccff00] outline-none font-mono"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder="Telemóvel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full text-xs bg-zinc-950 border border-white/5 rounded-xl p-3 text-zinc-100 placeholder-zinc-500 focus:border-[#ccff00] outline-none font-mono"
                        required
                      />
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Morada de Entrega (Rua, Nº, Andar)"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full text-xs bg-zinc-950 border border-white/5 rounded-xl p-3 text-zinc-100 placeholder-zinc-500 focus:border-[#ccff00] outline-none font-mono"
                    required
                  />

                  <div className="grid grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      placeholder="Código Postal (e.g. 1000-100)"
                      value={zipcode}
                      onChange={(e) => setZipcode(e.target.value)}
                      className="w-full text-xs bg-zinc-950 border border-white/5 rounded-xl p-3 text-zinc-100 placeholder-zinc-500 focus:border-[#ccff00] outline-none font-mono"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Cidade"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full text-xs bg-zinc-950 border border-white/5 rounded-xl p-3 text-zinc-100 placeholder-zinc-500 focus:border-[#ccff00] outline-none font-mono"
                      required
                    />
                  </div>

                  {formError && (
                    <p className="text-[11px] font-bold text-red-400 pl-1">{formError}</p>
                  )}

                  {/* Submission and Safety */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full glass-button-primary flex items-center justify-center space-x-2.5 rounded-full py-3.5 text-xs font-black uppercase tracking-widest disabled:opacity-30"
                    >
                      <CreditCard className="h-4.5 w-4.5" />
                      <span>{isSubmitting ? 'A submeter dados...' : 'Finalizar e Pagar ao Receber'}</span>
                    </button>
                    <p className="flex items-center justify-center gap-1 mt-2 text-[9px] text-zinc-500 font-mono tracking-wider">
                      <ShieldCheck className="h-3 w-3 text-[#ccff00] shrink-0" />
                      <span>PAGAMENTO EXCLUSIVO À COBRANÇA NA ENTREGA</span>
                    </p>
                  </div>
                </form>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
