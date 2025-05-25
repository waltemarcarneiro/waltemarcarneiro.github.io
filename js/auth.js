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
let currentView = 'login'; // login, register, resetPassword

// Monitora mudanças no estado de autenticação
auth.onAuthStateChanged((user) => {
    const userName = document.querySelector('.user-name');
    const userStatus = document.querySelector('.user-status');
    const userIcon = document.querySelector('#user ion-icon[name="person-circle-outline"]');
    
    if (user) {
        userName.innerHTML = user.displayName || 'Usuário';
        userStatus.innerHTML = 'Você está logado';
        if (user.photoURL) {
            userIcon.outerHTML = `<img src="${user.photoURL}" alt="Foto do perfil" style="width: 56px; height: 56px; border-radius: 50%; margin-right: 10px;">`;
        }
    } else {
        userName.innerHTML = 'Usuário';
        userStatus.innerHTML = 'Faça login aquí';
    }
});

// Função de login com Google
window.loginWithGoogle = async function() {
    try {
        console.log('Iniciando login com Google...');
        const provider = new GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        
        const result = await signInWithPopup(auth, provider);
        console.log('Login bem sucedido:', result.user);
        
        if (result.user) {
            document.getElementById('loginModal').style.display = 'none';
        }
    } catch (error) {
        console.error('Erro no login:', error.code, error.message);
    }
}

// Função para fechar modal de login
window.closeLoginModal = function() {
    document.getElementById('loginModal').style.display = 'none';
}

// Função para fazer logout
window.fazerLogout = async function() {
    try {
        console.log('Iniciando logout...');
        await signOut(auth);
        console.log('Logout realizado com sucesso');
        const userName = document.querySelector('.user-name');
        const userStatus = document.querySelector('.user-status');
        userName.textContent = 'Usuário';
        userStatus.textContent = 'Faça login aquí';
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
    }
};

// Intercepta clicks para verificar autenticação
document.addEventListener('click', function(e) {
    const clickedElement = e.target.closest('[onclick]');
    if (!clickedElement) return;

    if (clickedElement.hasAttribute('data-auth-free')) {
        return;
    }

    if (!auth.currentUser) {
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
        document.getElementById('loginModal').style.display = 'block';
        return false;
    }
}, true);

// Intercepta clicks em links protegidos
document.addEventListener('click', function(e) {
    const link = e.target.closest('a[data-auth-lock]');
    if (!link) return;

    if (!auth.currentUser) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('loginModal').style.display = 'block';
        return false;
    }
}, true);

// Verifica parâmetros da URL ao carregar
document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('auth') === 'required') {
        const fromPage = params.get('from');
        const loginModal = document.getElementById('loginModal');
        const message = `Você precisa fazer login para acessar ${fromPage}`;
        
        if (loginModal) {
            const modalMessage = loginModal.querySelector('p');
            if (modalMessage) modalMessage.textContent = message;
            loginModal.style.display = 'block';
        }
    }
});

// Funções para alternar tabs
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        button.classList.add('active');
        document.getElementById(`${button.dataset.tab}-tab`).classList.add('active');
    });
});

// Funções de UI
function showView(viewName) {
    currentView = viewName;
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const resetForm = document.getElementById('resetForm');
    const authMessage = document.getElementById('auth-message');
    
    [loginForm, registerForm, resetForm].forEach(form => {
        if (form) form.style.display = 'none';
    });
    authMessage.textContent = '';
    
    switch(viewName) {
        case 'login':
            loginForm.style.display = 'block';
            break;
        case 'register':
            registerForm.style.display = 'block';
            break;
        case 'resetPassword':
            resetForm.style.display = 'block';
            break;
    }
}

// Login com email/senha
async function loginWithEmail(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (!user.emailVerified) {
            await signOut(auth);
            showAuthMessage('Por favor, verifique seu email antes de fazer login', 'error');
            showResendVerificationButton(email);
            return;
        }

        showAuthMessage('Login realizado com sucesso!', 'success');
        setTimeout(() => {
            document.getElementById('loginModal').style.display = 'none';
        }, 1500);
    } catch (error) {
        showAuthMessage(getErrorMessage(error.code), 'error');
    }
}

// Criar conta
async function createAccount(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await sendEmailVerification(user);
        await signOut(auth);
        
        showAuthMessage('Conta criada! Verifique seu email para ativar.', 'success');
    } catch (error) {
        showAuthMessage(getErrorMessage(error.code), 'error');
    }
}

// Reenviar email de verificação
async function resendVerificationEmail(email) {
    try {
        const user = auth.currentUser;
        await sendEmailVerification(user);
        showAuthMessage('Email de verificação reenviado!', 'success');
    } catch (error) {
        showAuthMessage('Erro ao reenviar email', 'error');
    }
}

// Redefinir senha
async function resetPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email);
        showAuthMessage('Email de redefinição de senha enviado!', 'success');
    } catch (error) {
        showAuthMessage(getErrorMessage(error.code), 'error');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Form de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            await loginWithEmail(email, password);
        });
    }

    // Botões de navegação
    document.getElementById('showRegister')?.addEventListener('click', (e) => {
        e.preventDefault();
        showView('register');
    });

    document.getElementById('showResetPassword')?.addEventListener('click', (e) => {
        e.preventDefault();
        showView('resetPassword');
    });
});

// Mensagens de erro em português
const errorMessages = {
    'auth/user-not-found': 'Usuário não encontrado',
    'auth/wrong-password': 'Senha incorreta',
    'auth/email-already-in-use': 'Este email já está em uso',
    'auth/invalid-email': 'Email inválido',
    'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres'
};

function getErrorMessage(code) {
    return errorMessages[code] || 'Ocorreu um erro. Tente novamente.';
}

// Funções auxiliares
function showAuthMessage(message, type) {
    const messageElement = document.getElementById('auth-message');
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = `auth-message ${type}`;
    }
}

function showResendVerificationButton(email) {
    const messageElement = document.getElementById('auth-message');
    const button = document.createElement('button');
    button.textContent = 'Reenviar email de verificação';
    button.className = 'resend-button';
    button.onclick = () => resendVerificationEmail(email);
    messageElement.appendChild(button);
}
