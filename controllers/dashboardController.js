import moment from 'moment';
import User from '../models/usersModel.js';
import ContactMessage from '../models/contactMsgModel.js';

// Utility function for rendering pages
const renderPage = (res, page, data = {}) => {
    res.status(200).render(page, { isUserSignedIn: res.locals.isUserSignedIn, ...data });
};

// Dashboard
export const getDashboard = async (req, res, next) => {
    try {
        renderPage(res, 'dashboard/dashboard');
    } catch (error) {
        next(error);
    }
};

// Users with pagination
export const getUsers = async (req, res, next) => {
    const limit = 10;
    let page = parseInt(req.query.page, 10);
    page = isNaN(page) || page < 1 ? 1 : page;
    const offset = (page - 1) * limit;

    try {
        const users = await User.getUsers(limit, offset);
        const totalUsers = await User.getTotalUserCount();
        const totalPages = Math.ceil(totalUsers / limit);
        page = Math.min(page, totalPages || 1); // Ensure valid page number

        renderPage(res, 'dashboard/components/users', {
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
        renderPage(res, 'dashboard/components/performance');
    } catch (error) {
        next(error);
    }
};

// Support
export const getSupport = async (req, res, next) => {
    try {
        renderPage(res, 'dashboard/components/support');
    } catch (error) {
        next(error);
    }
};

// Contact Messages
export const getContactMessages = async (req, res, next) => {
    try {
        const userID = req.session.userID;
        if (!userID) {
            return res.redirect('/login'); // Redirect if not signed in
        }

        const user = await User.getUserByEmployeeId(userID);
        let messages = (await ContactMessage.getAllMessages()) || [];

        // Format created_at to show only date and time
        messages = messages.map((msg) => ({
            ...msg,
            formattedDate: moment(msg.created_at).format('YYYY-MM-DD HH:mm:ss'),
        }));

        renderPage(res, 'dashboard/components/contactMessages', { messages, user });
    } catch (error) {
        next(error);
    }
};

// Account
export const getAccount = async (req, res, next) => {
    try {
        const userID = req.session.userID;
        if (!userID) {
            return res.redirect('/login');
        }

        const user = await User.getUserByEmployeeId(userID);
        renderPage(res, 'dashboard/components/account', { user });
    } catch (error) {
        next(error);
    }
};
