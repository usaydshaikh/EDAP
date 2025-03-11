import getDb from '../config/db.js';

class ContactMessage {
    static async createMessage(userId = null, fullName, email, message) {
        const query = `INSERT INTO contact_messages (user_id, full_name, email, message_content) VALUES (?, ?, ?, ?)`;
        try {
            const db = await getDb();
            await db.execute(query, [userId, fullName, email, message]);
        } catch (error) {
            throw new Error('Error inserting contact message: ' + error.message);
        }
    }

    static async getAllMessages() {
        const query = `SELECT * FROM contact_messages ORDER BY created_at DESC`;
        try {
            const db = await getDb();
            const [rows] = await db.execute(query);
            return rows;
        } catch (error) {
            throw new Error('Error fetching contact messages: ' + error.message);
        }
    }

    static async getMessageById(id) {
        const query = `SELECT * FROM contact_messages WHERE id = ?`;
        try {
            const db = await getDb();
            const [rows] = await db.execute(query, [id]);
            return rows[0];
        } catch (error) {
            throw new Error('Error fetching contact message: ' + error.message);
        }
    }

    static async markAsReplied(replyContent, parent_message_id, messageId, repliedBy) {
        const query = `
            UPDATE contact_messages 
            SET status = 'Replied', 
                reply_content = ?, 
                parent_message_id = ?, 
                replied_by = ?, 
                replied_at = DATE_SUB(NOW(), INTERVAL 8 HOUR)  -- Adjust for timezone
            WHERE id = ?`;
        try {
            const db = await getDb();
            await db.execute(query, [replyContent, parent_message_id, repliedBy, messageId]);
        } catch (error) {
            throw new Error('Error updating contact message status: ' + error.message);
        }
    }

    static async deleteMessage(id) {
        const query = `DELETE FROM contact_messages WHERE id = ?`;
        try {
            const db = await getDb();
            await db.execute(query, [id]);
        } catch (error) {
            throw new Error('Error deleting contact message: ' + error.message);
        }
    }
}

export default ContactMessage;
