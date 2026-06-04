import "dotenv/config";
import { client } from "../db/dbClient.ts";
import { createUser } from "../services/userService.ts";
import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createFolder, createRootFolder } from "../services/folderService.ts";
export const userRouter = Router();

userRouter.post("/login", async (req, res) => {
	const { username, password } = req.body;

	const userResult = await client.query(
		"SELECT * FROM users WHERE username = $1",
		[username],
	);
	const existingUser = userResult.rows[0];

	if (userResult.rows.length === 0) {
		return res.status(401).json({
			success: false,
			message: "No account associated with this email, please sign up.",
		});
	}
	const passwordCheck = await bcrypt.compare(
		password,
		existingUser.password_hash,
	);

	if (!passwordCheck) {
		return res.status(401).json({
			success: false,
			message: "invalid password",
		});
	}

	const token = jwt.sign({ username }, process.env.JWT_SECRET!, {
		expiresIn: "5m",
	});

	res.cookie("token", token, {
		httpOnly: true,
		secure: false, // true in production (HTTPS)
		sameSite: "lax",
	});

	return res.status(200).json({
		success: true,
		token,
	});
});

userRouter.post("/register", async (req, res) => {
	const { username, password } = req.body;
	const userResult = await client.query(
		"SELECT * FROM users WHERE username = $1",
		[username],
	);
	const existingUser = userResult.rows[0];

	if (userResult.rows.length === 0) {
		const hash = await bcrypt.hash(password, 10);
		await createUser(username, hash);
		await createRootFolder(username);
		return res.status(201).json({ success: true, user: "created" });
	}

	if (existingUser) {
		return res.status(401).json({
			success: false,
			message: "An account already exists under this email.",
		});
	}
});
