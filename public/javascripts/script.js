setTimeout(function() {
    const alert = document.querySelector('.alert');
    if (alert) {
        alert.style.transition = 'opacity 0.5s ease-out';
        alert.style.opacity = '0';
        setTimeout(() => {
            alert.remove(); // Removes the element from the DOM
        }, 500); // Wait for the fade-out animation to complete
    }
}, 2000); // Timeout after 10 seconds