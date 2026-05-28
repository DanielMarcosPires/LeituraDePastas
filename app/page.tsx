"use client"
import SideBar from "./Components/SideBar/SideBar";
import { useFileContext } from "./Context/ContextProvider";
import { useEffect, useState } from "react";

export default function Home() {
  const { selectedFile } = useFileContext()
  const [fileContent, setFileContent] = useState<string>('')

  useEffect(() => {
    if (selectedFile?.fullPath) {
      handleReadFile()
    }
  }, [selectedFile])

  const handleReadFile = async () => {
    if (!selectedFile?.fullPath) return
    
    console.log('🔍 Tentando ler arquivo:', selectedFile.fullPath)
    try {
      const response = await fetch('/api/read-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: selectedFile.fullPath })
      })
      console.log('✅ Resposta recebida:', response.status)
      const result = await response.json()
      console.log('📄 Dados:', result.data)
      if (result.success) {
        setFileContent(result.data)
      }
    } catch (error) {
      console.error('❌ Erro:', error)
    }
  }

  return (
    <>
      <header className="bg-cyan-800 shadow-xl z-20 p-4">
        <h2 className="text-4xl">FilesView</h2>
      </header>
      <main className="grid grid-cols-12 h-screen">
        <SideBar />
        <div className="col-span-9 bg-gray-800 p-6 overflow-auto">
          {fileContent ? (
            <pre className="text-white text-sm font-mono whitespace-pre-wrap">
              {fileContent}
            </pre>
          ) : (
            <p className="text-gray-400">Selecione um arquivo para visualizar seu conteúdo</p>
          )}
        </div>
      </main>
    </>
  );
}
