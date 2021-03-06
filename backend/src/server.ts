import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import routes from "./routes";
import errorMiddleware from "./middlewares/errorhandler";
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);
app.use(errorMiddleware);
app.listen(3333);
