CREATE DATABASE IF NOT EXISTS graphql_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE graphql_db;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email) VALUES
  ('Ana Torres', 'ana@example.com'),
  ('Carlos Parra', 'carlos@example.com');

SELECT id, name, email FROM users;
