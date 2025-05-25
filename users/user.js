// Importações do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8e4W8z4EFQGgCXl2zQVPZgSj-d2xIHeU",
  authDomain: "waltemarbr.firebaseapp.com",
  projectId: "waltemarbr",
  storageBucket: "waltemarbr.appspot.com",
  messagingSenderId: "21358148527",
  appId: "1:21358148527:web:49cd9ab5cfdd71e96c8d5a",
  measurementId: "G-H16T9ZYGSH"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Função para mostrar mensagem de sucesso
function showSuccessMessage(message) {
  const successMessageElement = document.getElementById('success-message');
  successMessageElement.textContent = message;
  successMessageElement.classList.remove('hidden');
  successMessageElement.classList.add('show');
  
  setTimeout(() => {
    successMessageElement.classList.remove('show');
    successMessageElement.classList.add('hidden');
  }, 5000); // Ocultar mensagem após 3 segundos
}

// Função para login com Google
async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log('Usuário conectado com o Google com sucesso:', user);
    showSuccessMessage('Usuário conectado com o Google com sucesso!');
    setTimeout(() => {
      window.location.href = '/users/sucesso.html';
    }, 3500); // Redirecionar após a mensagem ser exibida
  } catch (error) {
    displayErrorMessage(error.message);
  }
}

// Função para registrar usuário
async function registerUser(email, password, username) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(collection(db, 'users'), user.uid), {
      username: username,
      email: email,
      createdAt: serverTimestamp()
    });

    console.log('Usuário cadastrado com sucesso:', user);
    showSuccessMessage('Usuário cadastrado com sucesso!');
    setTimeout(() => {
      window.location.href = '/users/sucesso.html';
    }, 3500); // Redirecionar após a mensagem ser exibida
  } catch (error) {
    displayErrorMessage(error.message);
  }
}

// Função para login do usuário
async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('Usuário logado com sucesso:', user);
    showSuccessMessage('Usuário logado com sucesso!');
    setTimeout(() => {
      window.location.href = '/users/sucesso.html';
    }, 3500); // Redirecionar após a mensagem ser exibida
  } catch (error) {
    displayErrorMessage(error.message);
  }
}

// Função para redefinir senha
async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    showSuccessMessage('Enviamos um link para redefinir sua senha. Verifique seu email.');
  } catch (error) {
    displayErrorMessage(error.message);
  }
}

// Adiciona listeners para os formulários e botões
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('register-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    await registerUser(email, password, username);
  });

  document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    await loginUser(email, password);
  });

  document.getElementById('google-login').addEventListener('click', async () => {
    await loginWithGoogle();
  });

  document.getElementById('reset-password').addEventListener('click', async () => {
    const email = document.getElementById('login-email').value;
    if (email) {
      await resetPassword(email);
    } else {
      alert('Por favor, insira seu email para redefinir sua senha.');
    }
  });

  document.getElementById('show-register').addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
    clearErrorMessage();
  });

  document.getElementById('show-login').addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
    clearErrorMessage();
  });

  togglePasswordVisibility('register-password', 'register-eye-icon');
  togglePasswordVisibility('login-password', 'eye-icon');
});

function togglePasswordVisibility(inputId, eyeIconId) {
  const passwordInput = document.getElementById(inputId);
  const eyeIcon = document.getElementById(eyeIconId);
  eyeIcon.addEventListener('click', () => {
    const isPasswordVisible = passwordInput.type === 'text';
    passwordInput.type = isPasswordVisible ? 'password' : 'text';
    eyeIcon.setAttribute('name', isPasswordVisible ? 'eye-outline' : 'eye-off-outline');
  });
}

function displayErrorMessage(errorCode) {
  const errorMessageElement = document.getElementById('error-message');
  const message = errorMessages[errorCode] || 'Ocorreu um erro. Por favor, tente novamente.';
  errorMessageElement.textContent = message;
  errorMessageElement.classList.remove('hidden');
  errorMessageElement.classList.add('show');
}

function clearErrorMessage() {
  const errorMessageElement = document.getElementById('error-message');
  errorMessageElement.textContent = '';
}
//mapeamento de mensagens de erro
const errorMessages = {
  'auth/invalid-credential': 'Credenciais inválidas. Por favor, verifique e tente novamente.',
  'auth/user-not-found': 'Usuário não encontrado. Por favor, verifique o email e tente novamente.',
  'auth/wrong-password': 'Senha incorreta. Por favor, tente novamente.',
  'auth/email-already-in-use': 'Este email já está em uso. Por favor, use outro email.',
  // Adicione outras mensagens de erro conforme necessário
};
