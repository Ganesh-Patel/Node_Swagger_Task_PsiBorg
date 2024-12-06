import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

async function sendEmail(email,firstname) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        let mailOptions;

        // Send Signup Successful email
        mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Signup Successful for Task Management App',
            text: `Hello ${firstname},

Congratulations! You have successfully signed up for the Task Management App.

You can now start managing your tasks and stay organized.

If you did not sign up for this account, please contact us at support@myapp.com to report any issues.

Best regards,
Ganesh Patel
Admin, Task Management App
If you have any questions, feel free to reach out to us at support@myapp.com.`,
            html: `
            <p>Hello ${firstname},</p>
            <p>Congratulations! You have successfully signed up for the Task Management App.</p>
            <p>You can now start managing your tasks and stay organized.</p>
            <p>If you did not sign up for this account, please contact us at <a href="mailto:support@myapp.com">support@myapp.com</a> to report any issues.</p>
            <br/>
            <p>Best regards,</p>
            <p>Ganesh Patel</p>
            <p>Admin, Task Management App</p>
            <p>If you have any questions, feel free to reach out to us at <a href="mailto:support@myapp.com">support@myapp.com</a>.</p>
            `
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Signup success email sent to:', email);

    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send signup email. Please try again later.');
    }
}

export default sendEmail;
