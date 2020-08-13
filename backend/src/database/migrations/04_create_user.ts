import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("user", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable().unique();
    table.string("email").notNullable();
    table.string("password").notNullable();
    table.string("pwd_reset_token");
    table.date("pwd_reset_expires");
  });
}
export async function down(knex: Knex) {
  return knex.schema.dropTable("user");
}
