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


// Estado de autenticação
onAuthStateChanged(auth, user => {
  protegerLinks();

  const nomeEl = document.querySelector(".user-name");
  const statusEl = document.querySelector(".user-status");
  const userDiv = document.getElementById("user");

  // Seleciona tanto <ion-icon> quanto <img> dentro de #user
  let iconEl = userDiv.querySelector("ion-icon, img");

  if (user) {
    const nome = user.displayName || "Usuário Logado";
    const foto = user.photoURL;

    nomeEl.textContent = nome;
    statusEl.textContent = "Você está logado";

    if (foto) {
      // Substitui qualquer ícone existente (ion-icon ou img) pela foto do usuário
      iconEl?.replaceWith(createProfileImage(foto));
    } else {
      // Se não tiver foto, mostra o ícone alternativo
      if (iconEl?.tagName === "ION-ICON") {
        iconEl.setAttribute("name", "happy-outline");
      } else {
        iconEl?.replaceWith(createIonIcon("happy-outline"));
      }
    }

    userDiv?.removeAttribute("data-auth-lock");
  } else {
    nomeEl.textContent = "Usuário";
    statusEl.textContent = "Faça login aqui";

    // Substitui qualquer ícone/imagem atual pelo ícone padrão
    iconEl?.replaceWith(createIonIcon("person-circle-outline"));

    userDiv?.setAttribute("data-auth-lock", "");
  }
});

// 🔧 Função auxiliar para criar uma imagem de perfil
function createProfileImage(foto) {
  const img = document.createElement("img");
  img.src = foto;
  img.alt = "Foto do usuário";
  img.style.width = "56px";
  img.style.height = "56px";
  img.style.borderRadius = "50%";
  img.style.marginRight = "10px";
  return img;
}

// 🔧 Função auxiliar para criar um ícone ion-icon
function createIonIcon(name) {
  const icon = document.createElement("ion-icon");
  icon.setAttribute("name", name);
  icon.style.fontSize = "56px";
  icon.style.marginRight = "10px";
  return icon;
}



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

// Chamar quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", ativarProtecoes);