"use client"
import { FaFolderPlus } from 'react-icons/fa'

interface InfoFolders{
    name:string,
    path:string,
    isDirectory:Boolean,
    children:[{}]
}

export default function SideBar() {
    async function createNewFolder() {
        const response = await fetch("/api/create-folder", { method: "POST" });
        const data = await response.json();

        console.log(data);
    }

    async function getInfoFolders() {
        const response = await fetch("/api/read-folder", { method: "GET" });
        const data = await response.json();

        console.log(data.folders)
    }

    return (
        <aside className="bg-cyan-950 col-span-3">
            <header className="flex items-end justify-between pt-6 pb-2 px-5 bg-cyan-900">
                <h2 className="text-2xl">Folders: </h2>
                <div className="flex justify-end">
                    <button className="flex items-center gap-3 bg-amber-700 p-2 rounded-xl" onClick={createNewFolder}>
                        <p>New Folder</p>
                        <FaFolderPlus size="20" />
                    </button>
                </div>
            </header>
            <button onClick={getInfoFolders}>test</button>
        </aside>
    )
}
