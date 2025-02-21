export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Check if response headers are already sent
    if (res.headersSent) {
        return next(err);
    }

    res.status(500).render('error', {
        message: 'An unexpected error occurred.',
        error: process.env.NODE_ENV === 'development' ? err : {},
    });
};
