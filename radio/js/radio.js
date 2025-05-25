document.addEventListener("DOMContentLoaded", function () {
    const audio = document.getElementById("audio");
    const playPauseBtn = document.getElementById("playPauseBtn");
    const playIcon = "play";
    const pauseIcon = "pause";

    playPauseBtn.addEventListener("click", function () {
        if (audio.paused) {
            audio.play();
            playPauseBtn.innerHTML = `<ion-icon name="${pauseIcon}"></ion-icon>`;
        } else {
            audio.pause();
            playPauseBtn.innerHTML = `<ion-icon name="${playIcon}"></ion-icon>`;
        }
    });
});
    //evento de compartilhamento        
    function sharePage() {
        if (navigator.share) {
            navigator.share({
                title: 'https://waltemar.com.br/radio/',
                text: '💜 A trilha sonora do amor! com 🎶 músicas internacionais dos anos 80 e 90. Curta, Compartilhe e Viva esse Clima 🥰 Romântico.',
                url: window.location.href
            }).then(() => {
                console.log('Página compartilhada com sucesso!');
            }).catch((error) => {
                console.error('Erro ao compartilhar a página:', error);
            });
        } else {
            alert('Compartilhamento não suportado neste navegador.');
        }
    }

//evento de links
function backOptions() {
    window.location.href = "../home.html#options";
}

// Funções para controlar a seção About
function viewAbout() {
    const aboutSection = document.getElementById('aboutSection');
    aboutSection.style.display = 'block';
    // Adiciona animação de fade
    setTimeout(() => {
        aboutSection.style.opacity = '1';
    }, 10);
}

function closeAbout() {
    const aboutSection = document.getElementById('aboutSection');
    aboutSection.style.opacity = '0';
    setTimeout(() => {
        aboutSection.style.display = 'none';
    }, 300);
}

const PIX_CODE = "00020126580014br.gov.bcb.pix013616f06530-c133-47f2-b4d4-452e580401fb5204000053039865802BR5922WALTEMAR LIMA CARNEIRO6006MANAUS62580520SAN2023012101152512450300017br.gov.bcb.brcode01051.0.063049962";

document.getElementById('donateBtn').addEventListener('click', function() {
    copyPIX();
    showDonateModal();
});

function copyPIX() {
    navigator.clipboard.writeText(PIX_CODE).then(() => {
        console.log('Código PIX copiado!');
    }).catch(err => {
        console.error('Erro ao copiar:', err);
    });
}

function showDonateModal() {
    const modal = document.getElementById('donateModal');
    modal.style.display = 'block';
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

function closeDonate() {
    const modal = document.getElementById('donateModal');
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}
