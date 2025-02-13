import getDb from '../config/db.js';

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

export const getLoginPage = (req, res) => {
    res.status(200).render('login', {
        page_name: 'login',
    });
};

export const getDashboard = async (req, res) => {
    const limit = 10; // limit to 10 users per page
    let page = parseInt(req.query.page, 10) || 1; // get the current page (default to 1)
    const offset = (page - 1) * limit; // calculate the offset for the query

    // queries
    const getUsers = 'SELECT name FROM users LIMIT ? OFFSET ?';
    const getTotalCount = 'SELECT COUNT(*) AS count FROM users';
    try {
        const db = await getDb();

        // Fetch users for the current page
        const [users] = await db.query(getUsers, [limit, offset]);

        // Fetch total count of users for pagination
        const [[{ count }]] = await db.query(getTotalCount);

        // Calculate total pages
        const totalPages = Math.ceil(count / limit);

        // Render the page with users and pagination information
        res.status(200).render('dashboard/dashboard', {
            users,
            current: page,
            totalPages,
        });
    } catch (error) {
        res.status(500).send('Error fetching users: ' + error.message);
    }
};

export const getPageNotFound = (req, res) => {
    res.status(404).send('<h1> Page Not Found </h1>');
};
