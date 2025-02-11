// public/app.js
document.addEventListener('DOMContentLoaded', function () {
    // Function to show a section and hide all others
    window.showSection = function (sectionId) {
        const sections = document.querySelectorAll('section');
        sections.forEach((section) => section.classList.add('d-none'));
        const target = document.getElementById(sectionId);
        if (target) {
            target.classList.remove('d-none');
        }
    };

    // Initially show the Home section
    showSection('homeSection');

    // Function to hide the auth modal
    window.hideModal = function () {
        const modalElement = document.getElementById('authModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        }
    };

    // Update the authentication area in the navbar based on login status
    function updateAuthNav() {
        const authNav = document.getElementById('authNav');
        authNav.innerHTML = '';
        if (localStorage.getItem('loggedIn') === 'true') {
            // User is logged in; show Profile and Logout buttons
            const userName = localStorage.getItem('userName') || 'User';
            authNav.innerHTML = `
        <a class="btn btn-outline-light me-2" href="#" onclick="showSection('profileSection'); updateProfileName();">Profile</a>
        <button class="btn btn-outline-danger" onclick="logout()">Logout</button>
      `;
            updateProfileName();
        } else {
            // User is not logged in; show Login/Register button
            authNav.innerHTML = `<button class="btn btn-outline-light" data-bs-toggle="modal" data-bs-target="#authModal">Login/Register</button>`;
        }
    }

    // Update the Profile section with the stored user name
    window.updateProfileName = function () {
        const profileUserName = document.getElementById('profileUserName');
        if (profileUserName) {
            profileUserName.innerText = localStorage.getItem('userName') || 'User';
        }
    };

    // Logout: clear login data and update UI
    window.logout = function () {
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('userName');
        updateAuthNav();
        showSection('homeSection');
    };

    // Handle Login form submission (only accept admin@maxxenergy.com / password)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            if (email === 'admin@maxxenergy.com' && password === 'password') {
                localStorage.setItem('loggedIn', 'true');
                localStorage.setItem('userName', email);
                alert("Success, you're logged in!");
                updateAuthNav();
                showSection('profileSection');
                hideModal();
            } else {
                alert('Invalid credentials. Please try again.');
            }
        });
    }

    // Handle Register form submission (demo only)
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('Registration functionality is not implemented yet.');
        });
    }

    // Handle Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            alert("Contact form submitted. We'll get back to you soon!");
        });
    }

    // Handle Password Reset form submission
    const passwordResetForm = document.getElementById('passwordResetForm');
    if (passwordResetForm) {
        passwordResetForm.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('Password reset link sent to your email.');
        });
    }

    // SEARCH FUNCTION: searches through all defined sections for matching text
    window.performSearch = function () {
        const query = document.getElementById('searchInput').value.toLowerCase();
        const resultsDiv = document.getElementById('searchResults');
        resultsDiv.innerHTML = '';
        let found = false;
        // Array of sections to search (id and title)
        const sectionsToSearch = [
            { id: 'homeSection', title: 'Home' },
            { id: 'serviceSection', title: 'Service' },
            { id: 'aboutSection', title: 'About' },
            { id: 'contactSection', title: 'Contact' },
            { id: 'profileSection', title: 'Profile' },
            { id: 'passwordResetSection', title: 'Password Reset' },
        ];
        sectionsToSearch.forEach((section) => {
            const element = document.getElementById(section.id);
            if (element && element.innerText.toLowerCase().includes(query)) {
                resultsDiv.innerHTML += `<p>Match found in <strong>${section.title}</strong> section.</p>`;
                found = true;
            }
        });
        if (!found) {
            resultsDiv.innerHTML = `<p>No matches found for "<strong>${query}</strong>".</p>`;
        }
        showSection('searchSection');
    };

    // On page load, update the auth area based on login status
    updateAuthNav();
});
