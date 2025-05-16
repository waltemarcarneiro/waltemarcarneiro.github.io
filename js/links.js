document.addEventListener('contextmenu', e => e.preventDefault());

function abrirPix() {
    window.location.href = "bank/santander.html";
}


function abrirWhatsApp() {
    window.location.href = "https://api.whatsapp.com/send?phone=5581971027858&text=%F0%9F%98%80%20Ol%C3%A1%2C%20estou%20com%20d%C3%BAvidas!";
}

function abrirLogin() {
    window.location.href = "./login/login.html";
}
function abrirProfile() {
    window.location.href = "./pages/profile.html";
}

function abrirSuporte() {
    window.location.href = "./pages/suporte.html";
}

function fecharPWA() {
 window.close();
}
