/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async knex => {
    await knex.schema.createTable("matches", table => {
        table.string("user_id").notNullable().index();
        table.string("target_id").notNullable().index();
        table.boolean("like").notNullable().index();
        table.timestamps(false, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async knex => {
    await knex.schema.dropTable("matches");
};
