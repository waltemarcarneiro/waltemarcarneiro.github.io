//SEGUNRANÇA DO USUÁRIO COM FIREBASE

import { auth } from "/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// === PROTEÇÃO GLOBAL DE PÁGINAS ===
const paginasProtegidas = [
  "/pages/profile.html",
  // adicione aqui todas as páginas que precisam estar protegidas
];

const estaPaginaProtegida = paginasProtegidas.includes(location.pathname);

onAuthStateChanged(auth, user => {
  if (estaPaginaProtegida && (!user || !user.emailVerified)) {
    location.href = "/index.html"; // ou redirecione para o login, se quiser
  }
});
//END



import { auth } from "/firebase-config.js";
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

// === LOGIN COM GOOGLE ===
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

// === CRIAR CONTA COM EMAIL/SENHA ===
window.criarConta = async (email, senha, nome) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    await sendEmailVerification(userCredential.user);
    mostrarMensagem("Verifique seu email para ativar a conta.");
  } catch (error) {
    mostrarMensagem(error.message);
  }
};

// === LOGIN COM EMAIL/SENHA ===
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

// === RECUPERAÇÃO DE SENHA ===
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

// === LOGOUT ===
window.deslogar = async () => {
  try {
    await signOut(auth);
    mostrarMensagem("Você saiu da conta.");
  } catch (error) {
    mostrarMensagem(error.message);
  }
};

// === QUALQUER ELEMENTO LOCK ===
function protegerElementosLock() {
  document.querySelectorAll('[lock]').forEach(el => {
    // Clona o conteúdo original do onclick (se houver)
    const inlineClick = el.getAttribute('onclick');

    // Remove o atributo padrão para evitar execução dupla
    if (inlineClick) el.removeAttribute('onclick');

    // Adiciona o listener manualmente para controlar
    el.addEventListener('click', e => {
      if (!auth.currentUser || !auth.currentUser.emailVerified) {
        e.preventDefault?.();
        e.stopImmediatePropagation?.();
        abrirModalAcesso();
      } else {
        if (inlineClick) {
          // Executa o código original do onclick
          new Function(inlineClick).call(el, e);
        }
      }
    });
  });
}

// === MONITORAMENTO DE ESTADO DE LOGIN ===
onAuthStateChanged(auth, user => {
  protegerElementosLock(); // aplica proteção sempre que o estado muda

  const nomeEl = document.querySelector(".user-name");
  const statusEl = document.querySelector(".user-status");
  const userDiv = document.getElementById("user");

  let iconEl = userDiv?.querySelector("ion-icon, img");

  if (user) {
    const nome = user.displayName || "Usuário Logado";
    const foto = user.photoURL;

    nomeEl.textContent = nome;
    statusEl.textContent = "Você está logado";

    if (foto) {
      iconEl?.replaceWith(createProfileImage(foto));
    } else {
      if (iconEl?.tagName === "ION-ICON") {
        iconEl.setAttribute("name", "happy-outline");
      } else {
        iconEl?.replaceWith(createIonIcon("happy-outline"));
      }
    }

    userDiv?.removeAttribute("lock");
  } else {
    nomeEl.textContent = "Usuário";
    statusEl.textContent = "Faça login aqui";

    iconEl?.replaceWith(createProfileImage("./image/person-circle-outline.svg"));

    userDiv?.setAttribute("lock", "");
  }
});

// === CRIA IMG DE PERFIL DO USUÁRIO ===
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

// === CRIA ÍCONE ION-ICON ===
function createIonIcon(name) {
  const icon = document.createElement("ion-icon");
  icon.setAttribute("name", name);
  icon.style.fontSize = "56px";
  icon.style.marginRight = "10px";
  return icon;
}

// === MENSAGEM DE ERRO/SUCESSO ===
function mostrarMensagem(msg) {
  const el = document.getElementById("auth-message");
  if (!el) return;
  el.textContent = msg;
  el.style.display = "block";
  setTimeout(() => el.style.display = "none", 5000);
}

// === CARREGA O MODAL DE LOGIN E DEFINE AS FUNÇÕES ===
fetch('/components/modals/modalLogin.html')
  .then(res => res.text())
  .then(html => {
    document.body.insertAdjacentHTML('beforeend', html);

    window.abrirModalAcesso = () => {
      document.getElementById("modalAcesso").style.display = "flex";
    };

    window.fecharModalAcesso = () => {
      document.getElementById("modalAcesso").style.display = "none";
    };

    window.alternarAba = (aba) => {
      document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));

      document.querySelector(`[data-tab="${aba}"]`).classList.add("active");
      document.getElementById(`${aba}-tab`).classList.add("active");
    };

    // Clique no avatar do usuário abre o modal (se bloqueado)
    const trigger = document.querySelector('#user[lock]');
    if (trigger) {
      trigger.addEventListener('click', () => {
        abrirModalAcesso();
      });
    }
  });

// Deixe global para funcionar mesmo com onclick no HTML
window.toggleSenha = function(icon) {
   const container = icon.closest('.senha-container');
   const input = container.querySelector('input');
   const mostrando = input.type === "text";

   input.type = mostrando ? "password" : "text";
   icon.src = mostrando ? "image/eye-off.svg" : "image/eye.svg";
}