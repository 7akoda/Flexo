import { client } from "../db/dbClient.ts";
import { Router } from "express";
import {
	checkFileDupe,
	createFile,
	deleteFile,
} from "../services/fileService.ts";
import { auth } from "../middleware/auth.ts";
import type { Request, Response } from "express";
import { checkFolderDupe, getFolderId } from "../services/folderService.ts";
import { getUserId } from "../services/userService.ts";
import { upload } from "../middleware/multer.ts";
import { validateFolder } from "../middleware/validate.ts";
export const fileRouter = Router();

fileRouter.get("/", auth, async (req, res) => {
	const username = req.user.username;

	const data = await client!.query("SELECT * FROM files WHERE user_id = $1", [
		await getUserId(username),
	]);

	res.send(data.rows);
});

fileRouter.post(
	"/",
	auth,
	validateFolder,
	upload.single("file"),
	async (req, res) => {
		const { authorizedUser, file_name, folderName, mimeType } = req.body;
		console.log("req.body = ", req.body);
		const folderId = await getFolderId(folderName);
		const rootFolderId = await getFolderId("Root");

		if (mimeType === undefined) {
			return res.status(401).json({ message: "invalid file extension" });
		}

		if (await checkFileDupe(authorizedUser, file_name, folderId)) {
			return res.status(401).json({ message: "dupe!" });
		}

		if (file_name.length == 0) {
			return res.status(401).json({ message: "please name the file" });
		}

		if (folderName === "") {
			const file = await createFile(
				authorizedUser,
				file_name,
				rootFolderId,
				mimeType,
			);
			return res
				.status(201)
				.json({ message: `${file_name} created in root`, file });
		}

		if (await checkFolderDupe(authorizedUser, folderName, rootFolderId)) {
			const file = await createFile(
				authorizedUser,
				file_name,
				rootFolderId,
				mimeType,
			);
			return res
				.status(201)
				.json({ message: `${file_name} created in ${folderName}`, file });
		}

		if (!(await checkFolderDupe(authorizedUser, folderName, rootFolderId))) {
			return res
				.status(401)
				.json({ message: `folder ${folderName} does not exist` });
		}
	},
);

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
