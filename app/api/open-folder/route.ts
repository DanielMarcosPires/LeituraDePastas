import { spawn } from "child_process"
import path from "path"
import { NextResponse } from "next/server"

export async function POST() {
  const folderPath = path.join(process.cwd(), "Storage")

  try {
    const cmd = process.platform === "win32"
      ? "explorer"
      : process.platform === "darwin"
      ? "open"
      : "xdg-open"

    spawn(cmd, [folderPath], {
      detached: true,
      stdio: "ignore",
    }).unref()

    return NextResponse.json({
      success: true,
      message: `Abrindo pasta: ${folderPath}`,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    )
  }
}