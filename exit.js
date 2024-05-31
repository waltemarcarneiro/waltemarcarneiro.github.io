// exit.js
function showExitConfirmation() {
    return confirm('Você realmente deseja sair do aplicativo?');
}

function isAtRootUrl() {
    return window.location.pathname === '/';
}

function updateNavigationState() {
    if (isAtRootUrl()) {
        localStorage.setItem('atRoot', 'true');
    } else {
        localStorage.setItem('atRoot', 'false');
    }
}

window.addEventListener('popstate', function (event) {
    updateNavigationState();
    if (localStorage.getItem('atRoot') === 'true' && !showExitConfirmation()) {
        history.pushState(null, null, location.href);
    }
});

history.pushState(null, null, location.href);
updateNavigationState();

window.addEventListener('beforeunload', function (e) {
    if (localStorage.getItem('atRoot') === 'true') {
        var confirmationMessage = 'Você realmente deseja sair do aplicativo?';
        (e || window.event).returnValue = confirmationMessage;
        return confirmationMessage;
    }
});

document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden' && localStorage.getItem('atRoot') === 'true') {
        alert('Você realmente deseja sair do aplicativo?');
    }
});

document.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
        updateNavigationState();
    });
});
