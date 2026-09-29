// Máscara de telefone
document.getElementById('telefone').addEventListener('input', function(e) {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 10) v = v.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    else if (v.length > 6) v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    else if (v.length > 0) v = v.replace(/^(\d*)/, '($1');
    e.target.value = v;
});

// Mostrar/ocultar senha
document.querySelectorAll('.olho').forEach(btn => {
    btn.addEventListener('click', () => {
        const input = document.getElementById(btn.dataset.target);
        const tipo = input.type === 'password' ? 'text' : 'password';
        input.type = tipo;
        btn.classList.toggle('ativo', tipo === 'text');
    });
});

// Submit
document.getElementById('cadastroForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const senha = document.getElementById('senha').value;
    const confirmar = document.getElementById('confirmarSenha').value;
    const erro = document.getElementById('senhaErro');

    if (senha !== confirmar) {
        erro.textContent = 'As senhas não coincidem.';
        return;
    }
    erro.textContent = '';

    const estilos = document.querySelectorAll('input[name="estilo"]:checked');
    if (!estilos.length) return alert('Escolha pelo menos um estilo!');

    console.log(Object.fromEntries(new FormData(this)));
    alert('Cadastro realizado!');
});