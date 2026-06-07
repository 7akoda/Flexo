import { createFile, deleteFile, populate } from "../services/fileService.ts";
import type { Request, Response } from "express";
import { s3 } from "../cloudflare/client.ts";
import { PutObjectCommand } from "@aws-sdk/client-s3";
export const makeFile = async (req: Request, res: Response) => {
	const { file_name, folderName, mimeType } = req.body;

	console.log(req.body.file);
	const authorizedUser = req.user.username;
	try {
		const createdFile = await createFile(
			authorizedUser,
			file_name,
			folderName,
			mimeType,
		);
		if (req.file) {
			await s3.send(
				new PutObjectCommand({
					Bucket: "hatch-bucket",
					Key: file_name,
					Body: req.file.buffer,
					ContentType: mimeType,
					Metadata: { user: authorizedUser },
				}),
			);
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
