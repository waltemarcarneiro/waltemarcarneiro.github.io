import { 
    GoogleAuthProvider, 
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile
} from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js';
import { auth } from '../firebase-config.js';

// Estado de autenticação
const authState = {
    isLoading: false,
    error: null,
    user: null
};

// Monitora mudanças no estado de autenticação
auth.onAuthStateChanged((user) => {
    authState.user = user;
    updateUIWithUserData(user);
});

// Atualiza UI com dados do usuário
function updateUIWithUserData(user) {
    const userName = document.querySelector('.user-name');
    const userStatus = document.querySelector('.user-status');
    const userIcon = document.querySelector('#user ion-icon[name="person-circle-outline"]');
    
    if (!userName || !userStatus || !userIcon) return;
    
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
}

// Login com Google
window.loginWithGoogle = async function() {
    try {
        authState.isLoading = true;
        const provider = new GoogleAuthProvider();
        
        const result = await signInWithPopup(auth, provider);
        console.log("Google Sign In successful");
        
        if (result.user) {
            localStorage.setItem('usuarioLogado', 'true');
            hideLoginModal();
        }
    } catch (error) {
        handleAuthError(error);
    } finally {
        authState.isLoading = false;
    }
}

// Criar conta
window.createAccount = async function(email, password, name) {
    if (!email || !password || !name) {
        alert('Por favor, preencha todos os campos');
        return;
    }

    try {
        authState.isLoading = true;
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        await updateProfile(userCredential.user, {
            displayName: name
        });

        localStorage.setItem('usuarioLogado', 'true');
        hideLoginModal();
        showSuccessMessage('Conta criada com sucesso!');
    } catch (error) {
        handleAuthError(error);
    } finally {
        authState.isLoading = false;
    }
}

// Login com email
window.loginWithEmail = async function(email, password) {
    if (!email || !password) {
        alert('Por favor, preencha todos os campos');
        return;
    }

    try {
        authState.isLoading = true;
        await signInWithEmailAndPassword(auth, email, password);
        localStorage.setItem('usuarioLogado', 'true');
        hideLoginModal();
    } catch (error) {
        handleAuthError(error);
    } finally {
        authState.isLoading = false;
    }
}

// Logout
window.fazerLogout = async function() {
    try {
        await signOut(auth);
        localStorage.removeItem('usuarioLogado');
        window.location.reload();
    } catch (error) {
        handleAuthError(error);
    }
}

// Helpers
function hideLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.style.display = 'none';
}

function showSuccessMessage(message) {
    alert(message); // Você pode substituir por uma notificação mais elegante
}

function handleAuthError(error) {
    console.error('Auth Error:', error);
    let message = 'Ocorreu um erro. Tente novamente.';
    
    switch (error.code) {
        case 'auth/email-already-in-use':
            message = 'Este email já está em uso.';
            break;
        case 'auth/invalid-email':
            message = 'Email inválido.';
            break;
        case 'auth/weak-password':
            message = 'Senha muito fraca. Use pelo menos 6 caracteres.';
            break;
        case 'auth/user-not-found':
            message = 'Usuário não encontrado.';
            break;
        case 'auth/wrong-password':
            message = 'Senha incorreta.';
            break;
        case 'auth/popup-closed-by-user':
            message = 'Login cancelado. Tente novamente.';
            break;
    }
    
    alert(message);
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
