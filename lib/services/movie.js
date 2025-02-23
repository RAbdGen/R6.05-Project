'use strict';

const { Service } = require('@hapipal/schmervice');

module.exports = class MovieService extends Service {
    async create(MovieData) {
        const { Movie } = this.server.models();
        return await Movie.query().insert(MovieData);
    }

    async getAll() {
        const { Movie } = this.server.models();
        return await Movie.query();
    }

    async update(id, MovieData) {
        const { Movie } = this.server.models();
        return await Movie.query().patchAndFetchById(id, MovieData);
    }

    async delete(id) {
        const { Movie } = this.server.models();
        return await Movie.query().deleteById(id);
    }
    async exportMoviesToCSV() {
        const { Movie } = this.server.models();

        try {
            // Récupère tous les films
            const movies = await Movie.query();

            // Convertit les films en CSV
            const header = ['id', 'title', 'description', 'releaseDate', 'director', 'createdAt', 'updatedAt'].join(',');
            const rows = movies.map(movie => {
                return [
                    movie.id,
                    movie.title,
                    movie.description,
                    movie.releaseDate,
                    movie.director,
                    movie.createdAt,
                    movie.updatedAt
                ].join(',');
            });

            const csvData = [header, ...rows].join('\n');
            return csvData;
        } catch (error) {
            console.error('Erreur lors de l\'export des films en CSV :', error);
            throw error;
        }
    }
};