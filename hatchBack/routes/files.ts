import { Router } from "express";
import { auth } from "../middleware/auth.ts";
import { upload } from "../middleware/multer.ts";
import * as FileController from "../controllers/FileController.ts";
export const fileRouter = Router();

fileRouter.get("/", auth, FileController.getFiles);
fileRouter.post("/", auth, upload.single("file"), FileController.makeFile);
fileRouter.delete("/:folder_id/:fileName", auth, FileController.destroyFile);
