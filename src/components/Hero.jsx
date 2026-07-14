import { useEffect, useState } from 'react'

export default function Hero({ profile, sectionId, site }) {
  const phrases = profile?.heroPhrases?.length
    ? profile.heroPhrases
    : [profile?.description].filter(Boolean)
  const heroCta = site?.heroCta
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (phrases.length <= 1) return undefined

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % phrases.length)
    }, 2600)

    return () => window.clearInterval(timer)
  }, [phrases.length])

  function handlePointerMove(event) {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 18
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 12

    event.currentTarget.style.setProperty('--hero-x', `${x.toFixed(2)}px`)
    event.currentTarget.style.setProperty('--hero-y', `${y.toFixed(2)}px`)
  }

  function handlePointerLeave(event) {
    event.currentTarget.style.setProperty('--hero-x', '0px')
    event.currentTarget.style.setProperty('--hero-y', '0px')
  }

  if (!profile?.name && phrases.length === 0 && !site?.title) return null

  return (
    <section
      className="hero-section"
      data-home-reveal
      id={sectionId}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
    >
      <div className="hero-inner">
        {site?.title && <p className="caption hero-kicker">{site.title}</p>}
        {profile?.name && <h1 className="hero-name">{profile.name}</h1>}
        <div className="hero-phrase-wrap" aria-live="polite">
          {phrases.map((phrase, index) => (
            <p
              className={index === activeIndex ? 'hero-phrase is-active' : 'hero-phrase'}
              key={phrase}
            >
              {phrase}
            </p>
          ))}
        </div>
        {heroCta?.label && heroCta?.href && (
          <a className="hero-cta" href={heroCta.href}>
            {heroCta.label}
          </a>
        )}
      </div>
    </section>
  )
}
