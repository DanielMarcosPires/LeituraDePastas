"use client"
import { FaFolderPlus, FaFolder, FaFile, FaFolderOpen } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { useFileContext } from '@/app/Context/ContextProvider'
import { IoReload } from 'react-icons/io5'

interface InfoFolder {
    name: string
    path: string
    isDirectory: boolean
    children?: InfoFolder[]
}

function FolderItem({ folder, level = 0 }: { folder: InfoFolder; level?: number }) {
    const [open, setOpen] = useState(false)
    const hasExtension = /\.[^./\\]+$/.test(folder.name)
    const hasChildren = !!(folder.children && folder.children.length > 0)
    const { setSelectedFileByPath } = useFileContext()
    function toggle(e: React.MouseEvent) {
        e.stopPropagation()
        if (hasChildren) setOpen((s) => !s)
    }

    function handleClickFile(e: React.MouseEvent) {
        e.stopPropagation()
        if (hasExtension) {
            setSelectedFileByPath(folder.path)
        } else if (hasChildren) {
            setOpen((s) => !s)
        }
    }

    return (
        <div style={{ paddingLeft: `${level * 12}px` }} className="py-1">
            <div
                onClick={handleClickFile}
                className="flex px-4 py-2 hover:bg-black cursor-pointer items-center gap-2"
            >
                {hasExtension ? (
                    <FaFile size={16} />
                ) : open ? (
                    <FaFolderOpen size={16} />
                ) : (
                    <FaFolder size={16} />
                )}
                <span className="text-lg">{folder.name}</span>
            </div>
            {hasChildren && open && (
                <div>
                    {folder.children!.map((child) => (
                        <FolderItem key={child.path} folder={child} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default function SideBar() {
    const [folders, setFolders] = useState<InfoFolder[]>([])

    async function createNewFolder() {
        const response = await fetch('/api/create-folder', { method: 'POST' })
        const data = await response.json()
        console.log(data)
        await getInfoFolders()
    }

    async function openStorageFolder() {
        try {
            createNewFolder()
            const response = await fetch('/api/open-folder', { method: 'POST' })
            const data = await response.json()
            console.log(data.message)
        } catch (error) {
            console.error('Erro ao abrir pasta:', error)
        }
    }

    async function getInfoFolders() {
        const response = await fetch('/api/read-folder', { method: 'GET' })
        const data = await response.json()
        // assume data.folders is an array of InfoFolder
        setFolders(data.folders || [])
    }

    useEffect(() => {
        getInfoFolders()
    }, [])

    return (
        <aside className="bg-gray-900 col-span-3">
            <header className="flex items-end justify-between pt-6 pb-2 px-5 bg-cyan-900">
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={openStorageFolder}
                        className="flex items-center cursor-pointer gap-3 bg-fuchsia-700 p-2 rounded-xl hover:bg-green-600 transition"
                    >
                        <p>Open File</p>
                        <FaFolder size="20" />
                    </button>
                    <button className="flex z-20 cursor-pointer items-center gap-3 bg-yellow-700 px-4 rounded-xl hover:bg-amber-600 transition" onClick={createNewFolder}>
                        {
                            folders.length === 0 ? <FaFolderPlus/>:
                                <>
                                    <IoReload size="20" />
                                </>
                            
                        }
                    </button>
                </div>
            </header>
            <main className="p-4">
                {folders.length === 0 ? (
                    <p className="text-sm text-gray-300">No folders found</p>
                ) : (
                    folders.map((f) => <FolderItem key={f.path} folder={f} />)
                )}
            </main>
        </aside>
    )
}
