import getDb from '../config/db.js';

class User {
    static async createUser(first_name, last_name, email, password) {
        const query =
            'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)';
        try {
            const db = await getDb();
            await db.execute(query, [first_name, last_name, email, password]);
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

    static async getUserByEmployeeId(id) {
        const query =
            'SELECT employee_id, first_name, last_name, email, password FROM users WHERE employee_id = ?';
        try {
            const db = await getDb();
            const [[user]] = await db.query(query, [id]);
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

    static async storeResetToken(employee_id, token, expiry) {
        const query =
            'UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE employee_id = ?';
        try {
            const db = await getDb();

            // Convert expiry time to UTC format (ISO 8601)
            const expiryUTC = new Date(expiry).toISOString().slice(0, 19).replace('T', ' ');

            await db.execute(query, [token, expiryUTC, employee_id]);
        } catch (error) {
            throw new Error('Error storing reset token: ' + error.message);
        }
    }

    static async getUserByResetToken(token) {
        const query = `SELECT employee_id FROM users WHERE reset_password_token = ? AND reset_password_expires > CONVERT_TZ(NOW(), '+00:00', 'SYSTEM')`;

        try {
            if (!token || typeof token !== 'string') {
                throw new Error('Token is required / invalid token format');
            }
            const db = await getDb();
            const [[user]] = await db.query(query, [token]);
            return user || null;
        } catch (error) {
            console.error('Error fetching user by reset token:', error.message);
            throw new Error('Error fetching user by reset token: ' + error.message);
        }
    }

    static async updatePassword(employee_id, password) {
        const query =
            'UPDATE users SET password = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE employee_id = ?';
        try {
            const db = await getDb();
            await db.execute(query, [password, employee_id]);
        } catch (error) {
            throw new Error('Error updating password: ' + error.message);
        }
    }
}

export default User;
