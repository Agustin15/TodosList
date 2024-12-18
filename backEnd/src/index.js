import { app } from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";

dotenv.config();
await connectDB();

const PORT = process.env.PORT;

app.listen(PORT,() => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
