import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "node",
        setupFiles: ["./tests/setup.ts"],
        fileParallelism: false,
        env: {
            NODE_ENV: "test",
            JWT_SECRET: "test-secret-only-for-tests",
        },
    },
});