import getDb from '../config/db.js';

class User {
    // Register new user
    static async createUser(first_name,last_name,email,password,confirmation_token,token_expires_at) {
        const query =
            'INSERT INTO users (first_name, last_name, email, password, confirmation_token, token_expires_at) VALUES (?, ?, ?, ?, ?, ?)';
        try {
            const db = await getDb();
            await db.execute(query, [
                first_name,
                last_name,
                email,
                password,
                confirmation_token,
                token_expires_at,
            ]);
        } catch (error) {
            throw new Error('Error creating user: ' + error.message);
        }
    }

    // Get user by confirmation token
    static async getUserByConfirmationToken(token) {
        const query = `SELECT * FROM users WHERE confirmation_token = ? AND token_expires_at > CONVERT_TZ(NOW(), '+00:00', 'SYSTEM')`;
        const db = await getDb();
        const [users] = await db.execute(query, [token]);
        return users.length ? users[0] : null;
    }

    // Activate user account
    static async activateUser(userId) {
        const query = `UPDATE users SET is_active = 1, confirmation_token = NULL, token_expires_at = NULL WHERE employee_id = ?`;
        const db = await getDb();
        return db.execute(query, [userId]);
    }

    static async updateUser(employee_id, first_name, last_name, role_id, profile_image) {
        const query =
            'UPDATE users SET first_name = ?, last_name = ?, role_id = ?, profile_image = ? WHERE employee_id = ?';
        try {
            const db = await getDb();
            await db.execute(query, [first_name, last_name, role_id, profile_image, employee_id]);
        } catch (error) {
            throw new Error('Error updating user: ' + error.message);
        }
    }

    static async deleteUser(employee_id) {
        const query = 'DELETE FROM users WHERE employee_id = ?';
        try {
            const db = await getDb();
            await db.execute(query, [employee_id]);
        } catch (error) {
            throw new Error('Error deleting user: ' + error.message);
        }
    }

    // Fetch all Users with Pagination
    static async getUsers(limit, offset) {
        const query = `
            SELECT employee_id, first_name, last_name, email, role_id 
            FROM users
            ORDER BY employee_id DESC 
            LIMIT ? OFFSET ?`;

        try {
            const db = await getDb();
            const [users] = await db.query(query, [limit, offset]);
            return users;
        } catch (error) {
            throw new Error('Error fetching users: ' + error.message);
        }
    }

    // Get selected user
    static async getUserByEmail(email) {
        const query = `
            SELECT employee_id, first_name, last_name, email, profile_image, password, is_active 
            FROM users 
            WHERE email = ?`;
        try {
            const db = await getDb();
            const [[user]] = await db.query(query, [email]);
            return user;
        } catch (error) {
            throw new Error('Error fetching user: ' + error.message);
        }
    }

    static async getUserRoleAndPermissions(employee_id) {
        const query = `
            SELECT r.name AS role, 
                GROUP_CONCAT(rp.permission_code) AS permissions 
            FROM users u 
            JOIN roles r ON u.role_id = r.id 
            LEFT JOIN role_permissions rp ON r.id = rp.role_id 
            WHERE u.employee_id = ? 
            GROUP BY u.employee_id;
        `;
        try {
            const db = await getDb();
            const [[result]] = await db.query(query, [employee_id]);
            return result || null;
        } catch (error) {
            throw new Error('Error fetching role and permissions: ' + error.message);
        }
    }

    //
    static async getUserByEmployeeId(employee_id) {
        const query =
            'SELECT employee_id, first_name, last_name, email, password, profile_image, role_id FROM users WHERE employee_id = ?';
        try {
            const db = await getDb();
            const [[user]] = await db.query(query, [employee_id]);
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
