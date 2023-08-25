document.addEventListener('DOMContentLoaded', () => {
    const openButton = document.getElementById('open-button');
    const popupOverlay = document.getElementById('popup-overlay');
    const popup = document.getElementById('popup');
    const closeButton = document.getElementById('close-button');

    closeButton.addEventListener('click', () => {
        popupOverlay.style.display = 'none'; // Esconde o popup
    });

    popupOverlay.addEventListener('click', (event) => {
        if (event.target === popupOverlay) {
            popupOverlay.style.display = 'none';

        }
    });
    

    //for set timerout
    function showPopup() {
        popup.style.display = "flex";
        closeButton.style.display = "block";
    }

    function closePopup() {
        popup.style.display = "none";
        closeButton.style.display = "none";
    }

    setTimeout(showPopup, 60000);

    window.addEventListener("click", function(event) {
        if (event.target === popup) {
            closePopup();
        }
    });


    


});