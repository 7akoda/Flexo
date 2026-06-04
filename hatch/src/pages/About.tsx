import React, { useEffect, useState } from "react";
import { useAuth } from "../store/authStore";

type file = {
	file_name: string;
	id: string;
	folder_id: string;
};
type folder = {
	file: file;
	folder_id: string;
	folder_name: string;
	parent_folder_id: string;
};

export const About = () => {
	const [fileData, setFileData] = useState<file[]>([]);
	const [fileName, setFileName] = useState<string>("");
	const [filesFolderName, setFileFoldersName] = useState("");
	const [folderData, setFolderData] = useState<folder[]>([]);
	const [folderName, setFolderName] = useState<string>("");

	const authorizedUser = useAuth((state) => state.auth);

	const getUserFiles = async () => {
		const response = await fetch("http://localhost:3000/files", {
			credentials: "include",
		});
		const result = await response.json();
		return result;
	};

	const getUserFolders = async () => {
		const response = await fetch("http://localhost:3000/folders", {
			credentials: "include",
		});
		const result = await response.json();
		return result;
	};

	const handleFileSubmit = async (e: React.SubmitEvent) => {
		e.preventDefault();
		const data = { authorizedUser, fileName, folderName: filesFolderName };
		const response = await fetch("http://localhost:3000/files", {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		const result = await response.json();

		setFileName("");
		setFileFoldersName("");
		setFileData((prev) => [...prev, result.file]);
		console.log("result.file from submit: ", result.file);
		return result;
	};

	const handleFolderSubmit = async (e: React.SubmitEvent) => {
		e.preventDefault();
		const data = { authorizedUser, folderName };
		const response = await fetch("http://localhost:3000/folders", {
			method: "POST",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});
		const result = await response.json();
		setFolderName("");
		console.log("result.folde from submit: ", result.folder);
		setFolderData((prev) => [...prev, result.folder]);
		return result;
	};

	const handleFileDelete = async (
		fileName: string,
		folder_id: string = "Root",
	) => {
		await fetch(`http://localhost:3000/files/${folder_id}/${fileName}`, {
			method: "DELETE",
			credentials: "include",
		});
		setFileData((prev) => prev.filter((file) => file.file_name !== fileName));
	};

	const handleFolderDelete = async (folderName: string) => {
		await fetch(`http://localhost:3000/folders/${folderName}`, {
			method: "DELETE",
			credentials: "include",
		});
		setFolderData((prev) =>
			prev.filter((folder) => folder.folder_name !== folderName),
		);
	};

	useEffect(() => {
		if (authorizedUser) {
			const loadFiles = async () => {
				const userFileData = await getUserFiles();
				setFileData(userFileData);
			};
			const loadFolders = async () => {
				const userFolderData = await getUserFolders();
				setFolderData(userFolderData);
			};
			loadFiles();
			loadFolders();
		}
	}, []);

	return (
		<>
			<p>Hello! {authorizedUser}</p>
			<br />
			<form className="" onSubmit={handleFileSubmit}>
				<input
					placeholder="file name"
					value={fileName}
					onChange={(e) => setFileName(e.target.value)}></input>
				<input
					placeholder="file's folder name"
					value={filesFolderName}
					onChange={(e) => setFileFoldersName(e.target.value)}></input>
				<button type="submit" className="bg-slate-500">
					submit
				</button>
			</form>
			<form onSubmit={handleFolderSubmit}>
				<input
					placeholder="folder name"
					value={folderName}
					onChange={(e) => setFolderName(e.target.value)}></input>
				<button type="submit" className="bg-slate-500">
					submit
				</button>
			</form>
			<br />
			{authorizedUser &&
				folderData.map((folder) => {
					return (
						<React.Fragment key={folder.folder_id}>
							<>
								Folder: {folder.folder_name}
								{folder.folder_name !== "Root" && (
									<>
										ParentFolder: {folder.parent_folder_id}
										<button
											className="bg-red-400"
											onClick={() => handleFolderDelete(folder.folder_name)}>
											delete
										</button>
									</>
								)}
								{fileData.map((file) => {
									return file.folder_id === folder.folder_id ? (
										<div className="flex flex-row" key={file.id}>
											<p>{file.file_name}</p>
											<button
												onClick={() =>
													handleFileDelete(file.file_name, folder.folder_id)
												}
												className="bg-slate-300">
												delete
											</button>
										</div>
									) : null;
								})}
							</>
						</React.Fragment>
					);
				})}
		</>
	);
};
