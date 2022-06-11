/**
 * @param { import("knex").Knex } knex
 * @returns {Promise<void>}
 */
exports.up = async knex => {
    try {
        await knex.schema.createTable("users", table => {
            table.string("telegram_id").primary();
            table.boolean("agree_terms").nullable().defaultTo(false);
            table.boolean("agree_username_permission").nullable().defaultTo(false);
            table.integer("age").nullable();
            table.enum("gender", ["男", "女"]).nullable();
            table.integer("height").nullable();
            table.enum("goal_relationship", ["結婚對象", "穩定關係", "短期關係"]).nullable();
            table.enum("smoking", ["不吸煙", "間中吸煙", "經常吸煙"]).nullable();
            table.string("occupation").nullable();
            table.decimal("salary", 10, 2).nullable();
            table.enum("education", ["小學", "中學", "大專", "學士", "碩士", "博士"]).nullable();
            table.text("self_intro").nullable();
            table.text("relationship_criteria").nullable();
            table.jsonb("photo_urls").nullable();

            table.enum("filter_gender", ["異性", "同性", "不限"]).nullable();
            table.integer("filter_age_upper_bound").nullable();
            table.integer("filter_age_lower_bound").nullable();
            table.integer("filter_height_upper_bound").nullable();
            table.integer("filter_height_lower_bound").nullable();

            table.boolean("info_updated").nullable().defaultTo(false);
            table.boolean("photo_uploaded").nullable().defaultTo(false);
            table.boolean("filter_updated").nullable().defaultTo(false);
        });
    } catch (e) {
        console.log(e);
    }
};

/**
 * @param { import("knex").Knex } knex
 * @returns {Promise<void>}
 */
exports.down = async knex => {
    await knex.schema.dropTable("users");
};