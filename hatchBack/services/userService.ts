import { client } from "../db/dbClient.ts";

export const getUserId = async (username: string) => {
	const user = await getUser(username);
	if (!user) throw new Error(`USER_NOT_FOUND`);
	return user.user_id;
};

export const createUser = async (
	username: string,
	hash: string,
	avatar = null,
) => {
	if (username.length === 0) {
		throw new Error("USERNAME_NEEDED");
	}
	const text =
		"INSERT INTO users (username, password_hash, avatar_url) VALUES ($1, $2, $3) RETURNING *";
	const values = [username, hash, avatar];
	const user = await client!.query(text, values);
	return user.rows[0];
};

export const getUser = async (username: string) => {
	const user = await client!.query("SELECT * FROM users WHERE username = $1", [
		username,
	]);
	if (user.rows.length == 0) {
		throw new Error("USER_NOT_FOUND");
	}
	return user.rows[0];
};
