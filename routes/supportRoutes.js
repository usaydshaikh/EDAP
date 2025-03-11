import express from 'express';
import requireDirector from '../middlewares/roleMiddleware.js';  // Import role middleware

const router = express.Router();

// Accessible by Director
router.get('/dashboard/support', requireDirector, (req, res) => {
    res.render('support', { title: "Support Page for Directors" });  // Render the page for Directors
});

export default router;

