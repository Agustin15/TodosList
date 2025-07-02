import { server } from "./app.js";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT;

server.listen(PORT,() => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
