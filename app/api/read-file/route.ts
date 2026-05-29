import fs from "fs/promises"
import path from "path"
import { NextRequest, NextResponse } from "next/server"

const BASE_DIR = path.join(process.cwd())

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body?.path || typeof body.path !== "string") {
      return NextResponse.json(
        { success: false, error: "Path inválido" },
        { status: 400 }
      )
    }

    const fullPath = path.resolve(BASE_DIR, body.path)

    const relative = path.relative(BASE_DIR, fullPath)

    if (relative.startsWith("..") || path.isAbsolute(relative)) {
      return NextResponse.json(
        { success: false, error: "Acesso negado" },
        { status: 403 }
      )
    }

    const data = await fs.readFile(fullPath, "utf-8")

    return NextResponse.json({
      success: true,
      data,
    })

  } catch (error) {
    console.error("READ FILE ERROR:", error)

    return NextResponse.json({
      success: false,
      error: String(error),
    }, { status: 500 })
  }
}