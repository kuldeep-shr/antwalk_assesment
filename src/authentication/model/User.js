import { poolQuery } from "../../database/Connection.js";
const { TABLE_USER } = process.env;

const createUser = async (args) => {
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
    const res = await client.query(queryText, values);
    await client.query("COMMIT");
    return res.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw "Error executing query";
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
    throw "something went wrong, while find user";
  } finally {
    client.release();
  }
};

const findUserByMagicLink = async (args) => {
  const client = await poolQuery.connect();
  try {
    console.log("argsss", args);
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
    throw "something went wrong, while fetching the magic link details";
  }
};

export { createUser, findUser, findUserByMagicLink };
