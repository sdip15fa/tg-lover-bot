/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async knex => {
    await knex.schema.alterTable("users", table => {
        table.boolean("filter_goal_relationship").nullable().defaultTo(false).index();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async knex => {
    await knex.schema.alterTable("users", table => {
        table.dropColumn("filter_goal_relationship");
    });
};
