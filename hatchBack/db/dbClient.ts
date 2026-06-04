import "dotenv/config";
import { Client } from "pg";

export let client: Client;
try {
	client = await new Client({
		user: process.env.POSTGRES_USER,
		host: process.env.POSTGRES_HOST,
		database: process.env.DATABASE_NAME,
		password: process.env.POSTGRES_PW,
		port: Number(process.env.POSTGRES_PORT),
	}).connect();
} catch (error) {
	console.log(error);
}
