import { client } from "../db/dbClient.ts";
import { Router } from "express";
import { auth } from "../middleware/auth.ts";
import { getUserId } from "../services/userService.ts";
import {
	checkFolderDupe,
	createFolder,
	deleteFolder,
} from "../services/folderService.ts";
import type { Request, Response } from "express";
export const folderRouter = Router();

folderRouter.get("/", auth, async (req, res) => {
	const username = req.user.username;
	const id = await getUserId(username);

	const data = await client!.query("SELECT * FROM folders WHERE user_id = $1", [
		id,
	]);
	res.send(data.rows);
});

folderRouter.post("/", auth, async (req, res) => {
	const { authorizedUser, folderName } = req.body;
	console.log(req.body);
	if (await checkFolderDupe(authorizedUser, folderName, authorizedUser)) {
		return res
			.status(401)
			.json({ message: "please name the folder something unique" });
	}
	if (folderName.length == 0) {
		return res.status(401).json({ message: "please name the folder" });
	}
	const folder = await createFolder(authorizedUser, folderName, "Root");
	console.log("folderPost", folder);
	return res.status(201).json({ message: "folder created", folder });
});

folderRouter.delete(
	"/:folderName",
	auth,
	async (req: Request<{ folderName: string }>, res) => {
		const { folderName } = req.params;
		const username = req.user.username;
		await deleteFolder(username, folderName, username);
		res.status(200).json({ message: "folder deleted" });
	},
);
