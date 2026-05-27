import { existsSync, mkdirSync } from "node:fs";

export class genFolderSystem{
    defaultFolderName = "Storage";

    constructor(folderName=this.defaultFolderName){
        let currentPath = `./${folderName}`

        if (!existsSync(currentPath)){
            mkdirSync(currentPath)
            console.log(`${currentPath} has been created.`)
        }
    }

    public genFolder({folderName="File",path=""}){
        let finalPath = path || `./${this.defaultFolderName}/${folderName}`

        if (folderName !== "File" && finalPath !== `./${this.defaultFolderName}/${folderName}`){
            finalPath = path+`${folderName}`
        }

        try {
            if (!existsSync(finalPath)){
                mkdirSync(finalPath, {recursive:true});
            }
            const messageResult = `${finalPath} has been created.`

            return {
                folderName,
                finalPath,
                messageResult
            }
        } catch (error) {
            console.error(error)
        }
    }
}