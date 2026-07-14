import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import LineSidebar from '../LineSidebar/LineSidebar'
import ProjectFooterNav from '../ProjectFooterNav/ProjectFooterNav'
import { getAssetUrl } from '../../lib/assets'
import './ShanhaijingDetail.css'

const SHANHAIJING_NAV_ITEMS = [
  { id: 'overview', label: '概览', targetId: 'shanhaijing-overview' },
  { id: 'translation', label: '转译', targetId: 'shanhaijing-translation' },
  { id: 'atlas', label: '山系', targetId: 'shanhaijing-atlas' },
  { id: 'ritual', label: '祭祀', targetId: 'shanhaijing-ritual' },
  { id: 'characters', label: '角色', targetId: 'shanhaijing-characters' },
  { id: 'archive', label: '图谱', targetId: 'shanhaijing-archive' },
  { id: 'outcome', label: '总结', targetId: 'shanhaijing-outcome' }
]

const MOUNTAIN_SYSTEMS = [
  { name: '南山山系', mountains: '40', distance: '16,380 里', note: '南经之山志' },
  { name: '西山山系', mountains: '77', distance: '17,517 里', note: '西经之山' },
  { name: '北山山系', mountains: '87', distance: '23,230 里', note: '北经之山' },
  { name: '东山山系', mountains: '46', distance: '18,860 里', note: '东经之山' },
  { name: '中山山系', mountains: '197', distance: '21,371 里', note: '中经之山' }
]

const RITUAL_CATEGORIES = [
  {
    title: '祈福',
    count: '120',
    ratio: '55%',
    description: '以祝词、陈列、洁净与焚草组织祈祥纳瑞的仪式链路。',
    steps: ['祝词', '陈列', '洁净', '焚草']
  },
  {
    title: '禳灾',
    count: '约 70',
    ratio: '32%',
    description: '围绕瘗埋、送灾与安抚展开，将灾异叙事转译为动作顺序。',
    steps: ['瘗埋', '送灾', '安抚']
  },
  {
    title: '战事',
    count: '约 28',
    ratio: '13%',
    description: '通过列兵、誓师与振动建立战争祭祀的阅读节奏。',
    steps: ['列兵', '誓师', '振动']
  }
]

const PROCESS_PAIRS = [
  {
    title: '自然神形',
    source: '/work/shanhaijing/spirit-human-scene.webp',
    sourceAlt: '自然神角色氛围图',
    sourceWidth: 1400,
    sourceHeight: 1175,
    cutout: '/work/shanhaijing/spirit-human-cutout.webp',
    cutoutAlt: '自然神角色透明信息元件',
    cutoutWidth: 857,
    cutoutHeight: 751
  },
  {
    title: '龙首神形',
    source: '/work/shanhaijing/dragon-head-scene.webp',
    sourceAlt: '人身龙首角色氛围图',
    sourceWidth: 1400,
    sourceHeight: 1400,
    cutout: '/work/shanhaijing/dragon-head-cutout.webp',
    cutoutAlt: '人身龙首角色透明信息元件',
    cutoutWidth: 964,
    cutoutHeight: 738
  },
  {
    title: '兽面神形',
    source: '/work/shanhaijing/stag-face-scene.webp',
    sourceAlt: '人面载戈角色氛围图',
    sourceWidth: 1400,
    sourceHeight: 1400,
    cutout: '/work/shanhaijing/stag-face-cutout.webp',
    cutoutAlt: '人面载戈角色透明信息元件',
    cutoutWidth: 593,
    cutoutHeight: 619
  }
]

const FEATURED_POSTERS = {
  atlas: {
    title: '舆神图',
    description: '把五大山系、山神角色与祭祀线索放回同一张地理索引。',
    thumb: '/work/shanhaijing/world-atlas-thumb.webp',
    full: '/work/shanhaijing/world-atlas-full.webp',
    thumbWidth: 820,
    thumbHeight: 580,
    fullWidth: 2600,
    fullHeight: 1840
  },
  ritual: {
    title: '祷祈戎 · 三大祭祀',
    description: '按祈福、禳灾与战事三类仪式重组原典信息。',
    thumb: '/work/shanhaijing/ritual-triad-thumb.webp',
    full: '/work/shanhaijing/ritual-triad-full.webp',
    thumbWidth: 720,
    thumbHeight: 1019,
    fullWidth: 1900,
    fullHeight: 2688
  }
}

const POSTER_ARCHIVE = [
  {
    title: '太牢祭',
    description: '围绕华山山神、斋戒、祭品与三才体系建立一张仪式全景。',
    thumb: '/work/shanhaijing/ta-lao-ritual-thumb.webp',
    full: '/work/shanhaijing/ta-lao-ritual-full.webp',
    thumbWidth: 720,
    thumbHeight: 1018,
    fullWidth: 1900,
    fullHeight: 2685
  },
  {
    title: '山海祭 · 神祇谱系',
    description: '从上古天帝、五方上帝到诸山山神，组织神祇层级与从属关系。',
    thumb: '/work/shanhaijing/deity-lineage-thumb.webp',
    full: '/work/shanhaijing/deity-lineage-full.webp',
    thumbWidth: 720,
    thumbHeight: 1018,
    fullWidth: 1900,
    fullHeight: 2685
  },
  {
    title: '礼器谱',
    description: '将卦象、纹样、玉器、牲礼与青铜礼器汇入统一的物件索引。',
    thumb: '/work/shanhaijing/ritual-vessels-thumb.webp',
    full: '/work/shanhaijing/ritual-vessels-full.webp',
    thumbWidth: 720,
    thumbHeight: 1018,
    fullWidth: 1900,
    fullHeight: 2685
  },
  {
    title: '北山祭',
    description: '以蛇身、人面与豕身神形为核心，梳理北山祭品与地域特征。',
    thumb: '/work/shanhaijing/north-mountain-thumb.webp',
    full: '/work/shanhaijing/north-mountain-full.webp',
    thumbWidth: 720,
    thumbHeight: 1012,
    fullWidth: 1900,
    fullHeight: 2672
  },
  {
    title: '东山祭',
    description: '以鱼、犬与羊等祭品建立东山山系的供奉语义。',
    thumb: '/work/shanhaijing/east-mountain-thumb.webp',
    full: '/work/shanhaijing/east-mountain-full.webp',
    thumbWidth: 720,
    thumbHeight: 998,
    fullWidth: 1900,
    fullHeight: 2635
  },
  {
    title: '南山祭',
    description: '从白茅、白狗、稻米到璧玉，呈现三重山系的祭祀差异。',
    thumb: '/work/shanhaijing/south-mountain-thumb.webp',
    full: '/work/shanhaijing/south-mountain-full.webp',
    thumbWidth: 720,
    thumbHeight: 1012,
    fullWidth: 1900,
    fullHeight: 2672
  }
]

function AssetImage({
  alt,
  className = '',
  fetchPriority,
  height,
  loading = 'lazy',
  src,
  width
}) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <span className={`shanhaijing-image-fallback${className ? ` ${className}` : ''}`} role="img" aria-label={alt}>
        图像资源暂不可用
      </span>
    )
  }

  return (
    <img
      alt={alt}
      className={className}
      fetchPriority={fetchPriority}
      height={height}
      loading={loading}
      onError={() => setHasError(true)}
      src={getAssetUrl(src)}
      width={width}
    />
  )
}

function ShanhaijingNavAnchor({ targetId }) {
  return (
    <span
      aria-hidden="true"
      className="shanhaijing-nav-anchor"
      data-shanhaijing-nav-anchor={targetId}
    />
  )
}

function ShanhaijingLineNavigation() {
  const [activeIndex, setActiveIndex] = useState(0)
  const lockedIndexRef = useRef(null)
  const syncActiveRef = useRef(null)
  const unlockTimerRef = useRef(null)

  useEffect(() => {
    const anchors = SHANHAIJING_NAV_ITEMS
      .map((item, index) => ({
        element: document.querySelector(`[data-shanhaijing-nav-anchor="${item.targetId}"]`),
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
    window.history.replaceState(null, '', `${window.location.pathname}#${item.targetId}`)

    unlockTimerRef.current = window.setTimeout(() => {
      lockedIndexRef.current = null
      unlockTimerRef.current = null
      syncActiveRef.current?.()
    }, reducedMotion ? 180 : 1200)
  }

  return (
    <aside className="shanhaijing-line-sidebar-shell">
      <LineSidebar
        activeIndex={activeIndex}
        accentColor="var(--shanhaijing-bronze)"
        ariaLabel="山海经项目章节导航"
        className="shanhaijing-line-sidebar"
        fontSize={0.76}
        itemGap={15}
        items={SHANHAIJING_NAV_ITEMS}
        markerColor="rgba(94, 66, 28, 0.28)"
        markerLength={28}
        maxShift={10}
        onItemClick={handleItemClick}
        textColor="var(--shanhaijing-muted)"
      />
    </aside>
  )
}

function PosterOpenButton({ className = '', onOpen, poster, useFullImage = false }) {
  const imageSource = useFullImage ? poster.full : poster.thumb
  const imageWidth = useFullImage ? poster.fullWidth : poster.thumbWidth
  const imageHeight = useFullImage ? poster.fullHeight : poster.thumbHeight

  return (
    <button
      aria-label={`查看完整图谱：${poster.title}`}
      className={`shanhaijing-poster-button${className ? ` ${className}` : ''}`}
      onClick={() => onOpen(poster)}
      type="button"
    >
      <AssetImage
        alt={`${poster.title}信息设计图谱`}
        height={imageHeight}
        src={imageSource}
        width={imageWidth}
      />
      <span className="shanhaijing-poster-button__action">查看完整图谱</span>
    </button>
  )
}

function PosterLightbox({ onClose, poster }) {
  const closeButtonRef = useRef(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)
    closeButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <div
      aria-label={`${poster.title}完整图谱`}
      aria-modal="true"
      className="shanhaijing-lightbox"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      role="dialog"
    >
      <div className="shanhaijing-lightbox__dialog">
        <button
          aria-label="关闭完整图谱"
          className="shanhaijing-lightbox__close"
          onClick={onClose}
          ref={closeButtonRef}
          type="button"
        >
          关闭
        </button>
        <figure>
          <AssetImage
            alt={`${poster.title}完整信息设计图谱`}
            height={poster.fullHeight}
            loading="eager"
            src={poster.full}
            width={poster.fullWidth}
          />
          <figcaption>
            <strong>{poster.title}</strong>
            <span>{poster.description}</span>
          </figcaption>
        </figure>
      </div>
    </div>
  )
}

export default function ShanhaijingDetail({ nextProject, projectsPage }) {
  const rootRef = useRef(null)
  const [activePoster, setActivePoster] = useState(null)

  useEffect(() => {
    document.body.classList.add('shanhaijing-page-active')
    document.documentElement.classList.add('shanhaijing-page-active')

    return () => {
      document.body.classList.remove('shanhaijing-page-active')
      document.documentElement.classList.remove('shanhaijing-page-active')
    }
  }, [])

  useEffect(() => {
    const rootElement = rootRef.current
    const nodes = Array.from(rootElement?.querySelectorAll('[data-shanhaijing-reveal]') || [])
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!nodes.length) return undefined

    if (reducedMotion) {
      nodes.forEach((node) => node.classList.add('is-visible'))
      return undefined
    }

    const viewportHeight = window.innerHeight
    nodes.forEach((node) => {
      const rect = node.getBoundingClientRect()
      if (rect.bottom > viewportHeight * 0.04 && rect.top < viewportHeight * 0.96) {
        node.classList.add('is-visible')
      }
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.08) return

          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      {
        rootMargin: '-6% 0px -10% 0px',
        threshold: [0, 0.08, 0.3]
      }
    )

    nodes.forEach((node) => observer.observe(node))
    rootElement?.classList.add('is-motion-ready')

    return () => observer.disconnect()
  }, [])

  return (
    <article className="shanhaijing-detail" ref={rootRef}>
      <div aria-hidden="true" className="shanhaijing-atmosphere">
        <span className="shanhaijing-glow shanhaijing-glow--one" />
        <span className="shanhaijing-glow shanhaijing-glow--two" />
        <span className="shanhaijing-glow shanhaijing-glow--three" />
        <span className="shanhaijing-glow shanhaijing-glow--four" />
      </div>

      <ShanhaijingLineNavigation />

      {projectsPage?.title && (
        <Link className="shanhaijing-back-link" to="/#projects">
          <span aria-hidden="true">←</span>
          {projectsPage.title}
        </Link>
      )}

      <header className="shanhaijing-hero" id="shanhaijing-overview">
        <ShanhaijingNavAnchor targetId="shanhaijing-overview" />

        <div className="shanhaijing-hero-copy" data-shanhaijing-reveal="left">
          <p className="shanhaijing-kicker">AIGC × INFORMATION DESIGN</p>
          <h1>
            <span>山海经</span>
            <strong>祭祀文化</strong>
            <span>信息可视化设计</span>
          </h1>
          <p className="shanhaijing-hero-lead">
            从《山海经》复杂的山系、神祇、祭品与仪式文本中建立分类逻辑，再以 AIGC 生成角色资产，最终形成一套可阅读、可比较、可延展的东方神话信息图谱。
          </p>

          <dl className="shanhaijing-hero-meta">
            <div>
              <dt>项目类型</dt>
              <dd>文化信息设计</dd>
            </div>
            <div>
              <dt>设计职责</dt>
              <dd>研究 / 架构 / AIGC / 视觉</dd>
            </div>
            <div>
              <dt>核心产出</dt>
              <dd>8 张主题信息图谱</dd>
            </div>
          </dl>
        </div>

        <div className="shanhaijing-hero-visual" data-shanhaijing-reveal="up">
          <div className="shanhaijing-hero-atlas-frame">
            <AssetImage
              alt="山海经五大山系与山神舆神图"
              className="shanhaijing-hero-atlas"
              fetchPriority="high"
              height={1840}
              loading="eager"
              src="/work/shanhaijing/world-atlas-full.webp"
              width={2600}
            />
            <div className="shanhaijing-hero-atlas-title">
              <span>SHAN HAI RITUAL ARCHIVE</span>
              <strong>山海祭</strong>
            </div>
          </div>

          <div className="shanhaijing-hero-visual-caption">
            <div>
              <strong>舆神图</strong>
              <span>五方山系、山神角色与祭祀线索总览</span>
            </div>
            <dl>
              <div><dt>山系</dt><dd>05</dd></div>
              <div><dt>山岳</dt><dd>447</dd></div>
              <div><dt>图谱</dt><dd>08</dd></div>
            </dl>
          </div>
        </div>
      </header>

      <section className="shanhaijing-section shanhaijing-translation" id="shanhaijing-translation">
        <ShanhaijingNavAnchor targetId="shanhaijing-translation" />

        <header className="shanhaijing-section-heading" data-shanhaijing-reveal="left">
          <h2>先把神话拆成数据，<br />再把数据还原成可读的世界。</h2>
          <p>
            原典并不是一条线性故事：地理、神祇、卦象、器物、牲礼和仪式动作彼此交织。设计的第一步，是把文本拆解为可以交叉阅读的信息层。
          </p>
        </header>

        <ol className="shanhaijing-method" data-shanhaijing-reveal="up">
          <li>
            <span>01</span>
            <strong>原典采样</strong>
            <p>摘取山系里程、祭祀对象、祭品与动作，建立基础资料表。</p>
          </li>
          <li>
            <span>02</span>
            <strong>语义归类</strong>
            <p>以地理、神祇、礼仪、器物四个维度重组零散叙述。</p>
          </li>
          <li>
            <span>03</span>
            <strong>角色生成</strong>
            <p>用 AIGC 生成神祇资产，并统一色相、光源、服饰与轮廓。</p>
          </li>
          <li>
            <span>04</span>
            <strong>信息编码</strong>
            <p>通过环形关系、路径、图标与尺度层级构建阅读顺序。</p>
          </li>
        </ol>
      </section>

      <section className="shanhaijing-section shanhaijing-atlas" id="shanhaijing-atlas">
        <ShanhaijingNavAnchor targetId="shanhaijing-atlas" />

        <header className="shanhaijing-atlas-heading" data-shanhaijing-reveal="left">
          <div>
            <h2>五大山系，<br />成为世界观的第一层索引。</h2>
            <p>
              以山系为骨架，把 447 座山、约 97,358 里的空间信息与山神角色并置，让读者先理解“在哪里”，再继续追踪“祭谁、用什么、如何祭”。
            </p>
          </div>
          <dl>
            <div><dt>山系</dt><dd>05</dd></div>
            <div><dt>山岳</dt><dd>447</dd></div>
            <div><dt>里程</dt><dd>97,358</dd></div>
          </dl>
        </header>

        <figure className="shanhaijing-atlas-figure" data-shanhaijing-reveal="up">
          <PosterOpenButton
            onOpen={setActivePoster}
            poster={FEATURED_POSTERS.atlas}
            useFullImage
          />
          <figcaption>
            <strong>舆神图</strong>
            <span>五大山系与神祇角色的横向总览</span>
          </figcaption>
        </figure>

        <div className="shanhaijing-mountain-index" data-shanhaijing-reveal="up">
          {MOUNTAIN_SYSTEMS.map((system) => (
            <article key={system.name}>
              <span>{system.note}</span>
              <h3>{system.name}</h3>
              <p><strong>{system.mountains}</strong> 座山</p>
              <p>{system.distance}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="shanhaijing-section shanhaijing-ritual" id="shanhaijing-ritual">
        <ShanhaijingNavAnchor targetId="shanhaijing-ritual" />

        <div className="shanhaijing-ritual-media" data-shanhaijing-reveal="left">
          <PosterOpenButton
            onOpen={setActivePoster}
            poster={FEATURED_POSTERS.ritual}
            useFullImage
          />
          <p>点击图像可查看完整文字与细节</p>
        </div>

        <div className="shanhaijing-ritual-copy">
          <header data-shanhaijing-reveal="up">
            <h2>把仪式拆成“目的、动作与证据”。</h2>
            <p>
              祈福、禳灾、战事并不是三个装饰主题，而是三套不同的信息语法。频次决定视觉权重，动作顺序决定阅读路径，文物与原文则为叙事提供证据。
            </p>
          </header>

          <ol className="shanhaijing-ritual-list">
            {RITUAL_CATEGORIES.map((category) => (
              <li data-shanhaijing-reveal="up" key={category.title}>
                <div className="shanhaijing-ritual-stat">
                  <strong>{category.ratio}</strong>
                  <span>{category.count} 条记录</span>
                </div>
                <div>
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                  <div className="shanhaijing-ritual-steps" aria-label={`${category.title}仪式动作`}>
                    {category.steps.map((step, index) => (
                      <span key={step}>
                        {step}
                        {index < category.steps.length - 1 && <i aria-hidden="true">→</i>}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="shanhaijing-section shanhaijing-characters" id="shanhaijing-characters">
        <ShanhaijingNavAnchor targetId="shanhaijing-characters" />

        <header className="shanhaijing-section-heading shanhaijing-characters-heading" data-shanhaijing-reveal="left">
          <h2>AIGC 生成的是角色资产，<br />信息设计决定它们如何进入系统。</h2>
          <p>
            我将“人、兽、龙、角、翼”等文本特征转成角色约束，再统一暗金色调、东方服饰、正面光源与剪影辨识度，避免每张图各说各话。
          </p>
        </header>

        <div className="shanhaijing-character-stage" data-shanhaijing-reveal="up">
          <figure className="shanhaijing-character shanhaijing-character--human">
            <AssetImage
              alt="自然神角色"
              height={1175}
              src="/work/shanhaijing/spirit-human-scene.webp"
              width={1400}
            />
            <figcaption>自然神形 / 流动气韵</figcaption>
          </figure>
          <figure className="shanhaijing-character shanhaijing-character--dragon">
            <AssetImage
              alt="人身龙首神角色"
              height={1400}
              src="/work/shanhaijing/dragon-head-scene.webp"
              width={1400}
            />
            <figcaption>龙首神形 / 权力象征</figcaption>
          </figure>
          <figure className="shanhaijing-character shanhaijing-character--stag">
            <AssetImage
              alt="人面载戈神角色"
              height={1400}
              src="/work/shanhaijing/stag-face-scene.webp"
              width={1400}
            />
            <figcaption>兽面神形 / 角冠特征</figcaption>
          </figure>
          <figure className="shanhaijing-character shanhaijing-character--boar">
            <AssetImage
              alt="猪头人身神角色"
              height={1400}
              src="/work/shanhaijing/boar-deity.webp"
              width={1400}
            />
            <figcaption>豕首神形 / 牲礼关联</figcaption>
          </figure>
          <span aria-hidden="true" className="shanhaijing-character-ring" />
        </div>

        <div className="shanhaijing-asset-system">
          <header data-shanhaijing-reveal="left">
            <h3>从单张生图到可复用信息元件</h3>
            <p>
              场景图负责建立气质，透明角色负责进入图谱。通过抠图、轮廓校正和尺度统一，让同一角色可以在总览、山系与祭祀专题中重复调用。
            </p>
          </header>

          <div className="shanhaijing-process-grid">
            {PROCESS_PAIRS.map((pair) => (
              <article data-shanhaijing-reveal="up" key={pair.title}>
                <div className="shanhaijing-process-pair">
                  <figure>
                    <AssetImage
                      alt={pair.sourceAlt}
                      height={pair.sourceHeight}
                      src={pair.source}
                      width={pair.sourceWidth}
                    />
                    <figcaption>氛围生成</figcaption>
                  </figure>
                  <figure>
                    <AssetImage
                      alt={pair.cutoutAlt}
                      height={pair.cutoutHeight}
                      src={pair.cutout}
                      width={pair.cutoutWidth}
                    />
                    <figcaption>元件提取</figcaption>
                  </figure>
                </div>
                <h4>{pair.title}</h4>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="shanhaijing-section shanhaijing-archive" id="shanhaijing-archive">
        <ShanhaijingNavAnchor targetId="shanhaijing-archive" />

        <header className="shanhaijing-section-heading shanhaijing-archive-heading" data-shanhaijing-reveal="left">
          <h2>输出不是一张主视觉，<br />而是一组可扩展的知识图谱。</h2>
          <p>
            每张图只承担一个明确主题，但沿用同一套暗金色谱、环形关系、线描图标与标题层级。读者可以单独阅读，也能在整套作品中建立连续认知。
          </p>
        </header>

        <div className="shanhaijing-gallery">
          {POSTER_ARCHIVE.map((poster, index) => (
            <figure
              className={`shanhaijing-gallery-item shanhaijing-gallery-item--${index + 1}`}
              data-shanhaijing-reveal="up"
              key={poster.title}
            >
              <PosterOpenButton onOpen={setActivePoster} poster={poster} />
              <figcaption>
                <strong>{poster.title}</strong>
                <span>{poster.description}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="shanhaijing-section shanhaijing-outcome" id="shanhaijing-outcome">
        <ShanhaijingNavAnchor targetId="shanhaijing-outcome" />

        <div className="shanhaijing-outcome-copy" data-shanhaijing-reveal="left">
          <p>设计结论</p>
          <blockquote>
            当 AIGC 进入信息设计，它负责扩充图像资产；研究、分类与阅读秩序，仍然由设计完成。
          </blockquote>
        </div>

        <dl className="shanhaijing-outcome-facts" data-shanhaijing-reveal="up">
          <div><dt>主题图谱</dt><dd>08</dd></div>
          <div><dt>地理索引</dt><dd>05</dd></div>
          <div><dt>祭祀语法</dt><dd>03</dd></div>
          <div><dt>视觉系统</dt><dd>01</dd></div>
        </dl>
      </section>

      <ProjectFooterNav nextProject={nextProject} />

      {activePoster && createPortal(
        <PosterLightbox onClose={() => setActivePoster(null)} poster={activePoster} />,
        document.body
      )}
    </article>
  )
}
