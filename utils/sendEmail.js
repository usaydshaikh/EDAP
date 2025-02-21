import nodemailer from 'nodemailer';

const sendEmail = async (to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Use Gmail's service
            auth: {
                user: process.env.EMAIL, // Your Gmail address
                pass: process.env.EMAIL_PASSWORD, // Your App Password (16-character)
            },
        });

        const info = await transporter.sendMail({
            from: `"EDAP" <${process.env.EMAIL}>`, // Sender address
            to: to, // Recipient email
            subject: subject, // Subject line
            html: text, // HTML body
        });

        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

export default sendEmail;
