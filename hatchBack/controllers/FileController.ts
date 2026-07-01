import {
	deleteCloudFile,
	downloadCloudFile,
	uploadFile,
} from "../cloudflare/services.ts";
import {
	createFile,
	deleteFile,
	populate,
	updateFileService,
} from "../services/fileService.ts";
import type { Request, Response } from "express";
import { Readable } from "node:stream";

export const makeFile = async (req: Request, res: Response) => {
	const { file_name, folderName, mimeType } = req.body;
	console.log("makeFile(): ", req.body);
	const authorizedUser = req.user.username;

	try {
		const createdFile = await createFile(
			authorizedUser,
			file_name,
			folderName,
			mimeType,
		);
		if (createdFile) {
			await uploadFile(req, res, file_name, mimeType, authorizedUser);
		}

		return res.status(200).json({ file: createdFile, message: "success!" });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Unknown error";

		return res.status(400).json({ error: message });
	}
};

export const destroyFile = async (
	req: Request<{ folder_id: string; fileName: string }>,
	res: Response,
) => {
	try {
		const { fileName, folder_id } = req.params;
		const authorizedUser = req.user.username;
		deleteCloudFile(fileName, authorizedUser);
		const file = await deleteFile(authorizedUser, fileName, folder_id);
		return res.status(200).json({ message: "file deleted", file: file });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Unknown error";

		return res.status(400).json({ error: message });
	}
};

export const getFiles = async (req: Request, res: Response) => {
	const authorizedUser = req.user.username;
	const data = await populate(authorizedUser);
	return res.status(200).json(data);
};

export const getFileDownload = async (
	req: Request<{ fileName: string }>,
	res: Response,
) => {
	try {
		const { fileName } = req.params;
		const authorizedUser = req.user.username;

		const response = await downloadCloudFile(fileName, authorizedUser);

		if (!response.Body) {
			return res.status(404).json({ error: "File not found" });
		}

		res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

		res.setHeader(
			"Content-Type",
			response.ContentType || "application/octet-stream",
		);

		const body = response.Body as Readable;
		console.log(body);

		body.on("error", (err) => res.destroy(err));
		body.pipe(res);
	} catch (err) {
		return res.status(400).json({
			error: err instanceof Error ? err.message : "Unknown error",
		});
	}
};

export const updateFile = async (req: Request, res: Response) => {
	try {
		const { authorizedUser, file_name, fileName, folder_name } = req.body;

		const file = await updateFileService(
			authorizedUser,
			file_name,
			fileName,
			folder_name,
		);
		return res.status(200).json({ message: "file updated", file: file });
	} catch (err) {
		return res.status(400).json({
			error: err instanceof Error ? err.message : "Unknown error",
		});
	}
};
