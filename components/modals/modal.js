function showModalLogin() {
    fetch('/components/modals/modalLogin.html')
        .then(response => response.text())
        .then(html => {
            document.body.insertAdjacentHTML('beforeend', html);
        });
}

function showModalSantander() {
    fetch('/components/modals/modalSantander.html')
        .then(response => response.text())
        .then(html => {
            document.body.insertAdjacentHTML('beforeend', html);
        });
}

// Tornando as funções disponíveis globalmente
window.showModalLogin = showModalLogin;
window.showModalSantander = showModalSantander;
