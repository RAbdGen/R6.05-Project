'use strict';

const { Service } = require('@hapipal/schmervice');

module.exports = class UserMovieService extends Service {
    async addFavorite(userId, movieId) {
        const { UserMovie } = this.server.models();

        // Vérifie si le film est déjà en favoris
        const existingFavorite = await UserMovie.query()
            .where({ userId, movieId })
            .first();

        if (existingFavorite) {
            throw new Error('Movie already in favorites');
        }

        // Ajoute le film aux favoris
        return await UserMovie.query().insert({ userId, movieId });
    }

    async removeFavorite(userId, movieId) {
        const { UserMovie } = this.server.models();

        // Vérifie si le film est dans les favoris
        const favorite = await UserMovie.query()
            .where({ userId, movieId })
            .first();

        if (!favorite) {
            throw new Error('Movie not in favorites');
        }

        // Supprime le film des favoris
        return await UserMovie.query().deleteById(favorite.id);
    }

    async getFavorites(userId) {
        const { UserMovie } = this.server.models();

        // Récupère les films favoris de l'utilisateur avec les détails des films
        return await UserMovie.query()
            .where({ userId })
            .withGraphFetched('movie') // Charge les détails du film associé
            .select('user_movie.*'); // Sélectionne uniquement les colonnes de user_movie
    }
};