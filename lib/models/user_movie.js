'use strict';

const { Model } = require('objection');

class UserMovie extends Model {
    static get tableName() {
        return 'user_movie'; // Nom de la table en base de données
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['userId', 'movieId'], // Champs obligatoires
            properties: {
                id: { type: 'integer' },
                userId: { type: 'integer' },
                movieId: { type: 'integer' },
                createdAt: { type: 'string', format: 'date-time' }
            }
        };
    }

    // Définir les relations
    static get relationMappings() {
        const User = require('./user');
        const Movie = require('./movie');

        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'user_movie.userId',
                    to: 'user.id'
                }
            },
            movie: {
                relation: Model.BelongsToOneRelation,
                modelClass: Movie,
                join: {
                    from: 'user_movie.movieId',
                    to: 'movie.id'
                }
            }
        };
    }
}

module.exports = UserMovie;