import fs from "fs";
import { readdir } from "fs/promises";
import path, { join } from "path";


class readFolder {
    async ReadFolder(path = "./Storage") {
        try {
            const folders = await readdir(path, { withFileTypes: true })

            console.log("Folder's Storage found!")
            return folders.map(dirent => ({
                name: dirent.name,
                path: join(path, dirent.name),
                isDirectory: dirent.isDirectory(),
            }))
        } catch (error) {
            console.error(error)
            return []
        }
    }

    async cascadeReadingFolder(folderDataPromise:any) {
        try {
            const folderData = await folderDataPromise
            const result = []

            for (const item of folderData) {
                if (item.isDirectory) {
                    const subfolders = await readdir(item.path, { withFileTypes: true })
                    const children = subfolders.map(dirent => ({
                        name: dirent.name,
                        path: join(item.path, dirent.name),
                        isDirectory: dirent.isDirectory(),
                    }))
                    item.children = await this.cascadeReadingFolder(Promise.resolve(children))
                }
                result.push(item)
            }

            return result
        } catch (error) {
            console.error(error)
            return []
        }
    }
}

export async function GET() {
  const reading = new readFolder()
  const folderData = reading.ReadFolder()
  try {
    const folders = await reading.cascadeReadingFolder(folderData)
    return Response.json({
      folders,
    });
  } catch (erro) {
    return Response.json({
      erro: "Erro ao ler pasta",
    });
  }
}