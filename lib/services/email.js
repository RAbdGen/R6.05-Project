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
    async notifyNewMovieToUsers(movieTitle, movieDescription) {
        const subject = 'Un nouveau film est disponible !';
        const text = `Bonjour,\n\nUn nouveau film vient d'être ajouté : "${movieTitle}".\n\nDescription : ${movieDescription}\n\nCordialement,\nL'équipe de support`;
        const html = `
        <p>Bonjour,</p>
        <p>Un nouveau film vient d'être ajouté : <strong>${movieTitle}</strong>.</p>
        <p>Description : ${movieDescription}</p>
        <p>Cordialement,<br>L'équipe de support</p>
    `;

        const { User } = this.server.models();

        try {
            // Récupère tous les utilisateurs
            const users = await User.query().select('email');

            // Envoie un e-mail à chaque utilisateur
            for (const user of users) {
                const mailOptions = {
                    from: '"Nom de l\'application" <garland.goodwin@ethereal.email>',
                    to: user.email,
                    subject,
                    text,
                    html
                };

                const info = await this.transporter.sendMail(mailOptions);
                console.log(`E-mail envoyé à ${user.email} :`, info.messageId);
            }

            return { message: 'Notifications envoyées avec succès' };
        } catch (error) {
            console.error('Erreur lors de l\'envoi des notifications :', error);
            throw Boom.badImplementation('Erreur lors de l\'envoi des notifications', error);
        }
    }
    async notifyMovieUpdateToFavorites(movieId, movieTitle, movieDescription) {
        const subject = 'Un film que vous aimez a été mis à jour !';
        const text = `Bonjour,\n\nLe film "${movieTitle}" que vous avez en favoris a été mis à jour.\n\nNouvelle description : ${movieDescription}\n\nCordialement,\nL'équipe de support`;
        const html = `
        <p>Bonjour,</p>
        <p>Le film <strong>${movieTitle}</strong> que vous avez en favoris a été mis à jour.</p>
        <p>Nouvelle description : ${movieDescription}</p>
        <p>Cordialement,<br>L'équipe de support</p>
    `;

        const { UserMovie } = this.server.models();

        try {
            // Récupère les utilisateurs qui ont ce film en favoris
            const favorites = await UserMovie.query()
                .where({ movieId })
                .joinRelated('user')
                .select('user.email');

            console.log('Favorites:', favorites); // Affiche les données retournées

            // Envoie un e-mail à chaque utilisateur
            for (const favorite of favorites) {
                const userEmail = favorite.email; // Accède directement à la propriété email
                if (!userEmail) {
                    console.error('Email non trouvé pour le favori :', favorite);
                    continue; // Passe à l'itération suivante
                }

                const mailOptions = {
                    from: '"Nom de l\'application" <garland.goodwin@ethereal.email>',
                    to: userEmail,
                    subject,
                    text,
                    html
                };

                const info = await this.transporter.sendMail(mailOptions);
                console.log(`E-mail envoyé à ${userEmail} :`, info.messageId);
            }

            return { message: 'Notifications envoyées avec succès' };
        } catch (error) {
            console.error('Erreur lors de l\'envoi des notifications :', error);
            throw Boom.badImplementation('Erreur lors de l\'envoi des notifications', error);
        }
    }
};