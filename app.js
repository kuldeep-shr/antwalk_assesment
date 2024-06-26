import express from "express";
import { poolQuery } from "./src/database/Connection.js";
import AuthRoutes from "./src/user/routes/Routes.js";
import TodoRoutes from "./src/todo/routes/Routes.js";

import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", AuthRoutes);
app.use("/api", TodoRoutes);

// Test the database connection
poolQuery.connect((err, client, release) => {
  if (err) {
    console.error("Error acquiring client", err.stack);
  } else {
    console.log("Database connected successfully");
  }
  release();
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
