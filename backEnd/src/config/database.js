import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let connection;

try {
  if (
    !process.env.DATABASE_HOST ||
    !process.env.DATABASE_USER ||
    !process.env.DATABASE_NAME ||
    !process.env.DATABASE_PASSWORD
  ) {
    throw new Error("Config variables of database are not defined");
  }

  connection =await mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
  });
} catch (error) {
  console.error("Database connection failed," + error);
  process.exit(1);
}

export default connection;
