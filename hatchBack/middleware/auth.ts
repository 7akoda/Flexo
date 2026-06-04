import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
	namespace Express {
		interface Request {
			user?: any;
		}
	}
}
export const auth = (req: Request, res: Response, next: () => void) => {
	const token = req.cookies.token;

	if (!token) {
		return res.status(401).json({
			success: false,
		});
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET!);
		req.user = decoded;

		next();
	} catch (error) {
		return res.status(401).json({
			success: false,
			message: error,
		});
	}
};
