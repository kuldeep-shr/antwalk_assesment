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

    await client.query("COMMIT");
    return insertedTodo.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw "error executing query";
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
      UPDATE ${TABLE_TODO} 
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
    throw new Error("error executing update query");
  } finally {
    client.release();
  }
};

/**
 * Fetch to-do items based on filters.
 * @param {Object} args - The filter arguments.
 * @returns {Promise} - Resolves with the list of to-do items.
 */
const listTodo = async (args) => {
  const client = await poolQuery.connect();
  try {
    if (args.todoId > 0) {
      // Specific todo with details
      const queryText = `
                SELECT 
                    *
                FROM todos
                WHERE 
                    id=$1
            `;
      const res = await client.query(queryText, [args.todoId]);
      if (res.rows.length > 0) {
        return {
          data: res.rows,
        };
      } else {
        throw new Error("no todo list exists");
      }
    } else {
      const buildQuery = (args) => {
        let queryText = `SELECT * FROM ${TABLE_TODO} WHERE 1=1 AND user_id=$1`;
        const values = [args.userId];
        let valueIndex = 2;

        if (args.selectedStatus.length > 0) {
          if (args.selectedStatus.length > 1) {
            queryText += ` AND status = ANY($${valueIndex++})`;
            values.push(args.selectedStatus);
          } else {
            queryText += ` AND status = $${valueIndex++}`;
            values.push(args.selectedStatus[0]);
          }
        }

        if (args.selectedPriority.length > 0) {
          if (args.selectedPriority.length > 1) {
            queryText += ` AND priority = ANY($${valueIndex++})`;
            values.push(args.selectedPriority);
          } else {
            queryText += ` AND priority = $${valueIndex++}`;
            values.push(args.selectedPriority[0]);
          }
        }

        if (args.title) {
          queryText += ` AND title ILIKE $${valueIndex++}`;
          values.push(`%${args.title}%`);
        }

        if (args.description) {
          queryText += ` AND description ILIKE $${valueIndex++}`;
          values.push(`%${args.description}%`);
        }

        // Add sorting
        const validSortColumns = ["due_date", "priority", "created_at"];
        if (args.sortBy && args.sortBy.length > 0) {
          const sortConditions = [];
          for (const sortItem of args.sortBy) {
            if (validSortColumns.includes(sortItem.column)) {
              if (sortItem.column === "priority") {
                sortConditions.push(`CASE 
                        WHEN priority = 'low' THEN 1 
                        WHEN priority = 'medium' THEN 2 
                        WHEN priority = 'high' THEN 3 
                        ELSE 4 
                    END ${sortItem.direction === "desc" ? "DESC" : "ASC"}`);
              } else {
                sortConditions.push(
                  `${sortItem.column} ${
                    sortItem.direction === "desc" ? "DESC" : "ASC"
                  }`
                );
              }
            }
          }
          if (sortConditions.length > 0) {
            queryText += ` ORDER BY ${sortConditions.join(", ")}`;
          }
        }
        // Pagination
        args.page = args.page == 0 ? 1 : args.page;
        queryText += ` OFFSET $${valueIndex++} LIMIT $${valueIndex++}`;
        values.push((args.page - 1) * args.limit); // Offset
        values.push(args.limit); // Limit

        return { text: queryText, values };
      };

      const { text, values } = buildQuery(args);
      const res = await client.query(text, values);
      return res.rows;
    }
  } catch (error) {
    return {
      isError: true,
      message: error.message || "something went wrong while fetching the todos",
    };
  } finally {
    client.release();
  }
};

const deleteTodoById = async (todoId, userId) => {
  const client = await poolQuery.connect();
  try {
    const queryText = `DELETE FROM todos WHERE id=$1 AND user_id=$2 RETURNING *`;
    const res = await client.query(queryText, [todoId, userId]);
    if (res.rows.length == 0) {
      throw new Error("no todo list exists");
    } else {
      return res.rows;
    }
  } catch (error) {
    return {
      isError: true,
      message: error.message || "something went wrong while fetching the todos",
    };
  } finally {
    client.release();
  }
};

const TodoModel = {
  createTodo,
  updateTodo,
  listTodo,
  deleteTodoById,
};
export default TodoModel;
