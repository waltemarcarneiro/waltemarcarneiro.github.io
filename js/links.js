document.addEventListener('contextmenu', e => e.preventDefault());

function openBancoBrasil() {
    window.location.href = "/bank/bb.html";
}

function openWhatsApp() {
    window.location.href = "https://api.whatsapp.com/send?phone=5581971027858&text=%F0%9F%98%80%20Ol%C3%A1%2C%20estou%20com%20d%C3%BAvidas!";
}

function openProfile() {
    window.location.href = "/pages/profile.html";
}

function openSuporte() {
    window.location.href = "/pages/suporte.html";
}
function openApp() {
    window.location.href = "/app/app.html";
}
function openHome() {
    // Use location.replace para evitar o aviso do Chrome ao voltar para a home
    location.replace("/index.html");
}



// telefonia

function openAppLima() {
    window.location.href = "https://applima.blogspot.com/";
}

//Garantir que o elemento já exista antes de adicionar o evento
const backButton = document.getElementById('backButton');
if (backButton) {
  backButton.addEventListener('click', () => {
    history.back();
  });
}

