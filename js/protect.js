// protect.js
import { auth } from "../firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Função para proteger páginas
function protegerPagina() {
  onAuthStateChanged(auth, user => {
    const verificado = user?.emailVerified || user?.providerData?.[0]?.providerId === "google.com";

    if (!user || !verificado) {
      // Salva a URL atual para redirecionar após login
      sessionStorage.setItem('destino_protegido', window.location.pathname + window.location.search);

      // Carrega o modal diretamente, se ainda não estiver carregado
      fetch('/components/modals/modalLogin.html')
        .then(res => res.text())
        .then(html => {
          if (!document.getElementById("modalAcesso")) {
            document.body.insertAdjacentHTML("beforeend", html);
            setTimeout(() => window.abrirModalAcesso?.(), 300);
          } else {
            window.abrirModalAcesso?.();
          }
        });
    }
  });
}

protegerPagina();
