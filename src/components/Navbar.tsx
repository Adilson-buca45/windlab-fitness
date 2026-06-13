import React from 'react';
import { Dumbbell, ShoppingBag, User, LayoutDashboard, LogOut, Activity } from 'lucide-react';
import { User as UserType, CartItem } from '../types';

interface NavbarProps {
  currentView: string;
  setView: (view: string) => void;
  currentUser: UserType | null;
  logout: () => void;
  cart: CartItem[];
  setCartOpen: (open: boolean) => void;
}

export default function Navbar({
  currentView,
  setView,
  currentUser,
  logout,
  cart,
  setCartOpen
}: NavbarProps) {
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl px-4 py-3.5 transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        
        {/* Brand Logo and Name */}
        <div 
          onClick={() => setView('home')} 
          className="flex cursor-pointer items-center space-x-2.5 text-zinc-50 transition hover:opacity-95 group"
          id="nav-logo"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ccff00] text-zinc-950 shadow-lg shadow-lime-900/10 group-hover:scale-105 transition-transform duration-300">
            <Dumbbell className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-lg font-black tracking-wider uppercase leading-none text-white font-display">
              FIT<span className="text-[#ccff00] text-glow">FORCE</span>
            </span>
            <span className="font-mono text-[9px] tracking-widest text-[#ccff00]/60 uppercase leading-none mt-1 font-bold">
              PERFORMANCE LAB
            </span>
          </div>
        </div>

        {/* Desktop Menu links - beautifully streamlined */}
        <div className="hidden md:flex items-center space-x-8 text-xs font-bold uppercase tracking-widest font-mono">
          <button 
            onClick={() => setView('home')}
            className={`transition-all hover:text-[#ccff00] relative py-1 ${
              currentView === 'home' 
                ? 'text-[#ccff00]' 
                : 'text-zinc-450 hover:translate-y-[-1px]'
            }`}
          >
            <span>Início</span>
            {currentView === 'home' && (
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#ccff00] rounded-full" />
            )}
          </button>
          
          <button 
            onClick={() => setView('catalogo')}
            className={`transition-all hover:text-[#ccff00] relative py-1 ${
              currentView === 'catalogo' 
                ? 'text-[#ccff00]' 
                : 'text-zinc-450 hover:translate-y-[-1px]'
            }`}
          >
            <span>Catálogo</span>
            {currentView === 'catalogo' && (
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#ccff00] rounded-full" />
            )}
          </button>

          {currentUser && currentUser.role === 'admin' && (
            <button 
              onClick={() => setView('admin')}
              className={`flex items-center space-x-2 transition-all hover:text-[#ccff00] relative py-1 ${
                currentView === 'admin' ? 'text-[#ccff00]' : 'text-zinc-455 hover:translate-y-[-1px]'
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Admin</span>
              {currentView === 'admin' && (
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#ccff00] rounded-full" />
              )}
            </button>
          )}
        </div>

        {/* Secondary Navigation Actions (Cart, User, Logout) */}
        <div className="flex items-center space-x-3">
          
          {/* Cart trigger button - Glass finished */}
          <button 
            onClick={() => setCartOpen(true)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full glass-button-secondary text-zinc-300 hover:text-[#ccff00]"
            id="nav-cart-trigger"
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ccff00] font-mono text-[10px] font-black text-zinc-950 shadow-md">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* User profile / Auth access */}
          {currentUser ? (
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setView('perfil')}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-full transition-all duration-300 ${
                  currentView === 'perfil' 
                    ? 'bg-[#ccff00] text-zinc-950 font-black' 
                    : 'glass-button-secondary text-zinc-200'
                }`}
              >
                <User className="h-4 w-4" />
                <span className="max-w-[110px] truncate text-xs font-bold uppercase tracking-wider font-mono">
                  {currentUser.name.split(' ')[0]}
                </span>
              </button>
              
              <button 
                onClick={logout}
                title="Sair da Conta"
                className="flex h-10 w-10 items-center justify-center rounded-full glass-button-secondary text-zinc-450 hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setView('auth')}
              className="glass-button-primary flex items-center space-x-2 rounded-full px-5 py-2.5 text-xs font-extrabold uppercase tracking-widest font-mono"
            >
              <User className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Entrar</span>
            </button>
          )}
        </div>

      </div>
    </nav>
  );
}
