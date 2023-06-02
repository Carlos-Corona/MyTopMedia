-- Databse used for this project
CREATE DATABASE IF NOT EXISTS MediaDatabase;

USE MediaDatabase;


CREATE TABLE IF NOT EXISTS Media (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  descr TEXT,
  cover VARCHAR(255),
  average_score DECIMAL(5,2),
  release_date DATE,
  media_type VARCHAR(255)
);
