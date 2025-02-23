'use strict';

const amqp = require('amqplib');
const nodemailer = require('nodemailer');

(async () => {
    try {
        // Connexion au message broker
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        const queue = 'export_requests';
        await channel.assertQueue(queue, { durable: true });

        console.log('En attente de demandes d\'export CSV...');

        // Écoute les messages
        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const { email, csvData } = JSON.parse(msg.content.toString());

                // Envoie le fichier CSV par e-mail
                const transporter = nodemailer.createTransport({
                    host: 'smtp.ethereal.email',
                    port: 587,
                    auth: {
                        user: 'garland.goodwin@ethereal.email',
                        pass: 'xxz7ZCwskrKK5sddYn'
                    }
                });

                const mailOptions = {
                    from: '"Nom de l\'application" <garland.goodwin@ethereal.email>',
                    to: email,
                    subject: 'Export CSV des films',
                    text: 'Voici votre export CSV des films.',
                    attachments: [
                        {
                            filename: 'movies_export.csv',
                            content: csvData
                        }
                    ]
                };

                const info = await transporter.sendMail(mailOptions);
                console.log(`E-mail envoyé à ${email} :`, info.messageId);

                channel.ack(msg); // Confirme la réception du message
            }
        });
    } catch (error) {
        console.error('Erreur dans le worker d\'export CSV :', error);
    }
})();