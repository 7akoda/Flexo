import multer from "multer";
import { mkdir } from "node:fs/promises";

const makeFolder = async (folder: string) => {
	await mkdir(`./uploads/${folder}`, { recursive: true });
};

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		if (req.body.folderName) {
			makeFolder(req.body.folderName);

			cb(null, `uploads/${req.body.folderName}`);
		}
	},
	filename: (req, file, cb) => {
		cb(null, req.body.file_name || file.originalname);
	},
});

export const upload = multer({ storage });
