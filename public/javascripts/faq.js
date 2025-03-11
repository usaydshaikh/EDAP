function search() {
    const searchInput = document.getElementById('search').value.trim().toLowerCase();
    const faqs = document.querySelectorAll('.accordion-item');
    const noresults = document.getElementById('noresults');
    let hasResults = false;

    faqs.forEach((faq) => {
        const question = faq.querySelector('.accordion-button')?.textContent.toLowerCase() || '';
        const answer = faq.querySelector('.accordion-body')?.textContent.toLowerCase() || '';
        if (question.includes(searchInput) || answer.includes(searchInput)) {
            faq.style.display = '';
            hasResults = true;
        } else {
            faq.style.display = 'none';
        }
    });

    let noResultsMsg = document.getElementById('noResultsMsg');
    if (!hasResults) {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('h1');
            noResultsMsg.id = 'noResultsMsg';
            noResultsMsg.style.color = 'gray';
            noResultsMsg.textContent = 'No Results Found.';
            noresults.appendChild(noResultsMsg);
        }
    } else if (noResultsMsg) {
        noResultsMsg.remove();
    }
}
