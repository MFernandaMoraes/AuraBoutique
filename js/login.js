/**
 * StyleMatch · Login
 * Validação + mostrar/ocultar senha + lembrar-me
 */
(function () {
  'use strict';

  /* =========================================================
     HELPERS
     ========================================================= */

  const $ = (sel, ctx = document) => ctx.querySelector(sel);

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* =========================================================
     MOSTRAR / OCULTAR SENHA
     ========================================================= */

  function initToggleSenha() {
    document.querySelectorAll('.olho').forEach((btn) => {
      btn.addEventListener('click', () => {
        const input = document.getElementById(btn.dataset.target);
        if (!input) return;

        const tipo = input.type === 'password' ? 'text' : 'password';
        input.type = tipo;
        btn.classList.toggle('ativo', tipo === 'text');
      });
    });
  }

  /* =========================================================
     "LEMBRAR DE MIM" — persiste e-mail no localStorage
     ========================================================= */

  const STORAGE_KEY = 'stylematch_login_email';

  function initLembrar() {
    const emailInput = $('#email');
    const lembrarInput = $('#lembrar');
    if (!emailInput || !lembrarInput) return;

    // Pré-preenche se já houver salvo
    const salvo = localStorage.getItem(STORAGE_KEY);
    if (salvo) {
      emailInput.value = salvo;
      lembrarInput.checked = true;
    }
  }

  function salvarLembrar(email, ativo) {
    if (ativo) {
      localStorage.setItem(STORAGE_KEY, email);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  /* =========================================================
     VALIDAÇÃO
     ========================================================= */

  function validarEmail(email) {
    return EMAIL_REGEX.test(email.trim());
  }

  function mostrarErro(msg) {
    const erroEl = $('#loginErro');
    if (erroEl) erroEl.textContent = msg;
  }

  function limparErro() {
    const erroEl = $('#loginErro');
    if (erroEl) erroEl.textContent = '';
  }

  /* =========================================================
     SUBMIT
     ========================================================= */

  function initSubmit() {
    const form = $('#loginForm');
    if (!form) return;

    const btnSubmit = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      limparErro();

      const email = $('#email').value.trim();
      const senha = $('#senha').value;
      const lembrar = $('#lembrar').checked;

      // E-mail vazio
      if (!email) {
        mostrarErro('Informe seu e-mail.');
        $('#email').focus();
        return;
      }

      // E-mail inválido
      if (!validarEmail(email)) {
        mostrarErro('E-mail inválido.');
        $('#email').focus();
        return;
      }

      // Senha vazia / curta
      if (!senha) {
        mostrarErro('Informe sua senha.');
        $('#senha').focus();
        return;
      }

      if (senha.length < 6) {
        mostrarErro('Senha deve ter no mínimo 6 caracteres.');
        $('#senha').focus();
        return;
      }

      // Salva preferência
      salvarLembrar(email, lembrar);

      // Feedback de carregamento
      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'ENTRANDO...';
      }

      // Simulação de autenticação (substituir por fetch real)
      setTimeout(() => {
        console.log('Login:', { email, lembrar });

        if (btnSubmit) {
          btnSubmit.disabled = false;
          btnSubmit.textContent = 'ENTRAR';
        }

        alert('Login realizado com sucesso!');
        // window.location.href = 'home.html';
      }, 900);
    });
  }

  /* =========================================================
     "ESQUECI A SENHA"
     ========================================================= */

  function initEsqueci() {
    const link = $('#esqueci');
    if (!link) return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      const email = $('#email').value.trim();

      if (email && validarEmail(email)) {
        alert(`Enviamos um link de recuperação para:\n${email}`);
      } else {
        alert('Digite seu e-mail no campo acima para recuperar a senha.');
        $('#email').focus();
      }
    });
  }

  /* =========================================================
     LIMPAR ERRO AO DIGITAR
     ========================================================= */

  function initLimparErro() {
    ['email', 'senha'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', limparErro);
      }
    });
  }

  /* =========================================================
     INIT
     ========================================================= */

  function init() {
    console.log('🔐 StyleMatch — Login carregado.');
    initToggleSenha();
    initLembrar();
    initSubmit();
    initEsqueci();
    initLimparErro();
  }

  document.addEventListener('DOMContentLoaded', init);
})();