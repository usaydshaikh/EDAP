
// flash message timout
setTimeout(function () {
    const alert = document.querySelector('.alert');
    if (alert) {
        alert.classList.remove('show');
    }
}, 2000); // Timeout after 10 seconds
