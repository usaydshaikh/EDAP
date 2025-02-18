export const getIndextPage = (req, res) => {
    res.status(200).render('index', {
        page_name: 'index',
    });
};

export const getAboutPage = (req, res) => {
    res.status(200).render('about', {
        page_name: 'about',
    });
};

export const getContactPage = (req, res) => {
    res.status(200).render('contact', {
        page_name: 'contact',
    });
};

export const getServicesPage = (req, res) => {
    res.status(200).render('services', {
        page_name: 'services',
    });
};

export const getFaqPage = (req, res) => {
    res.status(200).render('faq', {
        page_name: 'faq',
    });
};

export const getLoginPage = (req, res) => {
    res.status(200).render('login', {
        page_name: 'login',
    });
};

export const getPageNotFound = (req, res) => {
    res.status(404).render('404', {
        page_name: '404',
    });
};
