'use strict';

exports.up = async (knex) => {
    await knex.schema.createTable('user_movie', (table) => {
        table.increments('id').primary(); // Identifiant unique
        table.integer('userId').unsigned().notNullable().references('id').inTable('user').onDelete('CASCADE'); // Référence à l'utilisateur
        table.integer('movieId').unsigned().notNullable().references('id').inTable('movie').onDelete('CASCADE'); // Référence au film
        table.timestamp('createdAt').defaultTo(knex.fn.now()); // Date d'ajout du favori
    });
};

exports.down = async (knex) => {
    await knex.schema.dropTable('user_movie');
};