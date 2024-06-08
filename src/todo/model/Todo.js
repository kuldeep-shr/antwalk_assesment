import { poolQuery } from "../../database/Connection.js";
const { TABLE_TODO } = process.env;

const createTodo = async (args) => {
  const client = await poolQuery.connect();
  try {
    await client.query("BEGIN");

    const queryText = `
        INSERT INTO ${TABLE_TODO} (user_id, title, description, status, priority,due_date)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id AS todo_id,title,description,status, priority,due_date;
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

const updateTodo = async (id, args) => {
  const client = await poolQuery.connect();

  try {
    const todoId = id;
    await client.query("BEGIN");

    const setClause = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(args)) {
      setClause.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }

    // Include id in the paramIndex calculation
    const idParamIndex = paramIndex;
    paramIndex++;

    const queryText = `
      UPDATE todos 
      SET ${setClause.join(", ")}, updated_at = NOW()
      WHERE id = $${idParamIndex}
      RETURNING id, title, description, priority, status, user_id, created_at, updated_at;
    `;

    values.push(todoId);

    const res = await client.query(queryText, values);
    await client.query("COMMIT");
    return res.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw new Error("Error executing update query");
  } finally {
    client.release();
  }
};

const TodoModel = {
  createTodo,
  updateTodo,
};
export default TodoModel;
