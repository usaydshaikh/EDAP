export const getIndexPage = (req, res) => {
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
export const getForgotPasswordPage = (req, res) => {
    res.status(200).render('forgot-password', {
        page_name: 'forgot-password',
    });
};
export const getResetPasswordPage = (req, res) => {
    const token = req.params.token;
    res.status(200).render('reset-password', {
        page_name: 'reset-password',
        token,
    });
};
