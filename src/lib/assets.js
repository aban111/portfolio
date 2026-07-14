const ABSOLUTE_URL_PATTERN = /^(?:[a-z][a-z\d+\-.]*:|\/\/|#)/i

export function getAssetUrl(path) {
  if (!path || ABSOLUTE_URL_PATTERN.test(path)) return path

  if (path.startsWith('/')) {
    return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
  }

  return path
}
