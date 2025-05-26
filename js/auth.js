import { 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    sendPasswordResetEmail,
    updateProfile 
} from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js';
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

// Função para login com Google
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
        console.error('Erro no login com Google:', error);
        alert('Erro no login com Google: ' + error.message);
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
window.loginWithEmail = async function(email, password) {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        if (result.user) {
            document.getElementById('loginModal').style.display = 'none';
        }
    } catch (error) {
        console.error('Erro no login:', error);
        alert('Erro no login: ' + error.message);
    }
}

// Função para criar conta
window.createAccount = async function(email, password, name) {
    try {
        console.log('Iniciando criação de conta...');
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await updateProfile(user, {
            displayName: name
        });
        
        console.log('Conta criada com sucesso!');
        document.getElementById('loginModal').style.display = 'none';
        alert('Conta criada com sucesso!');
    } catch (error) {
        console.error('Erro ao criar conta:', error);
        alert('Erro ao criar conta: ' + error.message);
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
window.switchTab = function(tabName) {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    contents.forEach(content => content.classList.remove('active'));
    
    const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
    const selectedContent = document.getElementById(`${tabName}-tab`);
    
    if (selectedTab && selectedContent) {
        selectedTab.classList.add('active');
        selectedContent.classList.add('active');
    }
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
