import fs from "fs/promises"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { path } = await request.json()
    const dados = await fs.readFile(path, 'utf-8')
    return NextResponse.json({ success: true, data: dados })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}