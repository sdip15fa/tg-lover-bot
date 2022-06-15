// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
    development: {
        client: "postgresql",
        connection: {
            host: "localhost",
            port: 5432,
            database: "tg_lover_bot",
            user: "postgres",
            password: "",
        },
        migrations: {
            directory: "./db/migrations",
            tableName: "knex_migrations",
        },
    },

    production: {
        client: "postgresql",
        connection: {
            host: "dokku-postgres-tg-lover-bot",
            port: 5432,
            database: "tg_lover_bot",
            user: "postgres",
            password: "e5d52f311c66763c430c3b47b9872687",
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            directory: "./db/migrations",
            tableName: "knex_migrations",
        },
    },
};
