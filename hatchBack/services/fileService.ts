import { client } from "../db/dbClient.ts";
import { getFolderId } from "./folderService.ts";
import { getUserId } from "./userService.ts";

export const populate = async (username: string) => {
	const data = await client!.query("SELECT * FROM files WHERE user_id = $1", [
		await getUserId(username),
	]);
	return data.rows;
};

export const createFile = async (
	username: string,
	filename: string,
	folderName: string,
	mime_type: string,
) => {
	const id = await getUserId(username);
	const folder_id = await getFolderId(folderName);
	const rootFolderId = await getFolderId("Root");
	if (mime_type === undefined) {
		throw new Error("MIMETYPE_UNDEFINED");
	}
	if (await checkFileDupe(username, filename, folder_id)) {
		throw new Error("FILE_DUPLICATE");
	}
	if (filename.length == 0) {
		throw new Error("UNNAMED_FILE");
	}

	if (!folder_id && folderName.length > 0) {
		throw new Error("FOLDER_NOT_FOUND");
	}

	if (folderName.length == 0) {
		const createdFile = await client!.query(
			"INSERT INTO files (user_id, file_name, folder_id, mime_type) VALUES ($1, $2, $3, $4) RETURNING *",
			[id, filename, rootFolderId, mime_type],
		);
		return createdFile.rows[0];
	}

	const createdFile = await client!.query(
		"INSERT INTO files (user_id, file_name, folder_id, mime_type) VALUES ($1, $2, $3, $4) RETURNING *",
		[id, filename, folder_id, mime_type],
	);

	return createdFile.rows[0];
};

export const deleteFile = async (
	username: string,
	filename: string,
	folder_id: string,
) => {
	const id = await getUserId(username);
	const deletedFile = await client!.query(
		"DELETE FROM files WHERE file_name = $1 AND user_id = $2 AND folder_id = $3 returning *",
		[filename, id, folder_id],
	);
	if (deletedFile.rows.length == 0) {
		throw new Error("FILE_NOT_FOUND");
	}
	return deletedFile.rows[0];
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
