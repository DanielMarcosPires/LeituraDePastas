import { NextRequest, NextResponse } from "next/server"
import { exec } from "child_process"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const folderPath = path.join(process.cwd(), 'Storage')
    
    // Usar explorer.exe para abrir a pasta no Windows
    exec(`explorer "${folderPath}"`, (error) => {
      if (error) {
        console.error('Erro ao abrir pasta:', error)
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: `Abrindo pasta: ${folderPath}` 
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    )
  }
}
