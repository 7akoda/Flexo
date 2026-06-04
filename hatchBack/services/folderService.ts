import { client } from "../db/dbClient.ts";
import { getUserId } from "./userService.ts";

export const getFolderId = async (folder_name: string | null) => {
	if (!folder_name) return null;
	const text = "SELECT * FROM folders WHERE folder_name = $1";
	const value = [folder_name];
	const folder = await client!.query(text, value);
	if (!folder.rows[0]?.folder_id) return null;
	return folder.rows[0].folder_id;
};

export const createFolder = async (
	username: string,
	folder_name: string,
	parent_folder_name: string,
) => {
	const id = await getUserId(username);
	const parent_folder_id = await getFolderId(parent_folder_name);
	const text =
		"INSERT INTO folders ( user_id, folder_name, parent_folder_id) VALUES ($1, $2, $3)";
	const values = [id, folder_name, parent_folder_id];
	const fileDuplicate = await client.query(
		"SELECT * FROM folders WHERE folder_name = $1 AND user_id = $2",
		[folder_name, id],
	);
	if (fileDuplicate.rows.length > 0) {
		return "File already exists with this name.";
	}
	await client!.query(text, values);

	const createdFolder = await client.query(
		"SELECT * FROM folders WHERE folder_name = $1 AND user_id = $2",
		[folder_name, id],
	);
	return createdFolder.rows[0];
};

export const createRootFolder = async (username: string) => {
	const id = await getUserId(username);

	await client!.query(
		"INSERT INTO folders ( user_id, folder_name) VALUES ($1, $2)",
		[id, "Root"],
	);
};

export const deleteFolder = async (
	username: string,
	folder_name: string,
	parent_folder_name: string,
) => {
	const id = await getUserId(username);
	const folder_id = await getFolderId(folder_name);
	const parent_folder_id = await getFolderId(parent_folder_name);
	if (!parent_folder_id) {
		await client!.query(
			"DELETE FROM folders WHERE user_id = $1 AND folder_id = $2",
			[id, folder_id],
		);
	}
	await client!.query(
		"DELETE FROM folders WHERE parent_folder_id = $1 AND user_id = $2 AND folder_id = $3",
		[parent_folder_id, id, folder_id],
	);
};

export const checkFolderDupe = async (
	username: string,
	folder_name: string,
	parent_folder_name: string,
) => {
	const id = await getUserId(username);
	const folder_id = await getFolderId(folder_name);
	const parent_folder_id = await getFolderId(parent_folder_name);
	if (folder_id == false) return false;

	const check = await client!.query(
		"SELECT * FROM folders WHERE parent_folder_id = $1 AND user_id = $2 AND folder_id = $3",
		[parent_folder_id, id, folder_id],
	);
	if (check.rows.length > 0) return true;
	else false;
};
