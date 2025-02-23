'use strict';

const amqp = require('amqplib'); // Pour RabbitMQ
const { Service } = require('@hapipal/schmervice');

module.exports = class MessageBrokerService extends Service {
    constructor(server) {
        super(server);
        this.connection = null;
        this.channel = null;
    }

    async connect() {
        if (!this.connection) {
            this.connection = await amqp.connect('amqp://localhost'); // URL de RabbitMQ
            this.channel = await this.connection.createChannel();
        }
    }

    async sendExportRequest(email, csvData) {
        try {
            await this.connect();

            const queue = 'export_requests';
            await this.channel.assertQueue(queue, { durable: true });

            const message = JSON.stringify({ email, csvData });
            this.channel.sendToQueue(queue, Buffer.from(message), { persistent: true });

            console.log('Demande d\'export CSV envoyée au message broker');
        } catch (error) {
            console.error('Erreur lors de l\'envoi de la demande d\'export CSV :', error);
            throw error;
        }
    }
};