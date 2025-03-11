
console.log('getUsers.js is loaded');

const form = document.getElementById('userSearch');
document.addEventListener('DOMContentLoaded', function () {
    console.log('Script loaded and DOM ready');

    const form = document.getElementById('userSearch');
    const searchInput = document.getElementById('searchQuery');

    if (!form || !searchInput) {
        console.error('Form or search input not found');
        return;
    }

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        const query = searchInput.value;

        try {
            const response = await fetch(`/api/users/search?query=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            displayResults(data);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    });
});

function displayResults(users) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';
    if (users.length === 0) {
        resultsContainer.innerHTML = '<p>No users found.</p>';
        return;
    }
    const ul = document.createElement('ul');
    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = `${user.firstname} ${user.lastname} (${user.email})`;
        ul.appendChild(li);
    });
    resultsContainer.appendChild(ul);
}
