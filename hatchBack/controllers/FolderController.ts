import type { Request, Response } from "express";
import {
	createFolder,
	deleteFolder,
	populate,
} from "../services/folderService.ts";

export const makeFolder = async (req: Request, res: Response) => {
	try {
		const { folderName } = req.body;
		const authorizedUser = req.user.username;
		const folder = await createFolder(authorizedUser, folderName, "Root");

		return res.status(201).json({ folder: folder });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Unknown error";

		return res.status(400).json({ error: message });
	}
};

export const destroyFolder = async (
	req: Request<{ folderName: string }>,
	res: Response,
) => {
	try {
		const { folderName } = req.params;
		const username = req.user.username;
		const folder = await deleteFolder(username, folderName, username);
		return res.status(200).json({ message: "folder deleted", folder: folder });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Unknown error";

		return res.status(400).json({ error: message });
	}
};

export const getFolders = async (req: Request, res: Response) => {
	try {
		const username = req.user.username;
		const folders = await populate(username);
		return res.status(200).json(folders);
	} catch (err) {
		const message = err instanceof Error ? err.message : "Unknown error";

		return res.status(400).json({ error: message });
	}
};
