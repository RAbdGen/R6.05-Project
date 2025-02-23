'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');
const nodemailer = require('nodemailer');

module.exports = class EmailService extends Service {
    constructor(server) {
        super(server);

        // Configuration du transporteur Ethereal Email
        this.transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'garland.goodwin@ethereal.email', // Nom d'utilisateur Ethereal
                pass: 'xxz7ZCwskrKK5sddYn' // Mot de passe Ethereal
            }
        });
    }

    async sendEmailToNewUser(email, firstName, lastName) {
        const subject = 'Bienvenue sur notre plateforme !';
        const text = `Bonjour ${firstName} ${lastName},\n\nBienvenue sur notre plateforme ! Nous sommes ravis de vous compter parmi nous.\n\nCordialement,\nL'équipe de support`;
        const html = `
            <p>Bonjour ${firstName} ${lastName},</p>
            <p>Bienvenue sur notre plateforme ! Nous sommes ravis de vous compter parmi nous.</p>
            <p>Cordialement,<br>L'équipe de support</p>
        `;

        const mailOptions = {
            from: '"Nom de l\'application" <garland.goodwin@ethereal.email>',
            to: email,
            subject,
            text,
            html
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('E-mail de bienvenue envoyé :', info.messageId);
            console.log('Prévisualisation de l\'e-mail :', nodemailer.getTestMessageUrl(info));
            return info;
        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'e-mail de bienvenue :', error);
            throw Boom.badImplementation('Erreur lors de l\'envoi de l\'e-mail de bienvenue', error);
        }
    }
};