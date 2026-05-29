import { useFileContext } from "@/app/Context/FileProvider"
import { useCallback, useEffect, useState } from "react"

type ReadFileResponse = {
    success: boolean
    data: string
}

export default function MainContent() {
    const { selectedFile } = useFileContext()

    const [fileContent, setFileContent] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleReadFile = useCallback(async () => {
        if (!selectedFile?.fullPath) {
            setFileContent("")
            return
        }

        setLoading(true)
        setError(null)
        setFileContent("")

        try {
            const response = await fetch("/api/read-file", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    path: selectedFile.fullPath,
                }),
            })

            const result = await response.json() // 👈 TEM que vir antes

            if (!response.ok) {
                console.error("API error:", result)
                throw new Error(result?.error || "Failed to read file")
            }
            if (result.success) {
                setFileContent(result.data)
            } else {
                throw new Error(result?.error || "Unknown API error")
            }

        } catch (error) {
            console.error("Read file error:", error)
            setError(error instanceof Error ? error.message : "Erro ao ler arquivo")
        } finally {
            setLoading(false)
        }
    }, [selectedFile, setFileContent, setError, setLoading])

    useEffect(() => {
        handleReadFile()
    }, [handleReadFile])

    if (loading) {
        return (
            <p className="text-gray-400">
                Loading file...
            </p>
        )
    }

    if (error) {
        return (
            <p className="text-red-400">
                {error}
            </p>
        )
    }

    console.log(fileContent)

    return (
        <>
            {fileContent ? (
                <pre className="text-white text-sm font-mono p-4 whitespace-pre-wrap">
                    {fileContent}
                </pre>
            ) : (
                <p className="text-gray-400">
                    Selecione um arquivo para visualizar seu conteúdo
                </p>
            )}
        </>
    )
}