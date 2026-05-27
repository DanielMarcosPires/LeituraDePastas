import * as fs from 'fs';
import * as path from 'path';

interface FolderContent {
    name: string;
    path: string;
    type: 'file' | 'folder';
    children?: FolderContent[];
}

export class readFolder {
    private viewFoldersPath: string;

    constructor() {
        this.viewFoldersPath = path.join(process.cwd(), 'Storage', 'viewFolders');
    }

    public readFolderRecursive(folderPath: string = this.viewFoldersPath): FolderContent | null {
        try {
            if (!fs.existsSync(folderPath)) {
                console.error(`Pasta não encontrada: ${folderPath}`);
                return null;
            }

            const folderName = path.basename(folderPath);
            const content: FolderContent = {
                name: folderName,
                path: folderPath,
                type: 'folder',
                children: []
            };

            const items = fs.readdirSync(folderPath);

            items.forEach(item => {
                const itemPath = path.join(folderPath, item);
                const stats = fs.statSync(itemPath);

                if (stats.isDirectory()) {
                    const subFolder = this.readFolderRecursive(itemPath);
                    if (subFolder) {
                        content.children!.push(subFolder);
                    }
                } else {
                    content.children!.push({
                        name: item,
                        path: itemPath,
                        type: 'file'
                    });
                }
            });

            return content;
        } catch (error) {
            console.error(`Erro ao ler pasta: ${error}`);
            return null;
        }
    }

    public getFolderInfo(): void {
        const result = this.readFolderRecursive();
        if (result) {
            console.log(JSON.stringify(result, null, 2));
        }
    }
}