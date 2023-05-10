import express, { Express, Request, Response } from "express";

const app: Express = express();
const port = 8080;

app.get("/steam", (req: Request, res: Response) => {
  res.send(JSON.stringify({}));
});

app.listen(port, () => {
  console.log(`[Server]: I am running at https://localhost:${port}`);
});
