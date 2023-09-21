// Adicione o evento de clique ao ícone de seta à esquerda
        document.getElementById('backButton').addEventListener('click', () => {
            // Volta para a página anterior
            history.back();
        });
  const shareIcon = document.getElementById('share-Button');

  shareIcon.addEventListener('click', async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Downloads Premium',
          text: 'Baixe os melhores apps na versão premium',
          url: 'https://waltemarcarneiro.github.io/downloads/downloads.html'
        });
        console.log('Conteúdo compartilhado com sucesso!');
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
      }
    } else {
      console.log('A API de compartilhamento não é suportada neste navegador.');
      // Aqui você pode exibir um modal ou mensagem alternativa de compartilhamento
    }
  });

        // Adicione o evento de clique ao botão de fechamento do aviso
        document.getElementById('closeButton').addEventListener('click', () => {
            // Fecha o aviso
            document.getElementById('alertBox').style.display = 'none';
        });

        // Exibe o aviso ao carregar a página
        document.getElementById('alertBox').style.display = 'block';