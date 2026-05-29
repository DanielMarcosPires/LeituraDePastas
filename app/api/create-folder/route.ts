import { NextResponse } from "next/server"
import { GenFolderSystem } from "../../module/genFolder"

export async function POST() {
  try {
    const folderSystem = new GenFolderSystem()

    const result = await folderSystem.genFolder({
      folderName: "viewFolders",
    })

    return NextResponse.json({
      success: true,
      data: result,
    })

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create folder.",
      },
      { status: 500 }
    )
  }
}