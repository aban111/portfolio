import { useEffect, useRef } from 'react'
import './HomeAmbientBackground.css'

const BLOB_MOTION = [
  { x: -58, y: -34 },
  { x: 46, y: -42 },
  { x: -34, y: 52 },
  { x: 64, y: 38 }
]

export default function HomeAmbientBackground() {
  const layerRef = useRef(null)

  useEffect(() => {
    const layer = layerRef.current
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer = window.matchMedia('(pointer: fine)').matches

    if (!layer || reducedMotion || !finePointer) return undefined

    const blobs = Array.from(layer.querySelectorAll('[data-ambient-blob]'))
    let frameId = null
    let currentX = 0
    let currentY = 0
    let targetX = 0
    let targetY = 0

    const render = () => {
      currentX += (targetX - currentX) * 0.085
      currentY += (targetY - currentY) * 0.085

      blobs.forEach((blob, index) => {
        const motion = BLOB_MOTION[index]

        blob.style.setProperty('--ambient-shift-x', `${(currentX * motion.x).toFixed(2)}px`)
        blob.style.setProperty('--ambient-shift-y', `${(currentY * motion.y).toFixed(2)}px`)
      })

      const stillMoving = Math.abs(targetX - currentX) > 0.002 || Math.abs(targetY - currentY) > 0.002

      if (stillMoving) {
        frameId = window.requestAnimationFrame(render)
      } else {
        frameId = null
      }
    }

    const scheduleRender = () => {
      if (frameId === null) frameId = window.requestAnimationFrame(render)
    }

    const resetPointer = () => {
      targetX = 0
      targetY = 0
      layer.style.setProperty('--ambient-pointer-x', '50%')
      layer.style.setProperty('--ambient-pointer-y', '42%')
      layer.classList.remove('is-pointer-active')
      scheduleRender()
    }

    const handlePointerMove = (event) => {
      const xRatio = Math.min(1, Math.max(0, event.clientX / window.innerWidth))
      const yRatio = Math.min(1, Math.max(0, event.clientY / window.innerHeight))

      targetX = (xRatio - 0.5) * 2
      targetY = (yRatio - 0.5) * 2
      layer.style.setProperty('--ambient-pointer-x', `${(xRatio * 100).toFixed(2)}%`)
      layer.style.setProperty('--ambient-pointer-y', `${(yRatio * 100).toFixed(2)}%`)
      layer.classList.add('is-pointer-active')
      scheduleRender()
    }

    const handlePointerOut = (event) => {
      if (event.relatedTarget === null) resetPointer()
    }

    window.addEventListener('blur', resetPointer)
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerout', handlePointerOut, { passive: true })

    return () => {
      window.removeEventListener('blur', resetPointer)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerout', handlePointerOut)

      if (frameId !== null) window.cancelAnimationFrame(frameId)
    }
  }, [])

  return (
    <div aria-hidden="true" className="home-ambient-background" ref={layerRef}>
      <span className="home-ambient-background__blob home-ambient-background__blob--coral" data-ambient-blob />
      <span className="home-ambient-background__blob home-ambient-background__blob--sage" data-ambient-blob />
      <span className="home-ambient-background__blob home-ambient-background__blob--peach" data-ambient-blob />
      <span className="home-ambient-background__blob home-ambient-background__blob--mist" data-ambient-blob />
    </div>
  )
}
