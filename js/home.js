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
      tag: 'NOVO',
      imagem: 'https://i.pinimg.com/736x/e1/b2/be/e1b2be31580966c5eb32a93da087519c.jpg'
    },
    {
      nome: 'Calça Wide Leg',
      categoria: 'Alfaiataria',
      preco: 259.90,
      tag: 'DROP 02',
      imagem: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&auto=format&fit=crop&q=80'
    },
    {
      nome: 'Camisa Seda',
      categoria: 'Vestidos',
      preco: 299.00,
      tag: 'EXCLUSIVO',
      imagem: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80'
    },
    {
      nome: 'Trench Coat',
      categoria: 'Casacos',
      preco: 549.00,
      tag: 'NOVO',
      imagem: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&auto=format&fit=crop&q=80'
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

  function handleNav(target) {
    const mensagens = {
      vitrine: 'Abrindo vitrine completa...',
      produtos: 'Abrindo catálogo de produtos...',
      colecoes: 'Abrindo coleções sazonais...',
      estilos: 'Abrindo estilos conceituais...'
    };
    alert(mensagens[target] || 'Navegando...');
  }

  function initNav() {
    $$('[data-nav]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        handleNav(el.dataset.nav);
      });
    });
  }

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