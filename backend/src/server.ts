import app from './app';
import dotenv from "dotenv";

dotenv.config();
const port = process.env.PORT || 3010;

app.listen(port, () => {
  console.log(`[Server]: I am running at https://localhost:${port}`);
});
