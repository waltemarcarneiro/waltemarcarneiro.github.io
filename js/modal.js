// ...existing code...

function openSantander() {
    fetch('./components/modals/modalSantander.html')
        .then(response => response.text())
        .then(html => {
            document.body.insertAdjacentHTML('beforeend', html);
        });
}

// Tornando as funções disponíveis globalmente
window.openSantander = openSantander;

// Funções do modalSantander
window.copiarCodigo = function(codigo) {
    const elemento = event.currentTarget;
    const mensagem = elemento.dataset.message;
    navigator.clipboard.writeText(codigo).then(() => {
        mostrarMensagem(mensagem);
    });
}

window.copiarChave = function(chave) {
    const elemento = event.currentTarget;
    const mensagem = elemento.dataset.message;
    navigator.clipboard.writeText(chave).then(() => {
        mostrarMensagem(mensagem);
    });
}

window.mostrarMensagem = function(texto) {
    const mensagem = document.getElementById('mensagem');
    mensagem.innerHTML = texto;
    mensagem.style.display = 'block';
    
    document.addEventListener('click', function() {
        mensagem.style.display = 'none';
    }, { once: true });
}