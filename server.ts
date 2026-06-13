import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { createServer as createViteServer } from 'vite';
import crypto from 'crypto';
import { Product, User, Order, Category } from './src/types.js';

// Setup DB file persistence
const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Helper to hash password
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Initial default database structure
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Whey Isolate 100% (900g)',
    slug: 'whey-isolate-100-900g',
    price: 34.99,
    description: 'A proteína de soro de leite isolada de maior grau biológico. Proporciona 26g de proteína de absorção ultra-rápida por dose com quase zero hidratos de carbono e gorduras. Ideal para a recuperação e definição muscular máxima.',
    category: 'Proteínas',
    imageUrl: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=600&auto=format&fit=crop&q=80',
    stock: 45,
    options: ['Chocolate Belga', 'Baunilha Bourbon', 'Morango Silvestre']
  },
  {
    id: 'p2',
    name: 'Pre-Workout Explode (300g)',
    slug: 'pre-workout-explode-300g',
    price: 24.99,
    description: 'Fórmula científica ultra-concentrada concebida para aumentar drasticamente os níveis de energia, foco mental intenso e vasodilatação muscular extrema. Contém Beta-Alanina, Citrulina e Cafeína.',
    category: 'Pré-treinos',
    imageUrl: 'https://images.unsplash.com/photo-1611536326696-b52be8ea45f6?w=600&auto=format&fit=crop&q=80',
    stock: 50,
    options: ['Melancia Explosiva', 'Maçã Ácida']
  },
  {
    id: 'p3',
    name: 'Creatina Creapure® (250g)',
    slug: 'creatina-creapure-250g',
    price: 22.99,
    description: 'Creatina monohidratada de grau farmacêutico produzida na Alemanha com selo de qualidade Creapure®. Maximiza a força contrátil, aumenta a potência explosiva e acelera drasticamente a volumização das células musculares.',
    category: 'Creatinas',
    imageUrl: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=600&auto=format&fit=crop&q=80',
    stock: 60,
    options: ['Sem Sabor']
  },
  {
    id: 'p4',
    name: 'Vegan Protein Blend (900g)',
    slug: 'vegan-protein-blend-900g',
    price: 29.99,
    description: 'Mistura premium de proteína isolada de ervilha purificada e proteína de arroz biológica. Perfil completo de aminoácidos, enriquecido com enzimas digestivas naturais para uma digestão ultra leve.',
    category: 'Proteínas',
    imageUrl: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=600&auto=format&fit=crop&q=80',
    stock: 25,
    options: ['Chocolate Suave', 'Baunilha Natural']
  },
  {
    id: 'p5',
    name: 'Pump Booster Sem Estimulantes (400g)',
    slug: 'pump-booster-sem-estimulantes-400g',
    price: 26.99,
    description: 'Pré-treino sem cafeína, focado no aumento massivo do fluxo sanguíneo (pump) e hidratação celular. Formulado especialmente para treinos noturnos que não comprometem o teu sono de qualidade.',
    category: 'Pré-treinos',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
    stock: 30,
    options: ['Frutos Vermelhos']
  },
  {
    id: 'p6',
    name: 'Creatina Monohidratada Pura (500g)',
    slug: 'creatina-monohidratada-pura-500g',
    price: 19.99,
    description: 'Creatina pura 200 mesh microcristalina de altíssima qualidade. Aumenta os níveis de ATP muscular para promover ganhos consistentes de massa magra e potência desportiva.',
    category: 'Creatinas',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
    stock: 80,
    options: ['Sem Sabor']
  },
  {
    id: 'p7',
    name: 'Camisola Técnica Dry-Fit FitForce',
    slug: 'camisola-tecnica-dry-fit-fitforce',
    price: 19.99,
    description: 'Fabricada com tecido técnico respirável de secagem ultra-rápida. Costuras planas macias para evitar fricção. Painéis sob os braços para máxima mobilidade desportiva.',
    category: 'Roupas Fitness',
    imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&auto=format&fit=crop&q=80',
    stock: 120,
    options: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'p8',
    name: 'Leggings Pro Compressão Cintura Alta',
    slug: 'leggings-pro-compressao-cintura-alta',
    price: 29.99,
    description: 'Desenvolvido com tecnologia de compressão intermédia que ativa a circulação. Tecido opaco anti-transparência à prova de agachamento (squat-proof) com bolso lateral integrado para telemóvel.',
    category: 'Roupas Fitness',
    imageUrl: 'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=600&auto=format&fit=crop&q=80',
    stock: 45,
    options: ['XS', 'S', 'M', 'L']
  },
  {
    id: 'p9',
    name: 'Calções de Treino Pro Elastic',
    slug: 'calcoes-de-treino-pro-elastic',
    price: 22.50,
    description: 'Calções respiráveis ultra leves com cueca interna integrada para suporte seguro. Tecido elástico de alta flexibilidade perfeito para agachamentos intensificados e cardio de alto rendimento.',
    category: 'Roupas Fitness',
    imageUrl: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop&q=80',
    stock: 55,
    options: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'p10',
    name: 'Conjunto de Bandas de Resistência Premium',
    slug: 'conjunto-de-bandas-de-resistencia-premium',
    price: 15.99,
    description: 'Conjunto de 5 bandas elásticas de látex natural com diferentes intensidades de resistência (total de até 50kg). Inclui pegas ergonómicas acolchoadas, cintas de tornozelo e âncora de porta robusta.',
    category: 'Equipamentos',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
    stock: 75,
    options: ['Conjunto Completo']
  },
  {
    id: 'p11',
    name: 'Tapete de Yoga Alta Densidade',
    slug: 'tapete-de-yoga-alta-densidade',
    price: 24.99,
    description: 'Tapete premium com 6mm de espessura de material TPE ecológico antiderrapante de dupla face. Amortece as articulações fornecendo equilíbrio estável. Inclui fita de transporte elegante.',
    category: 'Equipamentos',
    imageUrl: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=600&auto=format&fit=crop&q=80',
    stock: 35,
    options: ['Preto Obsidian', 'Verde Pastel']
  },
  {
    id: 'p12',
    name: 'Corda de Saltar Speed Pro',
    slug: 'corda-de-saltar-speed-pro',
    price: 9.99,
    description: 'Corda leve e inteligente de cabo de aço revestido, equipada com rolamentos de esferas de rotação ultra leve em 360-graus. Pegas metálicas antiderrapantes de alumínio.',
    category: 'Equipamentos',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
    stock: 90,
    options: ['Cabo Preto', 'Cabo Vermelho']
  },
  {
    id: 'p13',
    name: 'Shaker Inox Térmico 750ml',
    slug: 'shaker-inox-termico-750ml',
    price: 18.99,
    description: 'Shaker feito de aço inoxidável duplo isolado que mantém as tuas bebidas frias por até 12 horas. Grelha interna de mistura perfeita que evita grumos, livre de odores e de BPA.',
    category: 'Garrafas e Shakers',
    imageUrl: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=600&auto=format&fit=crop&q=80',
    stock: 65,
    options: ['Preto Mate', 'Cinzento Escovado']
  },
  {
    id: 'p14',
    name: 'Garrafa de Água Motivacional 2L',
    slug: 'garrafa-de-agua-motivacional-2l',
    price: 12.99,
    description: 'Garrafa de hidratação diária de 2 litros com marcadores horários motivantes gravados no corpo translúcido. Palha de silicone suave rebatível, pega robusta e fecho estanque à prova de fugas.',
    category: 'Garrafas e Shakers',
    imageUrl: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600&auto=format&fit=crop&q=80',
    stock: 80,
    options: ['Azul-Roxo Degradé', 'Preto Minimalista']
  },
  {
    id: 'p15',
    name: 'Multivitamínico FitForce Daily',
    slug: 'multivitaminico-fitforce-daily',
    price: 14.99,
    description: 'Poderoso complexo completo contendo 24 vitaminas e minerais essenciais. Fortificado com antioxidantes, coenzima Q10 e extratos botânicos. Apoia a imunidade e metabolismo ativo diário.',
    category: 'Suplementos',
    imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=80',
    stock: 150,
    options: ['120 Cápsulas']
  }
];

interface UserWithPassword extends User {
  passwordHash: string;
}

interface DatabaseSchema {
  users: UserWithPassword[];
  products: Product[];
  orders: Order[];
}

// Function to initialize Database
async function initializeDB() {
  try {
    await fs.mkdir(DB_DIR, { recursive: true });
    try {
      const content = await fs.readFile(DB_FILE, 'utf-8');
      // Validate schema
      JSON.parse(content);
    } catch {
      // Create fresh database with seed data
      const defaultDb: DatabaseSchema = {
        users: [
          {
            id: 'u1',
            email: 'admin@fitforce.com',
            name: 'Administrador FitForce',
            role: 'admin',
            createdAt: new Date().toISOString(),
            passwordHash: hashPassword('admin123')
          },
          {
            id: 'u2',
            email: 'user@fitforce.com',
            name: 'João Silva',
            role: 'user',
            phone: '+351 912 345 678',
            address: 'Avenida da Liberdade 123, 3º Esq',
            zipcode: '1250-140',
            city: 'Lisboa',
            createdAt: new Date().toISOString(),
            passwordHash: hashPassword('user123')
          }
        ],
        products: INITIAL_PRODUCTS,
        orders: [
          {
            id: 'ord-1001',
            userId: 'u2',
            userEmail: 'user@fitforce.com',
            userName: 'João Silva',
            items: [
              {
                productId: 'p1',
                name: 'Whey Isolate 100% (900g)',
                price: 34.99,
                quantity: 1,
                option: 'Chocolate Belga'
              },
              {
                productId: 'p13',
                name: 'Shaker Inox Térmico 750ml',
                price: 18.99,
                quantity: 1,
                option: 'Preto Mate'
              }
            ],
            total: 53.98,
            status: 'Processando',
            address: 'Avenida da Liberdade 123, 3º Esq, Lisboa, 1250-140',
            phone: '+351 912 345 678',
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
          }
        ]
      };
      await fs.writeFile(DB_FILE, JSON.stringify(defaultDb, null, 2), 'utf-8');
      console.log('Database seeded successfully!');
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

// Global reader and writer helpers
async function readDB(): Promise<DatabaseSchema> {
  const content = await fs.readFile(DB_FILE, 'utf-8');
  return JSON.parse(content);
}

async function writeDB(db: DatabaseSchema): Promise<void> {
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
}

async function startServer() {
  await initializeDB();

  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // === AUTHENTICATION MIDDLEWARE ===
  const authHandler = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Não autorizado. Token em falta.' });
      }
      
      const token = authHeader.split(' ')[1];
      const db = await readDB();
      // Token structure in this demo is basic base64: email:passwordHash or simplified user id
      let userId: string;
      try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        userId = decoded.split(':')[0];
      } catch {
        return res.status(401).json({ error: 'Token inválido.' });
      }

      const user = db.users.find(u => u.id === userId);
      if (!user) {
        return res.status(401).json({ error: 'Utilizador não encontrado.' });
      }

      // Add user info to req
      (req as any).user = user;
      next();
    } catch (e) {
      res.status(500).json({ error: 'Erro no servidor durante a autenticação.' });
    }
  };

  const adminOnlyHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = (req as any).user;
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
    }
    next();
  };


  // === API ENDPOINTS ===

  // 1. AUTH API
  app.post('/api/auth/register', async (req, res) => {
    const { email, password, name, phone, address, zipcode, city } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, Palavra-passe e Nome são obrigatórios.' });
    }

    try {
      const db = await readDB();
      const exists = db.users.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        return res.status(400).json({ error: 'Este endereço de email já está registado.' });
      }

      const newUser: UserWithPassword = {
        id: 'u-' + Math.random().toString(36).substr(2, 9),
        email: email.toLowerCase(),
        name,
        phone,
        address,
        zipcode,
        city,
        role: 'user', // Default is normal registered user
        createdAt: new Date().toISOString(),
        passwordHash: hashPassword(password)
      };

      db.users.push(newUser);
      await writeDB(db);

      // Create a simplified token (base64 of user-id + timestamp)
      const token = Buffer.from(`${newUser.id}:${Date.now()}`).toString('base64');
      
      const { passwordHash, ...userResponse } = newUser;
      res.status(201).json({ user: userResponse, token });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao registar utilizador.' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e palavra-passe obrigatórios.' });
    }

    try {
      const db = await readDB();
      const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return res.status(400).json({ error: 'Credenciais de acesso incorretas.' });
      }

      const hash = hashPassword(password);
      if (user.passwordHash !== hash) {
        return res.status(400).json({ error: 'Credenciais de acesso incorretas.' });
      }

      const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');
      const { passwordHash, ...userResponse } = user;
      res.json({ user: userResponse, token });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao processar início de sessão.' });
    }
  });

  app.get('/api/auth/me', authHandler, (req, res) => {
    const user = (req as any).user;
    const { passwordHash, ...userResponse } = user;
    res.json({ user: userResponse });
  });

  app.put('/api/auth/profile', authHandler, async (req, res) => {
    const user = (req as any).user;
    const { name, phone, address, zipcode, city } = req.body;

    try {
      const db = await readDB();
      const index = db.users.findIndex(u => u.id === user.id);
      if (index === -1) {
        return res.status(404).json({ error: 'Utilizador não encontrado.' });
      }

      db.users[index].name = name || db.users[index].name;
      db.users[index].phone = phone;
      db.users[index].address = address;
      db.users[index].zipcode = zipcode;
      db.users[index].city = city;

      await writeDB(db);

      const { passwordHash, ...userResponse } = db.users[index];
      res.json({ user: userResponse });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar perfil.' });
    }
  });


  // 2. PRODUCTS API
  app.get('/api/products', async (req, res) => {
    try {
      const db = await readDB();
      res.json(db.products);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao obter catálogo de produtos.' });
    }
  });

  app.post('/api/products', authHandler, adminOnlyHandler, async (req, res) => {
    const { name, price, description, category, imageUrl, stock, options } = req.body;
    if (!name || price === undefined || !description || !category || !imageUrl || stock === undefined) {
      return res.status(400).json({ error: 'Campos obrigatórios em falta para o produto.' });
    }

    try {
      const db = await readDB();
      const slug = name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');

      const newProduct: Product = {
        id: 'p-' + Math.random().toString(36).substr(2, 9),
        name,
        slug,
        price: Number(price),
        description,
        category,
        imageUrl,
        stock: Number(stock),
        options: options || []
      };

      db.products.push(newProduct);
      await writeDB(db);

      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao adicionar produto.' });
    }
  });

  app.put('/api/products/:id', authHandler, adminOnlyHandler, async (req, res) => {
    const id = req.params.id;
    const { name, price, description, category, imageUrl, stock, options } = req.body;

    try {
      const db = await readDB();
      const index = db.products.findIndex(p => p.id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Produto não encontrado.' });
      }

      const original = db.products[index];
      const updatedSlug = name 
        ? name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
        : original.slug;

      db.products[index] = {
        ...original,
        name: name || original.name,
        slug: updatedSlug,
        price: price !== undefined ? Number(price) : original.price,
        description: description || original.description,
        category: category || original.category,
        imageUrl: imageUrl || original.imageUrl,
        stock: stock !== undefined ? Number(stock) : original.stock,
        options: options || original.options
      };

      await writeDB(db);
      res.json(db.products[index]);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao editar produto.' });
    }
  });

  app.delete('/api/products/:id', authHandler, adminOnlyHandler, async (req, res) => {
    const id = req.params.id;
    try {
      const db = await readDB();
      const initialLength = db.products.length;
      db.products = db.products.filter(p => p.id !== id);
      
      if (db.products.length === initialLength) {
        return res.status(404).json({ error: 'Produto não encontrado.' });
      }

      await writeDB(db);
      res.json({ message: 'Produto removido com sucesso.' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao remover produto.' });
    }
  });


  // 3. ORDERS API
  app.get('/api/orders', authHandler, async (req, res) => {
    const user = (req as any).user;
    try {
      const db = await readDB();
      if (user.role === 'admin') {
        res.json(db.orders);
      } else {
        const userOrders = db.orders.filter(o => o.userId === user.id);
        res.json(userOrders);
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro ao ler encomendas.' });
    }
  });

  app.post('/api/orders', authHandler, async (req, res) => {
    const user = (req as any).user;
    const { items, total, address, phone } = req.body;

    if (!items || !items.length || !total || !address || !phone) {
      return res.status(400).json({ error: 'Itens, valor total, endereço e telemóvel são obrigatórios.' });
    }

    try {
      const db = await readDB();

      // Check stock & deduct stock
      for (const item of items) {
        const prod = db.products.find(p => p.id === item.productId);
        if (!prod) {
          return res.status(400).json({ error: `Produto com id ${item.productId} não existe.` });
        }
        if (prod.stock < item.quantity) {
          return res.status(400).json({ error: `Stock insuficiente para ${prod.name}. Apenas restam ${prod.stock} unidades.` });
        }
      }

      // Deduct stock
      for (const item of items) {
        const prodIndex = db.products.findIndex(p => p.id === item.productId);
        db.products[prodIndex].stock -= item.quantity;
      }

      const nextOrderNumber = db.orders.length > 0 
        ? Math.max(...db.orders.map(o => parseInt(o.id.replace('ord-', '')) || 1000)) + 1 
        : 1001;

      const newOrder: Order = {
        id: `ord-${nextOrderNumber}`,
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        items,
        total: Number(total),
        status: 'Pendente',
        address,
        phone,
        createdAt: new Date().toISOString()
      };

      db.orders.unshift(newOrder); // Newest orders first
      await writeDB(db);

      res.status(201).json(newOrder);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao guardar encomenda.' });
    }
  });

  app.put('/api/orders/:id/status', authHandler, adminOnlyHandler, async (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Estado da encomenda em falta.' });
    }

    try {
      const db = await readDB();
      const index = db.orders.findIndex(o => o.id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Encomenda não encontrada.' });
      }

      db.orders[index].status = status;
      await writeDB(db);

      res.json(db.orders[index]);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar estado da encomenda.' });
    }
  });


  // === STATIC ASSETS & VITE INTEGRATION ===

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FitForce Full-stack listening on port ${PORT}`);
  });
}

startServer();
