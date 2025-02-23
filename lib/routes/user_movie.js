'use strict';

const Joi = require('joi');
const Boom = require('@hapi/boom');

module.exports = [
    // Ajouter un film aux favoris
    {
        method: 'POST',
        path: '/users/{userId}/favorites/{movieId}',
        options: {
            tags: ['api'],
            auth: {
                scope: ['user'] // Seuls les utilisateurs peuvent ajouter des favoris
            },
            validate: {
                params: Joi.object({
                    userId: Joi.number().integer().required(),
                    movieId: Joi.number().integer().required()
                })
            }
        },
        handler: async (request, h) => {
            const { userMovieService } = request.services();
            const { userId, movieId } = request.params;

            try {
                const favorite = await userMovieService.addFavorite(userId, movieId);
                return h.response(favorite).code(201); // 201 Created
            } catch (error) {
                if (error.message === 'Movie already in favorites') {
                    return Boom.conflict('Ce film est déjà dans vos favoris');
                }
                console.error('Erreur lors de l\'ajout du film aux favoris :', error);
                return Boom.badImplementation('Erreur lors de l\'ajout du film aux favoris', error);
            }
        }
    },

    // Supprimer un film des favoris
    {
        method: 'DELETE',
        path: '/users/{userId}/favorites/{movieId}',
        options: {
            tags: ['api'],
            auth: {
                scope: ['user'] // Seuls les utilisateurs peuvent supprimer des favoris
            },
            validate: {
                params: Joi.object({
                    userId: Joi.number().integer().required(),
                    movieId: Joi.number().integer().required()
                })
            }
        },
        handler: async (request, h) => {
            const { userMovieService } = request.services();
            const { userId, movieId } = request.params;

            try {
                await userMovieService.removeFavorite(userId, movieId);
                return h.response().code(204); // 204 No Content
            } catch (error) {
                if (error.message === 'Movie not in favorites') {
                    return Boom.notFound('Ce film n\'est pas dans vos favoris');
                }
                console.error('Erreur lors de la suppression du film des favoris :', error);
                return Boom.badImplementation('Erreur lors de la suppression du film des favoris', error);
            }
        }
    },

    // Lister les films favoris d'un utilisateur
    {
        method: 'GET',
        path: '/users/{userId}/favorites',
        options: {
            tags: ['api'],
            auth: {
                scope: ['user'] // Seuls les utilisateurs peuvent voir leurs favoris
            },
            validate: {
                params: Joi.object({
                    userId: Joi.number().integer().required()
                })
            }
        },
        handler: async (request, h) => {
            const { userMovieService } = request.services();
            const { userId } = request.params;

            try {
                const favorites = await userMovieService.getFavorites(userId);
                return h.response(favorites).code(200);
            } catch (error) {
                console.error('Erreur lors de la récupération des films favoris :', error);
                return Boom.badImplementation('Erreur lors de la récupération des films favoris', error);
            }
        }
    }
];