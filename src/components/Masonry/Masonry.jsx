import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './Masonry.css'

const MEDIA_QUERIES = ['(min-width: 1280px)', '(min-width: 960px)', '(min-width: 640px)']
const MEDIA_VALUES = [4, 3, 2]
const DEFAULT_GAP = 22
const FOOTER_HEIGHT = 118

function getMediaValue(queries, values, defaultValue) {
  if (typeof window === 'undefined') return defaultValue

  const index = queries.findIndex((query) => window.matchMedia(query).matches)

  return values[index] ?? defaultValue
}

function useMedia(queries, values, defaultValue) {
  const [value, setValue] = useState(() => getMediaValue(queries, values, defaultValue))

  useEffect(() => {
    const handler = () => setValue(getMediaValue(queries, values, defaultValue))
    const mediaLists = queries.map((query) => window.matchMedia(query))

    mediaLists.forEach((mediaList) => mediaList.addEventListener('change', handler))

    return () => mediaLists.forEach((mediaList) => mediaList.removeEventListener('change', handler))
  }, [defaultValue, queries, values])

  return value
}

function useMeasure() {
  const ref = useRef(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    if (!ref.current) return undefined

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect

      setSize({ width, height })
    })

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [])

  return [ref, size]
}

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false

    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = () => setReducedMotion(media.matches)

    media.addEventListener('change', handler)

    return () => media.removeEventListener('change', handler)
  }, [])

  return reducedMotion
}

function preloadImages(items) {
  return Promise.all(
    items.map(
      (item) =>
        new Promise((resolve) => {
          const image = new Image()

          image.src = item.img
          image.onload = () => {
            resolve({
              id: item.id,
              ratio: image.naturalHeight && image.naturalWidth
                ? image.naturalHeight / image.naturalWidth
                : item.ratio || 1.16
            })
          }
          image.onerror = () => {
            resolve({
              id: item.id,
              ratio: item.ratio || 1.16
            })
          }
        })
    )
  )
}

function getInitialPosition(item, animateFrom, container) {
  if (!container) return { x: item.x, y: item.y }

  let direction = animateFrom

  if (direction === 'random') {
    const directions = ['top', 'bottom', 'left', 'right']
    direction = directions[Math.floor(Math.random() * directions.length)]
  }

  switch (direction) {
    case 'top':
      return { x: item.x, y: -item.h - 120 }
    case 'bottom':
      return { x: item.x, y: window.innerHeight + 160 }
    case 'left':
      return { x: -item.w - 120, y: item.y }
    case 'right':
      return { x: window.innerWidth + 120, y: item.y }
    case 'center': {
      const rect = container.getBoundingClientRect()

      return {
        x: rect.width / 2 - item.w / 2,
        y: rect.height / 2 - item.h / 2
      }
    }
    default:
      return { x: item.x, y: item.y + 90 }
  }
}

export default function Masonry({
  items,
  animateFrom = 'bottom',
  duration = 0.6,
  stagger = 0.05,
  ease = 'power3.out',
  blurToFocus = true,
  scaleOnHover = true,
  hoverScale = 0.97,
  colorShiftOnHover = false,
  preserveImageRatio = false,
  onItemClick,
  gap = DEFAULT_GAP
}) {
  const columns = useMedia(MEDIA_QUERIES, MEDIA_VALUES, 1)
  const [containerRef, { width }] = useMeasure()
  const reducedMotion = useReducedMotion()
  const [imageRatios, setImageRatios] = useState({})
  const [imagesReady, setImagesReady] = useState(false)
  const hasMounted = useRef(false)
  const itemRefs = useRef(new Map())

  useEffect(() => {
    let cancelled = false

    preloadImages(items).then((measurements) => {
      if (cancelled) return

      const nextRatios = measurements.reduce((acc, measurement) => {
        acc[measurement.id] = measurement.ratio

        return acc
      }, {})

      setImageRatios(nextRatios)
      setImagesReady(true)
      hasMounted.current = false
    })

    return () => {
      cancelled = true
    }
  }, [items])

  const grid = useMemo(() => {
    if (!width || !imagesReady) return []

    const safeGap = Math.max(0, gap)
    const columnHeights = new Array(columns).fill(0)
    const columnWidth = (width - safeGap * (columns - 1)) / columns

    return items.map((item) => {
      const column = columnHeights.indexOf(Math.min(...columnHeights))
      const naturalRatio = imageRatios[item.id] || item.ratio || 1.16
      const displayRatio = preserveImageRatio
        ? Math.max(naturalRatio, 0.1)
        : Math.min(Math.max(naturalRatio, 0.82), 1.62)
      const imageHeight = columnWidth * displayRatio
      const hasDetails = Boolean(item.index || item.category || item.title || item.description)
      const height = imageHeight + (hasDetails ? FOOTER_HEIGHT : 0)
      const x = column * (columnWidth + safeGap)
      const y = columnHeights[column]

      columnHeights[column] += height + safeGap

      return {
        ...item,
        x,
        y,
        w: columnWidth,
        h: height,
        imageHeight,
        hasDetails
      }
    })
  }, [columns, gap, imageRatios, imagesReady, items, preserveImageRatio, width])

  const containerHeight = useMemo(() => (
    grid.reduce((max, item) => Math.max(max, item.y + item.h), 0)
  ), [grid])

  useLayoutEffect(() => {
    if (!imagesReady || grid.length === 0) return undefined

    if (reducedMotion) {
      grid.forEach((item) => {
        const element = itemRefs.current.get(item.id)

        if (!element) return

        gsap.set(element, {
          opacity: 1,
          x: item.x,
          y: item.y,
          width: item.w,
          height: item.h,
          scale: 1,
          filter: 'blur(0px)'
        })
      })

      hasMounted.current = true
      return undefined
    }

    const context = gsap.context(() => {
      grid.forEach((item, index) => {
        const element = itemRefs.current.get(item.id)

        if (!element) return

        const animationProps = {
          opacity: 1,
          x: item.x,
          y: item.y,
          width: item.w,
          height: item.h,
          scale: 1
        }

        if (!hasMounted.current) {
          const initialPosition = getInitialPosition(item, animateFrom, containerRef.current)

          gsap.fromTo(
            element,
            {
              opacity: 0,
              x: initialPosition.x,
              y: initialPosition.y,
              width: item.w,
              height: item.h,
              scale: 0.985,
              ...(blurToFocus && { filter: 'blur(12px)' })
            },
            {
              ...animationProps,
              ...(blurToFocus && { filter: 'blur(0px)' }),
              duration,
              ease,
              delay: index * stagger
            }
          )
        } else {
          gsap.to(element, {
            ...animationProps,
            duration,
            ease,
            overwrite: 'auto'
          })
        }
      })
    }, containerRef)

    hasMounted.current = true

    return () => context.revert()
  }, [animateFrom, blurToFocus, duration, ease, grid, imagesReady, reducedMotion, stagger, containerRef])

  const handleMouseEnter = (event, item) => {
    if (reducedMotion) return

    const element = itemRefs.current.get(item.id)

    if (element && scaleOnHover) {
      gsap.to(element, {
        scale: hoverScale,
        duration: 0.24,
        ease: 'power2.out',
        overwrite: 'auto'
      })
    }

    if (colorShiftOnHover) {
      const overlay = event.currentTarget.querySelector('.masonry-color-overlay')

      if (overlay) {
        gsap.to(overlay, {
          opacity: 0.18,
          duration: 0.24,
          ease: 'power2.out'
        })
      }
    }
  }

  const handleMouseLeave = (event, item) => {
    if (reducedMotion) return

    const element = itemRefs.current.get(item.id)

    if (element && scaleOnHover) {
      gsap.to(element, {
        scale: 1,
        duration: 0.24,
        ease: 'power2.out',
        overwrite: 'auto'
      })
    }

    if (colorShiftOnHover) {
      const overlay = event.currentTarget.querySelector('.masonry-color-overlay')

      if (overlay) {
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.24,
          ease: 'power2.out'
        })
      }
    }
  }

  if (!items?.length) return null

  return (
    <div
      ref={containerRef}
      className="masonry-list"
      style={{ height: containerHeight || undefined }}
    >
      {grid.map((item) => {
        const isInteractive = typeof onItemClick === 'function'
        const ItemTag = isInteractive ? 'button' : 'figure'
        const interactiveProps = isInteractive
          ? {
              type: 'button',
              'aria-label': `查看 ${item.title || item.label || '项目'}`,
              onClick: () => onItemClick(item)
            }
          : {}

        return (
          <ItemTag
            {...interactiveProps}
            className={`masonry-item ${isInteractive ? 'is-interactive' : 'is-static'}`}
            data-key={item.id}
            key={item.id}
            onMouseEnter={(event) => handleMouseEnter(event, item)}
            onMouseLeave={(event) => handleMouseLeave(event, item)}
            ref={(node) => {
              if (node) {
                itemRefs.current.set(item.id, node)
              } else {
                itemRefs.current.delete(item.id)
              }
            }}
            style={{
              width: item.w,
              height: item.h,
              transform: reducedMotion ? `translate3d(${item.x}px, ${item.y}px, 0)` : undefined,
              opacity: reducedMotion ? 1 : 0
            }}
          >
            <span className="masonry-image-frame" style={{ height: item.imageHeight }}>
              <img src={item.img} alt={item.alt || item.title || ''} loading="lazy" />
              {colorShiftOnHover && <span className="masonry-color-overlay" aria-hidden="true" />}
            </span>
            {item.hasDetails && (
              <span className="masonry-copy">
                {(item.index || item.category) && (
                  <span className="masonry-meta">
                    {item.index && <span>{item.index}</span>}
                    {item.category && <span>{item.category}</span>}
                  </span>
                )}
                {item.title && <strong>{item.title}</strong>}
                {item.description && <span className="masonry-description">{item.description}</span>}
              </span>
            )}
          </ItemTag>
        )
      })}
    </div>
  )
}
