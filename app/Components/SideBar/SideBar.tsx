"use client"
import { FaFolderPlus, FaFolder, FaFile, FaFolderOpen } from 'react-icons/fa'
import { memo, useCallback, useEffect, useState } from 'react'
import { useFileContext } from '@/app/Context/FileProvider'
import { IoReload } from 'react-icons/io5'

interface InfoFolder {
    name: string
    path: string
    isDirectory: boolean
    children?: InfoFolder[]
}

type FolderItemProps = {
    folder: InfoFolder
    level?: number
}

const FolderItem = memo(function FolderItem({
    folder,
    level = 0,
}: FolderItemProps) {
    const [open, setOpen] = useState(false)

    const isFile = !folder.isDirectory

    const Icon = isFile
        ? FaFile
        : open
            ? FaFolderOpen
            : FaFolder

    const { setSelectedFileByPath } = useFileContext()

    const handleClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation()

            if (isFile) {
                setSelectedFileByPath(folder.path)
                return
            }

            if (folder.children?.length) {
                setOpen((prev) => !prev)
            }
        },
        [folder, isFile, setSelectedFileByPath]
    )

    return (
        <div
            style={{ paddingLeft: level * 12 }}
            className="py-1"
        >
            <button
                onClick={handleClick}
                className="flex w-full items-center gap-2 px-4 py-2 hover:bg-black"
            >
                <Icon size={16} />

                <span className="text-lg">
                    {folder.name}
                </span>
            </button>

            {open &&
                folder.children?.map((child) => (
                    <FolderItem
                        key={child.path}
                        folder={child}
                        level={level + 1}
                    />
                ))}
        </div>
    )
})
export default function SideBar() {
    const [folders, setFolders] = useState<InfoFolder[]>([])

    async function initializeStorageFolder() {
        const response = await fetch('/api/create-folder',
            {
                method: 'POST'
            }
        )
        const data = await response.json()
        console.log(data)
        await getInfoFolders()
    }

    async function openStorageFolder() {
        try {
            await initializeStorageFolder()

            const response = await fetch('/api/open-folder', {
                method: 'POST',
            })

            const data = await response.json()

            console.log(data.message)

            await getInfoFolders()
        } catch (error) {
            console.error('Erro ao abrir pasta:', error)
        }
    }

    async function getInfoFolders() {
        try {
            const response = await fetch('/api/read-folder')

            if (!response.ok) {
                throw new Error('Failed to load folders')
            }

            const data = await response.json()

            setFolders(data.folders || [])
        } catch (error) {
            console.error(error)
        }
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
                    <button className="flex z-20 cursor-pointer items-center gap-3 bg-yellow-700 px-4 rounded-xl hover:bg-amber-600 transition" onClick={initializeStorageFolder}>
                        {
                            folders.length === 0 ? <FaFolderPlus /> :
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
