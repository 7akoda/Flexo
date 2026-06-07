import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { createUser, getUser } from "../services/userService.ts";
import jwt from "jsonwebtoken";
import { createRootFolder } from "../services/folderService.ts";

export const register = async (req: Request, res: Response) => {
	try {
		const { username, password } = req.body;
		const hash = await bcrypt.hash(password, 10);
		const user = await createUser(username, hash);
		await createRootFolder(username);

		return res.status(201).json({ success: true, user: user });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Unknown error";
		return res.status(400).json({ error: message });
	}
};

export const login = async (req: Request, res: Response) => {
	try {
		const { username, password } = req.body;

		const user = await getUser(username);
		const passwordCheck = await bcrypt.compare(password, user.password_hash);

		if (!passwordCheck) {
			return res.status(401).json({
				error: "invalid password",
			});
		}

		const token = jwt.sign({ username }, process.env.JWT_SECRET!, {
			expiresIn: "60m",
		});

		res.cookie("token", token, {
			httpOnly: true,
			secure: false, // true in production (HTTPS)
			sameSite: "lax",
		});

		return res.status(200).send({ token: token });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Unknown error";
		return res.status(400).json({ error: message });
	}
};
