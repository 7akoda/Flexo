import type { Request, Response } from "express";
import {
	createFolder,
	deleteFolder,
	getFolderId,
	populate,
	updateFolderService,
} from "../services/folderService.ts";
import { getDeletedCloudFolderFiles } from "../services/fileService.ts";
import { deleteCloudFolder } from "../cloudflare/services.ts";
import { auth } from "../middleware/auth.ts";

export const makeFolder = async (req: Request, res: Response) => {
	try {
		const { folderName, parent_folder_name } = req.body;
		const authorizedUser = req.user.username;
		const folder = await createFolder(
			authorizedUser,
			folderName,
			parent_folder_name,
		);
		return res.status(201).json({ folder: folder });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Unknown error";

		return res.status(400).json({ error: message });
	}
};

export const destroyFolder = async (
	req: Request<{ folderName: string; parent_folder_id: string }>,
	res: Response,
) => {
	try {
		const { folderName, parent_folder_id } = req.params;
		const authorizedUser = req.user.username;
		const files = await getDeletedCloudFolderFiles(authorizedUser, folderName);
		if (files) {
			deleteCloudFolder(files);
		}
		const folder = await deleteFolder(
			authorizedUser,
			folderName,
			parent_folder_id,
		);
		return res.status(200).json({ message: "folder deleted", folder: folder });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Unknown error";

		return res.status(400).json({ error: message });
	}
};

export const getFolders = async (req: Request, res: Response) => {
	try {
		const authorizedUser = req.user.username;
		const folders = await populate(authorizedUser);
		return res.status(200).json(folders);
	} catch (err) {
		const message = err instanceof Error ? err.message : "Unknown error";

		return res.status(400).json({ error: message });
	}
};

export const updateFolder = async (req: Request, res: Response) => {
	try {
		const { folderName, folderRename, parent_folder_id } = req.body;
		const authorizedUser = req.user.username;
		if (authorizedUser) {
			const folder = await updateFolderService(
				authorizedUser,
				folderName,
				folderRename,
				parent_folder_id,
			);
			return res.status(201).json({ folder: folder });
		}
	} catch (err) {
		const message = err instanceof Error ? err.message : "Unknown error";

		return res.status(400).json({ error: message });
	}
};
