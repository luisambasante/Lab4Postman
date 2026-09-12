const { buildSchema } = require('graphql');

// Tipos, consultas (Query) y mutaciones (Mutation) de Usuario y Producto.
const schema = buildSchema(`
  type User {
    id: ID!
    name: String!
    email: String!
    created_at: String
  }

  type Product {
    id: ID!
    name: String!
    description: String
    price: Float!
    stock: Int!
    created_at: String
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    products: [Product!]!
    product(id: ID!): Product
  }

  type Mutation {
    createUser(name: String!, email: String!): User!
    updateUser(id: ID!, name: String, email: String): User
    deleteUser(id: ID!): Boolean!

    createProduct(name: String!, description: String, price: Float!, stock: Int!): Product!
    updateProduct(id: ID!, name: String, description: String, price: Float, stock: Int): Product
    deleteProduct(id: ID!): Boolean!
  }
`);

module.exports = schema;
