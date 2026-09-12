# Usuarios GraphQL

Servicio de datos GraphQL que permite crear, consultar, actualizar y
eliminar usuarios en una base de datos MySQL. Ideal para aprender
GraphQL, esquemas tipados, resolutores y pruebas funcionales.

**Área:** Desarrollo de software y arquitectura de microservicios

**Competencia:** Construir servicios de datos con GraphQL aplicando
esquemas tipados, resolutores, persistencia en MySQL y pruebas
funcionales, de acuerdo con requisitos de calidad y seguridad.

## Estructura del proyecto

```
Lab4Postman/
├── src/
│   ├── db.js                      # Pool de conexión a MySQL (mysql2/promise)
│   ├── schema.js                  # Tipos, queries y mutaciones GraphQL + resolutores
│   └── index.js                   # Servidor Express que expone /graphql
├── database.sql                   # Script de creación de la BD y datos de ejemplo
├── postman_collection.json        # Colección de Postman con las 5 operaciones CRUD
├── package.json
├── .env.example                   # Plantilla de variables de entorno
└── .env                           # Variables de entorno reales (NO se sube al repo)
```

### Código fuente

- **`src/db.js`**: crea un *pool* de conexiones MySQL a partir de las
  variables de entorno (`DB_HOST`, `DB_PORT`, `DB_USER`,
  `DB_PASSWORD`, `DB_NAME`). Es el único punto donde se configura la
  conexión a la base de datos.
- **`src/schema.js`**: define el esquema GraphQL con `buildSchema`
  (tipo `User`, queries `users`/`user`, mutaciones
  `createUser`/`updateUser`/`deleteUser`) y los resolutores
  correspondientes. Todas las consultas SQL usan parámetros (`?`) en
  vez de concatenar strings, para evitar inyección SQL.
- **`src/index.js`**: levanta un servidor Express, habilita CORS y
  expone el esquema en la ruta `/graphql` usando `graphql-http`.

## Requisitos previos

- [Node.js](https://nodejs.org/) 18 o superior
- [MySQL](https://www.mysql.com/) 5.7+ / 8.x (o XAMPP/WAMP con MySQL)

## Instalación

1. Clonar el repositorio y entrar a la carpeta del laboratorio:

   ```bash
   git clone <url-del-repositorio>
   cd Lab4Postman
   ```

2. Instalar las dependencias:

   ```bash
   npm install
   ```

3. Crear el archivo `.env` a partir de la plantilla y completar tus
   propias credenciales de MySQL (este archivo **no** se sube al
   repositorio):

   ```bash
   cp .env.example .env
   ```

   ```env
   PORT=4000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=usuario_mysql
   DB_PASSWORD=clave_mysql
   DB_NAME=graphql_db
   ```

4. Crear la base de datos y la tabla `users` ejecutando
   `database.sql` en tu servidor MySQL, por ejemplo:

   ```bash
   mysql -u root -p < database.sql
   ```

   o pegando su contenido en MySQL Workbench / phpMyAdmin.

## Ejecución

- Modo desarrollo (con recarga automática vía `nodemon`):

  ```bash
  npm run dev
  ```

- Modo producción:

  ```bash
  npm start
  ```

Al arrancar correctamente verás en consola:

```
Servidor GraphQL escuchando en http://localhost:4000/graphql
```

## Esquema GraphQL

```graphql
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
```

### Ejemplos de operaciones

**Listar usuarios**

```graphql
query {
  users {
    id
    name
    email
    created_at
  }
}
```

**Obtener un usuario por ID**

```graphql
query {
  user(id: 1) {
    id
    name
    email
  }
}
```

**Crear un usuario**

```graphql
mutation {
  createUser(name: "Ana Torres", email: "ana@example.com") {
    id
    name
    email
  }
}
```

**Actualizar un usuario**

```graphql
mutation {
  updateUser(id: 1, name: "Ana Actualizada") {
    id
    name
    email
  }
}
```

**Eliminar un usuario**

```graphql
mutation {
  deleteUser(id: 1)
}
```

## Pruebas con Postman

El repositorio incluye [`postman_collection.json`](./postman_collection.json)
con las 5 operaciones CRUD ya armadas.

1. Abrir Postman y usar **Import** → seleccionar `postman_collection.json`.
2. La colección define la variable `base_url` (por defecto
   `http://localhost:4000`); ajústala si tu servidor corre en otro
   puerto.
3. Con el servidor corriendo (`npm run dev`), ejecutar en orden las
   peticiones: *Listar usuarios*, *Obtener usuario por ID*, *Crear
   usuario*, *Actualizar usuario*, *Eliminar usuario*. Todas se envían
   como `POST` a `{{base_url}}/graphql` con el cuerpo en formato JSON
   (`{ "query": "...", "variables": { ... } }`).

## Seguridad

- Las credenciales reales de la base de datos viven únicamente en
  `.env`, el cual está excluido del control de versiones mediante
  `.gitignore`. Usa `.env.example` como referencia de las variables
  requeridas.
- Todas las consultas a la base de datos usan sentencias
  parametrizadas (`mysql2` con `?`), nunca concatenación de strings,
  para prevenir inyección SQL.
