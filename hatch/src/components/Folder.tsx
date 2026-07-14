import { useEffect, useRef, useState } from "react";
import { handleFileSubmit } from "../handlers/file";
import {
	handleFolderDelete,
	handleFolderSubmit,
	handleFolderUpdate,
} from "../handlers/folder";
import { brand } from "../lib/brand";
import { useAuth } from "../store/authStore";
import { File as Files, type file } from "./File";
import { EditSvg } from "../assets/svg/Edit";

export type folder = {
	file: file;
	folder_id: string;
	folder_name: string;
	parent_folder_id: string;
	fileData: file[];
};

export type folderProps = {
	setFolderData: React.Dispatch<React.SetStateAction<folder[]>>;
	setStatusMessage: React.Dispatch<React.SetStateAction<string>>;
	children?: React.ReactNode;
	root: boolean;
	folder: folder;
	fileData: file[];
	setFileData: React.Dispatch<React.SetStateAction<file[]>>;
	fileFocus: string;
	setFileFocus: React.Dispatch<React.SetStateAction<string>>;
	child: boolean;
	folderData: folder[];
	style: React.CSSProperties;
};

export const Folder = ({
	setFolderData,
	setStatusMessage,
	root,
	folder,
	folderData,
	fileData,
	setFileData,
	fileFocus,
	setFileFocus,
	child,
	children,
	style,
}: folderProps) => {
	const authorizedUser = useAuth((state) => state.auth);
	const [file, setFile] = useState<File>();
	const [fileName, setFileName] = useState("");
	const [update, setUpdate] = useState(false);
	const [open, setOpen] = useState(root);
	const [folderName, setFolderName] = useState("");
	const [folderRename, setFolderRename] = useState(folder.folder_name);
	const fileNameInputRef = useRef<HTMLInputElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const folderInputRef = useRef<HTMLInputElement>(null);
	const subfolders = folderData.filter(
		(sfolder) => folder.folder_id === sfolder.parent_folder_id,
	);
	const filePromptOpen = fileFocus === folder.folder_name;

	useEffect(() => {
		if (update) folderInputRef.current?.focus();
		if (filePromptOpen) fileNameInputRef.current?.focus();
	}, [filePromptOpen, update]);

	const uploadFile = (e: React.SubmitEvent<HTMLFormElement>) => {
		if (!file) {
			e.preventDefault();
			return setStatusMessage("please upload a file");
		}
		handleFileSubmit(
			e,
			file,
			setStatusMessage,
			fileName,
			authorizedUser!,
			folder.folder_name,
			setFileData,
			setFileName,
			setFile,
			fileInputRef,
		);
		setFileFocus("");
	};

	return (
		<div
			onClick={() => update && setUpdate(false)}
			style={style}
			key={folder.folder_id}
			onDragOver={(e) => {
				e.preventDefault();
			}}
			onDrop={(e) => {
				e.preventDefault();
				e.stopPropagation();
				const dropped = e.dataTransfer.files?.[0];
				if (!dropped) return;
				setFile(dropped);
				setFileFocus(folder.folder_name);
				setOpen(true);
			}}
			className={`win98-panel flex flex-col gap-4 p-4 transition sm:p-5 ${
				root ? "bg-[var(--color-surface)]" : "bg-[var(--color-panel)]"
			} ${child ? "ml-5" : ""}`}>
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				{root ? (
					<div>
						<p className={brand.kicker}>Root directory</p>
						<p className="mt-1 text-xl font-semibold tracking-[-0.04em] text-[var(--color-text)]">
							{folder.folder_name}
						</p>
					</div>
				) : (
					<div className="flex flex-row items-start gap-2">
						<button
							type="button"
							onClick={() => setOpen((prev) => !prev)}
							className="flex items-center gap-3 text-left">
							<span
								className={`${brand.iconBox} size-10 text-[var(--color-text)]`}>
								{open ? "–" : "+"}
							</span>
							<span>
								{update ? (
									<form
										onClick={(e) => e.stopPropagation()}
										onSubmit={(e) =>
											handleFolderUpdate(
												e,
												folder.folder_name,
												authorizedUser,
												folder.parent_folder_id,
												folderRename,
												folder.folder_id,
												setUpdate,
												setFolderData,
											)
										}>
										<input
											ref={folderInputRef}
											className={`${brand.input} h-10 min-w-48`}
											onChange={(e) => setFolderRename(e.target.value)}
											value={folderRename}
										/>
									</form>
								) : (
									<p className="text-lg font-medium tracking-[-0.03em] text-[var(--color-text)]">
										{folder.folder_name}
									</p>
								)}
							</span>
						</button>
						{!update && (
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									setUpdate((prev) => !prev);
								}}
								className={`${brand.editButton} h-5 w-5 self-center`}>
								<EditSvg />
							</button>
						)}
					</div>
				)}
				{!root && (
					<button
						type="button"
						onClick={() =>
							handleFolderDelete(
								folder.folder_name,
								setFolderData,
								folder.parent_folder_id,
							)
						}
						className={`${brand.dangerButton} h-10`}>
						Delete
					</button>
				)}
			</div>

			<div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
				<form
					onSubmit={(e) =>
						handleFolderSubmit(
							e,
							setFolderData,
							setFolderName,
							folderName,
							authorizedUser,
							folder.folder_name,
						)
					}
					className="flex flex-col gap-2 sm:flex-row">
					<input
						placeholder="New folder"
						value={folderName}
						onChange={(e) => setFolderName(e.target.value)}
						className={`${brand.input} text-base`}
					/>
					<button
						disabled={folderName.length === 0}
						type="submit"
						className={`${brand.buttonInline} h-12 px-4`}>
						Add folder
					</button>
				</form>
				<label className={`${brand.subtleButton} h-12 cursor-pointer px-4`}>
					Choose file
					<input
						name="file"
						ref={fileInputRef}
						type="file"
						className="hidden"
						onChange={(e) => {
							const selected = e.target.files?.[0];
							setFile(selected);
							setOpen(true);
							setFileFocus(folder.folder_name);
						}}
					/>
				</label>
			</div>

			{file && (
				<div className={brand.note}>
					Selected:{" "}
					<span className="text-[var(--color-text)]">{file.name}</span>
				</div>
			)}

			{filePromptOpen && (
				<form
					onSubmit={uploadFile}
					className="flex flex-col gap-2 sm:flex-row sm:items-center">
					<input
						ref={fileNameInputRef}
						name={folder.folder_name}
						className={`${brand.input} h-12 text-base`}
						placeholder="Name this file"
						onChange={(e) => setFileName(e.target.value)}
						value={fileName}
					/>
					<p className="px-2 text-sm text-[var(--color-muted)]">
						{file &&
							"." +
								file.name.slice(
									file.name.lastIndexOf(".") + 1,
									file.name.length,
								)}
					</p>
					<button
						className={`${brand.buttonInline} h-12 px-4 text-sm`}
						type="submit">
						Upload
					</button>
				</form>
			)}

			{(root || open) && (
				<div
					className={`space-y-3 ${root ? "" : "border-l border-[var(--color-shadow)] pl-4"}`}>
					{children}
					{child &&
						subfolders.map((sfolder, index: number) => (
							<Folder
								style={{ zIndex: index + 1 }}
								folderData={folderData}
								setFileData={setFileData}
								fileData={fileData}
								fileFocus={fileFocus}
								folder={sfolder}
								setFileFocus={setFileFocus}
								root={false}
								setFolderData={setFolderData}
								setStatusMessage={setStatusMessage}
								key={sfolder.folder_id}
								child={true}
							/>
						))}
					<Files
						setFileData={setFileData}
						fileData={fileData}
						folder={folder}
					/>
				</div>
			)}
		</div>
	);
};
