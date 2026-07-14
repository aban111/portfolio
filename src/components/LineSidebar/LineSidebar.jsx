import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './LineSidebar.css'

const FALLOFF_CURVES = {
  linear: (progress) => progress,
  smooth: (progress) => progress * progress * (3 - 2 * progress),
  sharp: (progress) => progress * progress * progress
}

function normalizeItem(item, index) {
  if (typeof item === 'string') {
    return {
      id: `${item}-${index}`,
      label: item,
      disabled: false
    }
  }

  return {
    id: item.id || `${item.label}-${index}`,
    label: item.label,
    disabled: Boolean(item.disabled),
    ...item
  }
}

export default function LineSidebar({
  items = [],
  accentColor = '#c87a68',
  textColor = '#766c68',
  markerColor = '#c8aaa0',
  showIndex = true,
  showMarker = true,
  proximityRadius = 92,
  maxShift = 12,
  falloff = 'smooth',
  markerLength = 30,
  markerGap = 6,
  tickScale = 0.42,
  scaleTick = true,
  itemGap = 16,
  fontSize = 0.78,
  smoothing = 110,
  defaultActive = 0,
  activeIndex: controlledActiveIndex,
  onItemClick,
  ariaLabel = '页面章节导航',
  className = ''
}) {
  const normalizedItems = useMemo(
    () => items.map((item, index) => normalizeItem(item, index)),
    [items]
  )
  const listRef = useRef(null)
  const itemRefs = useRef([])
  const targetsRef = useRef([])
  const currentRef = useRef([])
  const rafRef = useRef(null)
  const runFrameRef = useRef(null)
  const lastRef = useRef(0)
  const smoothingRef = useRef(smoothing)
  const [internalActiveIndex, setInternalActiveIndex] = useState(defaultActive)
  const isControlled = controlledActiveIndex !== undefined
  const activeIndex = isControlled ? controlledActiveIndex : internalActiveIndex

  const runFrame = useCallback((now) => {
    const delta = Math.min((now - lastRef.current) / 1000, 0.05)
    const smoothingSeconds = Math.max(smoothingRef.current, 1) / 1000
    const interpolation = 1 - Math.exp(-delta / smoothingSeconds)
    let moving = false

    lastRef.current = now

    itemRefs.current.forEach((element, index) => {
      if (!element) return

      const pointerTarget = targetsRef.current[index] || 0
      const target = pointerTarget
      const current = currentRef.current[index] || 0
      const next = current + (target - current) * interpolation
      const settled = Math.abs(target - next) < 0.0015
      const value = settled ? target : next

      currentRef.current[index] = value
      element.style.setProperty('--effect', value.toFixed(4))
      if (!settled) moving = true
    })

    rafRef.current = moving && runFrameRef.current
      ? requestAnimationFrame(runFrameRef.current)
      : null
  }, [])

  const startLoop = useCallback(() => {
    if (rafRef.current !== null) return

    lastRef.current = performance.now()
    rafRef.current = requestAnimationFrame(runFrame)
  }, [runFrame])

  const handlePointerMove = useCallback((event) => {
    const list = listRef.current
    if (!list) return

    const listRect = list.getBoundingClientRect()
    const pointerY = event.clientY - listRect.top
    const ease = FALLOFF_CURVES[falloff] || FALLOFF_CURVES.linear

    itemRefs.current.forEach((element, index) => {
      if (!element || element.dataset.disabled === 'true') {
        targetsRef.current[index] = 0
        return
      }

      const itemCenter = element.offsetTop + element.offsetHeight / 2
      const distance = Math.abs(pointerY - itemCenter)
      const proximity = Math.max(0, 1 - distance / proximityRadius)

      targetsRef.current[index] = ease(proximity)
    })

    startLoop()
  }, [falloff, proximityRadius, startLoop])

  const handlePointerLeave = useCallback(() => {
    targetsRef.current = normalizedItems.map(() => 0)
    startLoop()
  }, [normalizedItems, startLoop])

  const handleClick = useCallback((index, item) => {
    if (item.disabled) return
    if (!isControlled) setInternalActiveIndex(index)
    onItemClick?.(index, item)
  }, [isControlled, onItemClick])

  useEffect(() => {
    smoothingRef.current = smoothing
  }, [smoothing])

  useEffect(() => {
    runFrameRef.current = runFrame
  }, [runFrame])

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, normalizedItems.length)
    targetsRef.current = normalizedItems.map(() => 0)
    currentRef.current = normalizedItems.map(() => 0)

    itemRefs.current.forEach((element, index) => {
      element?.style.setProperty('--effect', String(currentRef.current[index]))
    })
  }, [normalizedItems])

  useEffect(() => () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <nav
      aria-label={ariaLabel}
      className={`line-sidebar${showMarker ? ' line-sidebar--markers' : ''}${scaleTick ? ' line-sidebar--scale-tick' : ''}${className ? ` ${className}` : ''}`}
      style={{
        '--accent-color': accentColor,
        '--text-color': textColor,
        '--marker-color': markerColor,
        '--marker-length': `${markerLength}px`,
        '--marker-gap': `${markerGap}px`,
        '--tick-scale': tickScale,
        '--max-shift': `${maxShift}px`,
        '--item-gap': `${itemGap}px`,
        '--font-size': `${fontSize}rem`,
        '--smoothing': `${smoothing}ms`
      }}
    >
      <ul
        className="line-sidebar__list"
        onPointerLeave={handlePointerLeave}
        onPointerMove={handlePointerMove}
        ref={listRef}
      >
        {normalizedItems.map((item, index) => (
          <li
            className={`line-sidebar__item${item.disabled ? ' is-disabled' : ''}`}
            data-disabled={item.disabled ? 'true' : 'false'}
            key={item.id}
            ref={(element) => {
              itemRefs.current[index] = element
            }}
          >
            <button
              aria-current={activeIndex === index ? 'location' : undefined}
              aria-disabled={item.disabled || undefined}
              className="line-sidebar__button"
              disabled={item.disabled}
              onClick={() => handleClick(index, item)}
              title={item.disabled ? '暂未设置导航' : undefined}
              type="button"
            >
              <span className="line-sidebar__label">
                <span className="line-sidebar__text">{item.label}</span>
              </span>
              {showIndex && (
                <span className="line-sidebar__index">
                  {String(index + 1).padStart(2, '0')}
                </span>
              )}
              {showMarker && <span aria-hidden="true" className="line-sidebar__marker" />}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
