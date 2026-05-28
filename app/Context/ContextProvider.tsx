"use client"

import React, { createContext, useContext, useState, ReactNode } from "react";

type FileInfo = {
	fullPath: string;
	dir: string;
	name: string;
	ext: string;
};

type ContextType = {
	selectedFile: FileInfo | null;
	setSelectedFileByPath: (fullPath: string) => void;
};

const Context = createContext<ContextType | undefined>(undefined);

function parseFilePath(fullPath: string): FileInfo {
	// Normalize slashes
	const normalized = fullPath.replace(/\\+/g, "/");
	const parts = normalized.split("/");
	const last = parts.pop() || "";
	const dir = parts.join("/");
	const match = last.match(/^(.*)\.([^.]+)$/);
	const name = match ? match[1] : last;
	const ext = match ? match[2] : "";
	return { fullPath, dir, name, ext };
}

export function ContextProvider({ children }: { children: ReactNode }) {
	const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);

	function setSelectedFileByPath(fullPath: string) {
		const info = parseFilePath(fullPath);
		setSelectedFile(info);
	}

	return (
		<Context.Provider value={{ selectedFile, setSelectedFileByPath }}>
			{children}
		</Context.Provider>
	);
}

export function useFileContext() {
	const ctx = useContext(Context);
	if (!ctx) throw new Error("useFileContext must be used within ContextProvider");
	return ctx;
}

export default ContextProvider;
