import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail
} from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js';
import { auth } from '../../firebase-config.js';

export function initEmailAuth() {
    // Login com email/senha
    window.loginWithEmail = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (!user.emailVerified) {
                showMessage('Por favor, verifique seu email antes de fazer login. Verifique sua caixa de entrada.', 'error');
                return;
            }

            showMessage('Login realizado com sucesso!', 'success');
            setTimeout(() => {
                document.getElementById('loginModal').style.display = 'none';
            }, 2000);

        } catch (error) {
            handleAuthError(error);
        }
    };

    // Criar nova conta
    window.createAccount = async (email, password, name) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await user.updateProfile({ displayName: name });
            await sendEmailVerification(user);

            showMessage(
                'Conta criada! Por favor, verifique seu email para ativar sua conta. ' +
                'Verifique também sua caixa de spam.',
                'success'
            );

        } catch (error) {
            handleAuthError(error);
        }
    };

    // Recuperação de senha
    window.resetPassword = async (email) => {
        if (!email) {
            showMessage('Por favor, informe seu email', 'error');
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            showMessage(
                'Email de recuperação enviado! Verifique sua caixa de entrada e spam.',
                'success'
            );
        } catch (error) {
            handleAuthError(error);
        }
    };
}

function handleAuthError(error) {
    const errorMessages = {
        'auth/user-not-found': 'Usuário não encontrado.',
        'auth/wrong-password': 'Senha incorreta.',
        'auth/invalid-email': 'Email inválido.',
        'auth/email-already-in-use': 'Este email já está em uso.',
        'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
        'auth/operation-not-allowed': 'Operação não permitida.',
        'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
        'default': 'Ocorreu um erro. Tente novamente.'
    };

    const message = errorMessages[error.code] || errorMessages.default;
    showMessage(message, 'error');
}

function showMessage(message, type) {
    const authMessage = document.getElementById('auth-message');
    if (authMessage) {
        authMessage.textContent = message;
        authMessage.className = `auth-message ${type}`;
        authMessage.style.display = 'block';
        
        // Esconde a mensagem após 5 segundos
        setTimeout(() => {
            authMessage.style.display = 'none';
        }, 5000);
    }
}
