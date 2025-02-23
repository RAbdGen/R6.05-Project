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
};