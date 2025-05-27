// Alternar abas Login / Registro
window.alternarAba = (aba) => {
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));

  document.querySelector(`[data-tab="${aba}"]`).classList.add("active");
  document.getElementById(`${aba}-tab`).classList.add("active");
};

// Abrir modal
window.abrirModalAcesso = () => {
  document.getElementById("modalAcesso").style.display = "flex";
};

// Fechar modal
window.fecharModalAcesso = () => {
  document.getElementById("modalAcesso").style.display = "none";
};

// fetch('/components/modals/modalLogin.html')
//  .then(res => res.text())
// .then(html => {
//    document.body.insertAdjacentHTML('beforeend', html);

//   const trigger = document.querySelector('#user[data-auth-lock]');
//   if (trigger) {
//      trigger.addEventListener('click', () => {
//        abrirModalAcesso();
//      });
//    }
//  });

// modal ao clicar na div protegida
window.addEventListener("DOMContentLoaded", () => {
  const trigger = document.getElementById('user');
  trigger?.addEventListener('click', () => {
    if (trigger.hasAttribute('data-auth-lock')) {
      abrirModalAcesso();
    }
  });
});
  