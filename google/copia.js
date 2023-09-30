//copia texto
        document.addEventListener('DOMContentLoaded', function () {
            var botaoCopiar = document.getElementById('botaoCopiar');
            var textoParaCopiar = document.getElementById('textoParaCopiar');
            var imagem = new Image();
            imagem.src = 'beijo.gif';
            imagem.width = 280;
            imagem.height = 200;
            imagem.classList.add('minha-classe-css'); // Adicione uma classe CSS à imagem


            botaoCopiar.addEventListener('click', function () {
                // Seleciona o texto dentro da strong
                var texto = textoParaCopiar.textContent;

                // Cria um elemento de input temporário para copiar o texto
                var inputTemporario = document.createElement('input');
                inputTemporario.setAttribute('type', 'text');
                inputTemporario.setAttribute('value', texto);
                document.body.appendChild(inputTemporario);

                // Seleciona o texto no elemento de input temporário
                inputTemporario.select();

                // Executa o comando de cópia
                document.execCommand('copy');

                // Remove o elemento de input temporário
                document.body.removeChild(inputTemporario);

                // Atualiza o texto do botão após a cópia
                botaoCopiar.textContent = 'Senha Copiada! 🥰 Aguarde...';

                // Adiciona a imagem abaixo do texto
        botaoCopiar.insertAdjacentElement('afterend', imagem);

            });
        });