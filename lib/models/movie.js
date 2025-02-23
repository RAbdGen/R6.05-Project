'use strict';

const { Model } = require('objection');

class Movie extends Model {
    static get tableName() {
        return 'movie'; // Nom de la table en base de données
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['title', 'description', 'releaseDate', 'director'], // Champs obligatoires
            properties: {
                id: { type: 'integer' },
                title: { type: 'string', minLength: 1, maxLength: 255 },
                description: { type: 'string', minLength: 1 },
                releaseDate: { type: 'date', format: 'date' }, // Format de date
                director: { type: 'string', minLength: 1, maxLength: 255 },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
            }
        };
    }
}

module.exports = Movie;