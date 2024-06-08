import { poolQuery } from "../../database/Connection.js";
const { TABLE_USER } = process.env;

const createUser = async (args) => {
  console.log("TABLE_USER ENV", TABLE_USER);
  const client = await poolQuery.connect();
  try {
    await client.query("BEGIN");
    const queryText = `
        INSERT INTO ${TABLE_USER} (name,email,magic_link_token,magic_link_expires,created_at)
        VALUES ($1, $2,$3,$4, NOW())
        RETURNING id, email, name,magic_link_token,magic_link_expires, created_at, updated_at;
    `;
    const values = [
      args.name,
      args.email,
      args.magic_link_token,
      args.magic_link_expires,
    ];
    console.log("SQL QUERY.....", queryText);
    const res = await client.query(queryText, values);
    await client.query("COMMIT");
    return res.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error executing query", error.stack);
    throw error;
  } finally {
    client.release();
  }
};

const findUser = async (args) => {
  const client = await poolQuery.connect();
  try {
    let queryText = `
        SELECT * FROM ${TABLE_USER} WHERE
    `;
    const conditions = [];
    const values = [];

    if (args.name) {
      conditions.push(`name ILIKE $${conditions.length + 1}`);
      values.push(`%${args.name}%`);
    }

    if (args.email) {
      conditions.push(`email ILIKE $${conditions.length + 1}`);
      values.push(`%${args.email}%`);
    }

    queryText += " " + conditions.join(" AND ");
    queryText += " LIMIT 1";
    console.log("SQL QUERY.....", queryText);
    const res = await client.query(queryText, values);
    return res.rows[0];
  } catch (e) {
    console.error("Error executing query", e.stack);
    throw e;
  } finally {
    client.release();
  }
};

// const findUserByMagicLink = async (args) => {
//   const client = await poolQuery.connect();
//   try {
//     const queryText = `
//       SELECT
//     `;
//   } catch (error) {}
// };

export { createUser, findUser };
