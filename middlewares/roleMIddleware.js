const requireDirector = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    if (req.session.role !== 2) {  // 2 is Director's role
        return res.status(403).json({ message: "Forbidden. You do not have the required permissions." });
    }

    next();  // If role is Director, continue to the next middleware or route
};

export default requireDirector;
