import { poolQuery } from "../../database/Connection.js";
const { TABLE_TODO } = process.env;

const createTodoList = async (args) => {
  const client = await poolQuery.connect();
  try {
    await client.query("BEGIN");
    const queryText = `
        INSERT INTO ${TABLE_TODO} (user_id, title, description, status, priority,due_date)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id AS todoId,title,description,status, priority,due_date;
        `;
    const insertTodoValues = [
      args.user_id,
      args.title,
      args.description,
      args.status,
      args.priority,
      args.due_date,
    ];

    const insertedTodo = await client.query(queryText, insertTodoValues); // Insert todo

    await client.query("COMMIT"); // Commit the transaction
    return insertedTodo.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw "Error executing query";
  } finally {
    client.release();
  }
};

const TodoModel = {
  createTodoList,
};
export default TodoModel;
