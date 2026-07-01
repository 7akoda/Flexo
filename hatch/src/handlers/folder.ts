import type { folder } from "../components/Folder";

export const handleFolderDelete = async (
	folderName: string,
	setFolderData: React.Dispatch<React.SetStateAction<folder[]>>,
	parent_folder_id = "",
) => {
	if (parent_folder_id.length == 0) {
		const res = await fetch(`http://localhost:3000/folders/${folderName}`, {
			method: "DELETE",
			credentials: "include",
		});
		console.log(res);
		setFolderData((prev) =>
			prev.filter((folder) => folder.folder_name !== folderName),
		);
	}
	const res = await fetch(
		`http://localhost:3000/folders/${parent_folder_id}/${folderName}`,
		{
			method: "DELETE",
			credentials: "include",
		},
	);
	const result = await res.json();
	console.log(result);
	setFolderData((prev) =>
		prev.filter((folder) => folder.folder_name !== folderName),
	);
};

export const handleFolderSubmit = async (
	e: React.SubmitEvent,
	setFolderData: React.Dispatch<React.SetStateAction<folder[]>>,
	setFolderName: React.Dispatch<React.SetStateAction<string>>,
	folderName: string,
	authorizedUser: string | null,
	parent_folder_name: string,
) => {
	e.preventDefault();
	const data = { authorizedUser, folderName, parent_folder_name };
	const response = await fetch("http://localhost:3000/folders", {
		method: "POST",
		credentials: "include",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	const result = await response.json();
	setFolderName("");
	console.log("result from Foldersubmit: ", result);
	if (response.ok) {
		setFolderData((prev) => [...prev, result.folder]);
	}
	return result;
};

export const handleFolderUpdate = async (
	e: React.SubmitEvent,
	folderName: string,
	authorizedUser: string | null,
	parent_folder_id: string,
	folderRename: string,
	folder_id: string,
	setUpdate: React.Dispatch<React.SetStateAction<boolean>>,
	setFolderData: React.Dispatch<React.SetStateAction<folder[]>>,
) => {
	e.preventDefault();
	const data = {
		authorizedUser,
		folderName,
		folderRename,
		parent_folder_id,
		folder_id,
	};
	const response = await fetch(
		`http://localhost:3000/folders/${parent_folder_id}/${folderName}`,
		{
			method: "PUT",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		},
	);

	const result = await response.json();
	const updatedFolder = result.folder;

	if (response.ok) {
		setUpdate(false);
		setFolderData((prevFolders) => {
			console.log(prevFolders);
			return prevFolders.map((folder) =>
				folder.folder_id === updatedFolder.folder_id ? updatedFolder : folder,
			);
		});
	}
	return result;
};
