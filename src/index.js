require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createHandler } = require('graphql-http/lib/use/express');
const schema = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

const app = express();
app.use(cors());

app.all(
  '/graphql',
  createHandler({
    schema,
    rootValue: resolvers,
  })
);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor GraphQL escuchando en http://localhost:${PORT}/graphql`);
});
