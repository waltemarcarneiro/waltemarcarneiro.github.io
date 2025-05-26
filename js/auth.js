import { GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js';
import { auth } from '../firebase-config.js';

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

// Exporta funções de autenticação
export const loginWithGoogle = async () => {
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
export const closeLoginModal = () => {
    document.getElementById('loginModal').style.display = 'none';
}

// Função para fazer logout
export const fazerLogout = async () => {
    try {
        await signOut(auth);
        console.log('Logout realizado com sucesso');
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
    }
}

// Função para login com email/senha
export const loginWithEmail = async (email, password) => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        if (result.user) {
            document.getElementById('loginModal').style.display = 'none';
        }
    } catch (error) {
        console.error('Erro no login:', error);
        alert('Erro ao fazer login: ' + error.message);
    }
}

// Função para criar conta
export const createAccount = async (email, password, name) => {
    try {
        console.log('Iniciando criação de conta...');
        const result = await createUserWithEmailAndPassword(auth, email, password);
        
        if (result.user) {
            console.log('Conta criada, atualizando perfil...');
            await updateProfile(result.user, {
                displayName: name
            });
            console.log('Conta criada com sucesso!');
            document.getElementById('loginModal').style.display = 'none';
            alert('Conta criada com sucesso!');
        }
    } catch (error) {
        console.error('Erro ao criar conta:', error);
        let message = 'Erro ao criar conta: ';
        switch (error.code) {
            case 'auth/email-already-in-use':
                message += 'Este email já está em uso';
                break;
            case 'auth/invalid-email':
                message += 'Email inválido';
                break;
            case 'auth/weak-password':
                message += 'A senha deve ter pelo menos 6 caracteres';
                break;
            default:
                message += error.message;
        }
        alert(message);
    }
}

// Função para recuperar senha
export const resetPassword = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        alert('Email de recuperação enviado com sucesso!');
    } catch (error) {
        console.error('Erro ao enviar email de recuperação:', error);
        alert('Erro ao enviar email: ' + error.message);
    }
}

// Função para alternar abas do modal
export const switchTab = (tabName) => {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    contents.forEach(content => content.classList.remove('active'));
    
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Intercepta clicks para verificar autenticação
document.addEventListener('click', function(e) {
    const clickedElement = e.target.closest('[onclick], [data-auth-lock]');
    if (!clickedElement) return;

    if (clickedElement.hasAttribute('data-auth-free')) {
        return;
    }

    if (!auth.currentUser) {
        e.preventDefault();
        e.stopImmediatePropagation();
        document.getElementById('loginModal').style.display = 'flex';
        return false;
    }
}, true);

// Atribui funções ao objeto window para acesso global
window.loginWithGoogle = loginWithGoogle;
window.closeLoginModal = closeLoginModal;
window.fazerLogout = fazerLogout;
window.loginWithEmail = loginWithEmail;
window.createAccount = createAccount;
window.resetPassword = resetPassword;
window.switchTab = switchTab;
