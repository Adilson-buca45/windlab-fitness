import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Plus, 
  Edit3, 
  Trash2, 
  ShoppingBag, 
  Package, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  X
} from 'lucide-react';
import { Product, Order, Category } from '../types';

interface AdminDashboardProps {
  products: Product[];
  onAddProduct: (productData: Partial<Product>) => Promise<boolean>;
  onEditProduct: (id: string, productData: Partial<Product>) => Promise<boolean>;
  onDeleteProduct: (id: string) => Promise<boolean>;
  token: string | null;
}

export default function AdminDashboard({
  products,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  token
}: AdminDashboardProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'products' | 'orders'>('stats');

  // Form State
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCategory, setFormCategory] = useState<Category>('Proteínas');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formStock, setFormStock] = useState('');
  const [formOptions, setFormOptions] = useState(''); // Comma separated

  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');

  const categories: Category[] = [
    'Suplementos',
    'Proteínas',
    'Pré-treinos',
    'Creatinas',
    'Roupas Fitness',
    'Equipamentos',
    'Garrafas e Shakers'
  ];

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const fetchOrders = async () => {
    if (!token) return;
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error('Error loading admin orders:', e);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Status Updater
  const handleOrderStatusChange = async (orderId: string, newStatus: Order['status']) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (e) {
      console.error('Error changing status:', e);
    }
  };

  const handleEditClick = (prod: Product) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormPrice(prod.price.toString());
    setFormCategory(prod.category as Category);
    setFormImageUrl(prod.imageUrl);
    setFormDescription(prod.description);
    setFormStock(prod.stock.toString());
    setFormOptions(prod.options ? prod.options.join(', ') : '');
    setShowProductForm(true);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleAddNewClick = () => {
    setEditingProduct(null);
    setFormName('');
    setFormPrice('');
    setFormCategory('Proteínas');
    setFormImageUrl('');
    setFormDescription('');
    setFormStock('');
    setFormOptions('');
    setShowProductForm(true);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!formName || !formPrice || !formCategory || !formImageUrl || !formDescription || !formStock) {
      setFormError('Preencha os campos obrigatórios.');
      return;
    }

    const optionsArray = formOptions
      ? formOptions.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const productPayload = {
      name: formName,
      price: Number(formPrice),
      category: formCategory,
      imageUrl: formImageUrl,
      description: formDescription,
      stock: Number(formStock),
      options: optionsArray
    };

    try {
      let success = false;
      if (editingProduct) {
        success = await onEditProduct(editingProduct.id, productPayload);
        if (success) {
          setFormSuccess('Produto editado e atualizado!');
          setTimeout(() => setShowProductForm(false), 800);
        }
      } else {
        success = await onAddProduct(productPayload);
        if (success) {
          setFormSuccess('Fórmula adicionada ao catálogo online!');
          // Reset
          setFormName('');
          setFormPrice('');
          setFormCategory('Proteínas');
          setFormImageUrl('');
          setFormDescription('');
          setFormStock('');
          setFormOptions('');
          setTimeout(() => setShowProductForm(false), 850);
        }
      }

      if (!success) {
        setFormError('Falha ao registar alterações. Verifique os valores.');
      }
    } catch {
      setFormError('Erro de rede técnica.');
    }
  };

  // Statistics calculation
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const activeOrdersCount = orders.filter(o => o.status === 'Pendente' || o.status === 'Processando').length;
  const outOfStockCount = products.filter(p => p.stock <= 0).length;
  const totalProductsCount = products.length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 text-left" id="admin-dashboard-page">
      
      {/* Header and navigation tabs */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-white/5 pb-6 gap-6 text-left">
        <div>
          <h1 className="text-2xl md:text-3xl font-black uppercase text-white tracking-tight flex items-center space-x-2.5 font-display">
            <BarChart className="h-6.5 w-6.5 text-[#ccff00]" />
            <span>PAINEL DE ADMINISTRAÇÃO</span>
          </h1>
          <p className="text-[10px] text-zinc-500 font-mono mt-1 uppercase tracking-wider">FITFORCE CONTROL CENTER • GESTÃO GLOBAL E METAS GERAIS</p>
        </div>

        {/* tab selection filters */}
        <div className="flex bg-zinc-950 p-1.5 rounded-full border border-white/5 self-stretch lg:self-auto gap-1">
          {[
            { id: 'stats', label: 'Monitor' },
            { id: 'products', label: `Stock catálogo (${totalProductsCount})` },
            { id: 'orders', label: `Logística (${orders.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 lg:flex-initial px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider font-mono transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-[#ccff00] text-zinc-950'
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* METRICS & OVERVIEW TAB */}
      {activeTab === 'stats' && (
        <div className="mt-8 space-y-6" id="overview-metrics-section">
          {/* Bento Stats Display */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Faturação Total", val: `${totalRevenue.toFixed(2)}€`, desc: "Venda bruta faturada", icon: DollarSign },
              { title: "Pedidos Ativos", val: activeOrdersCount, desc: "Fulfillment por preparar", icon: Activity },
              { title: "Esgotados", val: outOfStockCount, desc: "Aguardam reabastecimento", icon: AlertTriangle, danger: outOfStockCount > 0 },
              { title: "Catálogo", val: totalProductsCount, desc: "Substâncias ativas listadas", icon: Package }
            ].map((stat, idx) => (
              <div key={idx} className="rounded-2xl glass-panel p-5 relative overflow-hidden text-left border border-white/5">
                <div className="flex justify-between items-center text-zinc-500">
                  <span className="font-mono text-[9px] font-black uppercase tracking-widest">{stat.title}</span>
                  <stat.icon className={`h-4.5 w-4.5 ${stat.danger ? 'text-red-400' : 'text-[#ccff00]'}`} />
                </div>
                <p className={`mt-3 text-2xl lg:text-3xl font-black font-mono leading-none ${stat.danger ? 'text-red-400' : 'text-white'}`}>
                  {stat.val}
                </p>
                <p className="mt-2 text-[10px] text-zinc-500 font-bold uppercase tracking-wide">{stat.desc}</p>
              </div>
            ))}
          </div>

          {/* Additional Stats Insights blocks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="rounded-3xl glass-panel p-6 text-left border border-white/5 relative overflow-hidden">
              <h3 className="font-black text-white text-base uppercase font-display">Divisão Composta</h3>
              <div className="mt-6 space-y-4 text-xs">
                {categories.map((cat) => {
                  const itemsInCat = products.filter(p => p.category === cat);
                  const sharePercent = products.length > 0 ? (itemsInCat.length / products.length) * 100 : 0;
                  return (
                    <div key={cat} className="flex flex-col text-left py-1">
                      <div className="flex justify-between font-bold text-zinc-300 font-mono text-[10px] uppercase">
                        <span>{cat}</span>
                        <span className="text-[#ccff00]">{itemsInCat.length} unidades</span>
                      </div>
                      <div className="w-full bg-zinc-950 h-2 rounded-full mt-2.5 overflow-hidden border border-white/5">
                        <div className="bg-[#ccff00] h-full rounded-full" style={{ width: `${sharePercent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl glass-panel p-6 text-left border border-white/5 relative overflow-hidden">
              <h3 className="font-black text-white text-base uppercase font-display">Próximos Envios Urgentes</h3>
              <div className="mt-6 space-y-3">
                {orders.slice(0, 4).map((o) => (
                  <div key={o.id} className="flex justify-between items-center text-xs p-3.5 rounded-xl bg-zinc-950/50 border border-white/5 hover:border-[#ccff00]/10 transition">
                    <div className="flex flex-col text-left">
                      <span className="font-mono text-xs font-black text-[#ccff00]">REF: {o.id.slice(-6).toUpperCase()}</span>
                      <span className="text-zinc-400 mt-1.5 font-bold uppercase text-[10px]">{o.userName.split(' ')[0]}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-mono font-black text-zinc-100">{o.total.toFixed(2)}€</span>
                      <span className="text-[9px] font-mono font-black uppercase text-[#ccff00] mt-1 p-0.5">{o.status}</span>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && (
                  <p className="text-zinc-500 text-xs text-center py-10 font-mono uppercase tracking-widest">A aguardar encomendas no gateway...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCTS MANAGEMENT TAB */}
      {activeTab === 'products' && (
        <div className="mt-8 space-y-6" id="products-management-section">
          <div className="flex justify-between items-center text-left">
            <div>
              <h3 className="font-black text-white tracking-tight uppercase text-lg font-display">Editor do Catálogo FitForce</h3>
              <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-wider mt-0.5">Define fórmulas, ajusta stock e sabores ativos</p>
            </div>
            
            <button
              onClick={handleAddNewClick}
              className="glass-button-primary flex items-center space-x-1.5 px-5 py-3 rounded-full text-xs font-black uppercase tracking-wider"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Adicionar Produto</span>
            </button>
          </div>

          {/* Form Modal for Addition / Edits */}
          {showProductForm && (
            <div className="rounded-3xl glass-panel p-6 my-4 border border-[#ccff00]/15 animate-fade-in text-left relative overflow-hidden" id="product-crud-form">
              <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-5">
                <h4 className="font-black text-[#ccff00] uppercase text-sm font-display tracking-wide">
                  {editingProduct ? `Editar: ${editingProduct.name}` : 'Criar Novo Registo Nutricional'}
                </h4>
                <button
                  type="button"
                  onClick={() => setShowProductForm(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full glass-button-secondary text-zinc-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-bold text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5Col text-left">
                    <label className="font-mono text-[9px] font-black text-zinc-500 uppercase tracking-widest pl-1">Nome de Mercado</label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. FitForce Pure Creatine Creapure 500g"
                      className="w-full text-xs glass-input rounded-xl p-3 text-zinc-150 outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1 text-left">
                      <label className="font-mono text-[9px] font-black text-zinc-500 uppercase tracking-widest pl-1">Preço Final (€)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formPrice}
                        onChange={(e) => setFormPrice(e.target.value)}
                        placeholder="29.99"
                        className="w-full text-xs glass-input rounded-xl p-3 text-zinc-150 outline-none font-mono"
                        required
                      />
                    </div>
                    
                    <div className="space-y-1 text-left">
                      <label className="font-mono text-[9px] font-black text-zinc-500 uppercase tracking-widest pl-1">Unidades físicas</label>
                      <input
                        type="number"
                        value={formStock}
                        onChange={(e) => setFormStock(e.target.value)}
                        placeholder="50"
                        className="w-full text-xs glass-input rounded-xl p-3 text-[#ccff00] outline-none font-mono font-bold"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1 text-left">
                    <label className="font-mono text-[9px] font-black text-zinc-500 uppercase tracking-widest pl-1">Linha de Performance</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as Category)}
                      className="w-full text-xs glass-input rounded-xl p-3 text-zinc-150 outline-none uppercase font-mono font-bold"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat} className="bg-zinc-950 text-white">{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="font-mono text-[9px] font-black text-zinc-500 uppercase tracking-widest pl-1">Sabores / Variantes (Separadas por vírgula)</label>
                    <input
                      type="text"
                      value={formOptions}
                      onChange={(e) => setFormOptions(e.target.value)}
                      placeholder="e.g. Maçã, Melancia, Neutro ou S, M, L"
                      className="w-full text-xs glass-input rounded-xl p-3 text-zinc-150 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <label className="font-mono text-[9px] font-black text-zinc-500 uppercase tracking-widest pl-1">Link CDN de Imagem</label>
                  <input
                    type="url"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full text-xs glass-input rounded-xl p-3 text-zinc-150 outline-none font-mono"
                    required
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="font-mono text-[9px] font-black text-zinc-500 uppercase tracking-widest pl-1">Descrição Comercial Detalhada</label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Composição microscópica básica, dosagens recomendadas e modo laboratorial de conservação..."
                    className="w-full text-xs glass-input rounded-xl p-3 text-zinc-150 outline-none"
                    required
                  />
                </div>

                {/* Status messages */}
                {formError && <p className="text-xs font-bold text-red-400 font-mono text-center mb-2">{formError}</p>}
                {formSuccess && <p className="text-xs font-bold text-[#ccff00] font-mono text-center mb-2">{formSuccess}</p>}

                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowProductForm(false)}
                    className="flex-1 py-3 text-xs font-bold bg-transparent text-zinc-400 border border-white/5 hover:bg-white/5 rounded-full uppercase font-mono"
                  >
                    Fechar Formulário
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 text-xs font-black bg-[#ccff00] text-zinc-950 rounded-full uppercase font-mono"
                  >
                    Guardar Informações
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Table display of products - beautifully glass designed */}
          <div className="overflow-x-auto rounded-3xl glass-panel p-3.5 shadow-xl border border-white/5">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="border-b border-white/5 text-zinc-500 uppercase font-mono text-[9px] tracking-widest">
                  <th className="py-4 px-4">Artigo</th>
                  <th className="py-4 px-3">Linha / Categoria</th>
                  <th className="py-4 px-3 text-right">Faturação</th>
                  <th className="py-4 px-3 text-right">Armazém</th>
                  <th className="py-4 px-4 text-center">Editar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-white/2 transition group">
                    <td className="py-4 px-4 flex items-center space-x-3 text-left">
                      <img 
                        src={prod.imageUrl} 
                        alt="" 
                        referrerPolicy="no-referrer"
                        className="h-10 w-10 shrink-0 rounded-lg object-contain bg-zinc-950 p-1 border border-white/5"
                      />
                      <div className="truncate max-w-[200px] md:max-w-[280px]">
                        <p className="font-bold text-white group-hover:text-[#ccff00] transition truncate uppercase text-[11px] font-display">{prod.name}</p>
                        <p className="font-mono text-[9px] text-zinc-550 mt-0.5 truncate uppercase">ID: {prod.id.slice(-8).toUpperCase()}</p>
                      </div>
                    </td>
                    <td className="py-4 px-3 text-left">
                      <span className="bg-zinc-950/80 px-2.5 py-1 rounded-full text-[9px] border border-white/5 font-bold uppercase tracking-wider font-mono text-zinc-350">
                        {prod.category}
                      </span>
                    </td>
                    <td className="py-4 px-3 text-right font-mono font-bold text-white">
                      {prod.price.toFixed(2)}€
                    </td>
                    <td className={`py-4 px-3 text-right font-mono font-black ${prod.stock <= 5 ? 'text-red-400 text-glow' : 'text-zinc-350'}`}>
                      {prod.stock <= 0 ? 'Sem stock' : `${prod.stock} un`}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleEditClick(prod)}
                          className="p-2 rounded-full glass-button-secondary border-none text-zinc-400 hover:text-[#ccff00]"
                          title="Editar Ficha"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Tem a certeza de apagar ${prod.name}?`)) {
                              onDeleteProduct(prod.id);
                            }
                          }}
                          className="p-2 rounded-full glass-button-secondary border-none text-zinc-500 hover:text-red-400"
                          title="Remover Ficha"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ORDERS OPERATION TAB */}
      {activeTab === 'orders' && (
        <div className="mt-8 space-y-6" id="orders-fulfillment-section">
          <div className="text-left">
            <h3 className="font-black text-white uppercase text-lg tracking-tight font-display">Logística e Envio de Encomendas</h3>
            <p className="text-zinc-550 text-[10px] font-mono tracking-wider uppercase mt-0.5">Controla o processamento dos pedidos colocados pela comunidade</p>
          </div>
          
          {loadingOrders ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#ccff00] border-t-transparent" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 rounded-2xl glass-panel max-w-lg mx-auto border border-dashed border-white/5 bg-zinc-950/20">
              <ShoppingBag className="h-8 w-8 text-zinc-600 mx-auto" />
              <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mt-3 font-mono">Sem pedidos pendentes no gateway.</p>
            </div>
          ) : (
            <div className="space-y-4 text-left">
              {orders.map((order) => (
                <div 
                  key={order.id}
                  className="rounded-2xl glass-panel p-4 md:p-5 flex flex-col space-y-4 border border-white/5 my-1"
                  id={`admin-order-${order.id}`}
                >
                  {/* Order main rows */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-white/5 pb-3">
                    <div className="text-left">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-black text-[#ccff00] uppercase tracking-wider bg-zinc-950 px-2 rounded border border-white/5">
                          ID: {order.id.slice(-6).toUpperCase()}
                        </span>
                        <span className="text-zinc-700">|</span>
                        <span className="text-xs text-white font-bold uppercase font-display">{order.userName}</span>
                        <span className="text-zinc-700 text-xs hidden sm:inline">•</span>
                        <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline font-bold">{order.userEmail}</span>
                      </div>
                      <p className="text-[9px] font-mono text-zinc-550 mt-1 uppercase tracking-wider">
                        Colocada em: {new Date(order.createdAt).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    {/* Order Fulfillment Status Updater Dropdown */}
                    <div className="flex items-center space-x-2 w-full md:w-auto self-stretch md:self-auto justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-2 md:pt-0">
                      <span className="font-mono text-[9px] font-black text-zinc-550 uppercase tracking-widest pl-1">ESTADO ATUAL:</span>
                      <select
                        value={order.status}
                        onChange={(e) => handleOrderStatusChange(order.id, e.target.value as Order['status'])}
                        className={`text-xs font-black rounded-full px-3.5 py-1.5 border outline-none bg-zinc-950 uppercase tracking-wider font-mono ${
                          order.status === 'Pendente' ? 'border-yellow-900/60 text-yellow-400' :
                          order.status === 'Processando' ? 'border-blue-900/60 text-blue-400' :
                          order.status === 'Enviado' ? 'border-purple-900/60 text-purple-400' :
                          'border-green-900/60 text-green-400'
                        }`}
                      >
                        <option value="Pendente" className="bg-zinc-950 text-white">Pendente</option>
                        <option value="Processando" className="bg-zinc-950 text-white">Processando</option>
                        <option value="Enviado" className="bg-zinc-950 text-white">Enviado</option>
                        <option value="Entregue" className="bg-zinc-950 text-white">Entregue</option>
                      </select>
                    </div>
                  </div>

                  {/* Ordering Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium text-left">
                    <div className="space-y-1 bg-zinc-950/40 border border-white/5 p-3.5 rounded-xl text-left">
                      <p className="font-mono text-[9px] font-black text-[#ccff00] uppercase tracking-widest mb-2.5">Artigos Solicitados</p>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <span className="text-zinc-350">
                              <span className="font-mono text-[#ccff00] font-black pr-1">{item.quantity}x</span> 
                              <span className="font-semibold text-white uppercase text-[11px] font-display">{item.name}</span> 
                              {item.option && <span className="text-[9px] text-[#ccff00] font-black tracking-wider uppercase ml-1.5 bg-zinc-950 px-2 py-0.5 rounded border border-white/5 inline-block">({item.option})</span>}
                            </span>
                            <span className="font-mono text-zinc-400">{(item.price * item.quantity).toFixed(2)}€</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 bg-zinc-950/40 border border-white/5 p-3.5 rounded-xl text-left">
                      <p className="font-mono text-[9px] font-black text-zinc-500 uppercase tracking-widest">Apoio Logístico Directo</p>
                      <p className="text-zinc-350"><strong className="text-zinc-500 text-[9px] uppercase font-mono font-bold tracking-wider">Morada:</strong> {order.address}</p>
                      <p className="text-zinc-350"><strong className="text-zinc-500 text-[9px] uppercase font-mono font-bold tracking-wider">Contacto:</strong> {order.phone}</p>
                      <div className="flex justify-between items-baseline pt-2 border-t border-white/5 mt-2.5 font-black leading-none">
                        <span className="text-[9px] uppercase font-mono tracking-widest text-zinc-500">Total Faturado Cobrança:</span>
                        <span className="font-mono text-sm text-[#ccff00] text-glow">{order.total.toFixed(2)}€</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
