const menuIcon = document.getElementById('menu-icon');
const dropdownMenu = document.getElementById('dropdown-menu');

menuIcon.addEventListener('click', () => {
  if (dropdownMenu.style.display === 'block') {
    dropdownMenu.style.display = 'none';
  } else {
    dropdownMenu.style.display = 'block';
  }
  //menu.classList.toggle('show');
  dropdownMenu.classList.toggle('show');
});

// Fechar o menu quando um link for clicado
const menuLinks = dropdownMenu.querySelectorAll('a');
menuLinks.forEach(link => {
  link.addEventListener('click', () => {
    dropdownMenu.style.display = 'none';
  });
});

// Fechar o menu se clicar fora dele
document.addEventListener('click', event => {
  if (!menuIcon.contains(event.target) && !dropdownMenu.contains(event.target)) {
    dropdownMenu.style.display = 'none';
  }
});

// Fechar o menu ao clicar no ícone "Fechar Menu"
const closeMenuLink = document.querySelector('.close-menu a');
closeMenuLink.addEventListener('click', () => {
  dropdownMenu.style.display = 'none';
});

// Fecha a páginga no navegador
document.getElementById("sair").addEventListener("click", function() {
  // Fecha a página (pode não funcionar em todos os navegadores)
  window.close();
});
