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
    
    // Mostra modal de login ao invés de redirecionar
    showLoginModal();
  }
});

// Função para mostrar modal
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.style.display = 'block';
}

// Login com Google
function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            document.getElementById('loginModal').style.display = 'none';
        })
        .catch((error) => {
            console.error('Erro no login:', error);
        });
}

// Função para fazer logout
function fazerLogout() {
    auth.signOut().then(() => {
        // Limpa informações do usuário
        const userName = document.querySelector('.user-name');
        const userInfo = document.querySelector('.user-info');
        userName.textContent = 'Usuário';
        userInfo.textContent = 'Área de Membros';
        
        // Mostra modal de login
        document.getElementById('loginModal').style.display = 'block';
    }).catch((error) => {
        console.error('Erro ao fazer logout:', error);
    });
}
