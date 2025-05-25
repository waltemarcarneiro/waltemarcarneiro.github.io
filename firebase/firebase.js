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
    } else {
      localStorage.removeItem("usuarioLogado");
      window.location.href = "login.html";
    }
  });
});


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

// Função para login com Google
async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log('Usuário conectado com o Google com sucesso:', user);
    showSuccessMessage('Usuário conectado com o Google com sucesso!');
    setTimeout(() => {
      window.location.href = './firebase/sucesso.html';
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
      window.location.href = './firebase/sucesso.html';
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
      window.location.href = './firebase/sucesso.html';
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

//FIREBASE CONFIG (HTML)

      const firebaseConfig = {
        apiKey: "AIzaSyCHOFjKBxvKhzLkk18vOhzmoKZyCPmevyM",
        authDomain: "waltemar-app.firebaseapp.com",
        projectId: "waltemar-app",
        storageBucket: "waltemar-app.firebasestorage.app",
        messagingSenderId: "385613786432",
        appId: "1:385613786432:web:2a98629d67efe7f4f89ea5",
        measurementId: "G-WPEEZ3H5X8"
      };

      firebase.initializeApp(firebaseConfig);

//Script para verificar o status de autenticação
 
      document.addEventListener("DOMContentLoaded", function () {
         // Use localStorage para checar a sessão do usuário
         const usuarioLogado = localStorage.getItem("usuarioLogado");

         if (usuarioLogado === "true") {
            console.log("Usuário logado anteriormente. Acesso permitido.");
            return; // Já está logado, fica na página inicial
         }

         // Verifica o estado de autenticação do Firebase
         firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
               // Usuário está logado; guarda no localStorage
               localStorage.setItem("usuarioLogado", "true");
               console.log("Usuário autenticado:", user.email);
            } else {
               // Usuário não está logado; redireciona para login
               window.location.href = "./firebase/login.html";
            }
         });
      });