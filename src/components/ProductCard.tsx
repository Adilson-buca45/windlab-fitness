import React from 'react';
import { ShoppingCart, Eye, PackageX, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product, option?: string, quantity?: number) => void;
}

export default function ProductCard({
  product,
  onViewDetails,
  onAddToCart
}: ProductCardProps) {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const defaultOption = product.options && product.options.length > 0 ? product.options[0] : undefined;

  return (
    <div 
      className="group relative flex flex-col overflow-hidden rounded-2xl glass-card text-left"
      id={`product-card-${product.id}`}
    >
      {/* Product Image Section with responsive overlay guides */}
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-950/80 border-b border-white/5">
        <img
          src={product.imageUrl}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center scale-95 group-hover:scale-100 transition-transform duration-700 ease-out"
        />
        {/* Subtle dark filter overlay */}
        <div className="absolute inset-0 bg-zinc-950/20 mix-blend-overlay pointer-events-none" />
        
        {/* Absolute Badges with backdrop-blur */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span className="rounded-full bg-zinc-950/80 border border-white/10 px-3 py-1 text-[9px] font-mono tracking-widest font-black uppercase text-[#ccff00] backdrop-blur-md">
            {product.category}
          </span>
          {isOutOfStock ? (
            <span className="flex items-center space-x-1 rounded-full bg-red-950/85 border border-red-900/60 px-3 py-1 text-[9px] font-bold text-red-400 uppercase tracking-wider backdrop-blur-md">
              <PackageX className="h-3 w-3" />
              <span>Esgotado</span>
            </span>
          ) : isLowStock ? (
            <span className="flex items-center space-x-1 rounded-full bg-orange-950/85 border border-orange-900/60 px-3 py-1 text-[9px] font-bold text-orange-400 uppercase tracking-wider backdrop-blur-md">
              <AlertTriangle className="h-3 w-3" />
              <span>{product.stock} restantes</span>
            </span>
          ) : null}
        </div>

        {/* Floating Quick Action overlay */}
        <div className="absolute inset-0 bg-zinc-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3 pointer-events-none group-hover:pointer-events-auto backdrop-blur-sm duration-305">
          <button
            onClick={() => onViewDetails(product)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-900/95 border border-zinc-800 text-zinc-300 hover:text-zinc-950 hover:bg-[#ccff00] hover:border-[#ccff00] transform translate-y-3 group-hover:translate-y-0 transition duration-300"
            title="Ver Detalhes"
          >
            <Eye className="h-5 w-5" />
          </button>
          {!isOutOfStock && (
            <button
              onClick={() => onAddToCart(product, defaultOption)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ccff00] text-zinc-950 hover:bg-[#d4ff1a] transform translate-y-3 group-hover:translate-y-0 transition duration-300 delay-75 shadow-lg shadow-lime-950/20"
              title="Adicionar Direto"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between min-h-[40px]">
          <h3 
            onClick={() => onViewDetails(product)}
            className="text-sm font-black text-white uppercase tracking-tight line-clamp-2 cursor-pointer hover:text-[#ccff00] transition duration-200 font-display"
          >
            {product.name}
          </h3>
        </div>
        
        <p className="mt-2 text-xs text-zinc-450 line-clamp-2 flex-1 leading-relaxed">
          {product.description}
        </p>
        
        <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
          <div className="flex flex-col">
            <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest leading-none font-bold">Preço final</span>
            <span className="text-xl font-black text-white mt-1 font-display">
              {product.price.toFixed(2)}€
            </span>
          </div>

          <button
            onClick={() => onViewDetails(product)}
            className="flex items-center space-x-1.5 text-[10px] font-black font-mono tracking-widest text-[#ccff00] hover:text-white uppercase transition duration-350"
          >
            <span>Ver artigo</span>
            <ArrowUpRight className="h-3. w-3." />
          </button>
        </div>
      </div>
    </div>
  );
}
