            document.getElementById('pixLink').addEventListener('click', function() {

                document.getElementById('popup').style.display = 'block';
            });

            function closePopup() {
                var popup = document.getElementById('popup');
                popup.style.animation = 'slideDown 0.5s ease-out forwards';

                setTimeout(function() {
                    popup.style.display = 'none';
                    popup.style.animation = '';
                }, 500);
                // Aguarde o término da animação antes de ocultar o popup
            }

            function copyText(elementId) {
                var textToCopy = document.getElementById(elementId).innerText;

                // Cria um elemento de área de transferência temporário
                var tempInput = document.createElement('textarea');
                tempInput.value = textToCopy;
                document.body.appendChild(tempInput);

                // Seleciona o texto da área de transferência temporária
                tempInput.select();
                tempInput.setSelectionRange(0, 99999);
                /* Para dispositivos móveis */

                // Copia o texto para a área de transferência
                document.execCommand('copy');

                // Remove o elemento de área de transferência temporário
                document.body.removeChild(tempInput);

                // Exibe um popup personalizado com o SweetAlert
                Swal.fire({
                    title: elementId === 'pix' ? 'Chave copiada!' : 'Codigo Pix copiado com sucesso!',
                    text: elementId === 'pix' ? 'Use a opção CHAVE ALEATÓRIA no app do seu banco.' : 'Use a opção COPIA e COLA no app do seu banco.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    customClass: {
                        title: 'swal-title-custom',
                        content: 'swal-text-custom'
                    }
                });
            }
