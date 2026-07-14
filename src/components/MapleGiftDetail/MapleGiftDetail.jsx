import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import LineSidebar from '../LineSidebar/LineSidebar'
import ProjectFooterNav from '../ProjectFooterNav/ProjectFooterNav'
import { getAssetUrl } from '../../lib/assets'
import './MapleGiftDetail.css'

const MAPLE_NAV_ITEMS = [
  { id: 'overview', label: '概览', targetId: 'fenglin-overview' },
  { id: 'positioning', label: '定位', targetId: 'fenglin-positioning' },
  { id: 'language', label: '语法', targetId: 'fenglin-language' },
  { id: 'products', label: '产品', targetId: 'fenglin-products' },
  { id: 'construction', label: '结构', targetId: 'fenglin-construction' },
  { id: 'outcome', label: '落地', targetId: 'fenglin-outcome' }
]

const ASSETS = {
  heroFamily: '/work/fenglin/hero-product-family.png',
  wineFan: '/work/fenglin/wine-set-fan.png',
  ribbonGate: '/work/fenglin/fenglin-ribbon-gate.png',
  powderRender: '/work/fenglin/powder-gift-bag-render.png',
  powderScene: '/work/fenglin/powder-pack-scene-b.png',
  powderCombo: '/work/fenglin/powder-gift-combo.png',
  giftRack: '/work/fenglin/gift-rack-showcase.png',
  bagDieline: '/work/fenglin/powder-gift-bag-dieline.png',
  bottleSpec: '/work/fenglin/wine-bottle-spec.png',
  wineBoxSketch: '/work/fenglin/wine-box-structure-sketch.png',
  bottleSketch: '/work/fenglin/wine-bottle-sketch.png',
  multiFlavorDieline: '/work/fenglin/multi-flavor-dieline.png'
}

function MapleNavAnchor({ targetId }) {
  return (
    <span
      aria-hidden="true"
      className="maple-nav-anchor"
      data-maple-nav-anchor={targetId}
    />
  )
}

function MapleLineNavigation() {
  const [activeIndex, setActiveIndex] = useState(0)
  const lockedIndexRef = useRef(null)
  const syncActiveRef = useRef(null)
  const unlockTimerRef = useRef(null)

  useEffect(() => {
    const anchors = MAPLE_NAV_ITEMS
      .map((item, index) => ({
        element: document.querySelector(`[data-maple-nav-anchor="${item.targetId}"]`),
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
    window.history.replaceState(null, '', `#${item.targetId}`)

    unlockTimerRef.current = window.setTimeout(() => {
      lockedIndexRef.current = null
      unlockTimerRef.current = null
      syncActiveRef.current?.()
    }, reducedMotion ? 180 : 1200)
  }

  return (
    <aside className="maple-line-sidebar-shell">
      <LineSidebar
        activeIndex={activeIndex}
        accentColor="var(--maple-orange)"
        ariaLabel="枫林好礼章节导航"
        className="maple-line-sidebar"
        fontSize={0.76}
        itemGap={15}
        items={MAPLE_NAV_ITEMS}
        markerColor="color-mix(in srgb, var(--maple-orange) 38%, transparent)"
        markerGap={7}
        markerLength={40}
        maxShift={7}
        onItemClick={handleItemClick}
        proximityRadius={78}
        smoothing={120}
        textColor="color-mix(in srgb, var(--maple-ink) 58%, transparent)"
      />
    </aside>
  )
}

function SectionEyebrow({ children }) {
  return <p className="maple-section-eyebrow">{children}</p>
}

function AssetImage({ alt, className = '', loading = 'lazy', src }) {
  return <img alt={alt} className={className} loading={loading} src={getAssetUrl(src)} />
}

export default function MapleGiftDetail({ nextProject, projectsPage }) {
  const rootRef = useRef(null)

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('[data-maple-reveal]'))
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const rootElement = rootRef.current

    if (!nodes.length) return undefined

    if (reducedMotion) {
      nodes.forEach((node) => node.classList.add('is-visible'))
      return undefined
    }

    const updateInitialVisibility = () => {
      const viewportHeight = window.innerHeight

      nodes.forEach((node) => {
        const rect = node.getBoundingClientRect()
        const visible = rect.bottom > viewportHeight * 0.06 && rect.top < viewportHeight * 0.94
        node.classList.toggle('is-visible', visible)
      })
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
        threshold: [0, 0.08, 0.34]
      }
    )

    updateInitialVisibility()
    nodes.forEach((node) => observer.observe(node))
    rootElement?.classList.add('is-motion-ready')

    return () => {
      observer.disconnect()
      rootElement?.classList.remove('is-motion-ready')
    }
  }, [])

  return (
    <article className="maple-detail" ref={rootRef}>
      <div aria-hidden="true" className="work-story-atmosphere maple-story-atmosphere">
        <span className="story-glow story-glow--a" />
        <span className="story-glow story-glow--b" />
        <span className="story-glow story-glow--c" />
        <span className="story-glow story-glow--d" />
        <span className="story-glow story-glow--e" />
      </div>
      <MapleLineNavigation />

      {projectsPage?.title && (
        <Link className="maple-back-link" to="/#projects">
          <span aria-hidden="true">←</span>
          {projectsPage.title}
        </Link>
      )}

      <header className="maple-hero" id="fenglin-overview">
        <MapleNavAnchor targetId="fenglin-overview" />
        <div className="maple-hero-copy" data-maple-reveal data-maple-reveal-direction="left">
          <SectionEyebrow>温州市永嘉县枫林镇农产品公用品牌设计</SectionEyebrow>
          <h1>
            <span>枫林好礼</span>
            <em>让农产品“好看”，<br />更“好懂”。</em>
          </h1>
          <p className="maple-hero-lead">
            立足乡村丰厚的自然馈赠，重构独特的在地文化叙事；以设计为笔，让沉睡的乡土资源焕发出全新的品牌生命力。
          </p>
          <dl className="maple-hero-meta">
            <div>
              <dt>项目类型</dt>
              <dd>农产品公用品牌设计</dd>
            </div>
            <div>
              <dt>产品线</dt>
              <dd>沙岗粉干、礼盒、纪念版《楠音醉》</dd>
            </div>
            <div>
              <dt>设计内容</dt>
              <dd>字标、主视觉、包装与瓶型</dd>
            </div>
          </dl>
        </div>

        <figure className="maple-hero-visual" data-maple-reveal data-maple-reveal-direction="up">
          <AssetImage alt="枫林好礼粉干、手提礼盒与楠音醉酒礼组合展示" loading="eager" src={ASSETS.heroFamily} />
          <figcaption>从日常物产到节庆礼赠，同一套地域视觉贯穿完整产品体系。</figcaption>
        </figure>

        <span aria-hidden="true" className="maple-river maple-river--hero" />
      </header>

      <section className="maple-context maple-section" id="fenglin-positioning">
        <MapleNavAnchor targetId="fenglin-positioning" />
        <div className="maple-section-heading" data-maple-reveal data-maple-reveal-direction="left">
          <SectionEyebrow>01 / 品牌定位</SectionEyebrow>
          <h2>从地方物产出发，<br />把在地故事做成礼物。</h2>
          <p>
            从枫林的自然馈赠与在地文化出发，以明确的品牌主张、可感的视觉符号和完整的包装体系，让产品既有地方性，也有被带走与被记住的理由。
          </p>
        </div>

        <figure className="maple-context-art" data-maple-reveal data-maple-reveal-direction="up">
          <AssetImage alt="枫林好礼的楠溪江流线与古村插画" src={ASSETS.ribbonGate} />
        </figure>

        <div className="maple-context-details" data-maple-reveal data-maple-reveal-direction="up">
          <ol>
            <li>
              <span>01</span>
              <div>
                <h3>地方物产</h3>
                <p>以沙岗粉干等产品为原点，让“好风味”有清晰、真实的表达。</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>文化叙事</h3>
                <p>把楠溪江山水、圣旨门街与南戏文化转译为可感知的图形语言。</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>礼赠体验</h3>
                <p>以“好枫情”承接送礼与分享，让产品拥有更完整的情感价值。</p>
              </div>
            </li>
          </ol>
          <div className="maple-journey" aria-label="品牌体验路径">
            <span>自然馈赠</span><i aria-hidden="true" /><span>在地文化</span><i aria-hidden="true" /><span>好礼体验</span>
          </div>
        </div>
      </section>

      <section className="maple-language maple-section" id="fenglin-language">
        <MapleNavAnchor targetId="fenglin-language" />
        <div className="maple-language-header" data-maple-reveal data-maple-reveal-direction="left">
          <SectionEyebrow>02 / 视觉语法</SectionEyebrow>
          <h2>从楠溪江山水，<br />到一眼可辨的品牌语法。</h2>
          <p>以俊逸鲜活、圆润流畅的字形为识别起点；将字形偏旁与古建筑屋檐结合，再以线条、插画与图标讲述枫林的在地故事。</p>
        </div>

        <div className="maple-language-stage" data-maple-reveal data-maple-reveal-direction="up">
          <div aria-hidden="true" className="maple-language-ribbon maple-language-ribbon--one" />
          <div aria-hidden="true" className="maple-language-ribbon maple-language-ribbon--two" />
          <AssetImage alt="枫林好礼将古村门楼与流线结合的主视觉" src={ASSETS.ribbonGate} />
          <ul className="maple-language-principles">
            <li><strong>楠溪江山水</strong><span>用流动线条建立视觉的连续感</span></li>
            <li><strong>屋檐字形</strong><span>以字形偏旁回应永嘉建筑的历史感</span></li>
            <li><strong>圣旨门街</strong><span>以代表性建筑成为包装画面的识别入口</span></li>
            <li><strong>粉干工艺</strong><span>将古法制作的产品属性转译为记忆图标</span></li>
          </ul>
        </div>
      </section>

      <section className="maple-products maple-section" id="fenglin-products">
        <MapleNavAnchor targetId="fenglin-products" />
        <div className="maple-products-heading" data-maple-reveal data-maple-reveal-direction="left">
          <SectionEyebrow>03 / 产品体系</SectionEyebrow>
          <h2>从日常粉干，<br />成为一份好礼。</h2>
          <p>基础款、礼盒与特殊包装共享同一套视觉识别；在规格、材料与色彩上作出区分，让不同使用场景拥有各自的表达。</p>
        </div>

        <div className="maple-products-gallery">
          <figure className="maple-product maple-product--powder" data-maple-reveal data-maple-reveal-direction="up">
            <AssetImage alt="沙岗粉干包装陈列效果" src={ASSETS.powderScene} />
            <figcaption>
              <span>沙岗粉干</span>
              <small>基础款软包装：0.5kg / 1.5kg 两种规格</small>
            </figcaption>
          </figure>
          <figure className="maple-product maple-product--wine" data-maple-reveal data-maple-reveal-direction="up">
            <AssetImage alt="枫林好礼礼盒包装与手提结构" src={ASSETS.powderRender} />
            <figcaption>
              <span>礼盒包装</span>
              <small>37 × 27 × 12cm · 1.5kg · 350g 卡纸彩印</small>
            </figcaption>
          </figure>
          <figure className="maple-product maple-product--rack" data-maple-reveal data-maple-reveal-direction="up">
            <AssetImage alt="枫林好礼多口味伴手礼陈列架" src={ASSETS.giftRack} />
            <figcaption>
              <span>多口味礼赠</span>
              <small>四色产品对应南戏演奏时常用的乐器</small>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="maple-construction maple-section" id="fenglin-construction">
        <MapleNavAnchor targetId="fenglin-construction" />
        <div className="maple-construction-header" data-maple-reveal data-maple-reveal-direction="left">
          <SectionEyebrow>04 / 包装结构</SectionEyebrow>
          <h2>把“拿起、打开、露出”，<br />也设计成礼物的一部分。</h2>
          <p>从粉干礼盒的手提结构，到特殊包装的镂空内盒与纪念版酒礼的扇形展开，包装把平面视觉延展为真实可参与的动作。</p>
        </div>

        <div className="maple-construction-grid">
          <figure className="maple-construction-card maple-construction-card--dieline" data-maple-reveal data-maple-reveal-direction="up">
            <AssetImage alt="沙岗粉干手提礼盒包装展开图" src={ASSETS.bagDieline} />
            <figcaption><strong>手提礼盒</strong><span>以圣旨门街的忠孝之门为主图形，并用柔韧的粉干造型贯穿正面。</span></figcaption>
          </figure>
          <figure className="maple-construction-card maple-construction-card--bottle" data-maple-reveal data-maple-reveal-direction="up">
            <AssetImage alt="楠音醉纪念版酒礼与扇形展开结构" src={ASSETS.wineFan} />
            <figcaption><strong>《楠音醉》瓶型</strong><span>125ml 瓶身灵感来自乐器琵琶；扇形展开的内盒让礼盒具有舞台般的互动感。</span></figcaption>
          </figure>
          <figure className="maple-construction-card maple-construction-card--sketch" data-maple-reveal data-maple-reveal-direction="up">
            <AssetImage alt="酒礼盒开合结构与瓶型草图" src={ASSETS.wineBoxSketch} />
            <AssetImage alt="酒瓶瓶型草图" className="maple-sketch-secondary" src={ASSETS.bottleSketch} />
            <figcaption><strong>特殊包装</strong><span>手提外盒与镂空内盒增强记忆点；打开礼盒，内部以扇形屏风呈现舞台般的互动感。</span></figcaption>
          </figure>
        </div>
      </section>

      <section className="maple-outcome maple-section" id="fenglin-outcome">
        <MapleNavAnchor targetId="fenglin-outcome" />
        <div className="maple-outcome-copy" data-maple-reveal data-maple-reveal-direction="left">
          <SectionEyebrow>05 / 项目落地</SectionEyebrow>
          <h2>让一份地方特产，<br />拥有被看见与被带走的方式。</h2>
          <p>
            从品牌主视觉到基础款、礼盒、特殊包装与纪念版酒礼，项目建立了可延展的产品表达，让“枫林好礼”在不同场景下保持一致而鲜活的识别。
          </p>

          <dl className="maple-outcome-metrics">
            <div>
              <dt>0 → 1</dt>
              <dd>字标、插画与图标的主视觉系统</dd>
            </div>
            <div>
              <dt>0.5 / 1.5 kg</dt>
              <dd>基础款粉干的两种包装规格</dd>
            </div>
            <div>
              <dt>125 ml</dt>
              <dd>《楠音醉》纪念版酒礼容量</dd>
            </div>
          </dl>

          <p className="maple-outcome-quote">“尝‘好风味’于舌尖，留‘好枫情’在心田。”</p>
        </div>

        <figure className="maple-outcome-visual" data-maple-reveal data-maple-reveal-direction="up">
          <AssetImage alt="枫林好礼粉干与礼盒落地展示" src={ASSETS.powderCombo} />
        </figure>
      </section>

      <ProjectFooterNav nextProject={nextProject} variant="maple" />
    </article>
  )
}
