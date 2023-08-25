document.addEventListener("DOMContentLoaded", function () {
    const preloader = document.getElementById("preloader");

    // Adiciona evento de clique aos links de navegação
    const navigationLinks = document.querySelectorAll("nav a");
    navigationLinks.forEach((link) => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            preloader.style.display = "block";

            // Aguarda um curto período de tempo (simulando o carregamento)
            setTimeout(function () {
                window.location.href = link.getAttribute("href");
            }, 2000); // 1 segundos de espera, para que a animação seja mais visível
        });
    });
    
    // Remover a div do preloader após o carregamento da página
    window.addEventListener("load", function () {
        preloader.style.display = "none";
    });
});
