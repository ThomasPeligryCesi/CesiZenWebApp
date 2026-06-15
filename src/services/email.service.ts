import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: Number(process.env.MAILTRAP_PORT),
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
    },
});

export async function sendPasswordResetEmail(to: string, rawToken: string) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;

    await transporter.sendMail({
        from: '"CesiZen" <noreply@cesizen.com>',
        to,
        subject: "Réinitialisation de votre mot de passe",
        html: `
            <h1>Réinitialisation du mot de passe</h1>
            <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
            <p>Cliquez sur le lien ci-dessous (valide 15 minutes) :</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>Si vous n'avez pas fait cette demande, ignorez cet email.</p>
        `,
    });
}
