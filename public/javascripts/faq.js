function search() {
    const searchIn = document.getElementById('search').value.toLowerCase();
    const faqs = document.querySelectorAll('.accordion-item');
    let hasResults = false;

    faqs.forEach((faq) => {
        const q = faq.querySelector('.accordion-button');
        const a = faq.querySelector('.accordion-body');

        if (q && a) {
            const question = q.textContent.toLowerCase();
            const answer = a.textContent.toLowerCase();

            if (question.includes(searchIn) || answer.includes(searchIn)) {
                faq.style.display = 'block';
                hasResults = true;
            } else {
                faq.style.display = 'none';
            }
        }
    });

    let noResultsMsg = document.getElementById('noResultsMsg');
    if (!hasResults) {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('h1');
            noResultsMsg.id = 'noResultsMsg';
            noResultsMsg.style.color = 'gray';
            noResultsMsg.textContent = 'No Results Found.';
            document.body.appendChild(noResultsMsg); // Append to an appropriate container
        }
    } else if (noResultsMsg) {
        noResultsMsg.remove();
    }
}
