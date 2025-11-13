import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

/**
 * POST /api/upload/products
 * 
 * @description Endpoint para subir imágenes de productos
 * @body {File} file - Archivo de imagen a subir
 * @returns {Object} URL pública de la imagen subida
 */

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No se envió ningún archivo' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Guardar en carpeta products que hay dentro de uploads
  const filePath = path.join(process.cwd(), 'public/uploads/products', file.name)
  await writeFile(filePath, buffer)

  const imageUrl = `/uploads/products/${file.name}`

  return NextResponse.json({ url: imageUrl })
}
