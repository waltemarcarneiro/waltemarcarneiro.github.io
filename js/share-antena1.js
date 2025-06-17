const shareIcon = document.getElementById('share-Button');
shareIcon.addEventListener('click', async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Radio Antena 1',
          text: '24h de músicas da melhor qualidade!',
          url: 'https://waltemar.com.br/pages/antena1.html'
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