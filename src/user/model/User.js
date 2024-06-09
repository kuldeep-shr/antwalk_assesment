import { poolQuery } from "../../database/Connection.js";
const { TABLE_USER } = process.env;

const createUser = async (args) => {
  const client = await poolQuery.connect();

  try {
    await client.query("BEGIN");

    const queryText = `
      INSERT INTO ${TABLE_USER} (name, email, magic_link_token, magic_link_expires, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING id, email, name,created_at, updated_at;
    `;

    const values = [
      args.name,
      args.email,
      args.magic_link_token,
      args.magic_link_expires,
    ];

    const res = await client.query(queryText, values);
    await client.query("COMMIT");

    return res.rows;
  } catch (error) {
    await client.query("ROLLBACK");
    throw "error executing query";
  } finally {
    client.release();
  }
};

const updateUser = async (userId, updateFields) => {
  const client = await poolQuery.connect();

  try {
    await client.query("BEGIN");

    const setClause = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updateFields)) {
      setClause.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }

    const queryText = `
      UPDATE ${TABLE_USER} 
      SET ${setClause.join(", ")}, updated_at = NOW()
      WHERE id = $${paramIndex}
      RETURNING id, name, email, created_at, updated_at;
    `;

    values.push(userId);
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

    const res = await client.query(queryText, values);

    return res.rows[0];
  } catch (error) {
    throw "something went wrong while finding the user";
  } finally {
    client.release();
  }
};

const findUserByMagicLink = async (args) => {
  const client = await poolQuery.connect();
  try {
    const queryText = `
      SELECT id, email, magic_link_token, magic_link_expires 
      FROM ${TABLE_USER} 
      WHERE email = $1 
        AND magic_link_token = $2 
        AND magic_link_expires > NOW()
    `;

    const res = await client.query(queryText, [
      args.email,
      args.magic_link_token,
    ]);

    return res.rows;
  } catch (error) {
    throw "something went wrong while fetching the magic link details";
  } finally {
    client.release();
  }
};

const UserModel = {
  createUser,
  updateUser,
  findUser,
  findUserByMagicLink,
};

export default UserModel;
