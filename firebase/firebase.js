// Importações do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCHOFjKBxvKhzLkk18vOhzmoKZyCPmevyM",
  authDomain: "waltemar-app.firebaseapp.com",
  projectId: "waltemar-app",
  storageBucket: "waltemar-app.firebasestorage.app",
  messagingSenderId: "385613786432",
  appId: "1:385613786432:web:2a98629d67efe7f4f89ea5",
  measurementId: "G-WPEEZ3H5X8",
};

// Inicialização do Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Verificar autenticação ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("Usuário autenticado:", user.email);
      localStorage.setItem("usuarioLogado", "true");
      updateUserInterface(user);
    } else {
      localStorage.removeItem("usuarioLogado");
      updateUserInterface(null);
      // Remover redirecionamento automático
      // window.location.href = "login.html"; <- REMOVER ESTA LINHA
    }
  });
});

// Função para mostrar o modal de login
function showLoginModal() {
  document.getElementById('loginModal').style.display = 'block';
}

// Event listener para links protegidos
document.addEventListener('click', (e) => {
  const target = e.target.closest('[data-auth-lock], [data-auth="required"]');
  if (!target) return;

  if (!auth.currentUser) {
    e.preventDefault();
    showLoginModal();
  }
}, true);

// Chame a função para verificar a autenticação quando a página carregar
checkAuthState();

// Função para mostrar mensagem de sucesso
function showSuccessMessage(message) {
  const successMessageElement = document.getElementById('success-message');
  successMessageElement.textContent = message;
  successMessageElement.classList.remove('hidden');
  successMessageElement.classList.add('show');
  
  setTimeout(() => {
    successMessageElement.classList.remove('show');
    successMessageElement.classList.add('hidden');
  }, 5000); // Ocultar mensagem após 5 segundos
}

// Função para mostrar mensagem ao usuário
function showMessage(message, type = 'info') {
    const messageEl = document.getElementById('auth-message');
    if (!messageEl) return;
    messageEl.textContent = message;
    messageEl.className = `auth-message ${type}`;
    messageEl.style.display = 'block';
}

// Função para atualizar interface após login/logout
function updateUserInterface(user) {
    const userName = document.querySelector('.user-name');
    const userStatus = document.querySelector('.user-status');
    const userIcon = document.querySelector('#user ion-icon[name="person-circle-outline"]');
    
    if (user) {
        userName.textContent = user.displayName || 'Usuário';
        userStatus.textContent = 'Você está logado';
        if (user.photoURL && userIcon) {
            userIcon.outerHTML = `<img src="${user.photoURL}" alt="Foto do perfil" style="width: 56px; height: 56px; border-radius: 50%; margin-right: 10px;">`;
        }
    } else {
        userName.textContent = 'Usuário';
        userStatus.textContent = 'Faça login aquí';
    }
}

// Login com Google
window.loginWithGoogle = async function() {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        if (result.user) {
            document.getElementById('loginModal').style.display = 'none';
            showMessage('Login realizado com sucesso!', 'success');
            updateUserInterface(result.user);
        }
    } catch (error) {
        showMessage(errorMessages[error.code] || error.message, 'error');
    }
}

// Login com email/senha
window.loginWithEmail = async function() {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;

    if (!email || !password) {
        showMessage('Preencha todos os campos', 'error');
        return;
    }

    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        if (result.user) {
            document.getElementById('loginModal').style.display = 'none';
            showMessage('Login realizado com sucesso!', 'success');
            updateUserInterface(result.user);
        }
    } catch (error) {
        showMessage(errorMessages[error.code] || error.message, 'error');
    }
}

// Criar conta
window.createAccount = async function() {
    const name = document.getElementById('nameInput').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    if (!name || !email || !password) {
        showMessage('Preencha todos os campos', 'error');
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        await sendEmailVerification(userCredential.user);
        showMessage('Conta criada! Verifique seu email.', 'success');
    } catch (error) {
        showMessage(errorMessages[error.code] || error.message, 'error');
    }
}

// Reset de senha
window.resetPassword = async function() {
    const email = document.getElementById('resetEmail').value;
    if (!email) {
        showMessage('Digite seu email', 'error');
        return;
    }

    try {
        await sendPasswordResetEmail(auth, email);
        showMessage('Email de redefinição enviado!', 'success');
    } catch (error) {
        showMessage(errorMessages[error.code] || error.message, 'error');
    }
}

// Logout
window.fazerLogout = async function() {
    try {
        await signOut(auth);
        updateUserInterface(null);
    } catch (error) {
        showMessage('Erro ao fazer logout', 'error');
    }
}

// Monitorar estado de autenticação
auth.onAuthStateChanged((user) => {
    updateUserInterface(user);
});

// Mensagens de erro em português
const errorMessages = {
    'auth/email-already-in-use': 'Este email já está em uso',
    'auth/invalid-email': 'Email inválido',
    'auth/weak-password': 'Senha muito fraca',
    'auth/user-not-found': 'Usuário não encontrado',
    'auth/wrong-password': 'Senha incorreta',
    'default': 'Ocorreu um erro. Tente novamente.'
};