// Converts every PNG/JPG in public/images to a resized WebP and removes the original.
// Usage: node scripts/optimize-images.mjs
import { readdir, rm } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const dir = path.resolve('public/images')

for (const file of await readdir(dir)) {
  if (!/\.(png|jpe?g)$/i.test(file)) continue
  const input = path.join(dir, file)
  const output = input.replace(/\.(png|jpe?g)$/i, '.webp')
  // Phone screens are shown small, so they need fewer pixels
  const maxWidth = file.includes('mobile') ? 640 : 1200

  await sharp(input)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(output)
  await rm(input)
  console.log(`${file} -> ${path.basename(output)}`)
}
