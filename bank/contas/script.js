document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal");
  const qrContainer = document.getElementById("qrcode");
  const toast = document.getElementById("toast");
  let qrCode;

  // ===== Toast de Pix =====
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
  }

  // ===== Fechar modal =====
  function fecharModal() {
    modal.style.display = "none";
  }

  // ===== Clicar fora do modal fecha =====
  modal.addEventListener("click", (e) => {
    if (e.target === modal) fecharModal();
  });

  // ===== Botão de fechar do modal =====
  document.querySelector(".fechar-modal").addEventListener("click", fecharModal);

  // ===== Botão de copiar Pix =====
  document.querySelectorAll(".copiar-pix").forEach(btn => {
    btn.addEventListener("click", e => {
      const pixKey = e.target.closest(".card").getAttribute("data-pix");
      navigator.clipboard.writeText(pixKey).then(() => showToast("Chave Pix copiada!"));
    });
  });

  // ===== Botão de QR Code =====
  document.querySelectorAll(".mostrar-qr").forEach(btn => {
    btn.addEventListener("click", e => {
      const card = e.target.closest(".card");
      const qrCodeString = card.getAttribute("data-qr");

      // Copiar código QR automaticamente
      navigator.clipboard.writeText(qrCodeString);

      // Mostrar modal primeiro
      modal.style.display = "flex";

      // Limpar container antes de gerar
      qrContainer.innerHTML = "";

      // Usar requestAnimationFrame para desktop/mobile
      requestAnimationFrame(() => {
        qrCode = new QRCodeStyling({
          width: 200,
          height: 200,
          data: qrCodeString,
          dotsOptions: { color: "#000000", type: "rounded" },
          backgroundOptions: { color: "#fff" },
          image: card.querySelector(".logo").src,
          imageOptions: { crossOrigin: "anonymous", margin: 5 }
        });
        qrCode.append(qrContainer);
      });
    });
  });
});
