'use strict';

const Joi = require('joi');
const Boom = require('@hapi/boom');

module.exports = [
    // Créer un film (admin seulement)
    {
        method: 'POST',
        path: '/movies',
        options: {
            tags: ['api'],
            auth: {
                scope: ['admin'] // Seuls les admins peuvent créer des films
            },
            validate: {
                payload: Joi.object({
                    title: Joi.string().required(),
                    description: Joi.string().required(),
                    releaseDate: Joi.date().required(),
                    director: Joi.string().required()
                })
            }
        },
        handler: async (request, h) => {
            const { movieService, emailService } = request.services(); // Ajoute emailService
            const movieData = request.payload;

            try {
                // Crée le film
                const newMovie = await movieService.create(movieData);

                // Notifie tous les utilisateurs
                await emailService.notifyNewMovieToUsers(newMovie.title, newMovie.description);

                return h.response(newMovie).code(201); // 201 Created
            } catch (error) {
                console.error('Erreur lors de la création du film :', error);
                return Boom.badImplementation('Erreur lors de la création du film', error);
            }
        }
    },

    // Lister tous les films
    {
        method: 'GET',
        path: '/movies',
        options: {
            tags: ['api'],
        },
        handler: async (request, h) => {
            const { movieService } = request.services();

            try {
                const movies = await movieService.getAll();
                return h.response(movies).code(200);
            } catch (error) {
                console.error('Erreur lors de la récupération des films :', error);
                return Boom.badImplementation('Erreur lors de la récupération des films', error);
            }
        }
    },

    // Mettre à jour un film (admin seulement)
    {
        method: 'PUT',
        path: '/movies/{id}',
        options: {
            tags: ['api'],
            auth: {
                scope: ['admin'] // Seuls les admins peuvent modifier des films
            },
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required()
                }),
                payload: Joi.object({
                    title: Joi.string(),
                    description: Joi.string(),
                    releaseDate: Joi.date(),
                    director: Joi.string()
                })
            }
        },
        handler: async (request, h) => {
            const { movieService, emailService } = request.services();
            const { id } = request.params;
            const movieData = request.payload;

            try {
                // Met à jour le film
                const updatedMovie = await movieService.update(id, movieData);

                // Notifie les utilisateurs qui ont ce film en favoris
                await emailService.notifyMovieUpdateToFavorites(id, updatedMovie.title, updatedMovie.description);

                return h.response(updatedMovie).code(200);
            } catch (error) {
                console.error('Erreur lors de la mise à jour du film :', error); // Affiche l'erreur complète
                return Boom.badImplementation('Erreur lors de la mise à jour du film', error);
            }
        }
    },

    // Supprimer un film (admin seulement)
    {
        method: 'DELETE',
        path: '/movies/{id}',
        options: {
            tags: ['api'],
            auth: {
                scope: ['admin'] // Seuls les admins peuvent supprimer des films
            },
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required()
                })
            }
        },
        handler: async (request, h) => {
            const { movieService } = request.services();
            const { id } = request.params;

            try {
                await movieService.delete(id);
                return h.response().code(204); // 204 No Content
            } catch (error) {
                console.error('Erreur lors de la suppression du film :', error);
                return Boom.badImplementation('Erreur lors de la suppression du film', error);
            }
        }
    },
    {
        method: 'GET',
        path: '/movies/export',
        options: {
            tags: ['api'],
            auth: {
                scope: ['admin'] // Seuls les admins peuvent accéder à cet endpoint
            }
        },
        handler: async (request, h) => {
            const { movieService, emailService } = request.services();
            const { messageBrokerService } = request.server.services(); // Accéder à messageBrokerService

            if (!messageBrokerService || typeof messageBrokerService.sendExportRequest !== 'function') {
                console.error('messageBrokerService or sendExportRequest is not defined');
                return Boom.badImplementation('Erreur de configuration du messageBrokerService');
            }

            try {
                // Génère le fichier CSV
                const csvData = await movieService.exportMoviesToCSV();

                // Envoie le fichier CSV via le message broker
                await messageBrokerService.sendExportRequest(request.auth.credentials.email, csvData);

                return h.response({ message: 'Demande d\'export CSV envoyée avec succès' }).code(200);
            } catch (error) {
                console.error('Erreur lors de la génération de l\'export CSV :', error);
                return Boom.badImplementation('Erreur lors de la génération de l\'export CSV', error);
            }
        }
    }
];