import { Router } from "express";
import { auth } from "../middleware/auth.ts";
import * as FolderController from "../controllers/FolderController.ts";
export const folderRouter = Router();

folderRouter.get("/", auth, FolderController.getFolders);
folderRouter.post("/", auth, FolderController.makeFolder);
folderRouter.delete(
	"/:parent_folder_id/:folderName",
	auth,
	FolderController.destroyFolder,
);

folderRouter.delete("/:folderName", auth, FolderController.destroyFolder);
folderRouter.put(
	"/:parent_folder_id/:folderName",
	auth,
	FolderController.updateFolder,
);
