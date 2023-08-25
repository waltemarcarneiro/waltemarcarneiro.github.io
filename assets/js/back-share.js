   // Adicione o evento de clique ao ícone de seta à esquerda
        document.getElementById('backButton').addEventListener('click', () => {
            // Volta para a página anterior
            history.back();
        });
   // Adicione o evento de clique ao ícone de compartilhamento
        document.getElementById('shareButton').addEventListener('click', () => {
            // Compartilha a página atual
            if (navigator.share) {
                navigator.share({
                    title: document.title,
                    url: window.location.href
                }).then(() => {
                    console.log('Página compartilhada com sucesso!');
                }).catch((error) => {
                    console.error('Erro ao compartilhar a página:', error);
                });
            } else {
                console.log('Compartilhamento não suportado pelo navegador.');
                // Aqui você pode adicionar um fallback ou mensagem para navegadores que não suportam o compartilhamento nativo.
            }
        });     
