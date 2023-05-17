import { Express, Request, Response } from 'express';

export default function registerAPIRoutes(app: Express) {
    app.get("/steam", (req: Request, res: Response) => {
        res.send(JSON.stringify({}));
    });
}
