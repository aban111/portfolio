import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const dataPath = path.join(root, 'public', 'data.json')
const errors = []

function check(condition, message) {
  if (!condition) errors.push(message)
}

function localFileExists(url) {
  if (typeof url !== 'string' || !url.startsWith('/')) return true
  return fs.existsSync(path.join(root, 'public', url.slice(1)))
}

function addAsset(assets, url, context) {
  if (!url) return
  assets.push({ context, url })
}

let data

try {
  data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
} catch (error) {
  console.error(`Unable to parse ${dataPath}: ${error.message}`)
  process.exit(1)
}

check(data?.site && typeof data.site === 'object', 'Missing site configuration')
check(Array.isArray(data?.site?.navigation), 'site.navigation must be an array')
check(typeof data?.profile?.name === 'string' && data.profile.name.length > 0, 'Missing profile.name')
check(Array.isArray(data?.projects) && data.projects.length > 0, 'projects must be a non-empty array')

const projects = Array.isArray(data?.projects) ? data.projects : []
const ids = new Set()
const assets = []

projects.forEach((project, projectIndex) => {
  const context = `projects[${projectIndex}]`

  check(typeof project.id === 'string' && project.id.length > 0, `${context} is missing id`)
  check(typeof project.title === 'string' && project.title.length > 0, `${context} is missing title`)
  check(!ids.has(project.id), `Duplicate project id: ${project.id}`)
  ids.add(project.id)

  const images = Array.isArray(project.images) ? project.images : []
  const workImages = Array.isArray(project.workImages) ? project.workImages : []

  images.forEach((image, index) => addAsset(assets, image?.src, `${project.id}.images[${index}]`))
  workImages.forEach((url, index) => addAsset(assets, url, `${project.id}.workImages[${index}]`))

  if (Array.isArray(project.process)) {
    project.process.forEach((section, sectionIndex) => {
      const indexes = Array.isArray(section.imageIndexes) ? section.imageIndexes : []

      indexes.forEach((imageIndex) => {
        check(
          Number.isInteger(imageIndex) && imageIndex >= 0 && imageIndex < images.length,
          `${project.id}.process[${sectionIndex}] references invalid image index ${imageIndex}`,
        )
      })
    })
  }

  const cases = Array.isArray(project.strategyCases) ? project.strategyCases : []

  cases.forEach((item, caseIndex) => {
    const caseContext = `${project.id}.strategyCases[${caseIndex}]`
    const analyses = Array.isArray(item.imageAnalysis?.items) ? item.imageAnalysis.items : []
    const shelfImages = Array.isArray(item.shelfEngine?.images) ? item.shelfEngine.images : []

    analyses.forEach((entry, index) => addAsset(assets, entry.image, `${caseContext}.imageAnalysis[${index}]`))
    shelfImages.forEach((image, index) => addAsset(assets, image.src, `${caseContext}.shelfEngine[${index}]`))
    addAsset(assets, item.kvFocus?.image, `${caseContext}.kvFocus`)
    addAsset(assets, item.posterAnalysis?.image, `${caseContext}.posterAnalysis`)
  })
})

addAsset(assets, data?.profile?.source?.replace(/^public\//, '/'), 'profile.source')

assets.forEach(({ context, url }) => {
  check(localFileExists(url), `Missing asset ${url} referenced by ${context}`)
})

if (errors.length > 0) {
  console.error(`Portfolio data validation failed with ${errors.length} error(s):`)
  errors.forEach((error) => console.error(`- ${error}`))
  process.exit(1)
}

console.log(`Validated ${projects.length} projects and ${assets.length} local asset references.`)
