import {
	DeleteObjectCommand,
	DeleteObjectsCommand,
	GetObjectCommand,
	PutObjectCommand,
} from "@aws-sdk/client-s3";
import { s3 } from "./client.ts";
import type { Request, Response } from "express";
import { getFileId } from "../services/fileService.ts";
import type { ObjectIdentifier } from "@aws-sdk/client-s3";
export const uploadFile = async (
	req: Request,
	res: Response,
	fileName: string,
	mimeType: string,
	authorizedUser: string,
) => {
	if (req.file) {
		try {
			const fileId = await getFileId(authorizedUser, fileName);
			await s3.send(
				new PutObjectCommand({
					Bucket: "hatch-bucket",
					Key: fileId,
					Body: req.file.buffer,
					ContentType: mimeType,
					Metadata: { user: authorizedUser, file: fileName },
				}),
			);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Unknown error";

			return res.status(400).json({ error: message });
		}
	}
};

export const downloadCloudFile = async (
	fileName: string,
	authorizedUser: string,
) => {
	const fileId = await getFileId(authorizedUser, fileName);

	return s3.send(
		new GetObjectCommand({
			Bucket: "hatch-bucket",
			Key: fileId,
		}),
	);
};

export const deleteCloudFile = async (
	fileName: string,
	authorizedUser: string,
) => {
	const fileId = await getFileId(authorizedUser, fileName);
	console.log("from delete: ", fileId);
	return s3.send(
		new DeleteObjectCommand({
			Bucket: "hatch-bucket",
			Key: fileId,
		}),
	);
};

export const deleteCloudFolder = async (fileArray: ObjectIdentifier[]) => {
	return s3.send(
		new DeleteObjectsCommand({
			Bucket: "hatch-bucket",
			Delete: {
				Objects: fileArray,
			},
		}),
	);
};
