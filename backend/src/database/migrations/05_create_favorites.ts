import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("favorites", (table) => {
    table.increments("id").primary();
    table
      .integer("prof_id")
      .notNullable()
      .references("id")
      .inTable("professor")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table
      .integer("user_id")
      .notNullable()
      .references("id")
      .inTable("user")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });
}
export async function down(knex: Knex) {
  return knex.schema.dropTable("favorites");
}
