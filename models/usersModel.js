import db from '../config/db.js';

class User {
    static async createUser(name, email, password) {
        const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        try {
            const [result] = await db.execute(query, [name, email, password]);
            return result.insertId;
        } catch (error) {
            throw new Error('Error creating user: ' + error.message);
        }
    }
}

module.exports = User;
