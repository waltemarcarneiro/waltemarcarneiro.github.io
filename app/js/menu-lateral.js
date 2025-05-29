const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebarMenu');

  menuToggle.addEventListener('click', (e) => {
    e.preventDefault();
    sidebar.classList.toggle('hidden');
  });

   // Fechar o menu ao clicar em qualquer link dentro do sidebar
  const sidebarLinks = sidebar.querySelectorAll('a');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      sidebar.classList.toggle('hidden');
    });
  });