import User from '../models/usersModel.js';

// Utility function for rendering pages with user session status
const renderPage = (res, page, isUserSignedIn, data = {}) => {
    res.status(200).render(page, { isUserSignedIn, ...data });
};

// Dashboard
export const getDashboard = async (req, res, next) => {
    try {
        const isUserSignedIn = Boolean(req.session.userID);
        renderPage(res, 'dashboard/dashboard', isUserSignedIn);
    } catch (error) {
        next(error);
    }
};

// Users with pagination
export const getUsers = async (req, res, next) => {
    const limit = 10;
    let page = parseInt(req.query.page, 10);
    page = isNaN(page) || page < 1 ? 1 : page; // Ensure page is a valid number

    const offset = (page - 1) * limit;

    try {
        const isUserSignedIn = Boolean(req.session.userID);
        const users = await User.getUsers(limit, offset);
        const totalUsers = await User.getTotalUserCount();
        const totalPages = Math.ceil(totalUsers / limit);

        renderPage(res, 'dashboard/components/users', isUserSignedIn, {
            users,
            current: page,
            totalPages,
        });
    } catch (error) {
        next(error);
    }
};

// Performance
export const getPerformance = async (req, res, next) => {
    try {
        const isUserSignedIn = Boolean(req.session.userID);
        renderPage(res, 'dashboard/components/performance', isUserSignedIn);
    } catch (error) {
        next(error);
    }
};

// Support
export const getSupport = async (req, res, next) => {
    try {
        const isUserSignedIn = Boolean(req.session.userID);
        renderPage(res, 'dashboard/components/support', isUserSignedIn);
    } catch (error) {
        next(error);
    }
};

// Account
export const getAccount = async (req, res, next) => {
    try {
        const user = await User.getUserByEmployeeId(req.session.userID);
        const isUserSignedIn = Boolean(req.session.userID);
        renderPage(res, 'dashboard/components/account', isUserSignedIn, { user });
    } catch (error) {
        next(error);
    }
};
