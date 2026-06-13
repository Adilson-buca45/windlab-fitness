import React, { useState } from 'react';
import { X, ShoppingCart, ShieldCheck, Truck, Scale, ChevronRight } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailsProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, option: string, quantity: number) => void;
}

export default function ProductDetails({
  product,
  onClose,
  onAddToCart
}: ProductDetailsProps) {
  const [selectedOption, setSelectedOption] = useState<string>(
    product.options && product.options.length > 0 ? product.options[0] : ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    onAddToCart(product, selectedOption, quantity);
    onClose();
  };

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-xl overflow-y-auto" id="product-details-modal">
      <div className="relative w-full max-w-4xl rounded-3xl glass-panel-heavy p-6 md:p-8 shadow-2xl animate-fade-in my-8 text-left">
        
        {/* Absolute dynamic background accent */}
        <div className="absolute top-0 right-1/4 h-[300px] w-[300px] rounded-full bg-[#ccff00]/5 blur-[80px] pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full glass-button-secondary text-zinc-400 hover:text-white"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        <div className="lg:grid lg:grid-cols-2 lg:gap-10 items-stretch">
          
          {/* Image Display */}
          <div className="aspect-square w-full rounded-2xl overflow-hidden bg-zinc-950/80 border border-white/5 flex items-center justify-center p-4">
            <img
              src={product.imageUrl}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="h-full w-full object-contain scale-95"
            />
          </div>

          {/* Product Purchasing Interface */}
          <div className="mt-6 lg:mt-0 flex flex-col justify-between">
            <div>
              {/* Category Tag */}
              <span className="inline-flex rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 px-3 py-1 text-[9px] font-mono tracking-widest font-black uppercase text-[#ccff00]">
                {product.category}
              </span>

              {/* Title & Price */}
              <h1 className="text-2xl md:text-3.5xl font-extrabold text-white uppercase tracking-tight mt-3 font-display">
                {product.name}
              </h1>
              
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-3xl font-black text-white font-display text-glow">
                  {product.price.toFixed(2)}€
                </span>
                <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">com IVA incluído</span>
              </div>

              {/* Description */}
              <div className="mt-6 border-t border-white/5 pt-4">
                <h3 className="text-[10px] font-mono tracking-widest font-bold uppercase text-[#ccff00]/80">Propriedade do Produto</h3>
                <p className="mt-2 text-xs sm:text-sm text-zinc-350 leading-relaxed font-sans">
                  {product.description}
                </p>
              </div>

              {/* Product Option Selector (flavor or size) */}
              {product.options && product.options.length > 0 && (
                <div className="mt-6">
                  <span className="font-mono text-[9px] font-black text-zinc-500 uppercase tracking-widest pl-1">
                    Selecionar Sabor / Opção
                  </span>
                  
                  <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {product.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setSelectedOption(opt)}
                        className={`px-3 py-2.5 rounded-xl text-xs font-bold uppercase font-mono transition-all duration-300 border ${
                          selectedOption === opt
                            ? 'bg-[#ccff00] border-[#ccff00] text-zinc-950 font-black shadow-md'
                            : 'glass-button-secondary text-zinc-400 hover:text-white'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity and Purchase trigger block */}
            <div className="mt-8 border-t border-white/5 pt-6">
              {isOutOfStock ? (
                <div className="rounded-2xl bg-red-950/20 border border-red-900/35 p-4 text-center">
                  <p className="text-xs font-black text-red-400 uppercase tracking-wider">Esgotado Temporariamente</p>
                  <p className="text-[11px] text-zinc-500 mt-1">Estamos a produzir novos lotes certificados. Use o suporte para receber alertas.</p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between pl-1">
                    <span className="font-mono text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                      Quantidade {product.stock <= 5 && `(ÚLTIMAS ${product.stock} UNIDADES)`}
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-stretch space-x-3">
                    {/* Quantity selectors */}
                    <div className="flex items-center rounded-xl bg-zinc-950 border border-white/5 p-1">
                      <button
                        onClick={handleDecrement}
                        disabled={quantity <= 1}
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-400 hover:text-[#ccff00] transition disabled:opacity-20"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-mono text-sm font-black text-white">
                        {quantity}
                      </span>
                      <button
                        onClick={handleIncrement}
                        disabled={quantity >= product.stock}
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-400 hover:text-[#ccff00] transition disabled:opacity-20"
                      >
                        +
                      </button>
                    </div>

                    {/* Add trigger */}
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 glass-button-primary flex items-center justify-center space-x-2 rounded-xl text-xs font-black uppercase tracking-wider"
                    >
                      <ShoppingCart className="h-4 w-4 stroke-[2.2]" />
                      <span>ADICIONAR AO CARRINHO</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Direct Shipping and Trust points */}
              <div className="mt-6 grid grid-cols-3 gap-2.5 text-center">
                {[
                  { icon: ShieldCheck, title: "Lab Certificado", val: "Puro" },
                  { icon: Truck, title: "Expresso", val: "24h - 48h" },
                  { icon: Scale, title: "Qualidade UE", val: "Garantido" }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center p-3 rounded-2xl glass-panel">
                    <item.icon className="h-4 w-4 text-[#ccff00]" />
                    <span className="font-mono text-[8px] font-black text-zinc-500 uppercase mt-1.5 tracking-widest">{item.title}</span>
                    <span className="text-[10px] text-zinc-200 font-bold mt-0.5">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
