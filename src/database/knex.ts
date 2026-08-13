import knex from "knex";
import path from "node:path";

import { env } from "../config/env.js";

const database = knex({
    client: "pg",
    connection: env.isProduction
        ? { connectionString: env.databaseUrl, ssl: { rejectUnauthorized: false } }
        : env.databaseUrl,
    pool: { min: 0, max: 10 },
    migrations: {
        directory: path.resolve(process.cwd(), env.isProduction ? "dist/database/migrations" : "src/database/migrations"),
        extension: "ts",
        loadExtensions: [env.isProduction ? ".js" : ".ts"],
    },
});

export default database;