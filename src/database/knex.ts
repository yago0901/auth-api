import knex from "knex";
import path from "node:path";

const database = knex({
    client: "sqlite3",
    connection: {
        filename: path.resolve(process.cwd(), "database.sqlite"),
    },
    useNullAsDefault: true,
});

export default database;