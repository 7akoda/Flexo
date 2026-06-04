export type FileNode = {
	id: string;
	type: "file";
	name: string;
};

export type FolderNode = {
	id: string;
	type: "folder";
	name: string;
	children: Array<FolderNode | FileNode>;
};
