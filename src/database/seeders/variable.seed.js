'use strict';

/** @type {import('sequelize-cli').Migration} */
const variables = [
    {
        name: 'First Name',
        value: '{{firstName}}',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        name: 'Last Name',
        value: '{{lastName}}',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        name: 'Title',
        value: '{{title}}',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        name: 'Company',
        value: '{{companyName}}',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        name: 'Email',
        value: '{{email}}',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        name: 'Phone',
        value: '{{firstPhone}}',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        name: 'Employee Count',
        value: '{{employees}}',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        name: 'Industry',
        value: '{{industry}}',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        name: 'Person LinkedIn',
        value: '{{personLinkedinUrl}}',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        name: 'Website',
        value: '{{website}}',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        name: 'Company LinkedIn',
        value: '{{companyLinkedinUrl}}',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        name: 'Company Address',
        value: '{{companyAddress}}',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        name: 'Company City',
        value: '{{companyCity}}',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        name: 'Company State',
        value: '{{companyState}}',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        name: 'Company Country',
        value: '{{companyCountry}}',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];
module.exports = {
    async up(queryInterface, Sequelize) {
        try {
            await queryInterface.bulkInsert('variables', variables, {});
        } catch (error) {
            console.log(error);
        }
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('variables', null, {});
    },
};
