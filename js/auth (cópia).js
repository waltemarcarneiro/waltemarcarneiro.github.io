import { auth } from "../firebase-config.js";
import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Login com Google
window.loginComGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    if (result.user.emailVerified || result.user.providerData[0].providerId === "google.com") {
      fecharModalAcesso();
    } else {
      mostrarMensagem("Verifique seu email para continuar.");
    }
  } catch (error) {
    mostrarMensagem(error.message);
  }
};

// Criar conta com email/senha
window.criarConta = async (email, senha, nome) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    await sendEmailVerification(userCredential.user);
    mostrarMensagem("Verifique seu email para ativar a conta.");
  } catch (error) {
    mostrarMensagem(error.message);
  }
};

// Login com email/senha
window.loginComEmail = async (email, senha) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, senha);
    if (result.user.emailVerified) {
      fecharModalAcesso();
    } else {
      mostrarMensagem("Conta não verificada. Verifique seu email.");
    }
  } catch (error) {
    mostrarMensagem(error.message);
  }
};

// Recuperar senha
window.recuperarSenha = async () => {
  const email = prompt("Digite seu email para redefinir a senha:");
  if (!email) return;
  try {
    await sendPasswordResetEmail(auth, email);
    mostrarMensagem("Verifique seu email para redefinir sua senha.");
  } catch (error) {
    mostrarMensagem(error.message);
  }
};

// Sair
window.deslogar = async () => {
  try {
    await signOut(auth);
    mostrarMensagem("Você saiu da conta.");
  } catch (error) {
    mostrarMensagem(error.message);
  }
};

// Proteção de links com ID "link-lock"
function protegerLinks() {
  document.querySelectorAll('[id="link-lock"]').forEach(el => {
    el.addEventListener("click", e => {
      if (!auth.currentUser || !auth.currentUser.emailVerified) {
        e.preventDefault();
        abrirModalAcesso();
      }
    });
  });
}

// Estado de autenticação
onAuthStateChanged(auth, user => {
  protegerLinks();

  const nomeEl = document.querySelector(".user-name");
  const statusEl = document.querySelector(".user-status");
  const iconEl = document.querySelector("#user ion-icon:first-child");
  const userDiv = document.getElementById("user");

  if (user) {
    const nome = user.displayName || "Usuário Logado";
    const foto = user.photoURL;

    nomeEl.textContent = nome;
    statusEl.textContent = "Você está logado";

    if (foto) {
      // Substituir o ícone por imagem de perfil
      iconEl.outerHTML = `<img src="${foto}" style="width:56px;height:56px;border-radius:50%;margin-right:10px;">`;
    } else {
      iconEl.setAttribute("name", "happy-outline");
    }

    userDiv?.removeAttribute("data-auth-lock");
  } else {
    nomeEl.textContent = "Usuário";
    statusEl.textContent = "Faça login aqui";

    // Restaurar o ícone padrão
    const existingImg = document.querySelector("#user img");
    if (existingImg) {
      existingImg.outerHTML = `<ion-icon style="font-size: 56px; margin-right: 10px;" name="person-circle-outline"></ion-icon>`;
    } else {
      iconEl?.setAttribute("name", "person-circle-outline");
    }

    userDiv?.setAttribute("data-auth-lock", "");
  }
});


// Mensagem
function mostrarMensagem(msg) {
  const el = document.getElementById("auth-message");
  if (!el) return;
  el.textContent = msg;
  el.style.display = "block";
  setTimeout(() => el.style.display = "none", 5000);
}

// Bloquear qualquer elemento com data-auth-lock se não estiver logado

function ativarProtecoes() {
  document.querySelectorAll('[data-auth-lock]').forEach(el => {
    el.onclick = (e) => {
      if (!auth.currentUser || !auth.currentUser.emailVerified) {
        e.preventDefault();
        abrirModalAcesso();
      }
    };
  });

  document.querySelectorAll('[data-auth-free]').forEach(el => {
    el.onclick = () => {
      if (auth.currentUser) {
        deslogar();
      }
    };
  });
}

// Chamar quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", ativarProtecoes);