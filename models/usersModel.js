import getDb from '../config/db.js';

class User {
    // Create User
    static async createUser(first_name, last_name, email, password) {
        const query =
            'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)';
        try {
            const db = await getDb();
            const [result] = await db.execute(query, [first_name, last_name, email, password]);
        } catch (error) {
            throw new Error('Error creating user: ' + error.message);
        }
    }

    // Fetch Users with Pagination
    static async getUsers(limit, offset) {
        const query =
            'SELECT employee_id, first_name, last_name, email FROM users ORDER BY employee_id DESC LIMIT ? OFFSET ?';
        try {
            const db = await getDb();
            const [users] = await db.query(query, [limit, offset]);
            return users;
        } catch (error) {
            throw new Error('Error fetching users: ' + error.message);
        }
    }

    static async getUserByEmail(email) {
        const query =
            'SELECT employee_id, first_name, last_name, email, password FROM users WHERE email = ?';
        try {
            const db = await getDb();
            const [[user]] = await db.query(query, [email]);
            return user;
        } catch (error) {
            throw new Error('Error fetching user: ' + error.message);
        }
    }

    // Get Total User Count
    static async getTotalUserCount() {
        const query = 'SELECT COUNT(*) AS count FROM users';
        try {
            const db = await getDb();
            const [[{ count }]] = await db.query(query);
            return count;
        } catch (error) {
            throw new Error('Error fetching user count: ' + error.message);
        }
    }
}

export default User;
