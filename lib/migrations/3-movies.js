'use strict';

exports.up = async (knex) => {
    await knex.schema.createTable('movie', (table) => {
        table.increments('id').primary(); // Identifiant unique
        table.string('title').notNullable(); // Titre du film
        table.text('description').notNullable(); // Description du film
        table.date('releaseDate').notNullable(); // Date de sortie
        table.string('director').notNullable(); // Réalisateur
        table.timestamp('createdAt').defaultTo(knex.fn.now()); // Date de création
        table.timestamp('updatedAt').defaultTo(knex.fn.now()); // Date de mise à jour
    });
};

exports.down = async (knex) => {
    await knex.schema.dropTable('movie');
};