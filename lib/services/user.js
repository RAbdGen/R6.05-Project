'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');
const Jwt = require('@hapi/jwt');


module.exports = class UserService extends Service {

    create(user){

        const { User } = this.server.models();

        return User.query().insertAndFetch(user);
    }

    findAll(){

        const { User } = this.server.models();

        return User.query();
    }

    delete(id){

        const { User } = this.server.models();

        return User.query().deleteById(id);
    }

    update(id, user){

        const { User } = this.server.models();

        return User.query().findById(id).patch(user);
    }

    async login(email, password) {

        const { User } = this.server.models();

        const user = await User.query().findOne({ email, password });

        if (!user) {
            throw Boom.unauthorized('Invalid credentials');
        }

        const token = Jwt.token.generate(
            {
                aud: 'urn:audience:iut',
                iss: 'urn:issuer:iut',
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                scope: user.roles
            },
            {
                key: 'random_string', // La clé qui est définit dans lib/auth/strategies/jwt.js
                algorithm: 'HS512'
            },
            {
                ttlSec: 14400 // 4 hours
            }
        );

        return token;
    }
    async promoteToAdmin(userId, adminUser) {
        const { User } = this.server.models();

        // Vérifiez si l'utilisateur authentifié est un admin
        if (!adminUser.roles.includes('admin')) {
            throw Boom.forbidden('Forbidden');
        }

        const user = await User.query().findById(userId);
        if (!user) {
            throw Boom.notFound('User not found');
        }

        // Ajoute le rôle 'admin'
        user.roles = [...new Set([...user.roles, 'admin'])];
        await User.query().patchAndFetchById(userId, { roles: user.roles });

        return 'User promoted to admin';
    }
}
