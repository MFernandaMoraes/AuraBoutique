/* =========================================================
   AURA BOUTIQUE — ADMIN HOME
   ========================================================= */

const cliente = JSON.parse(localStorage.getItem('cliente') || 'null');

// Protege: só admin entra
if (!cliente || !cliente.is_admin) {
  window.location.href = 'login.html';
}

if (cliente) {
  const primeiroNome = cliente.nome.split(' ')[0].toUpperCase();
  document.getElementById('adminName').textContent = primeiroNome;

  document.getElementById('userName').textContent = cliente.nome;
  document.getElementById('userEmail').textContent = cliente.email;

  const iniciais = cliente.nome
    .split(' ')
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  document.getElementById('userInitials').textContent = iniciais;
}

// Dropdown
const userMenu = document.getElementById('userMenu');
const userAvatar = document.getElementById('userAvatar');

userAvatar.addEventListener('click', (e) => {
  e.stopPropagation();
  userMenu.classList.toggle('open');
});

document.addEventListener('click', () => userMenu.classList.remove('open'));

// Logout
document.getElementById('btnLogout').addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.removeItem('cliente');
  window.location.href = 'login.html';
});

/* =========================================================
   RF02 — GESTÃO DE COLEÇÕES E ESTILOS
   ========================================================= */

const API = 'http://localhost:3000';

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

const fmtData = (valor) => {
  if (!valor) return '—';

  const d = valor instanceof Date ? valor : new Date(valor);

  if (isNaN(d.getTime())) return '—';

  return d.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
};

const statusClass = s => ({
  'Em preparação': 'status-preparacao',
  'Em andamento':  'status-andamento',
  'Concluída':     'status-concluida',
  'Arquivada':     'status-arquivada',
}[s] || 'status-preparacao');

let colecoesCache = [];
let paletaTemp = [];

/* ---------- RENDER COLEÇÕES ---------- */
function renderColecoes(lista) {
  const grid = $('#gridColecoes');
  if (!lista.length) {
    grid.innerHTML = `<div class="empty-state"><i class="fas fa-layer-group"></i>Nenhuma coleção cadastrada.</div>`;
    return;
  }

  grid.innerHTML = lista.map(c => `
    <div class="collection-card" data-id="${c.id_colecao}">
      <span class="collection-season">${c.temporada}</span>
      <span class="collection-name">${c.nome}</span>
      <span class="collection-dates">${fmtData(c.data_inicio)} → ${fmtData(c.data_fim)}</span>
      ${c.descricao ? `<p class="collection-desc">${c.descricao}</p>` : ''}
      <div class="collection-footer">
        <span class="status-badge ${statusClass(c.status)}">${c.status}</span>
        <div class="collection-actions">
          <button class="icon-action btn-arquivar" title="Arquivar">
            <i class="fas fa-box-archive"></i>
          </button>
          <button class="icon-action danger btn-remover" title="Remover">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Handlers
  $$('.collection-card', grid).forEach(card => {
    const id = card.dataset.id;

    card.querySelector('.btn-arquivar').addEventListener('click', async () => {
      const atual = colecoesCache.find(c => c.id_colecao == id);
      const novo = atual?.status === 'Arquivada' ? 'Em preparação' : 'Arquivada';
      await fetch(`${API}/colecoes/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: novo })
      });
      carregarColecoes();
    });

    card.querySelector('.btn-remover').addEventListener('click', async () => {
      if (!confirm('Remover esta coleção? Os estilos vinculados também serão apagados.')) return;
      await fetch(`${API}/colecoes/${id}`, { method: 'DELETE' });
      carregarColecoes();
      carregarEstilos();
    });
  });
}

/* ---------- RENDER ESTILOS ---------- */
function renderEstilos(lista) {
  const grid = $('#gridEstilos');
  if (!lista.length) {
    grid.innerHTML = `<div class="empty-state"><i class="fas fa-palette"></i>Nenhuma diretriz cadastrada.</div>`;
    return;
  }

  grid.innerHTML = lista.map(d => {
    const palavras = (d.palavras_chave || '').split(',').map(p => p.trim()).filter(Boolean);
    const cores = (d.paleta || '').split(',').map(c => c.trim()).filter(Boolean);
    const moodHtml = d.mood_url
      ? `<img src="${d.mood_url}" alt="${d.nome}" onerror="this.parentNode.classList.add('is-empty'); this.remove();">`
      : '';

    return `
      <div class="style-card" data-id="${d.id_diretriz}">
        <div class="style-mood ${d.mood_url ? '' : 'is-empty'}">${moodHtml}</div>
        <div class="style-body">
          <span class="style-collection-ref">${d.colecao_nome}</span>
          <span class="style-name">${d.nome}</span>
          ${palavras.length ? `<div class="style-tags">${palavras.map(p => `<span class="tag">${p}</span>`).join('')}</div>` : ''}
          ${cores.length ? `<div class="style-swatches">${cores.map(c => `<span class="swatch" style="background:${c}"></span>`).join('')}</div>` : ''}
        </div>
        <div class="style-footer">
          <span class="inherit-flag">${d.herda ? '<i class="fas fa-link"></i> Herdada' : 'Individual'}</span>
          <button class="icon-action danger btn-remover-estilo" title="Remover">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  $$('.style-card', grid).forEach(card => {
    card.querySelector('.btn-remover-estilo').addEventListener('click', async () => {
      if (!confirm('Remover este estilo?')) return;
      await fetch(`${API}/estilos-diretriz/${card.dataset.id}`, { method: 'DELETE' });
      carregarEstilos();
    });
  });
}

/* ---------- CARREGAR ---------- */
async function carregarColecoes() {
  try {
    const r = await fetch(`${API}/colecoes`);
    const lista = await r.json();
    colecoesCache = lista;
    renderColecoes(lista);
    $('#countColecoes').textContent = `${lista.length} cadastrada(s)`;

    atualizarContadores();

    // Atualiza selects
    const selEstilo = $('#selColecaoEstilo');
    const selHeranca = document.querySelector('select[name="herdou_de"]');

    const opts = lista
      .filter(c => c.status !== 'Arquivada')
      .map(c => `<option value="${c.nome}">${c.nome} (${c.temporada})</option>`)
      .join('');

    if (selEstilo) selEstilo.innerHTML = `<option value="">Selecione…</option>` +
      lista.map(c => `<option value="${c.id_colecao}">${c.nome} (${c.temporada})</option>`).join('');

    if (selHeranca) selHeranca.innerHTML = `<option value="">Nenhuma</option>` + opts;

  } catch (e) {
    console.error(e);
  }
}

async function carregarEstilos() {
  try {
    const r = await fetch(`${API}/estilos-diretriz`);
    const lista = await r.json();
    renderEstilos(lista);
    $('#countEstilos').textContent = `${lista.length} cadastrada(s)`;

    atualizarContadores();
    
  } catch (e) {
    console.error(e);
  }
}

/* =========================================================
   CONTADORES DO HERO (dinâmicos)
   ========================================================= */
function atualizarContadores() {
  // Coleções ativas = tudo que NÃO está arquivado
  const ativas = colecoesCache.filter(c => c.status !== 'Arquivada').length;
  const elAtivas = document.getElementById('statColecoesAtivas');
  if (elAtivas) elAtivas.textContent = ativas;

  // Estilos = total de diretrizes
  const elEstilos = document.getElementById('statEstilos');
  if (elEstilos) {
    const total = document.querySelectorAll('#gridEstilos .style-card').length;
    elEstilos.textContent = total;
  }

  // Produtos / Pedidos: placeholders até existirem endpoints
  const elProd = document.getElementById('statProdutos');
  if (elProd) elProd.textContent = '0';

  const elPed = document.getElementById('statPedidos');
  if (elPed) elPed.textContent = '0';
}

/* ---------- FORM COLEÇÃO ---------- */
const formColecao = $('#formColecao');
if (formColecao) {
  formColecao.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(formColecao);
    const payload = Object.fromEntries(fd.entries());

    try {
      const r = await fetch(`${API}/colecoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!r.ok) {
        const j = await r.json();
        alert(j.erro || 'Erro ao criar coleção.');
        return;
      }
      formColecao.reset();
      carregarColecoes();
    } catch (err) {
      console.error(err);
      alert('Não foi possível conectar ao servidor.');
    }
  });
}

/* ---------- FORM ESTILO ---------- */
const formEstilo = $('#formEstilo');
if (formEstilo) {
  formEstilo.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(formEstilo);
    const payload = Object.fromEntries(fd.entries());
    payload.herda = fd.get('herda') === 'on';
    payload.paleta = paletaTemp;

    if (!payload.id_colecao) {
      alert('Selecione uma coleção.');
      return;
    }

    try {
      const r = await fetch(`${API}/estilos-diretriz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!r.ok) {
        const j = await r.json();
        alert(j.erro || 'Erro ao criar estilo.');
        return;
      }
      formEstilo.reset();
      paletaTemp = [];
      renderSwatches();
      carregarEstilos();
    } catch (err) {
      console.error(err);
      alert('Não foi possível conectar ao servidor.');
    }
  });
}

/* ---------- COLOR PICKER ---------- */
function renderSwatches() {
  const box = $('#colorSwatches');
  if (!box) return;
  box.innerHTML = paletaTemp.map((c, i) =>
    `<span class="swatch" style="background:${c}" data-i="${i}" title="${c}"></span>`
  ).join('');

  $$('.swatch', box).forEach(s => {
    s.addEventListener('click', () => {
      paletaTemp.splice(+s.dataset.i, 1);
      renderSwatches();
    });
  });
}

const btnAddCor = $('#btnAddCor');
if (btnAddCor) {
  btnAddCor.addEventListener('click', () => {
    const cor = $('#corPicker').value;
    if (!paletaTemp.includes(cor)) {
      paletaTemp.push(cor);
      renderSwatches();
    }
  });
}

/* ---------- INIT ---------- */
carregarColecoes();
carregarEstilos();