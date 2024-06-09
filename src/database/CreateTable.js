import { poolQuery } from "./Connection.js";

async function createTables() {
  const tableInit = await poolQuery.connect();
  try {
    const { TABLE_USER, TABLE_TODO } = process.env;
    await tableInit.query("BEGIN");

    // Define your table creation queries here
    const createTableForUsers = `
      CREATE TABLE IF NOT EXISTS ${TABLE_USER} (
          id SERIAL PRIMARY KEY,                -- Primary key for the table
          name VARCHAR(100),                    -- User's name with a maximum length of 100 characters
          email VARCHAR(255) UNIQUE NOT NULL,   -- User's email, must be unique and cannot be null
          magic_link_token VARCHAR(255),        -- Token for magic link authentication
          magic_link_expires TIMESTAMP,         -- Expiration time for the magic link token
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp when the record is created
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Timestamp when the record is last updated
      );
      CREATE INDEX idx_email ON ${TABLE_USER} (email);
    `;

    const createTableForTodos = `
      -- Define ENUM types for status and priority
      CREATE TYPE todo_status AS ENUM ('todo', 'inprogress', 'completed', 'onhold', 'canceled', 'pending', 'review');
      CREATE TYPE todo_priority AS ENUM ('high', 'medium', 'low');

      -- Create the todo table if it doesn't already exist
      CREATE TABLE IF NOT EXISTS ${TABLE_TODO} (
          id SERIAL PRIMARY KEY,                 -- Primary key for the table, auto-incrementing
          user_id INTEGER NOT NULL,              -- Foreign key to associate the task with a user
          title VARCHAR(255) NOT NULL,           -- Title of the task, cannot be null
          description TEXT,                      -- Detailed description of the task
          status todo_status NOT NULL,           -- Status of the task
          priority todo_priority NOT NULL,       -- Priority of the task
          due_date DATE,                         -- Due date for the task
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp when the task is created
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp when the task is last updated
          CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES ${TABLE_USER} (id)  -- Foreign key constraint
      );

      -- Create an index on the user_id column to improve query performance
      CREATE INDEX idx_user_id ON ${TABLE_TODO} (user_id);

      -- Create an index on the status column to improve query performance
      CREATE INDEX idx_status ON ${TABLE_TODO} (status);

      -- Create an index on the priority column to improve query performance
      CREATE INDEX idx_priority ON ${TABLE_TODO} (priority);
    `;

    // Execute table creation queries
    await tableInit.query(createTableForUsers);
    await tableInit.query(createTableForTodos);

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
