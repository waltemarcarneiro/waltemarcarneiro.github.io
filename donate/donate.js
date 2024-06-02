document.addEventListener('DOMContentLoaded', function() {
    var pixLink = document.getElementById('pixLink');
    var popup = document.getElementById('popup');

    if (pixLink && popup) {
        pixLink.addEventListener('click', function() {
            popup.style.display = 'block';
        });
    }

    function closePopup() {
        if (popup) {
            popup.style.animation = 'slideDown 0.5s ease-out forwards';

            setTimeout(function() {
                popup.style.display = 'none';
                popup.style.animation = '';
            }, 500);
        }
    }

    function copyText(elementId) {
        var textToCopy = document.getElementById(elementId).innerText;

        if (navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy).then(function() {
                showCopySuccessPopup(elementId);
            }, function() {
                fallbackCopyText(elementId, textToCopy);
            });
        } else {
            fallbackCopyText(elementId, textToCopy);
        }
    }

    function fallbackCopyText(elementId, textToCopy) {
        var tempInput = document.createElement('textarea');
        tempInput.value = textToCopy;
        document.body.appendChild(tempInput);

        tempInput.select();
        tempInput.setSelectionRange(0, 99999); // Para dispositivos móveis

        document.execCommand('copy');
        document.body.removeChild(tempInput);

        showCopySuccessPopup(elementId);
    }

    function showCopySuccessPopup(elementId) {
        Swal.fire({
            title: elementId === 'pix' ? 'Chave copiada!' : 'Código Pix copiado com sucesso!',
            text: elementId === 'pix' ? 'Use a opção CHAVE ALEATÓRIA no app do seu banco.' : 'Use a opção COPIA e COLA no app do seu banco.',
            icon: 'success',
            confirmButtonText: 'OK',
            customClass: {
                title: 'swal-title-custom',
                content: 'swal-text-custom'
            }
        });
    }
});
