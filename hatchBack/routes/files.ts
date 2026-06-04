import { client } from "../db/dbClient.ts";
import { Router } from "express";
import {
	checkFileDupe,
	createFile,
	deleteFile,
} from "../services/fileService.ts";
import { auth } from "../middleware/auth.ts";
import type { Request, Response } from "express";
import { getFolderId } from "../services/folderService.ts";
import { getUserId } from "../services/userService.ts";
export const fileRouter = Router();

fileRouter.get("/", auth, async (req, res) => {
	const username = req.user.username;

	const data = await client!.query("SELECT * FROM files WHERE user_id = $1", [
		await getUserId(username),
	]);

	res.send(data.rows);
});

fileRouter.post("/", auth, async (req, res) => {
	const { authorizedUser, fileName, folderName } = req.body;
	const folderId = await getFolderId(folderName);
	const rootFolderId = await getFolderId("Root");
	if (await checkFileDupe(authorizedUser, fileName, folderId)) {
		return res.status(401).json({ message: "dupe!" });
	}
	if (fileName.length == 0) {
		return res.status(401).json({ message: "please name the file" });
	}
	if (folderName.length == 0) {
		const file = await createFile(authorizedUser, fileName, rootFolderId);
		return res.status(201).json({ message: "file created in root", file });
	}
	const file = await createFile(authorizedUser, fileName, folderId);
	return res
		.status(201)
		.json({ message: `${fileName} created in ${folderName}`, file });
});

fileRouter.delete(
	"/:folder_id/:fileName",
	auth,
	async (
		req: Request<{ folder_id: string; fileName: string }>,
		res: Response,
	) => {
		const { fileName, folder_id } = req.params;
		const username = req.user.username;
		await deleteFile(username, fileName, folder_id);
		res.status(200).json({ message: "file deleted" });
	},
);
