import express from "express";
import carreraRouter from "./routes/carrera.route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/carrera", carreraRouter);

export default app;
