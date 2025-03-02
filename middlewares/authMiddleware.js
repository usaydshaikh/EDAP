const isAuthenticated = (req, res, next) => {
    if (req.session.userID) {
        return next();
    } else {
        req.flash('error', 'You must be logged in to view this page.');
        return res.redirect('/login');
    }
};

export default isAuthenticated;
