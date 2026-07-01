import { useEffect, useRef, useState } from "react";
import { EditSvg } from "../assets/svg/Edit";
import {
	handleFileDelete,
	handleFileDownload,
	handleFileUpdate,
} from "../handlers/file";
import { brand } from "../lib/brand";
import type { folder } from "./Folder";
import { useAuth } from "../store/authStore";

export type file = {
	file_name: string;
	id: string;
	folder_id: string;
	mime_type: string;
};

export type fileProps = {
	folder: folder;
	fileData: file[];
	setFileData: React.Dispatch<React.SetStateAction<file[]>>;
};

export const File = ({ folder, fileData, setFileData }: fileProps) => {
	const authorizedUser = useAuth((state) => state.auth);
	const [update, setUpdate] = useState(false);
	const [fileName, setFileName] = useState("");
	const files = fileData.filter((file) => file.folder_id === folder.folder_id);
	const fileInputRef = useRef<HTMLInputElement>(null);
	useEffect(() => {
		if (update && fileInputRef.current) {
			fileInputRef.current.focus();

			fileInputRef.current.setSelectionRange(
				0,
				fileInputRef.current.value.lastIndexOf("."),
			);
		}
	}, [update]);

	if (!files.length) return null;

	console.log(fileName);

	return (
		<div className="space-y-2 pt-3" onClick={() => update && setUpdate(false)}>
			{files.map((file) => (
				<div
					className={`${brand.surface} flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between`}
					key={file.id}>
					<div className="min-w-0  ">
						<p className={brand.kicker}>File</p>
						<div className="flex flex-row ">
							{!update ? (
								<p className="mt-1 truncate text-base font-medium tracking-[-0.02em] text-(--color-text)">
									{file.file_name}
								</p>
							) : (
								<>
									<form
										className="flex"
										onSubmit={(e) =>
											handleFileUpdate(
												e,
												authorizedUser!,
												file.file_name,
												fileName +
													file.file_name.slice(
														file.file_name.lastIndexOf("."),
														file.file_name.length,
													),
												folder.folder_name,
												setFileData,
											)
										}>
										<input
											className="flex"
											ref={fileInputRef}
											onFocus={() =>
												setFileName(
													file.file_name.slice(0, fileName.lastIndexOf(".")),
												)
											}
											onChange={(e) => setFileName(e.target.value)}
											value={update ? fileName : file.file_name}
										/>
										<p>
											{file.file_name.slice(
												file.file_name.lastIndexOf("."),
												file.file_name.length,
											)}
										</p>
									</form>
								</>
							)}
							{!update && (
								<button
									onClick={() => setUpdate((prev) => !prev)}
									className="mt-2">
									<EditSvg />
								</button>
							)}
						</div>
					</div>
					<div className="flex gap-2 sm:justify-end">
						<button
							onClick={() => handleFileDownload(file.file_name)}
							className={`${brand.subtleButton} h-10`}>
							Download
						</button>
						<button
							onClick={() =>
								handleFileDelete(file.file_name, folder.folder_id, setFileData)
							}
							className={`${brand.dangerButton} h-10`}>
							Delete
						</button>
					</div>
				</div>
			))}
		</div>
	);
};
