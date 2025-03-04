import moment from 'moment';
import User from '../models/usersModel.js';
import ContactMessage from '../models/contactMsgModel.js';

// Utility function for rendering pages
const renderPage = (res, page, data = {}) => {
    res.status(200).render(page, { isUserSignedIn: res.locals.isUserSignedIn, ...data });
};

// Dashboard
export const getDashboard = async (req, res, next) => {
    const userID = req.session.userID;
    try {
        const user = await User.getUserByEmployeeId(userID);
        renderPage(res, 'dashboard/dashboard', { user });
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

    const userID = req.session.userID;
    try {
        const user = await User.getUserByEmployeeId(userID); // logged in user
        const users = await User.getUsers(limit, offset); // gets all users
        const totalUsers = await User.getTotalUserCount();
        const totalPages = Math.ceil(totalUsers / limit);
        page = Math.min(page, totalPages || 1); // Ensure valid page number

        renderPage(res, 'dashboard/components/users', {
            users,
            current: page,
            totalPages,
            user,
        });
    } catch (error) {
        next(error);
    }
};

// Performance
export const getPerformance = async (req, res, next) => {
    const userID = req.session.userID;
    try {
        const user = await User.getUserByEmployeeId(userID);
        renderPage(res, 'dashboard/components/performance', { user });
    } catch (error) {
        next(error);
    }
};

// Support
export const getSupport = async (req, res, next) => {
    const userID = req.session.userID;
    try {
        const user = await User.getUserByEmployeeId(userID);
        renderPage(res, 'dashboard/components/support', { user });
    } catch (error) {
        next(error);
    }
};

// Contact Messages
export const getContactMessages = async (req, res, next) => {
    const userID = req.session.userID;
    try {
        const user = await User.getUserByEmployeeId(userID);
        let messages = (await ContactMessage.getAllMessages()) || [];

        // Format timestamps without modifying user_id
        const updatedMessages = messages.map((msg) => ({
            ...msg,
            formattedDate: moment(msg.created_at).format('YYYY-MM-DD - HH:mm:ss'),
            repliedFormattedDate: msg.replied_at
                ? moment(msg.replied_at).format('YYYY-MM-DD - HH:mm:ss')
                : null,
        }));

        // Render page
        renderPage(res, 'dashboard/components/contactMessages', {
            messages: updatedMessages,
            user,
        });
    } catch (error) {
        next(error);
    }
};

// Account
export const getAccount = async (req, res, next) => {
    try {
        const userID = req.session.userID;
        const user = await User.getUserByEmployeeId(userID);
        
        // Ensure default profile picture
        if (!user.profile_image || user.profile_image.trim() === '') {
            user.profile_image = '/profile.png';
        }

        renderPage(res, 'dashboard/components/account', { user });
    } catch (error) {
        next(error);
    }
};
