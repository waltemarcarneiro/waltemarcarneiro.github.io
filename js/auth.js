import { 
    GoogleAuthProvider, 
    signInWithPopup, 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail,
    signOut 
} from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js';
import { auth } from './firebase-config.js';

// Estado do modal
let currentView = 'login';

// Função para mostrar mensagem ao usuário
function showMessage(message, type = 'info') {
    const messageEl = document.getElementById('auth-message');
    if (!messageEl) return;
    
    messageEl.textContent = message;
    messageEl.className = `auth-message ${type}`;
    messageEl.style.display = 'block';
}

// Login com Google
window.loginWithGoogle = async function() {
    try {
        showMessage('Conectando com Google...', 'info');
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        
        showMessage('Login realizado com sucesso!', 'success');
        setTimeout(() => {
            document.getElementById('loginModal').style.display = 'none';
            window.location.reload(); // Recarrega a página após login
        }, 1500);
    } catch (error) {
        console.error('Erro no login com Google:', error);
        showMessage('Erro ao fazer login com Google. Tente novamente.', 'error');
    }
}

// Criar nova conta
window.showRegister = function() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    showMessage('Preencha os dados para criar sua conta', 'info');
}

// Register Event Listener
document.addEventListener('DOMContentLoaded', () => {
    // Form de registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            
            try {
                showMessage('Criando sua conta...', 'info');
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await sendEmailVerification(userCredential.user);
                
                showMessage('Conta criada! Verifique seu email para ativar.', 'success');
                setTimeout(() => {
                    document.getElementById('loginForm').style.display = 'block';
                    document.getElementById('registerForm').style.display = 'none';
                }, 3000);
            } catch (error) {
                console.error('Erro no registro:', error);
                showMessage(getErrorMessage(error.code), 'error');
            }
        });
    }

    // Form de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                showMessage('Fazendo login...', 'info');
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                
                if (!userCredential.user.emailVerified) {
                    await signOut(auth);
                    showMessage('Por favor, verifique seu email antes de fazer login', 'error');
                    return;
                }
                
                showMessage('Login realizado com sucesso!', 'success');
                setTimeout(() => {
                    document.getElementById('loginModal').style.display = 'none';
                    window.location.reload();
                }, 1500);
            } catch (error) {
                console.error('Erro no login:', error);
                showMessage(getErrorMessage(error.code), 'error');
            }
        });
    }
});

// Mensagens de erro em português
function getErrorMessage(code) {
    const messages = {
        'auth/email-already-in-use': 'Este email já está cadastrado',
        'auth/invalid-email': 'Email inválido',
        'auth/operation-not-allowed': 'Operação não permitida',
        'auth/weak-password': 'Senha muito fraca. Use pelo menos 6 caracteres',
        'auth/user-disabled': 'Esta conta foi desativada',
        'auth/user-not-found': 'Usuário não encontrado',
        'auth/wrong-password': 'Senha incorreta',
        'auth/popup-closed-by-user': 'Login cancelado. Tente novamente.',
        'default': 'Ocorreu um erro. Tente novamente.'
    };
    return messages[code] || messages.default;
}
