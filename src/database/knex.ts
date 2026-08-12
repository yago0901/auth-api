import knex from "knex";
import path from "node:path";

import { env } from "../config/env.js";

const database = knex({
    client: "sqlite3",
    connection: {
        filename: env.isTest ? ":memory:" : path.resolve(process.cwd(), "database.sqlite"),
    },
    useNullAsDefault: true,
    pool: env.isTest ? { min: 1, max: 1 } : undefined,
});

export default database;