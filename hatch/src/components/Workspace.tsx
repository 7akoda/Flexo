import { useEffect, useState } from "react";
import { useAuth } from "../store/authStore";
import { brand } from "../lib/brand";

import { Folder, type folder } from "./Folder";
import type { file } from "./File";

export const Workspace = () => {
	const authorizedUser = useAuth((state) => state.auth);
	const [folderData, setFolderData] = useState<folder[]>([]);
	const [statusMessage, setStatusMessage] = useState("");
	const [fileData, setFileData] = useState<file[]>([]);
	const [fileFocus, setFileFocus] = useState("");

	const getUserFolders = async () => {
		const response = await fetch("http://localhost:3000/folders", {
			credentials: "include",
		});
		return response.json();
	};

	const getUserFiles = async () => {
		const response = await fetch("http://localhost:3000/files", {
			credentials: "include",
		});
		return response.json();
	};

	useEffect(() => {
		if (!authorizedUser) return;
		const loadWorkspace = async () => {
			const [folders, files] = await Promise.all([
				getUserFolders(),
				getUserFiles(),
			]);
			setFolderData(folders);
			setFileData(files);
		};
		loadWorkspace();
	}, [authorizedUser]);

	const rootData = folderData.filter((folder) => folder.folder_name === "Root");
	const rootFolderId = rootData[0]?.folder_id;
	const childData = folderData.filter(
		(folder) =>
			folder.folder_name !== "Root" && folder.parent_folder_id === rootFolderId,
	);

	return (
		<div className="mx-auto flex w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
			<section className={`${brand.panel} flex-1`}>
				<div className={brand.windowBar}>
					<span>Explorer</span>
					<span>{authorizedUser}</span>
				</div>
				<div className="mb-8 grid gap-6 border-b border-[var(--color-shadow)] pb-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
					<div className="grid gap-3 sm:grid-cols-3">
						<div className={`${brand.surface} px-4 py-4`}>
							<p className={brand.kicker}>Folders</p>
							<p className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[var(--color-text)]">
								{Math.max(folderData.length - 1, 0)}
							</p>
						</div>
						<div className={`${brand.surface} px-4 py-4`}>
							<p className={brand.kicker}>Files</p>
							<p className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[var(--color-text)]">
								{fileData.length}
							</p>
						</div>
						<div className={`${brand.surface} min-w-52 px-4 py-4`}>
							<p className={brand.kicker}>Signed in</p>
							<p className="mt-2 truncate text-base font-medium text-[var(--color-text)]">
								{authorizedUser}
							</p>
						</div>
					</div>
				</div>
				{statusMessage && <p className={`mb-6 ${brand.note}`}>{statusMessage}</p>}
				<div className="space-y-3">
					{rootData.length ? (
						rootData.map((folder) => (
							<Folder
								style={{ zIndex: 0 }}
								folderData={folderData}
								key={folder.folder_id}
								setFileFocus={setFileFocus}
								fileFocus={fileFocus}
								root={true}
								child={false}
								setStatusMessage={setStatusMessage}
								folder={folder}
								setFolderData={setFolderData}
								fileData={fileData}
								setFileData={setFileData}>
								{childData.map((cFolder, index: number) => (
									<Folder
										style={{ zIndex: index + 1 }}
										folderData={folderData}
										key={cFolder.folder_id}
										setFileFocus={setFileFocus}
										fileFocus={fileFocus}
										root={false}
										child={true}
										setStatusMessage={setStatusMessage}
										folder={cFolder}
										setFolderData={setFolderData}
										fileData={fileData}
										setFileData={setFileData}
									/>
								))}
							</Folder>
						))
					) : (
						<div className="win98-inset px-4 py-12 text-center text-[var(--color-muted)]">
							Your workspace is getting ready.
						</div>
					)}
				</div>
			</section>
		</div>
	);
};
