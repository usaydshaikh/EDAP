export const getIndextPage = (req, res) => {
    res.status(200).render('index');
};

export const getAboutPage = (req, res) => {
    res.status(200).render('about');
};

export const getContactPage = (req, res) => {
    res.status(200).render('contact');
};


export const getPageNotFound = (req, res) => {
    res.status(404).send('<h1> Page Not Found </h1>');
};
