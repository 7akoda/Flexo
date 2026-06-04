import { client } from "../db/dbClient.ts";

export const getUserId = async (username: string) => {
	const text = "SELECT * FROM users WHERE username = $1";
	const value = [username];
	const user = await client!.query(text, value);
	if (!user.rows[0]) throw new Error(`User not found: ${username}`);
	return user.rows[0].user_id;
};

export const createUser = async (
	username: string,
	hash: string,
	avatar = null,
) => {
	const text =
		"INSERT INTO users (username, password_hash, avatar_url) VALUES ($1, $2, $3);";
	const values = [username, hash, avatar];
	await client!.query(text, values);
};
