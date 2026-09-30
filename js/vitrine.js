/* =========================================================
   STYLEMATCH — VITRINE / HOME EDITORIAL
   ========================================================= */

// ---------- DADOS ----------
const maisVendidos = [
  { id: 1, nome: 'Jaqueta Oversized Cargo', categoria: 'Streetwear', preco: 289.9, tag: 'Top 1', imagem: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80' },
  { id: 2, nome: 'Calça Parachute Y2K',      categoria: 'Y2K',        preco: 219.9, tag: 'Top 2', imagem: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80' },
  { id: 3, nome: 'Camisa Social Slim',       categoria: 'Clássico',   preco: 179.9, tag: null,    imagem: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80' },
  { id: 4, nome: 'Cropped Dark Alt',         categoria: 'Alt',        preco: 139.9, tag: 'Top 3', imagem: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80' },
  { id: 5, nome: 'Hoodie Graphic Print',     categoria: 'Streetwear', preco: 249.9, tag: null,    imagem: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80' },
  { id: 6, nome: 'Saia Plissada Midi',       categoria: 'Clássico',   preco: 159.9, tag: null,    imagem: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&q=80' }
];

const lancamentos = [
  { id: 7,  nome: 'Top Corset Vinil',        categoria: 'Alt',        preco: 189.9, tag: 'Novo', imagem: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80' },
  { id: 8,  nome: 'Óculos Futurista',        categoria: 'Y2K',        preco: 99.9,  tag: 'Novo', imagem: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80' },
  { id: 9,  nome: 'Blazer Structured',       categoria: 'Clássico',   preco: 349.9, tag: 'Novo', imagem: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80' },
  { id: 10, nome: 'Cargo Pant Utility',      categoria: 'Streetwear', preco: 229.9, tag: 'Novo', imagem: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80' },
  { id: 11, nome: 'Bolsa Mini Bag Y2K',      categoria: 'Y2K',        preco: 149.9, tag: 'Novo', imagem: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80' },
  { id: 12, nome: 'Colete Dark Techwear',    categoria: 'Alt',        preco: 269.9, tag: 'Novo', imagem: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80' }
];

// ---------- ESTADO ----------
let carrinho = JSON.parse(localStorage.getItem('sm_carrinho') || '[]');

// ---------- ELEMENTOS ----------
const cartCount  = document.getElementById('cartCount');
const toast      = document.getElementById('toast');
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose= document.getElementById('mobileClose');
const mobileOverlay = document.getElementById('mobileOverlay');
const newsForm   = document.getElementById('newsForm');
const newsMsg    = document.getElementById('newsMsg');

// ---------- FORMATAR PREÇO ----------
function formatarPreco(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// ---------- CRIAR CARD ----------
function criarCard(p) {
  const card = document.createElement('article');
  card.className = 'p-card';
  card.innerHTML = `
    <div class="p-media">
      <img src="${p.imagem}" alt="${p.nome}" loading="lazy">
      ${p.tag ? `<span class="p-tag">${p.tag}</span>` : ''}
    </div>
    <div class="p-info">
      <span class="p-cat">${p.categoria}</span>
      <h3 class="p-name">${p.nome}</h3>
      <span class="p-price">${formatarPreco(p.preco)}</span>
      <button class="p-add" data-id="${p.id}">Adicionar</button>
    </div>
  `;
  return card;
}

// ---------- RENDERIZAR CARROSSÉIS ----------
function renderizarCarrossel(elId, lista) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.innerHTML = '';
  lista.forEach(p => el.appendChild(criarCard(p)));
}

// ---------- ADICIONAR AO CARRINHO ----------
function adicionarAoCarrinho(id) {
  const produto = [...maisVendidos, ...lancamentos].find(p => p.id === id);
  if (!produto) return;

  const existente = carrinho.find(i => i.id === id);
  if (existente) existente.qtd += 1;
  else carrinho.push({ ...produto, qtd: 1 });

  localStorage.setItem('sm_carrinho', JSON.stringify(carrinho));
  atualizarCarrinho();
  mostrarToast(`${produto.nome} adicionado`);
}

function atualizarCarrinho() {
  const total = carrinho.reduce((acc, i) => acc + i.qtd, 0);
  cartCount.textContent = total;
}

// ---------- DELEGAÇÃO DE CLIQUE (adicionar) ----------
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.p-add');
  if (!btn) return;
  adicionarAoCarrinho(Number(btn.dataset.id));
});

// ---------- CONTROLES DO CARROSSEL ----------
document.querySelectorAll('.carousel-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = `carousel-${btn.dataset.carousel}`;
    const el = document.getElementById(targetId);
    if (!el) return;

    const card = el.querySelector('.p-card');
    const step = card ? card.offsetWidth + 14 : 300;

    el.scrollBy({
      left: step * Number(btn.dataset.dir),
      behavior: 'smooth'
    });
  });
});

// ---------- TOAST ----------
let toastTimeout;
function mostrarToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2200);
}

// ---------- MENU MOBILE ----------
function abrirMenu() {
  mobileMenu.classList.add('open');
  mobileOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function fecharMenu() {
  mobileMenu.classList.remove('open');
  mobileOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

menuToggle.addEventListener('click', abrirMenu);
mobileClose.addEventListener('click', fecharMenu);
mobileOverlay.addEventListener('click', fecharMenu);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') fecharMenu();
});

// ---------- NEWSLETTER ----------
newsForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = newsForm.querySelector('input');
  const email = input.value.trim();

  if (!email || !email.includes('@')) {
    newsMsg.textContent = 'Digite um e-mail válido.';
    return;
  }

  newsMsg.textContent = 'Inscrito com sucesso! ◈';
  input.value = '';
  setTimeout(() => (newsMsg.textContent = ''), 3500);
});

// ---------- INICIALIZAÇÃO ----------
renderizarCarrossel('carousel-vendidos', maisVendidos);
renderizarCarrossel('carousel-lancamentos', lancamentos);
atualizarCarrinho();