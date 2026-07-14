import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import BabyFirstDetail from './BabyFirstDetail/BabyFirstDetail'
import FangyuanDetail from './FangyuanDetail/FangyuanDetail'
import LineSidebar from './LineSidebar/LineSidebar'
import Masonry from './Masonry/Masonry'
import MapleGiftDetail from './MapleGiftDetail/MapleGiftDetail'
import ProjectFooterNav from './ProjectFooterNav/ProjectFooterNav'
import ShanhaijingDetail from './ShanhaijingDetail/ShanhaijingDetail'
import ZhengdaDetail from './ZhengdaDetail/ZhengdaDetail'
import { getAssetUrl } from '../lib/assets'

function getImageAlt(projectTitle, image, index) {
  return image?.alt || `${projectTitle} 作品展示 ${index + 1}`
}

function SemanticTitle({ as: Tag, lines, text }) {
  const titleLines = Array.isArray(lines) && lines.length > 0 ? lines : [text].filter(Boolean)

  if (!titleLines.length) return null

  return (
    <Tag>
      {titleLines.map((line) => (
        <span key={line}>{line}</span>
      ))}
    </Tag>
  )
}

function getPercentNumber(label) {
  const match = String(label || '').match(/-?\d+(?:\.\d+)?/)

  return match ? Number(match[0]) : null
}

function getChartAxisLabels(chart) {
  const topLabel = chart[0]?.valueLabel || '100%'
  const topValue = getPercentNumber(topLabel)
  const middleLabel = Number.isFinite(topValue) ? `${(topValue / 2).toFixed(1)}%` : '50%'

  return [topLabel, middleLabel, '0%']
}

function StoryMedia({ images, layout = 'single', projectTitle, eager = false }) {
  if (!images?.length) return null

  const resolvedLayout = images.length === 1 ? 'single' : layout || 'stack'

  return (
    <div className={`story-media story-media--${resolvedLayout}`} data-reveal>
      {images.map((image, index) => (
        <figure className="story-media-item" key={image.src}>
          <img
            alt={getImageAlt(projectTitle, image, index)}
            loading={eager && index === 0 ? 'eager' : 'lazy'}
            src={getAssetUrl(image.src)}
          />
          {image.caption && <figcaption className="story-image-caption caption">{image.caption}</figcaption>}
        </figure>
      ))}
    </div>
  )
}

function ProjectNavAnchor({ targetId }) {
  if (!targetId) return null

  return (
    <span
      aria-hidden="true"
      className="project-nav-anchor"
      data-project-nav-anchor={targetId}
    />
  )
}

function StorySection({ section, images, projectTitle, anchorId }) {
  const sectionImages = (section.imageIndexes || [])
    .map((imageIndex) => images[imageIndex])
    .filter(Boolean)

  return (
    <section className="story-section" id={anchorId}>
      <ProjectNavAnchor targetId={anchorId} />
      <div className="story-copy" data-reveal>
        {section.caption && <p className="caption">{section.caption}</p>}
        <SemanticTitle as="h2" lines={section.titleLines} text={section.title} />
        {Array.isArray(section.body) && section.body.length > 0 && (
          <div className="story-paragraphs">
            {section.body.map((paragraph) => (
              <p className="story-paragraph" key={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </div>

      <StoryMedia
        images={sectionImages}
        layout={section.layout}
        projectTitle={projectTitle}
      />
    </section>
  )
}

function StrategySection({ strategy, anchorId }) {
  if (!strategy) return null

  const pillars = Array.isArray(strategy.pillars) ? strategy.pillars : []
  const metrics = Array.isArray(strategy.metrics) ? strategy.metrics : []

  return (
    <section className="story-strategy" data-reveal id={anchorId}>
      <ProjectNavAnchor targetId={anchorId} />
      <div className="story-copy story-strategy-heading">
        {strategy.caption && <p className="caption">{strategy.caption}</p>}
        <SemanticTitle as="h2" lines={strategy.titleLines} text={strategy.title} />
        {strategy.description && <p className="story-paragraph">{strategy.description}</p>}
      </div>

      {pillars.length > 0 && (
        <div className="strategy-map">
          {pillars.map((pillar) => (
            <div
              className={`strategy-pillar${pillar.variant ? ` strategy-pillar--${pillar.variant}` : ''}`}
              key={pillar.label}
            >
              {Array.isArray(pillar.items) && pillar.items.length > 0 && (
                <ul>
                  {pillar.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              <div className="strategy-pillar-title">
                <span>{pillar.label}</span>
                {pillar.sub && <small>{pillar.sub}</small>}
              </div>
            </div>
          ))}
        </div>
      )}

      {(strategy.goal || metrics.length > 0) && (
        <div className="strategy-result">
          {strategy.goal && <p className="strategy-goal">{strategy.goal}</p>}
          {metrics.length > 0 && (
            <div className="strategy-metrics">
              {metrics.map((metric) => (
                <article className="strategy-metric" key={metric.label}>
                  <div className="strategy-metric-row">
                    <span className="strategy-tag">{metric.label}</span>
                    <p>{metric.text}</p>
                  </div>
                  {metric.action && (
                    <div className="strategy-metric-row">
                      <span className="strategy-tag strategy-tag--action">{strategy.actionLabel}</span>
                      <p>{metric.action}</p>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}

function StrategyCaseSection({ cases }) {
  const [activeCalloutKey, setActiveCalloutKey] = useState(null)
  const calloutClearTimer = useRef(null)

  const showCallout = (key) => {
    if (calloutClearTimer.current) {
      window.clearTimeout(calloutClearTimer.current)
      calloutClearTimer.current = null
    }

    setActiveCalloutKey(key)
  }

  const scheduleCalloutClear = () => {
    if (calloutClearTimer.current) window.clearTimeout(calloutClearTimer.current)

    calloutClearTimer.current = window.setTimeout(() => {
      setActiveCalloutKey(null)
      calloutClearTimer.current = null
    }, 120)
  }

  useEffect(() => () => {
    if (calloutClearTimer.current) window.clearTimeout(calloutClearTimer.current)
  }, [])

  if (!Array.isArray(cases) || cases.length === 0) return null

  return (
    <div className="strategy-cases">
      {cases.map((item) => {
        const chart = Array.isArray(item.chart) ? item.chart : []
        const insights = Array.isArray(item.insights) ? item.insights : []
        const imageAnalysis = Array.isArray(item.imageAnalysis?.items) ? item.imageAnalysis.items : []
        const kvFocus = item.kvFocus
        const kvLeft = Array.isArray(kvFocus?.left) ? kvFocus.left : []
        const kvRight = Array.isArray(kvFocus?.right) ? kvFocus.right : []
        const shelfEngine = item.shelfEngine
        const shelfImages = Array.isArray(shelfEngine?.images) ? shelfEngine.images : []
        const shelfNotes = Array.isArray(shelfEngine?.notes) ? shelfEngine.notes : []
        const posterAnalysis = item.posterAnalysis
        const posterLeft = Array.isArray(posterAnalysis?.left) ? posterAnalysis.left : []
        const posterRight = Array.isArray(posterAnalysis?.right) ? posterAnalysis.right : []
        const posterTags = Array.isArray(posterAnalysis?.tags) ? posterAnalysis.tags : []
        const solutions = Array.isArray(item.solutions) ? item.solutions : []
        const chartMax = chart.reduce((max, bar) => Math.max(max, Number(bar.value) || 0), 0) || 100
        const chartAxisLabels = getChartAxisLabels(chart)

        return (
          <section className="strategy-case" data-reveal key={item.title}>
            <div className="strategy-case-heading">
              {item.caption && <p className="caption">{item.caption}</p>}
              <SemanticTitle as="h2" lines={item.titleLines} text={item.title} />
            </div>

            {imageAnalysis.length > 0 && (
              <div className="case-image-analysis">
                {imageAnalysis.map((entry) => {
                  const notes = Array.isArray(entry.notes) ? entry.notes : []
                  const callouts = Array.isArray(entry.callouts)
                    ? entry.callouts
                    : notes.map((note, index) => ({
                        text: note,
                        x: 72,
                        y: 20 + index * 18
                      }))
                  const panelKey = `${item.title}-${entry.brand}`
                  const isPanelEmphasizing = activeCalloutKey?.startsWith(`${panelKey}-`)

                  return (
                    <article
                      className={[
                        'case-image-panel',
                        `case-image-panel--${entry.variant || 'default'}`,
                        isPanelEmphasizing ? 'is-emphasizing' : ''
                      ].filter(Boolean).join(' ')}
                      key={entry.brand}
                    >
                      {entry.image && (
                        <figure className="case-image-frame">
                          <div className="case-annotated-media" data-reveal>
                            <img src={getAssetUrl(entry.image)} alt={entry.alt || `${entry.brand} 竞店视觉分析`} loading="lazy" />
                            {callouts.length > 0 && (
                              <div className="case-hotspots" aria-hidden="true">
                                {callouts.map((callout, index) => {
                                  const calloutKey = `${panelKey}-${index}`
                                  const isActive = activeCalloutKey === calloutKey

                                  return (
                                    <span
                                      className={isActive ? 'case-connector is-active' : 'case-connector'}
                                      key={`${entry.brand}-${callout.text || index}-connector`}
                                      onPointerEnter={() => showCallout(calloutKey)}
                                      onPointerLeave={scheduleCalloutClear}
                                      style={{
                                        '--hotspot-x': `${callout.x ?? 72}%`,
                                        '--hotspot-y': `${callout.y ?? 50}%`,
                                        '--callout-delay': `${index * 150}ms`
                                      }}
                                    />
                                  )
                                })}
                                {callouts.map((callout, index) => {
                                  const calloutKey = `${panelKey}-${index}`
                                  const isActive = activeCalloutKey === calloutKey

                                  return (
                                    <span
                                      className={isActive ? 'case-hotspot is-active' : 'case-hotspot'}
                                      key={`${entry.brand}-${callout.text || index}`}
                                      onPointerEnter={() => showCallout(calloutKey)}
                                      onPointerLeave={scheduleCalloutClear}
                                      style={{
                                        '--hotspot-x': `${callout.x ?? 72}%`,
                                        '--hotspot-y': `${callout.y ?? 50}%`,
                                        '--callout-delay': `${index * 150}ms`
                                      }}
                                    />
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        </figure>
                      )}
                      <div className="case-image-copy" data-reveal>
                        <p className="case-brand">{entry.brand}</p>
                        {callouts.length > 0 && (
                          <div className="case-callout-list">
                            {callouts.map((callout, index) => {
                              const calloutKey = `${panelKey}-${index}`
                              const isActive = activeCalloutKey === calloutKey

                              return (
                                <p
                                  className={isActive ? 'case-callout is-active' : 'case-callout'}
                                  key={`${entry.brand}-${callout.text || index}`}
                                  onPointerEnter={() => showCallout(calloutKey)}
                                  onPointerLeave={scheduleCalloutClear}
                                  style={{
                                    '--callout-y': `${callout.y ?? 50}%`,
                                    '--callout-delay': `${index * 150}ms`
                                  }}
                                >
                                  {callout.text}
                                </p>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </article>
                  )
                })}
              </div>
            )}

            {kvFocus && (
              <div className="kv-focus">
                <div className="kv-focus-copy kv-focus-copy--left">
                  {kvLeft.map((block) => {
                    const paragraphs = Array.isArray(block.text) ? block.text : [block.text].filter(Boolean)

                    return (
                      <article className="kv-focus-point" key={block.title}>
                        <h3>{block.title}</h3>
                        {paragraphs.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </article>
                    )
                  })}
                </div>

                {kvFocus.image && (
                  <figure className="kv-focus-media">
                    <img src={getAssetUrl(kvFocus.image)} alt={kvFocus.alt || `${item.title} 页面设计`} loading="lazy" />
                  </figure>
                )}

                <div className="kv-focus-copy kv-focus-copy--right">
                  {kvRight.map((block) => {
                    const paragraphs = Array.isArray(block.text) ? block.text : [block.text].filter(Boolean)

                    return (
                      <article className="kv-focus-point" key={block.title}>
                        <h3>{block.title}</h3>
                        {paragraphs.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </article>
                    )
                  })}

                  {kvFocus.metric && (
                    <div className="kv-focus-metric">
                      <p>{kvFocus.metric.label}</p>
                      <strong>{kvFocus.metric.value}</strong>
                      {kvFocus.metric.detail && <span>{kvFocus.metric.detail}</span>}
                    </div>
                  )}
                </div>
              </div>
            )}

            {shelfEngine && (
              <div className="shelf-engine">
                <div className="shelf-engine-gallery">
                  {shelfImages.map((image, index) => (
                    <figure className={`shelf-phone shelf-phone--${index + 1}`} key={image.src}>
                      <img src={getAssetUrl(image.src)} alt={image.alt || image.label || item.title} loading="lazy" />
                      {image.label && <figcaption>{image.label}</figcaption>}
                    </figure>
                  ))}
                </div>

                <div className="shelf-engine-copy">
                  {shelfNotes.map((note) => {
                    const paragraphs = Array.isArray(note.text) ? note.text : [note.text].filter(Boolean)

                    return (
                      <article className="kv-focus-point" key={note.title}>
                        <h3>{note.title}</h3>
                        {paragraphs.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </article>
                    )
                  })}

                  {shelfEngine.metric && (
                    <div className="kv-focus-metric shelf-engine-metric">
                      <p>{shelfEngine.metric.label}</p>
                      <strong>{shelfEngine.metric.value}</strong>
                    </div>
                  )}
                </div>
              </div>
            )}

            {posterAnalysis && (
              <div className="poster-analysis">
                {posterAnalysis.subtitle && <p className="poster-analysis-subtitle">{posterAnalysis.subtitle}</p>}

                <div className="poster-analysis-layout">
                  <div className="poster-callouts poster-callouts--left">
                    {posterLeft.map((callout, index) => {
                      const text = typeof callout === 'string' ? callout : callout.text
                      if (!text) return null

                      return (
                        <p
                          className="poster-callout"
                          key={text}
                          style={{ '--poster-delay': `${index * 110}ms` }}
                        >
                          {text}
                        </p>
                      )
                    })}
                  </div>

                  {posterAnalysis.image && (
                    <figure className="poster-analysis-media">
                      <img src={getAssetUrl(posterAnalysis.image)} alt={posterAnalysis.alt || item.title} loading="lazy" />
                    </figure>
                  )}

                  <div className="poster-callouts poster-callouts--right">
                    {posterRight.map((callout, index) => {
                      const text = typeof callout === 'string' ? callout : callout.text
                      if (!text) return null

                      return (
                        <p
                          className="poster-callout"
                          key={text}
                          style={{ '--poster-delay': `${index * 110}ms` }}
                        >
                          {text}
                        </p>
                      )
                    })}
                  </div>
                </div>

                {posterTags.length > 0 && (
                  <div className="poster-tags">
                    {posterTags.map((tag, index) => (
                      <span key={tag} style={{ '--poster-delay': `${index * 110}ms` }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {(chart.length > 0 || insights.length > 0) && (
              <div className="strategy-case-grid">
                {chart.length > 0 && (
                  <div className="case-chart">
                    <div className="case-chart-head">
                      {item.chartTitle && <p className="case-chart-title">{item.chartTitle}</p>}
                    </div>
                    <div
                      className="case-chart-plot"
                      aria-label={`${item.chartTitle || '核心转化指标'}：${chart.map((bar) => `${bar.label} ${bar.valueLabel}`).join('，')}`}
                      role="img"
                    >
                      <div className="case-chart-axis" aria-hidden="true">
                        {chartAxisLabels.map((label) => (
                          <span key={label}>{label}</span>
                        ))}
                      </div>
                      {item.chartBenchmark && (
                        <p className="case-chart-benchmark">
                          <span>{item.chartBenchmark}</span>
                        </p>
                      )}
                      <div className="case-bars" aria-hidden="true">
                      {chart.map((bar) => (
                        <div
                          className="case-bar"
                          key={bar.label}
                          style={{ '--bar-height': `${Math.max(0, Math.min(1, (Number(bar.value) || 0) / chartMax)) * 100}%` }}
                        >
                          <span className="case-bar-column">
                            <strong className="case-bar-value">{bar.valueLabel}</strong>
                            <span className="case-bar-fill" />
                          </span>
                          <small className="case-bar-label">{bar.label}</small>
                        </div>
                      ))}
                      </div>
                    </div>
                  </div>
                )}

                {insights.length > 0 && (
                  <div className="case-insights">
                    {insights.map((insight) => (
                      <p key={insight.label}>
                        <strong>{insight.label}</strong>
                        {insight.text}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {(item.problem || solutions.length > 0) && (
              <div className="case-solution">
                {item.problem && (
                  <article className="case-solution-row case-solution-row--problem">
                    <span>{item.problem.label}</span>
                    <p>{item.problem.text}</p>
                  </article>
                )}

                {solutions.length > 0 && (
                  <article className="case-solution-row">
                    <span>{item.solutionLabel}</span>
                    <div className="case-solution-cards">
                      {solutions.map((solution) => (
                        <div className="case-solution-card" key={solution.title}>
                          <h3>{solution.title}</h3>
                          <p>{solution.text}</p>
                        </div>
                      ))}
                    </div>
                  </article>
                )}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}

const ASUS_DETAIL_NAV_ITEMS = [
  { id: 'overview', label: '概述', targetId: 'asus-overview' },
  { id: 'shop-analysis', label: '分析', targetId: 'asus-shop-analysis' },
  { id: 'design-breakdown', label: '策略', targetId: 'asus-design-breakdown' },
  { id: 'main-images', label: '主图', targetId: 'asus-main-images' },
  { id: 'promotions', label: '推广', targetId: 'asus-promotions' },
  { id: 'summary', label: '小结', targetId: 'asus-summary' }
]

function ProjectLineNavigation() {
  const [activeIndex, setActiveIndex] = useState(0)
  const lockedIndexRef = useRef(null)
  const syncActiveRef = useRef(null)
  const unlockTimerRef = useRef(null)

  useEffect(() => {
    const anchors = ASUS_DETAIL_NAV_ITEMS
      .map((item, index) => ({
        element: document.querySelector(`[data-project-nav-anchor="${item.targetId}"]`),
        index
      }))
      .filter((item) => item.element)

    if (!anchors.length) return undefined

    const updateActiveItem = () => {
      if (lockedIndexRef.current !== null) {
        setActiveIndex(lockedIndexRef.current)
        return
      }

      const activationLine = window.innerHeight * 0.48
      const nextIndex = anchors.reduce((currentIndex, anchor) => (
        anchor.element.getBoundingClientRect().top <= activationLine
          ? anchor.index
          : currentIndex
      ), 0)

      setActiveIndex((currentIndex) => (
        currentIndex === nextIndex ? currentIndex : nextIndex
      ))
    }
    const observer = new IntersectionObserver(updateActiveItem, {
      rootMargin: '0px 0px -52% 0px',
      threshold: [0, 1]
    })

    syncActiveRef.current = updateActiveItem
    anchors.forEach(({ element }) => observer.observe(element))
    updateActiveItem()

    return () => {
      observer.disconnect()
      syncActiveRef.current = null
      if (unlockTimerRef.current !== null) window.clearTimeout(unlockTimerRef.current)
    }
  }, [])

  const handleItemClick = (index, item) => {
    if (!item.targetId) return

    const target = document.getElementById(item.targetId)
    if (!target) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (unlockTimerRef.current !== null) window.clearTimeout(unlockTimerRef.current)
    lockedIndexRef.current = index
    setActiveIndex(index)
    target.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'start'
    })
    window.history.replaceState(null, '', `#${item.targetId}`)

    unlockTimerRef.current = window.setTimeout(() => {
      lockedIndexRef.current = null
      unlockTimerRef.current = null
      syncActiveRef.current?.()
    }, reducedMotion ? 180 : 1200)
  }

  return (
    <aside className="project-line-sidebar-shell">
      <LineSidebar
        activeIndex={activeIndex}
        accentColor="var(--story-accent)"
        ariaLabel="华硕项目章节导航"
        fontSize={0.76}
        itemGap={15}
        items={ASUS_DETAIL_NAV_ITEMS}
        markerColor="color-mix(in srgb, var(--story-accent) 34%, transparent)"
        markerGap={7}
        markerLength={40}
        maxShift={7}
        onItemClick={handleItemClick}
        proximityRadius={78}
        smoothing={120}
        textColor="color-mix(in srgb, var(--muted) 74%, transparent)"
      />
    </aside>
  )
}

const MAIN_IMAGE_ASSETS = Array.from({ length: 21 }, (_, index) => {
  const number = String(index + 1).padStart(2, '0')

  return {
    id: index + 1,
    label: number,
    hue: (index * 17 + 338) % 360,
    src: `/work/asus/main-images/main-image-${number}.png`,
    alt: `华硕电商主图 ${index + 1}`
  }
})

const PROMOTION_IMAGE_ORDER = [
  1, 11, 14, 2, 15, 20, 3, 16, 21, 4, 17, 22, 5,
  18, 23, 6, 19, 24, 7, 25, 8, 9, 10
]

const PROMOTION_MASONRY_ITEMS = PROMOTION_IMAGE_ORDER.map((imageNumber) => {
  const number = String(imageNumber).padStart(2, '0')

  return {
    id: `asus-promotion-${number}`,
    img: getAssetUrl(`/work/asus/promotion/promotion-${number}.jpg`),
    alt: `华硕推广视觉设计 ${imageNumber}`
  }
})

function PromotionMasonrySection() {

  return (
    <section
      aria-labelledby="project-masonry-title"
      className="project-masonry-section"
      data-reveal
      id="asus-promotions"
    >
      <ProjectNavAnchor targetId="asus-promotions" />
      <div className="strategy-case-heading project-masonry-heading">
        <p className="caption">PROMOTION DESIGN</p>
        <h2 id="project-masonry-title">
          <span>推广图展示</span>
        </h2>
        <p className="project-masonry-lead">
          横版、方版与竖版推广物料，按原始比例完整呈现。
        </p>
      </div>

      <Masonry
        items={PROMOTION_MASONRY_ITEMS}
        animateFrom="bottom"
        duration={0.6}
        stagger={0.05}
        ease="power3.out"
        blurToFocus
        preserveImageRatio
        scaleOnHover
        hoverScale={0.97}
        colorShiftOnHover={false}
      />
    </section>
  )
}

function MainImageShowcase() {
  const rows = Array.from({ length: 3 }, (_, rowIndex) =>
    MAIN_IMAGE_ASSETS.slice(rowIndex * 7, rowIndex * 7 + 7)
  )

  return (
    <section
      aria-labelledby="main-image-showcase-title"
      className="main-image-section"
      data-reveal
      id="asus-main-images"
    >
      <ProjectNavAnchor targetId="asus-main-images" />
      <div className="strategy-case-heading main-image-heading">
        <p className="caption">12 / Main Image Gallery</p>
        <h2 id="main-image-showcase-title">
          <span>主图设计展示</span>
        </h2>
      </div>

      <div
        className="main-image-showcase"
        aria-label="21 张主图，三行循环滚动"
      >
        {rows.map((row, rowIndex) => (
          <div className={`main-image-row main-image-row--${rowIndex + 1}`} key={rowIndex}>
            <div className="main-image-track">
              {[false, true].map((isDuplicate) => (
                <div className="main-image-sequence" aria-hidden={isDuplicate || undefined} key={String(isDuplicate)}>
                  {row.map((item) => (
                    <figure
                      className="main-image-card"
                      key={`${item.id}-${isDuplicate ? 'duplicate' : 'original'}`}
                      style={{ '--placeholder-hue': item.hue }}
                    >
                      <img
                        className="main-image-asset"
                        src={getAssetUrl(item.src)}
                        alt={isDuplicate ? '' : item.alt}
                        loading="lazy"
                      />
                      <figcaption>MAIN IMAGE {item.label}</figcaption>
                    </figure>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </section>
  )
}

const SUMMARY_WORKFLOW_STEPS = [
  {
    title: '参考图收集',
    note: '增加 AIGC 和 3D 视觉素材库'
  },
  {
    title: '书写关键词',
    note: '将高频关键词沉淀到模板库'
  },
  {
    title: 'AIGC 制作',
    note: '将可复用性强的内容保存到素材库'
  },
  {
    title: '后期调试',
    note: '持续完成成图调试和关键词迭代'
  }
]

const SUMMARY_CORE_METRICS = [
  { label: '转化率', value: '18.4%', trend: '提升' },
  { label: '客单价', value: '+720 ¥', trend: '提升' }
]

const SUMMARY_SUPPORT_METRICS = [
  { className: 'summary-support-metric--ctr', label: '点击率', value: '+23.6%', trend: 'up' },
  { className: 'summary-support-metric--sales', label: '销售达成率', value: '+22.4%', trend: 'up' },
  { className: 'summary-support-metric--bounce', label: '综合跳失率', value: '-5.5%', trend: 'down' },
  { className: 'summary-support-metric--satisfaction', label: '匹配满意度', value: '6.8 → 8.2', trend: 'up' }
]

const SUMMARY_RETROSPECTIVES = [
  {
    title: '设计方案复盘',
    items: [
      {
        label: '核心策略',
        text: '通过将硬核参数转化为用户可感知的利益点，降低认知门槛，驱动转化率提升。'
      },
      {
        label: '迭代方向',
        text: '当前卖点以静态图文为主，下一步将引入动效或短视频切片展示性能跑分与散热风道，进一步降低理解成本。'
      }
    ]
  },
  {
    title: '可复用方法论',
    items: [
      {
        label: '首屏信息',
        text: '必须包含价格锚点、核心利益和信任背书三个要素，确保 3 秒内抓住用户注意力。'
      },
      {
        label: '组件复用',
        text: '建立跨品类组件体系，支持运营快速替换素材并提升设计效率。'
      },
      {
        label: '验收清单',
        text: '上线前检查清晰度、加载速度、多端兼容、文案合规和数据埋点，减少返工。'
      }
    ]
  }
]

function ProjectSummarySection() {
  return (
    <section
      aria-labelledby="project-summary-title"
      className="project-summary-section"
      id="asus-summary"
    >
      <ProjectNavAnchor targetId="asus-summary" />

      <div className="project-summary-block project-summary-block--workflow">
        <header className="project-summary-heading" data-reveal>
          <h2 id="project-summary-title">AI 赋能业务增长</h2>
          <p>
            长期以来，AIGC 在工作中的应用虽取得一定成果，但生成效率仍有提升空间。随着业务推进，我开始将成功案例中的优质内容和数据分类整理为素材库，并按应用场景提炼标准化关键词模板。通过持续沉淀、复用和迭代，AIGC 创作资源更加完整，关键词使用也更规范。
          </p>
        </header>

        <ol className="summary-workflow" aria-label="AIGC 素材生产流程">
          {SUMMARY_WORKFLOW_STEPS.map((step, index) => (
            <li
              className="summary-workflow-step"
              data-reveal
              key={step.title}
              style={{ '--summary-index': index }}
            >
              <div className="summary-workflow-node">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{step.title}</strong>
              </div>
              <p>{step.note}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="project-summary-block project-summary-block--results">
        <header className="project-summary-heading" data-reveal>
          <h2>结果量化</h2>
        </header>

        <div className="summary-results-grid">
          <div className="summary-core-metrics" data-reveal>
            {SUMMARY_CORE_METRICS.map((metric) => (
              <article key={metric.label}>
                <p className="summary-metric-value">
                  {metric.value}
                  <span aria-label={metric.trend}>↑</span>
                </p>
                <h3>{metric.label}</h3>
              </article>
            ))}
          </div>

          {SUMMARY_SUPPORT_METRICS.map((metric, index) => (
            <article
              className={`summary-support-metric ${metric.className}`}
              data-reveal
              key={metric.label}
              style={{ '--summary-index': index }}
            >
              <h3>{metric.label}</h3>
              <p>
                {metric.value}
                <span aria-label={metric.trend === 'up' ? '提升' : '下降'}>
                  {metric.trend === 'up' ? '↑' : '↓'}
                </span>
              </p>
            </article>
          ))}
        </div>

        <p className="summary-result-quote" data-reveal>
          “太好了，数据提升了，我们有救了”
        </p>

        <div className="summary-retrospective-grid">
          {SUMMARY_RETROSPECTIVES.map((group, index) => (
            <article
              className="summary-retrospective"
              data-reveal
              key={group.title}
              style={{ '--summary-index': index }}
            >
              <h3>{group.title}</h3>
              <ol>
                {group.items.map((item) => (
                  <li key={item.label}>
                    <strong>{item.label}：</strong>
                    {item.text}
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function EditorialWorkDetail({ nextProject, project, projectsPage, separator }) {
  const meta = [project.category, project.year, project.role].filter(Boolean).join(separator)
  const images = Array.isArray(project.images) ? project.images : []
  const heroImage = images[0]
  const tools = Array.isArray(project.tools) ? project.tools : []
  const process = Array.isArray(project.process) ? project.process : []
  const strategy = project.strategy
  const strategyCases = Array.isArray(project.strategyCases) ? project.strategyCases : []
  const hasStrategy = Boolean(strategy)
  const strategyCaseCount = strategyCases.length
  const themeStyle = project.theme
    ? {
        '--story-accent': project.theme.accent,
        '--story-accent-soft': project.theme.accentSoft,
        '--story-wash': project.theme.wash,
        '--story-blob-a': project.theme.blobA,
        '--story-blob-b': project.theme.blobB,
        '--story-blob-c': project.theme.blobC,
        '--story-blob-d': project.theme.blobD,
        '--story-blob-e': project.theme.blobE
      }
    : undefined

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('[data-reveal]'))

    if (!nodes.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-visible', entry.intersectionRatio >= 0.12)
        })
      },
      {
        rootMargin: '-6% 0px -10% 0px',
        threshold: 0.12
      }
    )

    nodes.forEach((node) => observer.observe(node))

    return () => observer.disconnect()
  }, [project.id, process.length, images.length, hasStrategy, strategyCaseCount])

  return (
    <article className={`work-detail work-detail--story work-detail--${project.id}`} style={themeStyle}>
      <div aria-hidden="true" className="work-story-atmosphere">
        <span className="story-glow story-glow--a" />
        <span className="story-glow story-glow--b" />
        <span className="story-glow story-glow--c" />
        <span className="story-glow story-glow--d" />
        <span className="story-glow story-glow--e" />
      </div>

      {project.id === 'asus-store-ux' && <ProjectLineNavigation />}

      {projectsPage?.title && (
        <Link className="work-back caption" to="/#projects">
          {projectsPage.title}
        </Link>
      )}

      <div className="work-story-grid">
        <header
          className="work-story-intro"
          data-reveal
          id={project.id === 'asus-store-ux' ? 'asus-overview' : undefined}
        >
          {project.id === 'asus-store-ux' && <ProjectNavAnchor targetId="asus-overview" />}
          <div className="work-story-sticky">
            {project.category && <p className="caption">{project.category}</p>}
            <div className="work-story-heading">
              <SemanticTitle as="h1" lines={project.titleLines} text={project.title} />
              {meta && <p className="work-meta">{meta}</p>}
            </div>

            {project.overview && <p className="work-story-lead">{project.overview}</p>}

            <div className="work-story-meta">
              {project.role && (
                <div className="work-story-meta-group">
                  {project.roleLabel && <p className="caption">{project.roleLabel}</p>}
                  <p>{project.role}</p>
                </div>
              )}

              {tools.length > 0 && (
                <div className="work-story-meta-group">
                  {project.toolsLabel && <p className="caption">{project.toolsLabel}</p>}
                  <ul className="work-story-tools">
                    {tools.map((tool) => (
                      <li key={tool}>{tool}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="work-story-main">
          {heroImage && (
            <figure className="story-hero" data-reveal>
              <img
                alt={getImageAlt(project.title, heroImage, 0)}
                loading="eager"
                src={getAssetUrl(heroImage.src)}
              />
            </figure>
          )}

          {process.map((section, index) => (
            <StorySection
              anchorId={project.id === 'asus-store-ux' && index === 0 ? 'asus-shop-analysis' : undefined}
              images={images}
              key={`${section.title}-${index}`}
              projectTitle={project.title}
              section={section}
            />
          ))}
        </div>
      </div>

      <StrategySection
        anchorId={project.id === 'asus-store-ux' ? 'asus-design-breakdown' : undefined}
        strategy={strategy}
      />
      <StrategyCaseSection cases={strategyCases} />
      {project.id === 'asus-store-ux' && (
        <>
          <MainImageShowcase />
          <PromotionMasonrySection />
          <ProjectSummarySection />
        </>
      )}
      <ProjectFooterNav nextProject={nextProject} variant="story" />
    </article>
  )
}

export default function WorkDetail({ projects, projectsPage, separator = '' }) {
  const { id } = useParams()
  const currentIndex = projects.findIndex((item) => item.id === id)
  const project = projects[currentIndex]

  if (!project) return <Navigate to="/projects" replace />

  const nextProject = projects.length > 1
    ? projects[(currentIndex + 1) % projects.length]
    : null

  if (project.id === 'baby-first') {
    return <BabyFirstDetail nextProject={nextProject} projectsPage={projectsPage} />
  }

  if (project.id === 'fenglin-haoli') {
    return <MapleGiftDetail nextProject={nextProject} projectsPage={projectsPage} />
  }

  if (project.id === 'fangyuan-parking') {
    return <FangyuanDetail nextProject={nextProject} projectsPage={projectsPage} />
  }

  if (project.id === 'zhengxi-luyuan') {
    return <ZhengdaDetail nextProject={nextProject} projectsPage={projectsPage} />
  }

  if (project.id === 'shanhaijing-aigc') {
    return <ShanhaijingDetail nextProject={nextProject} projectsPage={projectsPage} />
  }

  if (Array.isArray(project.process) && Array.isArray(project.images) && project.images.length > 0) {
    return (
      <EditorialWorkDetail
        nextProject={nextProject}
        project={project}
        projectsPage={projectsPage}
        separator={separator}
      />
    )
  }

  const meta = [project.category, project.year, project.role].filter(Boolean).join(separator)
  const workImages = project.workImages || []

  return (
    <article className="work-detail">
      {projectsPage?.title && (
        <Link className="work-back caption" to="/#projects">
          {projectsPage.title}
        </Link>
      )}

      <header className="work-hero">
        {project.category && <p className="caption">{project.category}</p>}
        <h1>{project.title}</h1>
        {meta && <p className="work-meta">{meta}</p>}
      </header>

      {project.description && (
        <div className="section-heading work-summary">
          {project.role && <p className="caption">{project.role}</p>}
          <p className="work-copy">{project.description}</p>
        </div>
      )}

      {workImages.length > 0 && (
        <section className="work-gallery" aria-label={project.title}>
          {workImages.map((src, index) => (
            <figure className="work-frame" key={src}>
              <img
                alt={`${project.title} 作品展示 ${index + 1}`}
                loading={index === 0 ? 'eager' : 'lazy'}
                src={getAssetUrl(src)}
              />
            </figure>
          ))}
        </section>
      )}

      <ProjectFooterNav nextProject={nextProject} />
    </article>
  )
}
