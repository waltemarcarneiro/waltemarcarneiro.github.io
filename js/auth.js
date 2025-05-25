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

// Monitora o estado de autenticação
onAuthStateChanged(auth, (user) => {
    console.log("Estado de autenticação mudou:", user); // Debug
    const userName = document.querySelector('.user-name');
    const userStatus = document.querySelector('.user-status');
    
    if (user) {
        userName.textContent = user.displayName || user.email || 'Usuário';
        userStatus.textContent = 'Você está logado';
        localStorage.setItem('usuarioLogado', 'true');
    } else {
        userName.textContent = 'Usuário';
        userStatus.textContent = 'Faça login aquí';
        localStorage.removeItem('usuarioLogado');
    }
});

// Verifica acesso a áreas protegidas
function checkProtectedAccess() {
    const protectedPages = ['/radio/', '/videos/filmes.html'];
    const currentPath = window.location.pathname;
    
    if (protectedPages.some(path => currentPath.includes(path))) {
        if (!auth.currentUser) {
            window.location.href = '/home.html?auth=required';
        }
    }
}

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
    console.log("Iniciando login com Google..."); // Debug
    try {
        const provider = new GoogleAuthProvider();
        showMessage('Conectando com Google...', 'info');
        const result = await signInWithPopup(auth, provider);
        console.log("Login Google bem sucedido:", result.user); // Debug
        
        showMessage('Login realizado com sucesso!', 'success');
        setTimeout(() => {
            document.getElementById('loginModal').style.display = 'none';
            window.location.reload();
        }, 1500);
    } catch (error) {
        console.error('Erro no login com Google:', error);
        showMessage(getErrorMessage(error.code), 'error');
    }
}

// Login com Email (requer verificação)
window.loginWithEmail = async function(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        if (!userCredential.user.emailVerified) {
            await signOut(auth);
            showMessage('Email não verificado. Verifique sua caixa de entrada ou solicite novo email.', 'error');
            showResendVerificationButton(email);
            return;
        }

        showMessage('Login realizado com sucesso!', 'success');
        setTimeout(() => closeLoginModal(), 1500);
    } catch (error) {
        console.error('Erro login email:', error);
        showMessage(getErrorMessage(error.code), 'error');
    }
}

// Criar nova conta
window.createAccount = async function(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        
        showMessage('Conta criada! Verifique seu email para ativar.', 'success');
        await signOut(auth); // Desloga até verificar email
    } catch (error) {
        console.error('Erro criar conta:', error);
        showMessage(getErrorMessage(error.code), 'error');
    }
}

// Reenviar verificação
window.resendVerification = async function(email) {
    try {
        const user = auth.currentUser;
        await sendEmailVerification(user);
        showMessage('Email de verificação reenviado!', 'success');
    } catch (error) {
        showMessage('Erro ao reenviar. Tente novamente.', 'error');
    }
}

// Resetar senha
window.resetPassword = async function(email) {
    try {
        await sendPasswordResetEmail(auth, email);
        showMessage('Email de recuperação enviado!', 'success');
    } catch (error) {
        showMessage(getErrorMessage(error.code), 'error');
    }
}

// Função para mostrar o modal de login
window.showModalLogin = function() {
    document.getElementById('loginModal').style.display = 'block';
    showMessage('Faça login para continuar', 'info');
}

// Função para fechar o modal
window.closeLoginModal = function() {
    document.getElementById('loginModal').style.display = 'none';
}

// Funções de navegação do modal
window.showView = function(view) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const resetForm = document.getElementById('resetForm');
    
    // Esconde todos os forms
    [loginForm, registerForm, resetForm].forEach(form => {
        if (form) form.style.display = 'none';
    });
    
    // Mostra o form selecionado
    switch(view) {
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

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Formulário de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Login form submitted'); // Debug
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                showMessage('Fazendo login...', 'info');
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                console.log('Login successful:', userCredential); // Debug
                
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

    // Formulário de registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Register form submitted'); // Debug
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            
            try {
                showMessage('Criando sua conta...', 'info');
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                console.log('Registration successful:', userCredential); // Debug
                
                await sendEmailVerification(userCredential.user);
                showMessage('Conta criada! Verifique seu email para ativar.', 'success');
                
                setTimeout(() => {
                    showView('login');
                }, 3000);
            } catch (error) {
                console.error('Erro no registro:', error);
                showMessage(getErrorMessage(error.code), 'error');
            }
        });
    }
});

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
