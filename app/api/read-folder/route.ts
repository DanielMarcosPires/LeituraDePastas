import { readdir } from "fs/promises"
import path from "path"

type FolderNode = {
  name: string
  path: string
  isDirectory: boolean
  children?: FolderNode[]
}

class FolderReader {
  constructor(private basePath = "./Storage") {}

  async readFolder(dirPath = this.basePath): Promise<FolderNode[]> {
    const entries = await readdir(dirPath, { withFileTypes: true })

    return entries.map((entry) => {
      const fullPath = path.join(dirPath, entry.name)

      return {
        name: entry.name,
        path: fullPath,
        isDirectory: entry.isDirectory(),
      }
    })
  }

  async readTree(dirPath = this.basePath): Promise<FolderNode[]> {
    const entries = await this.readFolder(dirPath)

    return Promise.all(
      entries.map(async (entry) => {
        if (!entry.isDirectory) return entry

        const children = await this.readTree(entry.path)

        return {
          ...entry,
          children,
        }
      })
    )
  }
}

export async function GET() {
  try {
    const reader = new FolderReader()

    const folders = await reader.readTree()

    return Response.json({
      folders,
    })
  } catch (error) {
    console.error(error)

    return Response.json(
      { error: "Erro ao ler pasta" },
      { status: 500 }
    )
  }
}