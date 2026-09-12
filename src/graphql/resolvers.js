const pool = require('../config/db');

async function findUserById(id) {
  const [rows] = await pool.query(
    'SELECT id, name, email, created_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function findProductById(id) {
  const [rows] = await pool.query(
    'SELECT id, name, description, price, stock, created_at FROM products WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

const resolvers = {
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

  products: async () => {
    const [rows] = await pool.query(
      'SELECT id, name, description, price, stock, created_at FROM products ORDER BY id'
    );
    return rows;
  },

  product: async ({ id }) => findProductById(id),

  createProduct: async ({ name, description, price, stock }) => {
    const [result] = await pool.query(
      'INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)',
      [name, description ?? null, price, stock]
    );
    return findProductById(result.insertId);
  },

  updateProduct: async ({ id, name, description, price, stock }) => {
    const fields = [];
    const values = [];

    if (name !== undefined) {
      fields.push('name = ?');
      values.push(name);
    }
    if (description !== undefined) {
      fields.push('description = ?');
      values.push(description);
    }
    if (price !== undefined) {
      fields.push('price = ?');
      values.push(price);
    }
    if (stock !== undefined) {
      fields.push('stock = ?');
      values.push(stock);
    }

    if (fields.length > 0) {
      values.push(id);
      await pool.query(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, values);
    }

    return findProductById(id);
  },

  deleteProduct: async ({ id }) => {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};

module.exports = resolvers;
