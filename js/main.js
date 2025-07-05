import { desbloquearComBiometria } from './webAuth.js';

document.addEventListener('DOMContentLoaded', async () => {
  const usarBiometria = localStorage.getItem('biometria_ativada') === 'true';

  if (usarBiometria) {
    const liberado = await desbloquearComBiometria();
    if (!liberado) {
      document.getElementById('modal-acesso').classList.add('show');
    }
  } else {
    document.getElementById('modal-acesso').classList.add('show');
  }
});
