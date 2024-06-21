document.addEventListener("DOMContentLoaded", function() {
    var loginButton = document.getElementById("loginButton");
    var passwordInput = document.getElementById("passwordInput");
    var recoverPasswordLink = document.getElementById("recoverPasswordLink");

    if (loginButton) {
        loginButton.addEventListener("click", function() {
            performLogin();
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener("keyup", function(event) {
            if (event.keyCode === 13) {
                performLogin();
            }
        });
    }

    if (recoverPasswordLink) {
        recoverPasswordLink.addEventListener("click", function(event) {
            event.preventDefault();
            openRecoverPopup();
        });
    }

    function performLogin() {
        var enteredUsername = document.getElementById("usernameInput").value;
        var enteredPassword = document.getElementById("passwordInput").value;

        var encodedUsername = "U2hlZXA=";
        var encodedPassword = "cmVjaWZl";

        if (btoa(enteredUsername) === encodedUsername && btoa(enteredPassword) === encodedPassword) {
            window.location.href = "../bank/sofisa.html";
        } else {
            openErrorPopup();
        }
    }

    function openErrorPopup() {
        var errorPopup = document.getElementById("errorPopup");
        if (errorPopup) {
            errorPopup.style.display = "flex";
            errorPopup.querySelector(".close-button").addEventListener("click", closeErrorPopup);
            setTimeout(closeErrorPopup, 5000);
            clearInputs();
            removeFocus();
        }
    }

    function closeErrorPopup() {
        var errorPopup = document.getElementById("errorPopup");
        if (errorPopup) {
            errorPopup.style.display = "none";
        }
    }

    function openRecoverPopup() {
        var recoverPopup = document.getElementById("recoverPopup");
        if (recoverPopup) {
            recoverPopup.style.display = "flex";
            recoverPopup.querySelector(".close-button").addEventListener("click", closeRecoverPopup);
            removeFocus();
        }
    }

    function closeRecoverPopup() {
        var recoverPopup = document.getElementById("recoverPopup");
        if (recoverPopup) {
            recoverPopup.style.display = "none";
        }
    }

    window.onclick = function(event) {
        var recoverPopup = document.getElementById("recoverPopup");
        if (event.target == recoverPopup) {
            closeRecoverPopup();
        }
    };

    document.onkeyup = function(event) {
        if (event.key === "Enter") {
            closeRecoverPopup();
        }
    };

    document.onkeydown = function(event) {
        if (event.key === "Escape") {
            closeRecoverPopup();
        }
    };

    function clearInputs() {
        var usernameInput = document.getElementById("usernameInput");
        var passwordInput = document.getElementById("passwordInput");
        if (usernameInput) {
            usernameInput.value = "";
        }
        if (passwordInput) {
            passwordInput.value = "";
        }
    }

    function removeFocus() {
        var tempInput = document.createElement("input");
        document.body.appendChild(tempInput);
        tempInput.focus();
        document.body.removeChild(tempInput);
    }
});
