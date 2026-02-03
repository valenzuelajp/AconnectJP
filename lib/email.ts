import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendVerificationEmail = async (to: string, token: string) => {
    const verifyLink = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${token}`;

    const mailOptions = {
        from: `"AConnect Verification" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Verify Your AConnect Account",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #8B1538; text-align: center;">Welcome to AConnect!</h2>
        <p>Thank you for registering. Please use the verification code below to complete your registration:</p>
        <div style="background: #f9f9f9; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #8B1538; margin: 20px 0; border-radius: 5px;">
            ${token}
        </div>
        <p>Alternatively, you can click the link below:</p>
        <p style="text-align: center;">
            <a href="${verifyLink}" style="background: #8B1538; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Account</a>
        </p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #666; text-align: center;">If you didn't create an account, you can safely ignore this email.</p>
      </div>
    `,
    };

    return transporter.sendMail(mailOptions);
};
