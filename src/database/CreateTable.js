import { poolQuery } from "./Connection.js";

async function createTables() {
  const tableInit = await poolQuery.connect();
  try {
    const { TABLE_USER, TABLE_TODO } = process.env;
    await tableInit.query("BEGIN");

    // Define your table creation queries here
    const createTableQuery1 = `
        CREATE TABLE IF NOT EXISTS ${TABLE_USER} (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(255) UNIQUE NOT NULL,
        magic_link_token VARCHAR(255),
        magic_link_expires TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    // const createTableQuery2 = `
    //   CREATE TABLE IF NOT EXISTS ${TABLE_TODO} (
    //     id SERIAL PRIMARY KEY,
    //     name VARCHAR(100),
    //     description TEXT
    //   )
    // `;

    // const createTableQuery3 = `
    //   CREATE TABLE IF NOT EXISTS ${TABLE_USER_CATEGORY} (
    //     user_id INT,
    //     category_id INT,
    //     is_selected BOOLEAN DEFAULT FALSE
    //   )
    // `;

    // Execute table creation queries
    await tableInit.query(createTableQuery1);
    // await tableInit.query(createTableQuery2);
    // await tableInit.query(createTableQuery3);

    await tableInit.query("COMMIT");
    console.log("Tables created successfully (if not exist).");
  } catch (err) {
    await tableInit.query("ROLLBACK");
    console.error("Error creating tables:", err);
  } finally {
    tableInit.release();
  }
}

createTables();
