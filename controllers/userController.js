import db from '../config/db.js';


export async function searchUsers(req, res) {
  const query = req.query.query || '';
  const limit = 10;
  const page = parseInt(req.query.page) || 1; 
  const offset = (page - 1) * limit; 
  
  try {

    const [users] = await db.execute(
      `SELECT * FROM users 
       WHERE LOWER(name) LIKE ? OR LOWER(email) LIKE ? 
       LIMIT ? OFFSET ?`,
      [`%${query.toLowerCase()}%`, `%${query.toLowerCase()}%`, limit, offset]
    );
    const [totalCount] = await db.execute(
      `SELECT COUNT(*) AS count 
       FROM users 
       WHERE LOWER(name) LIKE ? OR LOWER(email) LIKE ?`,
      [`%${query.toLowerCase()}%`, `%${query.toLowerCase()}%`]
    );

    //console.log('Search endpoint hit with query:', req.query.query);
    const totalPages = Math.ceil(totalCount[0].count / limit); 


    res.render('users', {
      users,           
      currentPage: page, 
      totalPages,      
      query,        
    });


  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).send('Server error');
  }
};
