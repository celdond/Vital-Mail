import express, { Express } from "express";
import registerAPIRoutes from "./api/api";
import cors from "cors";
import path from "path";
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";
import * as OpenApiValidator from "express-openapi-validator";

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const apiSpec = path.join(__dirname, "../openapi.yaml");
const apidoc = YAML.load(apiSpec);

app.use("/api", swaggerUi.serve, swaggerUi.setup(apidoc));

app.use(
  OpenApiValidator.middleware({
    apiSpec: "./openapi.yaml",
    validateRequests: true,
    validateResponses: true,
  }),
);

registerAPIRoutes(app);

app.use((err: any, req: any, res: any, next: any) => {
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

export default app;
