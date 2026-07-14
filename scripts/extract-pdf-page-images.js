import fs from 'fs'
import path from 'path'
import zlib from 'zlib'

const source = process.argv[2] || 'public/resume.pdf'
const outputDir = process.argv[3] || 'public/work'
const pdf = fs.readFileSync(source)
const text = pdf.toString('latin1')
const objectPattern = /(\d+)\s+0\s+obj/g
const images = []

function getNumber(header, key) {
  const match = header.match(new RegExp(`/${key}\\s+(\\d+)`))
  return match ? Number(match[1]) : 0
}

for (const match of text.matchAll(objectPattern)) {
  const objectStart = match.index
  const objectEnd = text.indexOf('endobj', objectStart)
  if (objectEnd === -1) continue

  const streamMarker = text.indexOf('stream', objectStart)
  if (streamMarker === -1 || streamMarker > objectEnd) continue

  const header = text.slice(objectStart, streamMarker)
  if (!header.includes('/Subtype /Image') || !header.includes('/DCTDecode')) continue

  const length = getNumber(header, 'Length')
  const width = getNumber(header, 'Width')
  const height = getNumber(header, 'Height')
  if (!length || width < 1500 || height < 800) continue

  let streamStart = streamMarker + 'stream'.length
  if (text[streamStart] === '\r' && text[streamStart + 1] === '\n') streamStart += 2
  else if (text[streamStart] === '\n' || text[streamStart] === '\r') streamStart += 1

  const stream = pdf.subarray(streamStart, streamStart + length)
  const image = header.includes('/FlateDecode') ? zlib.inflateSync(stream) : stream
  images.push({ width, height, image })
}

fs.mkdirSync(outputDir, { recursive: true })

images.forEach((item, index) => {
  const file = path.join(outputDir, `page-${String(index + 1).padStart(2, '0')}.jpg`)
  fs.writeFileSync(file, item.image)
})

console.log(`Extracted ${images.length} page images to ${outputDir}`)
