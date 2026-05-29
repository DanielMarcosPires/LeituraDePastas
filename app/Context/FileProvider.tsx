"use client"

import React, {
	createContext,
	useContext,
	useState,
	useMemo,
	useCallback,
	ReactNode,
} from "react";

export type FileInfo = {
	fullPath: string;
	dir: string;
	name: string;
	ext: string;
};

type FileContextType = {
	selectedFile: FileInfo | null;
	setSelectedFile: React.Dispatch<React.SetStateAction<FileInfo | null>>;
	setSelectedFileByPath: (fullPath: string) => void;
};

const FileContext = createContext<FileContextType | undefined>(undefined);

function parseFilePath(fullPath: string): FileInfo {
	const normalized = fullPath.replace(/\\+/g, "/").trim();

	const parts = normalized.split("/");
	const file = parts.pop() || "";

	const dir = parts.join("/");

	const lastDot = file.lastIndexOf(".");

	const hasExtension = lastDot > 0;

	const name = hasExtension ? file.slice(0, lastDot) : file;

	const ext = hasExtension ? file.slice(lastDot + 1) : "";

	return {
		fullPath: normalized,
		dir,
		name,
		ext,
	};
}

export function FileProvider({ children }: { children: ReactNode }) {
	const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);

	const setSelectedFileByPath = useCallback((fullPath: string) => {
		setSelectedFile(parseFilePath(fullPath));
	}, []);

	const value = useMemo(
		() => ({
			selectedFile,
			setSelectedFile,
			setSelectedFileByPath
		}),
		[selectedFile, setSelectedFileByPath]
	);


	return (
		<FileContext.Provider value={value}>
			{children}
		</FileContext.Provider>
	);
}

export function useFileContext() {
	const ctx = useContext(FileContext);
	if (!ctx) {
		throw new Error("useFileContext must be used within FileProvider");
	}

	return ctx;
}

export default FileProvider;
