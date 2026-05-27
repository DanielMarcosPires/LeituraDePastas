import { NextResponse } from "next/server";
import { genFolderSystem } from "../../module/genFolder";

export async function POST() {
  try {
    const folder = new genFolderSystem();
    const result = folder.genFolder({
        folderName:"viewFolders"
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create folder." }, { status: 500 });
  }
}
