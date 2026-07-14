import fs from 'fs'
import pdf from 'pdf-parse'

const file = process.argv[2]

if (!file) {
  console.error('Please provide a PDF file path')
  process.exit(1)
}

const buffer = fs.readFileSync(file)
const dataFile = 'public/data.json'

function readExistingData() {
  try {
    return JSON.parse(fs.readFileSync(dataFile, 'utf8'))
  } catch {
    return {}
  }
}

pdf(buffer).then((data) => {
  const lines = data.text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)

  if (lines.length === 0) {
    console.error('No extractable PDF text found. The PDF appears to be image-based, so public/data.json was not overwritten.')
    process.exit(1)
  }

  const existingData = readExistingData()
  const existingProfile = existingData.profile || {}
  const out = {
    ...existingData,
    profile: {
      name: '',
      tagline: '',
      about: [],
      email: '',
      links: []
    },
    projects: []
  }

  let section = ''
  let currentProject = null
  const projectPrefix = /^[-*•]\s*/

  for (const line of lines) {
    if (/^projects?$/i.test(line)) {
      section = 'projects'
      continue
    }

    if (/^about$/i.test(line)) {
      section = 'about'
      continue
    }

    if (/^contact$/i.test(line)) {
      section = 'contact'
      continue
    }

    if (section === 'about') {
      out.profile.about.push(line)
      continue
    }

    if (section === 'contact') {
      if (line.includes('@')) out.profile.email = out.profile.email || line
      continue
    }

    if (section === 'projects') {
      if (projectPrefix.test(line) || /^[0-9]{4}/.test(line)) {
        if (currentProject) out.projects.push(currentProject)
        currentProject = { title: line.replace(projectPrefix, ''), description: '' }
      } else if (currentProject) {
        currentProject.description += (currentProject.description ? ' ' : '') + line
      }
      continue
    }

    if (!out.profile.name) {
      out.profile.name = line
      continue
    }

    if (!out.profile.tagline) {
      out.profile.tagline = line
    }
  }

  if (currentProject) out.projects.push(currentProject)

  out.profile = {
    ...existingProfile,
    ...out.profile,
    name: out.profile.name || existingProfile.name || '',
    tagline: out.profile.tagline || existingProfile.tagline || '',
    about: out.profile.about.length > 0
      ? out.profile.about
      : Array.isArray(existingProfile.about)
        ? existingProfile.about
        : [existingProfile.about].filter(Boolean),
    email: out.profile.email || existingProfile.email || '',
    links: Array.isArray(existingProfile.links) ? existingProfile.links : []
  }

  fs.writeFileSync(dataFile, `${JSON.stringify(out, null, 2)}\n`)
  console.log(`Wrote ${dataFile}`)
})
