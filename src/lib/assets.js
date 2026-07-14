const ABSOLUTE_URL_PATTERN = /^(?:[a-z][a-z\d+\-.]*:|\/\/|#)/i

function getProductionAssetRoot() {
  const moduleUrl = new URL(import.meta.url)

  moduleUrl.pathname = moduleUrl.pathname.replace(/\/[^/]+\/[^/]+$/, '/')
  moduleUrl.search = ''
  moduleUrl.hash = ''

  return moduleUrl
}

const PRODUCTION_ASSET_ROOT = getProductionAssetRoot()

export function getAssetUrl(path) {
  if (!path || ABSOLUTE_URL_PATTERN.test(path)) return path

  if (path.startsWith('/')) {
    if (import.meta.env.DEV) return path

    return new URL(path.replace(/^\/+/, ''), PRODUCTION_ASSET_ROOT).href
  }

  return path
}
