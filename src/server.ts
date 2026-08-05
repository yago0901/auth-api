import "dotenv/config";
import app from "./app.js";
import database from "./database/knex.js";

const PORT = process.env.PORT || 3000;

database
  .raw("SELECT 1")
  .then(() => {
    console.log("Database connection established");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});