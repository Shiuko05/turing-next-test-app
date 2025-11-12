import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No se envió ningún archivo' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
    
  // Guardar en carpeta avatar que hay dentro de uploads
  const filePath = path.join(process.cwd(), 'public/uploads/avatar', file.name)
  await writeFile(filePath, buffer)

  const imageUrl = `/uploads/avatar/${file.name}`

  return NextResponse.json({ url: imageUrl })
}
