const { buildSchema } = require('graphql');
const pool = require('./db');

// Tipos, consultas (Query) y mutaciones (Mutation) del recurso Usuario.
const schema = buildSchema(`
  type User {
    id: ID!
    name: String!
    email: String!
    created_at: String
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    createUser(name: String!, email: String!): User!
    updateUser(id: ID!, name: String, email: String): User
    deleteUser(id: ID!): Boolean!
  }
`);

async function findUserById(id) {
  const [rows] = await pool.query(
    'SELECT id, name, email, created_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

const root = {
  users: async () => {
    const [rows] = await pool.query(
      'SELECT id, name, email, created_at FROM users ORDER BY id'
    );
    return rows;
  },

  user: async ({ id }) => findUserById(id),

  createUser: async ({ name, email }) => {
    const [result] = await pool.query(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email]
    );
    return findUserById(result.insertId);
  },

  updateUser: async ({ id, name, email }) => {
    const fields = [];
    const values = [];

    if (name !== undefined) {
      fields.push('name = ?');
      values.push(name);
    }
    if (email !== undefined) {
      fields.push('email = ?');
      values.push(email);
    }

    if (fields.length > 0) {
      values.push(id);
      await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
    }

    return findUserById(id);
  },

  deleteUser: async ({ id }) => {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};

module.exports = { schema, root };
