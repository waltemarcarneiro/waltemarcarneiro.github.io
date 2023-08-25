document.addEventListener("DOMContentLoaded", function () {
    const popups = document.querySelectorAll(".popup");
    const prevButtons = document.querySelectorAll(".prev-button");
    const nextButtons = document.querySelectorAll(".next-button");
    
    let currentPopupIndex = 0;

    function showPopup(index) {
        popups.forEach(popup => popup.classList.remove("show"));
        popups[index].classList.add("show");
        currentPopupIndex = index;
    }

    function prevPopup() {
        currentPopupIndex = (currentPopupIndex - 1 + popups.length) % popups.length;
        showPopup(currentPopupIndex);
    }

    function nextPopup() {
        currentPopupIndex = (currentPopupIndex + 1) % popups.length;
        showPopup(currentPopupIndex);
    }

    popups.forEach((popup, index) => {
        popup.querySelector(".close-button").addEventListener("click", () => {
            popup.classList.remove("show");
        });


        prevButtons[index].addEventListener("click", prevPopup);
        nextButtons[index].addEventListener("click", nextPopup);
    });

    showPopup(currentPopupIndex);
});

