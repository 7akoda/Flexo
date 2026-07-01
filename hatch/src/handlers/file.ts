import fileExtensionsToMime from "../json/extension_to_mime.json";
type fileExtMime = keyof typeof fileExtensionsToMime;
import type { file } from "../components/File";
import type React from "react";
import type { SetStateAction } from "react";
const getMimeType = (file: fileExtMime) => {
	return fileExtensionsToMime[file];
};

export const handleFileSubmit = async (
	e: React.SubmitEvent,
	file: File,
	setStatusMessage: React.Dispatch<React.SetStateAction<string>>,
	fileName: string,
	authorizedUser: string,
	filesFolderName: string,
	setFileData: React.Dispatch<React.SetStateAction<file[]>>,
	setFileName: React.Dispatch<React.SetStateAction<string>>,
	setFile: React.Dispatch<React.SetStateAction<File | undefined>>,
	fileInputRef: React.RefObject<HTMLInputElement | null>,
) => {
	e.preventDefault();
	if (!file) {
		setStatusMessage("please upload a file");
		return;
	}
	const fileExt = file.name.slice(file?.name.lastIndexOf("."));
	console.log("fileextension", fileExt);
	const fileMime = Object.hasOwn(fileExtensionsToMime, fileExt);
	const file_name_with_extension = fileName.concat(fileExt);

	const mimeType = getMimeType(fileExt as fileExtMime);
	if (!fileMime) {
		setStatusMessage("We do not accept that file extension type");
		setTimeout(() => setStatusMessage(""), 5000);
		return;
	}

	const formData = new FormData();

	formData.append("file_name", file_name_with_extension);
	if (authorizedUser) {
		formData.append("authorizedUser", authorizedUser);
	}
	formData.append("folderName", filesFolderName);
	formData.append("mimeType", mimeType);
	console.log("filestatus: ", file);
	if (file) {
		formData.append("file", file);
	}
	if (!file) {
		return setStatusMessage("Please choose a file");
	}
	const response = await fetch("http://localhost:3000/files", {
		method: "POST",
		credentials: "include",
		body: formData,
	});

	const result = await response.json();
	console.log(fileInputRef);
	if (fileInputRef.current) {
		fileInputRef.current.value = "";
	}
	setFileName("");
	setFile(undefined);
	if (response.ok) {
		setFileData((prev) => [...prev, result.file]);
	}
	setStatusMessage(result.error);
	return result;
};

export const handleFileUpdate = async (
	e: React.SubmitEvent,
	authorizedUser: string,
	file_name: string,
	fileName: string,
	folder_name: string,
	setFileData: React.Dispatch<SetStateAction<file[]>>,
) => {
	e.preventDefault();
	const data = {
		authorizedUser: authorizedUser,
		file_name: file_name,
		fileName: fileName,
		folder_name: folder_name,
		setFileData,
	};

	const response = await fetch(`http://localhost:3000/files/${fileName}`, {
		method: "PUT",
		credentials: "include",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});

	const result = await response.json();
	setFileData((prev) => [...prev, result.file]);
};

export const handleFileDownload = (fileName: string) => {
	const link = document.createElement("a");
	link.href = `http://localhost:3000/files/${fileName}`;
	link.click();
};

export const handleFileDelete = async (
	fileName: string,
	folder_id: string = "Root",
	setFileData: React.Dispatch<React.SetStateAction<file[]>>,
) => {
	await fetch(`http://localhost:3000/files/${folder_id}/${fileName}`, {
		method: "DELETE",
		credentials: "include",
	});
	setFileData((prev) => prev.filter((file) => file.file_name !== fileName));
};
