import { client } from "./db/dbClient.ts";
import cors from "cors";
import cookieParser from "cookie-parser";
import { fileRouter } from "./routes/files.ts";
import { folderRouter } from "./routes/folders.ts";
import { userRouter } from "./routes/users.ts";
import express from "express";

const app = express();
const port = 3000;
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/users", userRouter);
app.use("/files", fileRouter);
app.use("/folders", folderRouter);
app.listen(port, () => console.log("listening!"));
