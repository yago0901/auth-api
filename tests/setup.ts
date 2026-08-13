import { beforeAll, beforeEach, afterAll } from "vitest";

import database from "../src/database/knex.js";
import * as createUsers from "../src/database/migrations/20260731221603_create_users.js";
import * as createRefreshTokens from "../src/database/migrations/20260806170343_create_refresh_tokens_table.js";

beforeAll(async () => {
    await createRefreshTokens.down(database);
    await createUsers.down(database);

    await createUsers.up(database);
    await createRefreshTokens.up(database);
});

beforeEach(async () => {
    await database("refresh_tokens").del();
    await database("users").del();
});

afterAll(async () => {
    await database.destroy();
});