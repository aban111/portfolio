import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import LineSidebar from '../LineSidebar/LineSidebar'
import ProjectFooterNav from '../ProjectFooterNav/ProjectFooterNav'
import { getAssetUrl } from '../../lib/assets'
import './BabyFirstDetail.css'

const BABY_NAV_ITEMS = [
  { id: 'overview', label: '概述', targetId: 'baby-overview' },
  { id: 'identity', label: '标识', targetId: 'baby-identity' },
  { id: 'application', label: '延展', targetId: 'baby-application' },
  { id: 'poster', label: '海报', targetId: 'baby-poster' },
  { id: 'brochure', label: '画册', targetId: 'baby-brochure' },
  { id: 'summary', label: '总结', targetId: 'baby-summary' }
]

const ASSETS = {
  mark: '/work/baby-first/mark-primary.svg',
  logo: '/work/baby-first/logo-horizontal.svg',
  logoCompact: '/work/baby-first/logo-compact.svg',
  logoCorporate: '/work/baby-first/logo-corporate-primary.svg',
  logoChinese: '/work/baby-first/logo-chinese.svg',
  childSeat: '/work/baby-first/child-seat.webp',
  brochureScene: '/work/baby-first/brochure-page-11.webp',
  streetBanner: '/work/baby-first/street-banner.webp',
  logisticsBoxes: '/work/baby-first/logistics-boxes.webp',
  paperCups: '/work/baby-first/paper-cups.webp',
  ceramicMugs: '/work/baby-first/ceramic-mugs.webp',
  businessCards: '/work/baby-first/business-cards.webp',
  staffBadge: '/work/baby-first/staff-badge.webp',
  outdoorSign: '/work/baby-first/outdoor-sign.webp',
  posterWall: '/work/baby-first/poster-wall.webp',
  brochureCover: '/work/baby-first/brochure-page-01.webp',
  brochureCompany: '/work/baby-first/brochure-page-03.webp',
  brochureFactory: '/work/baby-first/brochure-page-04.webp',
  brochureSeat: '/work/baby-first/brochure-page-06.webp',
  brochureChair: '/work/baby-first/brochure-page-09.webp'
}

const COLORS = [
  { hex: '#2cd5c4', label: '品牌主色' },
  { hex: '#70d4a5', label: '自然辅助色' },
  { hex: '#83e5e5', label: '轻量辅助色' },
  { hex: '#4d5e66', label: '信息深色' }
]

const IMAGE_DIMENSIONS = {
  [ASSETS.childSeat]: [2699, 4045],
  [ASSETS.brochureScene]: [1515, 1075],
  [ASSETS.streetBanner]: [2547, 1911],
  [ASSETS.logisticsBoxes]: [2280, 1805],
  [ASSETS.paperCups]: [2546, 1910],
  [ASSETS.ceramicMugs]: [2550, 2036],
  [ASSETS.businessCards]: [2255, 1801],
  [ASSETS.staffBadge]: [2255, 1800],
  [ASSETS.outdoorSign]: [2401, 1801],
  [ASSETS.posterWall]: [5873, 3413],
  [ASSETS.brochureCover]: [758, 1075],
  [ASSETS.brochureCompany]: [1515, 1075],
  [ASSETS.brochureFactory]: [1515, 1075],
  [ASSETS.brochureSeat]: [1515, 1075],
  [ASSETS.brochureChair]: [1515, 1075]
}

function AssetImage({ alt, className = '', loading = 'lazy', src }) {
  const [width, height] = IMAGE_DIMENSIONS[src] || []

  return (
    <img
      alt={alt}
      className={className}
      height={height}
      loading={loading}
      src={getAssetUrl(src)}
      width={width}
    />
  )
}

function SectionEyebrow({ children }) {
  return <p className="baby-section-eyebrow">{children}</p>
}

function BabyLineNavigation() {
  const [activeIndex, setActiveIndex] = useState(0)
  const lockedIndexRef = useRef(null)
  const unlockTimerRef = useRef(null)
  const frameRef = useRef(null)

  useEffect(() => {
    const sections = BABY_NAV_ITEMS
      .map((item, index) => ({
        element: document.getElementById(item.targetId),
        index
      }))
      .filter(({ element }) => element)

    if (!sections.length) return undefined

    const updateActiveItem = () => {
      frameRef.current = null

      if (lockedIndexRef.current !== null) {
        setActiveIndex(lockedIndexRef.current)
        return
      }

      const activationLine = Math.min(window.innerHeight * 0.46, 430)
      let nextIndex = 0

      sections.forEach(({ element, index }) => {
        if (element.getBoundingClientRect().top <= activationLine) nextIndex = index
      })

      const isAtPageEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8
      if (isAtPageEnd) nextIndex = sections.at(-1).index

      setActiveIndex((currentIndex) => (
        currentIndex === nextIndex ? currentIndex : nextIndex
      ))
    }

    const scheduleUpdate = () => {
      if (frameRef.current !== null) return
      frameRef.current = window.requestAnimationFrame(updateActiveItem)
    }

    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    updateActiveItem()

    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current)
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
    window.history.replaceState(null, '', `#${item.targetId}`)

    unlockTimerRef.current = window.setTimeout(() => {
      lockedIndexRef.current = null
      unlockTimerRef.current = null

      const activationLine = Math.min(window.innerHeight * 0.46, 430)
      let nextIndex = 0
      BABY_NAV_ITEMS.forEach((navItem, navIndex) => {
        const section = document.getElementById(navItem.targetId)
        if (section?.getBoundingClientRect().top <= activationLine) nextIndex = navIndex
      })
      setActiveIndex(nextIndex)
    }, reducedMotion ? 80 : 1100)
  }

  return (
    <aside className="baby-line-sidebar-shell">
      <LineSidebar
        activeIndex={activeIndex}
        accentColor="var(--baby-primary)"
        ariaLabel="宝贝第一项目章节导航"
        className="baby-line-sidebar"
        fontSize={0.76}
        itemGap={15}
        items={BABY_NAV_ITEMS}
        markerColor="color-mix(in srgb, var(--baby-primary) 34%, transparent)"
        markerGap={7}
        markerLength={40}
        maxShift={7}
        onItemClick={handleItemClick}
        proximityRadius={80}
        smoothing={120}
        textColor="color-mix(in srgb, var(--baby-ink) 56%, transparent)"
      />
    </aside>
  )
}

function ApplicationFigure({ alt, className, label, src }) {
  return (
    <figure
      className={`baby-application-item ${className}`}
      data-baby-reveal
      data-baby-reveal-direction="up"
    >
      <AssetImage alt={alt} src={src} />
      <figcaption>{label}</figcaption>
    </figure>
  )
}

function BrochureSpread({ alt, className = '', src }) {
  return (
    <figure className={`baby-brochure-spread ${className}`}>
      <AssetImage alt={alt} src={src} />
    </figure>
  )
}

export default function BabyFirstDetail({ nextProject, projectsPage }) {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    const nodes = Array.from(root?.querySelectorAll('[data-baby-reveal]') || [])
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!nodes.length) return undefined

    if (reducedMotion) {
      nodes.forEach((node) => node.classList.add('is-visible'))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle(
            'is-visible',
            entry.isIntersecting && entry.intersectionRatio >= 0.08
          )
        })
      },
      {
        rootMargin: '-7% 0px -10% 0px',
        threshold: [0, 0.08, 0.28]
      }
    )

    nodes.forEach((node) => observer.observe(node))
    root.classList.add('is-motion-ready')

    return () => {
      observer.disconnect()
      root.classList.remove('is-motion-ready')
    }
  }, [])

  return (
    <article className="baby-detail" ref={rootRef}>
      <div aria-hidden="true" className="baby-atmosphere">
        <span className="baby-glow baby-glow--one" />
        <span className="baby-glow baby-glow--two" />
        <span className="baby-glow baby-glow--three" />
        <span className="baby-glow baby-glow--four" />
      </div>

      <BabyLineNavigation />

      {projectsPage?.title && (
        <Link className="baby-back-link" to="/#projects">
          <span aria-hidden="true">←</span>
          {projectsPage.title}
        </Link>
      )}

      <header className="baby-hero" id="baby-overview">
        <div className="baby-hero-copy" data-baby-reveal data-baby-reveal-direction="left">
          <AssetImage
            alt="baby first 宝贝第一品牌标志"
            className="baby-hero-logo"
            loading="eager"
            src={ASSETS.logo}
          />
          <SectionEyebrow>宁波宝贝第一母婴用品有限公司 · 品牌形象提升</SectionEyebrow>
          <h1>
            <span>宝贝第一</span>
            <strong>让“安全”成为<br />一眼可识别的品牌语言。</strong>
          </h1>
          <p className="baby-hero-lead">
            围绕儿童安全座椅的专业性与舒适使用环境，重塑品牌识别、应用触点与产品传播，让产品标准转化为消费者能够感知的信任。
          </p>
          <dl className="baby-hero-meta">
            <div>
              <dt>项目角色</dt>
              <dd>品牌形象提升设计 / 企业画册设计</dd>
            </div>
            <div>
              <dt>设计范围</dt>
              <dd>VI 基础系统、应用系统、产品海报、企业画册</dd>
            </div>
          </dl>
        </div>

        <figure className="baby-hero-visual" data-baby-reveal data-baby-reveal-direction="up">
          <span aria-hidden="true" className="baby-hero-orbit baby-hero-orbit--one" />
          <span aria-hidden="true" className="baby-hero-orbit baby-hero-orbit--two" />
          <AssetImage
            alt="婴儿乘坐宝贝第一儿童安全座椅"
            loading="eager"
            src={ASSETS.childSeat}
          />
          <figcaption>专业 · 自信 · 以客户为导向</figcaption>
        </figure>
      </header>

      <section className="baby-intent baby-section" aria-labelledby="baby-intent-title">
        <div className="baby-section-heading" data-baby-reveal data-baby-reveal-direction="left">
          <SectionEyebrow>01 / Brand Intent</SectionEyebrow>
          <h2 id="baby-intent-title">从产品安全出发，<br />把专业感转译为品牌信任。</h2>
          <p>
            项目不是简单更换标志，而是把安全座椅的可靠结构、理性科技感与母婴品牌所需的亲和力，整理成一套可持续复用的视觉系统。
          </p>
        </div>

        <figure className="baby-intent-visual" data-baby-reveal data-baby-reveal-direction="up">
          <div className="baby-intent-media">
            <AssetImage alt="婴儿在车内乘坐宝贝第一儿童安全座椅" src={ASSETS.brochureScene} />
          </div>
          <figcaption>以真实乘坐场景呈现安全、舒适与被守护的品牌价值。</figcaption>
        </figure>

        <ol className="baby-intent-principles" data-baby-reveal data-baby-reveal-direction="up">
          <li><span>01</span><strong>安全</strong><p>以稳定、可靠的结构作为品牌识别起点。</p></li>
          <li><span>02</span><strong>专业</strong><p>用清晰秩序承接产品标准与制造能力。</p></li>
          <li><span>03</span><strong>亲和</strong><p>以轻盈色彩平衡母婴场景中的情绪温度。</p></li>
        </ol>
      </section>

      <section className="baby-identity baby-section" id="baby-identity">
        <div className="baby-identity-heading" data-baby-reveal data-baby-reveal-direction="left">
          <SectionEyebrow>02 / VI Basic System</SectionEyebrow>
          <h2>从安全锁扣提炼标志，<br />建立理性而亲和的基础系统。</h2>
          <p>
            对品牌关键词进行再度挖掘，发散多组视觉方向并完成用户测试；最终方案以锁扣结构为识别核心，用淡蓝绿色表达科技、安全与舒适。
          </p>
        </div>

        <div className="baby-logo-stage" data-baby-reveal data-baby-reveal-direction="up">
          <div className="baby-logo-stage-mark">
            <AssetImage alt="宝贝第一品牌图形标志" src={ASSETS.mark} />
            <p><strong>安全锁扣</strong><span>稳固、可靠与守护关系的图形抽象</span></p>
          </div>
          <div className="baby-logo-stage-primary">
            <AssetImage alt="宝贝第一中英文组合标志" src={ASSETS.logo} />
          </div>
        </div>

        <div className="baby-logo-variants" data-baby-reveal data-baby-reveal-direction="up">
          <figure><AssetImage alt="宝贝第一紧凑组合标志" src={ASSETS.logoCompact} /><figcaption>紧凑组合</figcaption></figure>
          <figure><AssetImage alt="宝贝第一中文组合标志" src={ASSETS.logoChinese} /><figcaption>中文组合</figcaption></figure>
          <figure><AssetImage alt="宝贝第一企业全称组合标志" src={ASSETS.logoCorporate} /><figcaption>企业全称组合</figcaption></figure>
        </div>

        <div className="baby-identity-specs">
          <div className="baby-color-system" data-baby-reveal data-baby-reveal-direction="left">
            <p className="baby-spec-label">标准色 / Color System</p>
            <div className="baby-color-list">
              {COLORS.map((color) => (
                <div className="baby-color-item" key={color.hex}>
                  <span style={{ '--swatch-color': color.hex }} />
                  <p><strong>{color.hex}</strong><small>{color.label}</small></p>
                </div>
              ))}
            </div>
          </div>

          <div className="baby-type-system" data-baby-reveal data-baby-reveal-direction="up">
            <p className="baby-spec-label">标准字体 / Typography</p>
            <div className="baby-type-sample">
              <strong>宝贝安全，妈妈安心。</strong>
              <span>Ningbo Babyfirst Baby Product Co., Ltd.</span>
            </div>
            <p>方正中等线体 / 方正黑体简体 / 方正大黑简体 / Gilroy / Arial / Roboto</p>
          </div>
        </div>
      </section>

      <section className="baby-application baby-section" id="baby-application">
        <div className="baby-application-heading" data-baby-reveal data-baby-reveal-direction="left">
          <SectionEyebrow>03 / Application System</SectionEyebrow>
          <h2>一套图形语言，<br />贯穿办公物料与线下场景。</h2>
          <p>
            辅助图形以圆点与斜向圆角线条构成，在不同尺寸中保持统一节奏；从员工物料、礼赠用品到户外导视，持续强化品牌识别。
          </p>
        </div>

        <div className="baby-application-grid">
          <ApplicationFigure
            alt="宝贝第一户外灯杆旗应用"
            className="baby-application-item--street"
            label="户外导视 / Street Banner"
            src={ASSETS.streetBanner}
          />
          <ApplicationFigure
            alt="宝贝第一物流纸箱应用"
            className="baby-application-item--boxes"
            label="物流包装 / Shipping System"
            src={ASSETS.logisticsBoxes}
          />
          <ApplicationFigure
            alt="宝贝第一品牌纸杯应用"
            className="baby-application-item--cups"
            label="日常触点 / Paper Cups"
            src={ASSETS.paperCups}
          />
          <ApplicationFigure
            alt="宝贝第一品牌马克杯应用"
            className="baby-application-item--mugs"
            label="礼赠用品 / Mugs"
            src={ASSETS.ceramicMugs}
          />
          <ApplicationFigure
            alt="宝贝第一员工证件应用"
            className="baby-application-item--badge"
            label="员工识别 / Staff Badge"
            src={ASSETS.staffBadge}
          />
          <ApplicationFigure
            alt="宝贝第一品牌名片应用"
            className="baby-application-item--cards"
            label="商务触点 / Business Cards"
            src={ASSETS.businessCards}
          />
          <ApplicationFigure
            alt="宝贝第一线下产品广告牌应用"
            className="baby-application-item--sign"
            label="零售场景 / Retail Signage"
            src={ASSETS.outdoorSign}
          />
        </div>
      </section>

      <section className="baby-poster baby-section" id="baby-poster">
        <div className="baby-poster-intro">
          <div className="baby-poster-heading" data-baby-reveal data-baby-reveal-direction="left">
            <SectionEyebrow>04 / Product Poster</SectionEyebrow>
            <h2>让产品场景、核心卖点与品牌识别，<br />在同一视线里完成沟通。</h2>
          </div>
          <p data-baby-reveal data-baby-reveal-direction="up">
            海报以真实乘坐场景建立舒适感，再用统一的品牌绿、产品名称与卖点信息完成收束，让不同系列在户外环境中保持清晰识别。
          </p>
        </div>

        <figure className="baby-poster-stage" data-baby-reveal data-baby-reveal-direction="up">
          <AssetImage alt="宝贝第一儿童安全座椅系列户外产品海报" src={ASSETS.posterWall} />
          <figcaption>
            <span><i>01</i>场景先行</span>
            <span><i>02</i>卖点聚焦</span>
            <span><i>03</i>系统统一</span>
          </figcaption>
        </figure>
      </section>

      <section className="baby-brochure baby-section" id="baby-brochure">
        <div className="baby-brochure-intro">
          <div data-baby-reveal data-baby-reveal-direction="left">
            <SectionEyebrow>05 / Corporate Brochure</SectionEyebrow>
            <h2>把企业能力与产品谱系，<br />组织成可快速阅读的画册节奏。</h2>
          </div>
          <div className="baby-brochure-outline" data-baby-reveal data-baby-reveal-direction="up">
            <p>画册共 11 页，以“企业建立信任、产品完成证明”为结构主线。</p>
            <ol>
              <li><span>01</span><strong>企业介绍</strong><small>公司简介、工厂总览与荣誉资质</small></li>
              <li><span>02</span><strong>产品介绍</strong><small>安全座椅与儿童餐椅的场景化展示</small></li>
              <li><span>03</span><strong>信息组织</strong><small>生活方式画面与参数页成对出现</small></li>
            </ol>
          </div>
        </div>

        <div className="baby-brochure-stage" data-baby-reveal data-baby-reveal-direction="up">
          <BrochureSpread
            alt="宝贝第一企业产品宣传册封面"
            className="baby-brochure-spread--cover"
            src={ASSETS.brochureCover}
          />
          <div className="baby-brochure-spreads">
            <BrochureSpread alt="宝贝第一企业简介画册跨页" src={ASSETS.brochureCompany} />
            <BrochureSpread alt="宝贝第一工厂总览画册跨页" src={ASSETS.brochureFactory} />
            <BrochureSpread alt="宝贝第一 V141 安全座椅产品画册跨页" src={ASSETS.brochureSeat} />
            <BrochureSpread alt="宝贝第一 SKIDO 儿童餐椅产品画册跨页" src={ASSETS.brochureChair} />
          </div>
        </div>
      </section>

      <section className="baby-summary baby-section" id="baby-summary">
        <div className="baby-summary-heading" data-baby-reveal data-baby-reveal-direction="left">
          <SectionEyebrow>06 / Project Summary</SectionEyebrow>
          <h2>把“安全”从产品属性，<br />升级成贯穿品牌的系统信号。</h2>
          <p>
            从标志基础规范到线下应用、产品海报与企业画册，项目用同一套颜色、图形与信息秩序串起不同触点，让专业制造能力被更一致地看见和理解。
          </p>
        </div>

        <div className="baby-summary-system" data-baby-reveal data-baby-reveal-direction="up">
          <AssetImage alt="宝贝第一品牌图形标志" src={ASSETS.mark} />
          <ol>
            <li><span>基础系统</span><p>标志、组合、色彩、字体与辅助图形</p></li>
            <li><span>应用延展</span><p>办公物料、礼赠用品、户外导视与物流包装</p></li>
            <li><span>传播内容</span><p>产品海报、企业介绍与产品画册</p></li>
          </ol>
        </div>
      </section>

      <ProjectFooterNav nextProject={nextProject} variant="baby" />
    </article>
  )
}
