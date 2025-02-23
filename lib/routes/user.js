'use strict';

const Joi = require('joi')

module.exports = [
    {
        method: 'post',
        path: '/user',
        options: {
            auth:
            {
                scope: ['admin', 'user']
            },
            tags:['api'],
            validate: {
            payload: Joi.object({
                firstName: Joi.string().required().min(3).example('John').description('Firstname of the user'),
                lastName: Joi.string().required().min(3).example('Doe').description('Lastname of the user'),
                email: Joi.string().required().email().example('john@doe.fr').description('Email of the user'),
                password: Joi.string().required().example('password').description('Password of the user'),
                username: Joi.string().required().example('johndoe').description('Username of the user')
            })
        }
    },
        handler: async (request, h) => {

            const { userService } = request.services();

            return await userService.create(request.payload);
        }
    },
    {
        method: 'get',
        path: '/users',
        options: {
            tags:['api'],
            auth: {
                scope: ['admin', 'user']
            }
        },
        handler: async (request, h) => {

            const { userService } = request.services();

            return await userService.findAll();
        }
    },
    {
        method: 'delete',
        path: '/user/{id}',
        options: {
            tags:['api'],
            auth : {
                scope : ['admin']
            },
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().min(1)
                })
            }
        },
        handler: async (request, h) => {

            const { userService } = request.services();

            return await userService.delete(request.params.id);
        }
    },
    {
        method: 'patch',
        path: '/user/{id}',
        options: {
            tags:['api'],
            auth : {
                scope : ['admin']
            },
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().min(1)
                }),
                payload: Joi.object({
                    firstName: Joi.string().min(3).example('John').description('Firstname of the user'),
                    lastName: Joi.string().min(3).example('Doe').description('Lastname of the user'),
                    email: Joi.string().email().example('john@doe.fr').description('Email of the user'),
                    password: Joi.string().example('password').description('Password of the user'),
                    username: Joi.string().example('johndoe').description('Username of the user')
                })
            }
        },
        handler: async (request, h) => {

            const { userService } = request.services();

            return await userService.update(request.params.id, request.payload);
        }
    },
    {
        method: 'post',
        path: '/user/login',
        options: {
            tags:['api'],
            auth: false,
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().required().example('john@doe.fr').description('Email of the user'),
                    password: Joi.string().required().example('password').description('Password of the user')
                })
            }
        },
        handler: async (request, h) => {

            const { userService } = request.services();

            return await userService.login(request.payload.email, request.payload.password);
        }
    },
    {
        method: 'POST',
        path: '/user/{userId}/promote',
        options: {
            tags: ['api'],
            auth: {
                scope: ['admin']
            },
            validate: {
                params: Joi.object({
                    userId: Joi.number().integer().required().min(1).description('The ID of the user to promote')
                }),
                payload: Joi.object({
                    email: Joi.string().email().required().example('john@doe.fr').description('Email of the user to promote')
                })
            }
        },
        handler: async (request, h) => {
            const { userId } = request.params;
            const { email } = request.payload;
            const adminUser = request.auth.credentials;
            const { userService } = request.services();

            console.log('adminUser', adminUser);
            try {
                const { User } = request.models();

                const user = await User.query().findOne({ id: userId, email: email });
                if (!user) {
                    return h.response({ message: 'User not found' }).code(404);
                }

                const result = await userService.promoteToAdmin(userId, adminUser);

                return h.response({ message: result }).code(200);
            } catch (error) {
                if (error.isBoom) {
                    return error;
                }
                console.error(error);
                return h.response({ message: 'Internal Server Error' }).code(500);
            }
        }
    }

];


