class ModalManager {
  constructor() {
    this.modalOverlay = null;
    this.modalContent = null;
    this.createModalBase();
    this.addGlobalListeners();
  }

  createModalBase() {
    this.modalOverlay = document.createElement('div');
    this.modalOverlay.className = 'modal-overlay';
    this.modalOverlay.style.display = 'none';
    this.modalOverlay.innerHTML = `
      <div class="modal-box" tabindex="-1">
        <button class="modal-close" aria-label="Fechar modal">&times;</button>
        <div class="modal-content"></div>
      </div>
    `;
    document.body.appendChild(this.modalOverlay);
    this.modalContent = this.modalOverlay.querySelector('.modal-content');
    this.modalOverlay.querySelector('.modal-close').onclick = () => this.close();
    this.modalOverlay.onclick = (e) => {
      if (e.target === this.modalOverlay) this.close();
    };
  }

  async open(modalFile) {
    this.modalContent.innerHTML = '<div class="modal-loading">Carregando...</div>';
    this.modalOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    try {
      const resp = await fetch(`modals/${modalFile}`);
      const html = await resp.text();
      this.modalContent.innerHTML = html;
      this.modalOverlay.querySelector('.modal-box').focus();
    } catch {
      this.modalContent.innerHTML = '<div class="modal-error">Erro ao carregar conteúdo.</div>';
    }
  }

  close() {
    this.modalOverlay.style.display = 'none';
    document.body.style.overflow = '';
    this.modalContent.innerHTML = '';
  }

  addGlobalListeners() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
  }
}

// Instância global
window.modalManager = new ModalManager();
