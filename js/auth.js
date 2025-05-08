// Monitora estado de autenticação
auth.onAuthStateChanged((user) => {
  const userName = document.querySelector('.user-name');
  const userInfo = document.querySelector('.user-info');
  
  if (user) {
    // Usuário está logado
    userName.textContent = user.displayName || 'Usuário';
    userInfo.textContent = 'Logado';
    
    // Atualiza elementos da interface para usuário logado
    document.querySelectorAll('.auth-required').forEach(el => {
      el.style.display = 'block';
    });
  } else {
    // Usuário não está logado
    userName.textContent = 'Usuário';
    userInfo.textContent = 'Área de Membros';
    
    // Redireciona para login
    window.location.href = './login/login.html';
  }
});
