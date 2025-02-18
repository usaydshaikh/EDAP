import User from '../models/usersModel.js';

export const getDashboard = async (req, res) => {
    try {
        // get the loggedin user Id from the session and send the dashboard page
        const isUserSignedIn = req.session.userID;

        res.status(200).render('dashboard/dashboard', {
            isUserSignedIn,
        });
    } catch (error) {
        res.status(500).send('Error getting dashboard page: ' + error.message);
    }
};

export const getUsers = async (req, res) => {
    const limit = 10;
    let page = parseInt(req.query.page, 10) || 1;
    const offset = (page - 1) * limit;

    try {
        // get the loggedin user Id from the session and send the dashboard page
        const isUserSignedIn = req.session.userID;
        const users = await User.getUsers(limit, offset);
        const totalUsers = await User.getTotalUserCount();
        const totalPages = Math.ceil(totalUsers / limit);

        res.status(200).render('dashboard/components/users', {
            isUserSignedIn,
            users,
            current: page,
            totalPages,
        });
    } catch (error) {
        res.status(500).send('Error fetching users: ' + error.message);
    }
};

export const getPerformance = async (req, res) => {
    try {
        // get the loggedin user Id from the session and send the performance page
        const isUserSignedIn = req.session.userID;

        res.status(200).render('dashboard/components/performance', {
            isUserSignedIn,
        });
    } catch (error) {
        res.status(500).send('Error getting performance page: ' + error.message);
    }
};

export const getSupport = async (req, res) => {
    try {
        // get the loggedin user Id from the session and send the support page
        const isUserSignedIn = req.session.userID;

        res.status(200).render('dashboard/components/support', {
            isUserSignedIn,
        });
    } catch (error) {
        res.status(500).send('Error getting support page: ' + error.message);
    }
};

export const getAccount = async (req, res) => {
    try {
        // get the loggedin user Id from the session and send the account page
        const isUserSignedIn = req.session.userID;

        res.status(200).render('dashboard/components/account', {
            isUserSignedIn,
        });
    } catch (error) {
        res.status(500).send('Error getting account page: ' + error.message);
    }
};
