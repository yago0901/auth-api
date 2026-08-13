import database from "../database/knex.js";

await database.migrate.latest();

console.log("Migrations aplicadas");

await database.destroy();