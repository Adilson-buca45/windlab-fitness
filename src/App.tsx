import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  Dumbbell, 
  ChevronRight, 
  ArrowRight, 
  Award,
  BookOpen
} from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategoryFilters from './components/CategoryFilters';
import ProductCard from './components/ProductCard';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import LoginAuth from './components/LoginAuth';
import UserProfile from './components/UserProfile';
import AdminDashboard from './components/AdminDashboard';
import { Product, User, CartItem, OrderItem, Category } from './types';

export default function App() {
  // Navigation Routing States
  const [currentView, setView] = useState<string>('home');
  const [cartOpen, setCartOpen] = useState<boolean>(false);

  // Core Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);

  // Authentication States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Catalog Filtering/Search States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Todos'>('Todos');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Shopping Cart State
  const [cart, setCart] = useState<CartItem[]>([]);

  // === ON BOOT LOAD DATA ===
  useEffect(() => {
    // 1. Fetch catalog products
    loadProducts();

    // 2. Load Cart from client storage
    const savedCart = localStorage.getItem('fitforce_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        localStorage.removeItem('fitforce_cart');
      }
    }

    // 3. Verify logged-in status
    const savedToken = localStorage.getItem('fitforce_token');
    if (savedToken) {
      verifyToken(savedToken);
    }
  }, []);

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (e) {
      console.error('Failed to load products from API:', e);
    } finally {
      setLoadingProducts(false);
    }
  };

  const verifyToken = async (savedToken: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${savedToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        setToken(savedToken);
      } else {
        // Expired or invalid token
        localStorage.removeItem('fitforce_token');
      }
    } catch (error) {
      console.error('Token verification error:', error);
      localStorage.removeItem('fitforce_token');
    }
  };

  // === CART MANAGEMENT CONTROLLERS ===
  const saveCartToStorage = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem('fitforce_cart', JSON.stringify(updatedCart));
  };

  const handleAddToCart = (product: Product, option?: string, quantity: number = 1) => {
    const updatedCart = [...cart];
    const isSelectedOption = option || '';
    
    const existingIndex = updatedCart.findIndex(
      item => item.product.id === product.id && (item.selectedOption || '') === isSelectedOption
    );

    if (existingIndex > -1) {
      // Check stock limits before adding more
      const nextQty = updatedCart[existingIndex].quantity + quantity;
      if (nextQty <= product.stock) {
        updatedCart[existingIndex].quantity = nextQty;
        saveCartToStorage(updatedCart);
        setCartOpen(true);
      } else {
        alert(`Não podes adicionar mais exemplares. Limite de stock atingido (${product.stock} unidades disponíveis).`);
      }
    } else {
      if (quantity <= product.stock) {
        updatedCart.push({
          product,
          quantity,
          selectedOption: option
        });
        saveCartToStorage(updatedCart);
        setCartOpen(true);
      } else {
        alert(`O stock deste produto é insuficiente (${product.stock} unidades disponíveis).`);
      }
    }
  };

  const handleUpdateCartQuantity = (productId: string, option: string | undefined, quantity: number) => {
    const optMatch = option || '';
    let updatedCart = [...cart];
    
    const index = updatedCart.findIndex(
      item => item.product.id === productId && (item.selectedOption || '') === optMatch
    );

    if (index > -1) {
      // Validate bounds
      if (quantity <= 0) {
        updatedCart = updatedCart.filter((_, i) => i !== index);
      } else if (quantity <= updatedCart[index].product.stock) {
        updatedCart[index].quantity = quantity;
      } else {
        alert(`Stock escasso! Apenas temos ${updatedCart[index].product.stock} unidades.`);
      }
      saveCartToStorage(updatedCart);
    }
  };

  const handleRemoveCartItem = (productId: string, option: string | undefined) => {
    const optMatch = option || '';
    const updatedCart = cart.filter(
      item => !(item.product.id === productId && (item.selectedOption || '') === optMatch)
    );
    saveCartToStorage(updatedCart);
  };

  const handleClearCart = () => {
    saveCartToStorage([]);
  };

  // === AUTHENTICATION ACTIONS ===
  const handleAuthSuccess = (user: any, userToken: string) => {
    setCurrentUser(user);
    setToken(userToken);
    localStorage.setItem('fitforce_token', userToken);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('fitforce_token');
    setView('home');
  };

  const handleUpdateProfile = async (profileData: any): Promise<boolean> => {
    if (!token) return false;
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // === CHECKOUT HANDLER ===
  const handleCheckoutSubmit = async (
    address: string,
    phone: string,
    items: OrderItem[],
    total: number
  ): Promise<boolean> => {
    if (!token) return false;
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items, total, address, phone })
      });
      if (res.ok) {
        // Refresh local product catalogue (which updates stock indicators!)
        loadProducts();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // === ADMIN CRUD ACTIONS ===
  const handleAddProductAdmin = async (productData: Partial<Product>): Promise<boolean> => {
    if (!token) return false;
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        loadProducts();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleEditProductAdmin = async (id: string, productData: Partial<Product>): Promise<boolean> => {
    if (!token) return false;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        loadProducts();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleDeleteProductAdmin = async (id: string): Promise<boolean> => {
    if (!token) return false;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        loadProducts();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // === FILTER CALCULATIONS ===
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Home Featured articles
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-[#ccff00] selection:text-zinc-950">
      
      {/* Sticky Top Navbar */}
      <Navbar 
        currentView={currentView}
        setView={setView}
        currentUser={currentUser}
        logout={handleLogout}
        cart={cart}
        setCartOpen={setCartOpen}
      />

      {/* Slide Cartesian Cart Drawer */}
      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        currentUser={currentUser}
        onCheckout={handleCheckoutSubmit}
        onClearCart={handleClearCart}
        setView={setView}
      />

      {/* Detailed popover modal for product */}
      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* CORE VIEWPORT LAYOUT WRAPPER */}
      <main className="flex-1">
        
        {/* VIEW 1: HOME PAGE */}
        {currentView === 'home' && (
          <div className="animate-fade-in">
            {/* Elegant Hero Slogan section */}
            <Hero onExplore={() => setView('catalogo')} />

            {/* Featured Section */}
            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4 text-left">
                <div>
                  <span className="font-mono text-[9px] font-bold text-[#ccff00] tracking-widest uppercase">Mais Vendidos</span>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tight mt-1">Destaques FitForce</h2>
                  <p className="text-xs text-zinc-500 font-medium uppercase mt-0.5">As fórmulas e equipamentos preferidos da nossa comunidade</p>
                </div>
                
                <button
                  onClick={() => setView('catalogo')}
                  className="group flex items-center space-x-1 text-xs font-bold font-mono uppercase tracking-widest text-[#ccff00] hover:text-white transition"
                >
                  <span>Ver Catálogo Completo</span>
                  <ArrowRight className="h-4 w-4 transition transform group-hover:translate-x-1" />
                </button>
              </div>

              {loadingProducts ? (
                <div className="flex h-52 items-center justify-center">
                  <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#ccff00] border-t-transparent" />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                  {featuredProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onViewDetails={setSelectedProduct}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Quick Category shortcuts */}
            <section className="bg-zinc-900/35 border-y border-zinc-900 py-16 text-left">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                  <span className="font-mono text-[9px] font-bold text-[#ccff00] tracking-widest uppercase text-left">Navegação Rápida</span>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight mt-1">Navegar por Linha de Produto</h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'Proteínas' as Category, desc: 'Isolados e concentrados puros' },
                    { name: 'Pré-treinos' as Category, desc: 'Foco mental e energia extrema' },
                    { name: 'Creatinas' as Category, desc: 'Potência e volumização celular' },
                    { name: 'Equipamentos' as Category, desc: 'Acessórios premium para treino' }
                  ].map((cat, idx) => (
                    <div 
                      key={idx}
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setView('catalogo');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="group cursor-pointer rounded-2xl border border-zinc-900 bg-zinc-950 p-5 transition hover:border-zinc-800 hover:shadow-lg hover:shadow-lime-900/5 text-left"
                    >
                      <span className="font-mono text-[10px] text-zinc-550 group-hover:text-[#ccff00] font-bold uppercase transition">Linha 0{idx+1}</span>
                      <h4 className="text-sm font-extrabold text-white uppercase tracking-tight mt-2 group-hover:text-[#ccff00] transition">{cat.name}</h4>
                      <p className="text-[11px] text-zinc-500 mt-1">{cat.desc}</p>
                      
                      <span className="inline-flex items-center text-[10px] font-bold text-[#ccff00] uppercase mt-4 group-hover:underline">
                        Explorar
                        <ChevronRight className="h-3 w-3 pl-0.5" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Brand Manifesto Slogan strip */}
            <section className="mx-auto max-w-7xl px-4 py-20 text-center">
              <div className="rounded-2xl bg-gradient-to-tr from-zinc-950 to-zinc-900 border border-zinc-900 p-8 sm:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-[200px] w-[200px] rounded-full bg-[#ccff00]/5 blur-3xl pointer-events-none" />
                
                <div className="max-w-2xl mx-auto flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ccff00] text-zinc-950 shadow-md">
                    <Dumbbell className="h-6 w-6 stroke-[2.5]" />
                  </div>
                  <h3 className="mt-4 font-mono font-black text-xs text-[#ccff00] tracking-widest uppercase">Mantra FitForce</h3>
                  <p className="mt-4 text-2xl sm:text-3xl font-black text-white uppercase italic leading-tight">
                    "Transforma o teu potencial em resultados."
                  </p>
                  <p className="mt-4 text-xs text-zinc-500 max-w-md uppercase tracking-wider font-mono">
                    Compromisso obstinado de satisfação alimentar, suplementar e desportiva sem cedências.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: PRODUCT CATALOGUE */}
        {currentView === 'catalogo' && (
          <div className="mx-auto max-w-7xl px-4 py-10 text-left">
            
            {/* Header info bar */}
            <div className="border-b border-zinc-900 pb-6 mb-8 text-left">
              <span className="font-mono text-[9px] font-bold text-[#ccff00] tracking-widest uppercase">Produtos Disponíveis</span>
              <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mt-1">
                Catálogo FitForce
              </h1>
              <p className="text-xs text-zinc-500 font-medium uppercase mt-0.5">As melhores fórmulas de performance com envio imediato</p>
            </div>

            {/* Filtering and search row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-10">
              <div className="lg:col-span-8">
                <CategoryFilters 
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              </div>

              {/* Live search input */}
              <div className="lg:col-span-4 w-full">
                <label className="font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1 mb-2 block">
                  Pesquisar Artigos
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                    <Search className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Nome ou descrição..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs bg-zinc-900 border border-zinc-850 rounded-xl py-3.5 pl-10 pr-4 text-zinc-100 placeholder-zinc-500 focus:border-[#ccff00] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Product collection results */}
            {loadingProducts ? (
              <div className="flex h-60 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ccff00] border-t-transparent" />
              </div>
            ) : filteredProducts.length === 0 ? (
              /* Empty matches banner */
              <div className="text-center py-20 border border-dashed border-zinc-900 rounded-2xl bg-zinc-900/10">
                <Award className="h-10 w-10 text-zinc-700 mx-auto" />
                <p className="text-base font-bold text-zinc-300 uppercase mt-3">Nenhum resultado coincidente</p>
                <p className="text-xs text-zinc-505 max-w-sm mx-auto mt-1">Lamentamos, não encontramos produtos para os critérios especificados. Altere os termos da pesquisa ou escolham outra categoria.</p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('Todos');
                  }}
                  className="mt-6 px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-850 hover:border-zinc-700 font-bold text-xs uppercase"
                >
                  Limpar Filtros
                </button>
              </div>
            ) : (
              /* Product catalogue grid */
              <div>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-4 pl-1">
                  A mostrar <strong className="text-zinc-300 font-bold">{filteredProducts.length}</strong> artigos encontrados
                </p>
                
                <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                  {filteredProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onViewDetails={setSelectedProduct}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* VIEW 3: AUTHENTICATION ENTRANCE */}
        {currentView === 'auth' && (
          <LoginAuth 
            onAuthSuccess={handleAuthSuccess}
            setView={setView}
          />
        )}

        {/* VIEW 4: USER PROFILE PORTAL */}
        {currentView === 'perfil' && (
          <UserProfile
            currentUser={currentUser}
            onUpdateProfile={handleUpdateProfile}
            token={token}
          />
        )}

        {/* VIEW 5: ADMIN DASHBOARD */}
        {currentView === 'admin' && currentUser?.role === 'admin' && (
          <AdminDashboard
            products={products}
            onAddProduct={handleAddProductAdmin}
            onEditProduct={handleEditProductAdmin}
            onDeleteProduct={handleDeleteProductAdmin}
            token={token}
          />
        )}

      </main>

      {/* FOOTER STRIP PANEL */}
      <footer className="mt-auto border-t border-zinc-900 bg-zinc-950/70 py-10 px-4 text-xs font-medium text-zinc-550 text-center">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-500">
          
          {/* Slogan */}
          <div className="text-left max-w-xs self-start md:self-auto">
            <span className="text-sm font-black uppercase text-zinc-350 tracking-wider">FIT<span className="text-[#ccff00]">FORCE</span></span>
            <p className="mt-1.5 text-zinc-600 line-clamp-2">"Transforma o teu potencial em resultados."</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <button onClick={() => setView('home')} className="hover:text-zinc-300 transition">Início</button>
            <span className="hidden sm:inline text-zinc-800">|</span>
            <button onClick={() => setView('catalogo')} className="hover:text-zinc-300 transition">Catálogo</button>
            <span className="hidden sm:inline text-zinc-805">|</span>
            <button 
              onClick={() => {
                if (currentUser) setView('perfil');
                else setView('auth');
              }} 
              className="hover:text-zinc-300 transition"
            >
              Minha Área
            </button>
          </div>

          <span className="text-[11px] font-mono tracking-wide text-zinc-650">
            © 2026 FitForce. Todos os direitos reservados.
          </span>
        </div>
      </footer>

    </div>
  );
}
