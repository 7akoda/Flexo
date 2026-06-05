import { client } from "../db/dbClient.ts";
import { getFolderId } from "./folderService.ts";
import { getUserId } from "./userService.ts";

export const createFile = async (
	username: string,
	filename: string,
	folder_id: string,
	mime_type: string,
) => {
	const id = await getUserId(username);
	const text =
		"INSERT INTO files (user_id, file_name, folder_id, mime_type) VALUES ($1, $2, $3, $4)";
	const values = [id, filename, folder_id, mime_type];

	const fileDuplicate = await client.query(
		"SELECT * FROM files WHERE file_name = $1 AND user_id = $2 AND folder_id = $3",
		[filename, id, folder_id],
	);
	if (fileDuplicate.rows.length > 0) {
		return "File already exists with this name in this folder.";
	}
	await client!.query(text, values);
	const createdFile = await client!.query(
		"SELECT * FROM files WHERE user_id = $1 AND file_name = $2 AND folder_id = $3 AND mime_type = $4",
		values,
	);
	return createdFile.rows[0];
};

export const deleteFile = async (
	username: string,
	filename: string,
	folder_id: string,
) => {
	const id = await getUserId(username);
	await client!.query(
		"DELETE FROM files WHERE file_name = $1 AND user_id = $2 AND folder_id = $3",
		[filename, id, folder_id],
	);
};

export const checkFileDupe = async (
	username: string,
	filename: string,
	folder_id: string,
) => {
	const id = await getUserId(username);
	const values = [id, filename, folder_id];
	const text =
		"SELECT * FROM files WHERE user_id = $1 AND file_name = $2 AND folder_id = $3";
	const check = await client!.query(text, values);

	if (check.rows.length > 0) {
		return true;
	} else return false;
};

export const changeFile = async (
	username: string,
	filename: string,
	folder_id: string,
) => {
	const id = await getUserId(username);
	const values = [id, filename, folder_id];
};
