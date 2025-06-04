import { auth } from "../firebase-config.js";

// Verifica acesso à página atual
function checkAccess() {
    if (!auth.currentUser) {
        // Se não estiver logado, carrega e mostra o modal
        fetch('/components/modals/modalLogin.html')
            .then(res => res.text())
            .then(html => {
                if (!document.getElementById('modalAcesso')) {
                    document.body.insertAdjacentHTML('beforeend', html);
                }
                document.getElementById('modalAcesso').style.display = 'flex';
            });
    }
}

// Monitor de autenticação
auth.onAuthStateChanged(user => {
    if (!user) {
        checkAccess();
    }
});

// Verifica acesso imediatamente
checkAccess();
