import { client } from "../db/dbClient.ts";
import type { Request, Response } from "express";

const checkFolder = async (folder_name: string) => {
	const check = await client!.query(
		"SELECT * FROM FOLDERS WHERE folder_name = $1",
		[folder_name],
	);
	if (check.rows[0].length > 0) {
		return true;
	} else false;
};

export const validateFolder = async (
	req: Request,
	res: Response,
	next: () => void,
) => {
	const exists = await checkFolder(req.body.folderName);

	if (!exists) {
		return res.status(404).json({ message: "Folder not found" });
	}

	next();
};
