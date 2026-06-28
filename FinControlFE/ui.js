// ============================================================
// FinControlFE — UI Layout (Sidebar + Topbar + helpers)
// ============================================================

function exigirLogin() {
  if (!getToken()) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  if (!sb) return;
  sb.classList.toggle('aberta');
}

function setActiveNav(paginaAtual) {
  document.querySelectorAll('[data-page]').forEach(a => {
    const p = a.getAttribute('data-page');
    a.classList.toggle('ativo', p === paginaAtual);
  });
}

function iniciarLayout(paginaAtual) {
  const usuario = getUsuario();
  if (!usuario) return;

  // Sidebar
  const isFisica = usuario.tipo_conta !== 'empresa';
  const navFisica = `
    <span class="nav-label">Pessoal</span>
    <a href="receitas.html" data-page="receitas"><i class="fa fa-arrow-up"></i> Receitas</a>
    <a href="despesas.html" data-page="despesas"><i class="fa fa-arrow-down"></i> Despesas</a>
    <a href="cartoes.html" data-page="cartoes"><i class="fa fa-credit-card"></i> Cartões</a>
    <a href="metas.html" data-page="metas"><i class="fa fa-bullseye"></i> Metas</a>
  `;
  const navEmpresa = `
    <span class="nav-label">Empresa</span>
    <a href="receitas.html" data-page="receitas"><i class="fa fa-arrow-up"></i> Receitas</a>
    <a href="despesas.html" data-page="despesas"><i class="fa fa-arrow-down"></i> Despesas</a>
    <a href="cartoes.html" data-page="cartoes"><i class="fa fa-credit-card"></i> Cartões</a>
    <a href="metas.html" data-page="metas"><i class="fa fa-bullseye"></i> Metas</a>
  `;

  const sidebar = `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-logo">
        <img src="assets/logo.png" alt="FinControl" />
        <div>
          <span>FinControl</span>
          <small>${isFisica ? '👤 Pessoa Física' : '🏢 Empresa'}</small>
        </div>
      </div>

      <nav>
        <span class="nav-label">Geral</span>
        <a href="dashboard.html" data-page="dashboard"><i class="fa fa-home"></i> Dashboard</a>
        <a href="fluxo-caixa.html" data-page="fluxo"><i class="fa fa-chart-line"></i> Fluxo de Caixa</a>
        <a href="investimentos.html" data-page="investimentos"><i class="fa fa-chart-bar"></i> Investimentos</a>
        ${isFisica ? navFisica : navEmpresa}

        <span class="nav-label">Relatórios</span>
        <a href="relatorios.html" data-page="relatorios"><i class="fa fa-file-alt"></i> Relatórios</a>
        <a href="categorias.html" data-page="categorias"><i class="fa fa-tags"></i> Categorias</a>
      </nav>

      <!-- Bloco final: perfil da pessoa/empresa -->
      <div class="sidebar-profile">
        <div class="sidebar-profile-main" onclick="window.location.href='perfil.html'" role="button" tabindex="0">
          <div class="sidebar-profile-avatar" aria-hidden="true">
            ${usuario.foto ? `<img src="${FinConfig.API_BASE.replace('/api','')}${usuario.foto}" alt="foto" />` : (usuario.nome?.charAt(0)?.toUpperCase() || 'U')}
          </div>
          <div class="sidebar-profile-info">
            <div class="sidebar-profile-name">${(usuario.nome || '').split(' ')[0] || ''}</div>
            <div class="sidebar-profile-type">${isFisica ? 'Pessoa Física' : 'Empresa'}</div>
          </div>
        </div>

        <div class="sidebar-profile-actions">
          <a href="perfil.html" data-page="perfil" class="sidebar-profile-link"><i class="fa fa-user-circle"></i> Meu Perfil</a>
          <a href="quem-somos.html" data-page="quem-somos" class="sidebar-profile-link"><i class="fa fa-info-circle"></i> Quem Somos</a>
          <a href="#" onclick="logout();return false;" class="sidebar-profile-link"><i class="fa fa-sign-out-alt"></i> Sair</a>
        </div>
      </div>

      <div class="sidebar-footer">FinControl &copy; 2026</div>
    </aside>
  `;

  // Topbar
  const avatarHtml = usuario.foto
    ? `<img src="${FinConfig.API_BASE.replace('/api','')}${usuario.foto}" alt="foto">`
    : (usuario.nome?.charAt(0)?.toUpperCase() || 'U');

  const topbar = `
    <div class="topbar">
      <div class="topbar-left">
        <button class="btn-menu" type="button" onclick="toggleSidebar()"><i class="fa fa-bars"></i></button>
        <h1 id="page-title">Dashboard</h1>
      </div>
      <div class="topbar-right">
        <div class="search-wrap">
          <i class="fa fa-search"></i>
          <input type="text" placeholder="Pesquisar..." id="busca-global" autocomplete="off" />
          <div class="search-results" id="search-results"></div>
        </div>
        <button class="notif-btn" type="button" title="Notificações" onclick="toast('Notificações (placeholder)','aviso')">
          <i class="fa fa-bell"></i>
          <span class="notif-badge" id="notif-badge" style="display:none">0</span>
        </button>
        <div class="avatar-wrap" onclick="window.location.href='perfil.html'">
          <div class="avatar" id="avatar-user">
            ${typeof avatarHtml === 'string' && avatarHtml.startsWith('<') ? avatarHtml : `<span>${avatarHtml}</span>`}
          </div>
          <span class="avatar-nome">${(usuario.nome || '').split(' ')[0] || ''}</span>
        </div>
      </div>
    </div>
  `;

  document.getElementById('sidebar-slot').innerHTML = sidebar;
  document.getElementById('topbar-slot').innerHTML = topbar;

  // Page title mapping
  const titles = {
    dashboard: 'Dashboard',
    receitas: 'Receitas',
    despesas: 'Despesas',
    cartoes: 'Cartões',
    metas: 'Metas',
    fluxo: 'Fluxo de Caixa',
    investimentos: 'Investimentos',
    relatorios: 'Relatórios',
    categorias: 'Categorias',
    perfil: 'Meu Perfil',
    'quem-somos': 'Quem Somos'
  };
  const pageTitle = document.getElementById('page-title');
  if (pageTitle && titles[paginaAtual]) pageTitle.textContent = titles[paginaAtual];

  setActiveNav(paginaAtual);

  // Pesquisa global (placeholder)
  const buscaInput = document.getElementById('busca-global');
  const buscaRes = document.getElementById('search-results');
  let timeout;
  if (buscaInput && buscaRes) {
    buscaInput.addEventListener('input', () => {
      clearTimeout(timeout);
      const q = buscaInput.value.trim();
      if (q.length < 2) {
        buscaRes.classList.remove('show');
        return;
      }
      timeout = setTimeout(async () => {
        try {
          // Endpoint esperado (back): GET /api/pesquisa?q=...
          const data = await api(`/pesquisa?q=${encodeURIComponent(q)}`);
          if (!data?.resultados?.length) {
            buscaRes.innerHTML = '<div class="search-item">Nenhum resultado</div>';
            buscaRes.classList.add('show');
            return;
          }
          buscaRes.innerHTML = data.resultados.map(r => {
            const icon = r.tipo === 'receita' ? 'arrow-up' : r.tipo === 'despesa' ? 'arrow-down' : 'chart-bar';
            const color = r.tipo === 'receita' ? 'var(--verde)' : r.tipo === 'despesa' ? 'var(--vermelho)' : 'var(--azul)';
            return `
              <div class="search-item">
                <span><i class="fa fa-${icon}" style="color:${color}"></i> ${r.descricao}</span>
                <span>${formatMoeda(r.valor)}</span>
              </div>
            `;
          }).join('');
          buscaRes.classList.add('show');
        } catch (_) {
          // placeholder silencioso
        }
      }, 350);
    });

    document.addEventListener('click', e => {
      if (!e.target.closest('.search-wrap')) buscaRes.classList.remove('show');
    });
  }
}

