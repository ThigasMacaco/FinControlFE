// ============================================================
// FinControlFE — App (Front-end apenas UI/JS)
// Preparado para plugar o back-end depois.
// ============================================================

window.FinConfig = {
  API_BASE: 'http://localhost:3000/api' // ajuste se necessário
};

const STORAGE = {
  token: 'fincontrol_token',
  usuario: 'fincontrol_usuario'
};

function getToken() {
  return localStorage.getItem(STORAGE.token);
}

function setToken(token) {
  localStorage.setItem(STORAGE.token, token);
}

function getUsuario() {
  const u = localStorage.getItem(STORAGE.usuario);
  return u ? JSON.parse(u) : null;
}

function setUsuario(usuario) {
  localStorage.setItem(STORAGE.usuario, JSON.stringify(usuario));
}

function logout() {
  localStorage.removeItem(STORAGE.token);
  localStorage.removeItem(STORAGE.usuario);
  window.location.href = 'index.html';
}

function toast(mensagem, tipo = 'sucesso') {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = mensagem;
  el.className = `toast show toast-${tipo}`;
  setTimeout(() => el.classList.remove('show'), 3500);
}

function formatMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor || 0);
}

async function api(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) headers['Authorization'] = `Bearer ${token}`;

  const resp = await fetch(`${FinConfig.API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (resp.status === 401) {
    logout();
    return;
  }

  let data = null;
  try {
    data = await resp.json();
  } catch (_) {
    // sem body
  }

  if (!resp.ok) {
    const msg = (data && data.erro) ? data.erro : `Erro HTTP ${resp.status}`;
    throw new Error(msg);
  }

  return data;
}

// ============================================================
// Auth UI (login/cadastro) — já prepara para backend
// ============================================================

window.AuthUI = {
  mostrarTab(tab) {
    const loginForm = document.getElementById('form-login');
    const cadForm = document.getElementById('form-cadastro');

    if (tab === 'login') {
      loginForm.style.display = 'block';
      cadForm.style.display = 'none';
      AuthUI.setTabAtivo('login');
    } else {
      loginForm.style.display = 'none';
      cadForm.style.display = 'block';
      AuthUI.setTabAtivo('cadastro');
    }
  },

  setTabAtivo(tabName) {
    document.querySelectorAll('.login-tab').forEach(btn => {
      const isActive = btn.getAttribute('data-tab') === tabName;
      btn.classList.toggle('ativo', isActive);
    });
  },

  async fazerLogin(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-login');

    btn.disabled = true;
    const old = btn.innerHTML;
    btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Entrando...';

    try {
      const data = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: document.getElementById('login-email').value,
          senha: document.getElementById('login-senha').value
        })
      });

      if (!data || !data.token) throw new Error('Resposta do servidor inválida.');

      setToken(data.token);
      if (data.usuario) setUsuario(data.usuario);

      // Página interna ainda não criada nessa pasta.
      // Ao plugar back-end, troque para a rota real.
      toast('Login realizado!', 'sucesso');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 300);
      
      // sanity check (ajuda a diagnosticar redirect indevido)
      // if (!getToken()) console.warn('token não persistiu');

    } catch (err) {
      toast(err.message || 'Erro ao entrar', 'erro');
      btn.disabled = false;
      btn.innerHTML = old;
    }
  },

  async fazerCadastro(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-cad');

    btn.disabled = true;
    const old = btn.innerHTML;
    btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Criando conta...';

    try {
      const data = await api('/auth/cadastro', {
        method: 'POST',
        body: JSON.stringify({
          nome: document.getElementById('cad-nome').value,
          email: document.getElementById('cad-email').value,
          senha: document.getElementById('cad-senha').value,
          tipo_conta: document.getElementById('cad-tipo').value
        })
      });

      if (!data || !data.token) throw new Error('Resposta do servidor inválida.');

      setToken(data.token);
      if (data.usuario) setUsuario(data.usuario);

      toast('Conta criada!', 'sucesso');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 600);
    } catch (err) {
      toast(err.message || 'Erro ao cadastrar', 'erro');
      btn.disabled = false;
      btn.innerHTML = old;
    }
  },

  abrirRecuperarSenha(e) {
    if (e && e.preventDefault) e.preventDefault();
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.add('show');
    const input = document.getElementById('rs-email');
    if (input) input.value = '';
  },

  fecharModal() {
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.remove('show');
  },

  async enviarRecuperacao() {
    const email = (document.getElementById('rs-email')?.value || '').trim();
    if (!email) {
      toast('Informe seu e-mail.', 'erro');
      return;
    }

    try {
      // Esperado pelo back: POST /api/auth/recuperar-senha { email }
      const data = await api('/auth/recuperar-senha', {
        method: 'POST',
        body: JSON.stringify({ email })
      });

      toast(data?.mensagem || 'Se o e-mail existir, enviaremos instruções.', 'sucesso');
      AuthUI.fecharModal();
    } catch (err) {
      toast(err.message || 'Erro ao enviar recuperação.', 'erro');
    }
  }
};

// Redirecionar se já estiver logado (quando a página interna existir)
(function init() {
  const token = getToken();
  if (token) {
    // Ainda não há dashboard.html nesta pasta.
    // Mantém o usuário no login se o arquivo não existir.
    // (Ao criar as páginas internas, descomente o redirect)
    // window.location.href = 'dashboard.html';
  }
})();

