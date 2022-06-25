/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async knex => {
    await knex.schema.raw(`
        ALTER TABLE "users"
            DROP CONSTRAINT "users_goal_relationship_check",
            ADD CONSTRAINT "users_goal_relationship_check"
                CHECK (goal_relationship IN ('結婚對象', '穩定關係', '短期關係', '朋友關係'))
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async knex => {
    await knex.schema.raw(`
        ALTER TABLE "users"
            DROP CONSTRAINT "users_goal_relationship_check",
            ADD CONSTRAINT "users_goal_relationship_check"
                CHECK (goal_relationship IN ('結婚對象', '穩定關係', '短期關係'))
    `);
};
