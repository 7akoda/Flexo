import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import { S3Client } from "@aws-sdk/client-s3";

const endpoint = process.env.S3_API_ENDPOINT;
const accessKeyId = process.env.S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

if (!endpoint || !accessKeyId || !secretAccessKey) {
	throw new Error("Missing R2 environment variables");
}

export const s3 = new S3Client({
	region: "auto",
	endpoint,
	credentials: {
		accessKeyId,
		secretAccessKey,
	},
});
