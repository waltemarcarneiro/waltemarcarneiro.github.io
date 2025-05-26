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

// Função para login com Google (corrigida)
window.loginWithGoogle = async function() {
    try {
        const provider = new GoogleAuthProvider();
        // Configurar escopos necessários
        provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
        provider.addScope('https://www.googleapis.com/auth/userinfo.email');
        
        // Configurar parâmetros personalizados
        provider.setCustomParameters({
            prompt: 'select_account'
        });
        
        // Tentar login
        const result = await signInWithPopup(auth, provider);
        
        if (result.user) {
            // Garantir que temos as credenciais
            const credential = GoogleAuthProvider.credentialFromResult(result);
            localStorage.setItem('usuarioLogado', 'true');
            document.getElementById('loginModal').style.display = 'none';
        }
    } catch (error) {
        console.error('Erro detalhado:', error);
        if (error.code === 'auth/cancelled-popup-request') {
            alert('Login cancelado pelo usuário');
        } else {
            alert('Erro ao fazer login com Google: ' + error.message);
        }
    }
}

// Funções de autenticação
window.closeLoginModal = function() {
    document.getElementById('loginModal').style.display = 'none';
}

window.fazerLogout = async function() {
    try {
        await signOut(auth);
        localStorage.removeItem('usuarioLogado');
        console.log('Logout realizado com sucesso');
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
    }
}

window.loginWithEmail = async function(email, password) {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        if (result.user) {
            localStorage.setItem('usuarioLogado', 'true');
            window.closeLoginModal();
        }
    } catch (error) {
        console.error('Erro no login:', error);
        alert('Erro no login: ' + error.message);
    }
}

window.createAccount = async function(email, password, name) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await updateProfile(user, {
            displayName: name
        });
        
        localStorage.setItem('usuarioLogado', 'true');
        window.closeLoginModal();
        alert('Conta criada com sucesso!');
    } catch (error) {
        console.error('Erro ao criar conta:', error);
        alert('Erro ao criar conta: ' + error.message);
    }
}

window.resetPassword = async function(email) {
    try {
        await sendPasswordResetEmail(auth, email);
        alert('Email de recuperação enviado com sucesso!');
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        alert('Erro ao enviar email: ' + error.message);
    }
}

window.switchTab = function(tabName) {
    try {
        const tabs = document.querySelectorAll('.tab-btn');
        const contents = document.querySelectorAll('.tab-content');
        
        tabs.forEach(tab => tab.classList.remove('active'));
        contents.forEach(content => content.classList.remove('active'));
        
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
    } catch (error) {
        console.error('Erro ao trocar tab:', error);
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
