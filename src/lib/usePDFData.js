import { useEffect, useState } from 'react'
import { getAssetUrl } from './assets'

const EMPTY_DATA = {
  site: {
    navigation: []
  },
  pages: {},
  profile: {
    about: [],
    contactItems: [],
    links: []
  },
  projects: []
}

function normalizeData(data) {
  return {
    ...EMPTY_DATA,
    ...data,
    site: {
      ...EMPTY_DATA.site,
      ...(data?.site || {})
    },
    pages: {
      ...EMPTY_DATA.pages,
      ...(data?.pages || {})
    },
    profile: {
      ...EMPTY_DATA.profile,
      ...(data?.profile || {}),
      about: Array.isArray(data?.profile?.about)
        ? data.profile.about
        : [data?.profile?.about].filter(Boolean),
      contactItems: Array.isArray(data?.profile?.contactItems) ? data.profile.contactItems : [],
      links: Array.isArray(data?.profile?.links) ? data.profile.links : []
    },
    projects: Array.isArray(data?.projects) ? data.projects : []
  }
}

export function usePDFData() {
  const [data, setData] = useState(EMPTY_DATA)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false

    fetch(getAssetUrl('/data.json'))
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Unable to load portfolio data (${response.status})`)
        }

        return response.json()
      })
      .then((json) => {
        if (ignore) return

        setData(normalizeData(json))
        setError(null)
      })
      .catch((fetchError) => {
        if (ignore) return

        setData(EMPTY_DATA)
        setError(fetchError)
      })
      .finally(() => {
        if (!ignore) setIsLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [])

  return { data, error, isLoading }
}
