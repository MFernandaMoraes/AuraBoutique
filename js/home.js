/**
 * Aura Boutique — Home Y2K (Base)
 * Interações essenciais da base: menu mobile, produtos dinâmicos, newsletter.
 */
(function () {
  'use strict';

  /* =========================================================
     DADOS BASE (mock para render dos produtos)
     ========================================================= */

  const produtos = [
    {
      nome: 'Camiseta Streetwear Angel - Branca',
      categoria: 'Streetwear',
      preco: 159.90,
      tag: 'STREETWEAR',
      imagem: 'https://i.pinimg.com/736x/e1/b2/be/e1b2be31580966c5eb32a93da087519c.jpg'
    },
    {
      nome: 'Terno Sob Medida ACE',
      categoria: 'Clássico',
      preco: 289.90,
      tag: 'CLÁSSICO',
      imagem: 'https://i.pinimg.com/736x/84/ef/5b/84ef5b8a4e3bd257a2cbdeab42c7a1a2.jpg'
    },
    {
      nome: 'LYSMO Jaqueta Preta',
      categoria: 'Vestidos',
      preco: 259.00,
      tag: 'Y2K',
      imagem: 'https://i.pinimg.com/736x/3f/d5/b5/3fd5b51b99536039003df7f2aac7ec62.jpg'
    },
    {
      nome: '10YRS Tour Belt Red',
      categoria: 'Acessórios',
      preco: 89.00,
      tag: 'ACESSÓRIOS',
      imagem: 'https://i.pinimg.com/736x/b8/5c/16/b85c166da86402404fe220b154f15a71.jpg'
    }
  ];

  /* =========================================================
     HELPERS
     ========================================================= */

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  function formatarPreco(valor) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  /* =========================================================
     RENDER — PRODUTOS
     ========================================================= */

  function renderProdutos() {
    const grid = $('#productGrid');
    if (!grid) return;

    grid.innerHTML = '';

    produtos.forEach((p) => {
      const card = document.createElement('article');
      card.className = 'product-card';

      card.innerHTML = `
        <div class="product-media">
          <span class="product-tag">${p.tag}</span>
          <img src="${p.imagem}" alt="${p.nome}"
               onerror="this.style.display='none'; this.parentNode.style.background='linear-gradient(135deg,#1e1e1e,#2b2b2b)';">
        </div>
        <div class="product-info">
          <span class="product-cat">${p.categoria}</span>
          <h3 class="product-name">${p.nome}</h3>
          <span class="product-price">${formatarPreco(p.preco)}</span>
        </div>
      `;

      card.addEventListener('click', () => {
        alert(`🛍️ ${p.nome}\n\nCategoria: ${p.categoria}\nPreço: ${formatarPreco(p.preco)}`);
      });

      grid.appendChild(card);
    });
  }

  /* =========================================================
     MENU MOBILE
     ========================================================= */

  function initMobileMenu() {
    const menu = $('#mobileMenu');
    const overlay = $('#mobileOverlay');
    const toggle = $('#menuToggle');
    const close = $('#mobileClose');

    if (!menu || !overlay || !toggle) return;

    const open = () => {
      menu.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      menu.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    };

    toggle.addEventListener('click', open);
    if (close) close.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);

    $$('.mobile-nav a').forEach((link) => {
      link.addEventListener('click', (e) => {
        if (link.dataset.nav) {
          e.preventDefault();
          handleNav(link.dataset.nav);
        }
        closeMenu();
      });
    });
  }

  /* =========================================================
     NAVEGAÇÃO (mock)
     ========================================================= */

  /* =========================================================
     AÇÕES DA NAVBAR
     ========================================================= */

  function initNavActions() {
    const btnSearch = $('#btnSearch');
    const btnLogin = $('#btnLogin');
    const btnLoginText = $('#btnLoginText');
    const btnCart = $('#btnCart');

    if (btnSearch) {
      btnSearch.addEventListener('click', () => {
        alert('🔍 Buscar produtos...');
      });
    }

    if (btnCart) {
      btnCart.addEventListener('click', () => {
        alert('🛍️ Sua sacola está vazia.');
      });
    }

    // Categorias
    $$('.cat-card').forEach((cat) => {
      cat.addEventListener('click', (e) => {
        e.preventDefault();
        alert(`📂 Categoria: ${cat.dataset.cat || 'Categoria'}`);
      });
    });
  }

  /* =========================================================
     NEWSLETTER
     ========================================================= */

  function initNewsletter() {
    const form = $('#newsForm');
    const msg = $('#newsMsg');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = $('#newsEmail').value.trim();

      if (!email || !email.includes('@')) {
        if (msg) msg.textContent = 'E-mail inválido.';
        return;
      }

      if (msg) msg.textContent = 'Inscrição confirmada. Bem-vindo à lista.';
      form.reset();

      setTimeout(() => {
        if (msg) msg.textContent = '';
      }, 4000);
    });
  }

  /* =========================================================
     FALLBACK DA IMAGEM HERO
     ========================================================= */

  function initHeroFallback() {
    const img = $('#heroImg');
    const fallback = $('#heroFallback');
    if (!img || !fallback) return;

    img.addEventListener('error', () => {
      img.style.display = 'none';
      fallback.style.display = 'flex';
    });
  }

  /* =========================================================
     FOOTER (links extras)
     ========================================================= */

  function initFooter() {
    const login = $('#footerLogin');
    const register = $('#footerRegister');
    const orders = $('#footerOrders');
    const help = $('#footerHelp');

    if (login) login.addEventListener('click', (e) => {
      e.preventDefault();
      alert('🔐 Login');
    });
    if (register) register.addEventListener('click', (e) => {
      e.preventDefault();
      alert('📝 Criar conta');
    });
    if (orders) orders.addEventListener('click', (e) => {
      e.preventDefault();
      alert('📦 Meus pedidos (requer login)');
    });
    if (help) help.addEventListener('click', (e) => {
      e.preventDefault();
      alert('💬 Central de ajuda');
    });

    $$('[data-social]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        alert(`🌐 Redes sociais · ${link.dataset.social}`);
      });
    });
  }

  /* =========================================================
     INIT
     ========================================================= */

  function init() {
    console.log('◈ Aura Boutique — Home Y2K carregada.');
    renderProdutos();
    initMobileMenu();
    initNav();
    initNavActions();
    initNewsletter();
    initHeroFallback();
    initFooter();
  }

  document.addEventListener('DOMContentLoaded', init);
})();

/* =========================================================
   NAVBAR: alterna estado logado / deslogado
   ========================================================= */
(function initNavbarAuth() {
  const cliente = JSON.parse(localStorage.getItem('cliente') || 'null');

  const btnLoginText = document.getElementById('btnLoginText');
  const userMenu     = document.getElementById('userMenu');
  const userInitials = document.getElementById('userInitials');
  const userName     = document.getElementById('userName');
  const userEmail    = document.getElementById('userEmail');
  const userAvatar   = document.getElementById('userAvatar');
  const userDropdown = document.getElementById('userDropdown');
  const btnLogout    = document.getElementById('btnLogout');

  // ---------- DESLOGADO ----------
  if (!cliente) {
    if (btnLoginText) btnLoginText.hidden = false;
    if (userMenu)     userMenu.hidden = true;
    return;
  }

  // ---------- LOGADO ----------
  // Esconde botão LOGIN, mostra avatar
  if (btnLoginText) btnLoginText.hidden = true;
  if (userMenu)     userMenu.hidden = false;

  // Preenche iniciais (ex: "Ana Maria" → "AM")
  const iniciais = cliente.nome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(p => p[0]?.toUpperCase() || '')
    .join('');
  if (userInitials) userInitials.textContent = iniciais || '?';

  if (userName)  userName.textContent  = cliente.nome;
  if (userEmail) userEmail.textContent = cliente.email;

  // ---------- ABRE / FECHA DROPDOWN ----------
  userAvatar?.addEventListener('click', (e) => {
    e.stopPropagation();
    const aberto = userMenu.classList.toggle('open');
    userAvatar.setAttribute('aria-expanded', aberto);
  });

  // Fecha ao clicar fora
  document.addEventListener('click', (e) => {
    if (!userMenu.contains(e.target)) {
      userMenu.classList.remove('open');
      userAvatar.setAttribute('aria-expanded', 'false');
    }
  });

  // Fecha com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      userMenu.classList.remove('open');
      userAvatar.setAttribute('aria-expanded', 'false');
    }
  });

  // ---------- LOGOUT ----------
  btnLogout?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('cliente');
    window.location.href = 'login.html';
  });
})();