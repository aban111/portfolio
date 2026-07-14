import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import LineSidebar from '../LineSidebar/LineSidebar'
import ProjectFooterNav from '../ProjectFooterNav/ProjectFooterNav'
import { getAssetUrl } from '../../lib/assets'
import './ZhengdaDetail.css'

const ZHENGDA_NAV_ITEMS = [
  { id: 'overview', label: '概览', targetId: 'zhengda-overview' },
  { id: 'strategy', label: '策略', targetId: 'zhengda-strategy' },
  { id: 'posters', label: '海报', targetId: 'zhengda-posters' },
  { id: 'archive', label: '矩阵', targetId: 'zhengda-archive' },
  { id: 'labels', label: '酒标', targetId: 'zhengda-labels' },
  { id: 'application', label: '落地', targetId: 'zhengda-application' },
  { id: 'outcome', label: '结果', targetId: 'zhengda-outcome' }
]

const POSTERS = [
  { title: '元旦', group: '节庆', src: '/work/zhengda/poster-yuandan.webp', width: 1170, height: 2532 },
  { title: '小寒', group: '节气', src: '/work/zhengda/poster-xiaohan.webp', width: 1170, height: 2532 },
  { title: '腊八节', group: '节庆', src: '/work/zhengda/poster-laba.webp', width: 1170, height: 2239 },
  { title: '大寒', group: '节气', src: '/work/zhengda/poster-dahan.webp', width: 1170, height: 2532 },
  { title: '小年', group: '节庆', src: '/work/zhengda/poster-xiaonian.webp', width: 1170, height: 2532 },
  { title: '除夕', group: '节庆', src: '/work/zhengda/poster-chuxi.webp', width: 1170, height: 2532 },
  { title: '大年初一', group: '春节', src: '/work/zhengda/poster-chuyi.webp', width: 1170, height: 2532 },
  { title: '大年初二', group: '春节', src: '/work/zhengda/poster-chuer.webp', width: 1170, height: 2532 },
  { title: '大年初三', group: '春节', src: '/work/zhengda/poster-chusan.webp', width: 1170, height: 2532 },
  { title: '开工大吉', group: '营销节点', src: '/work/zhengda/poster-kaigong.webp', width: 1242, height: 2208 },
  { title: '元宵节', group: '节庆', src: '/work/zhengda/poster-yuanxiao.webp', width: 1284, height: 2778 },
  { title: '妇女节', group: '营销节点', src: '/work/zhengda/poster-womens-day.webp', width: 1284, height: 2778 },
  { title: '惊蛰', group: '节气', src: '/work/zhengda/poster-jingzhe.webp', width: 4626, height: 8192 },
  { title: '春分', group: '节气', src: '/work/zhengda/poster-chunfen.webp', width: 1284, height: 2778 },
  { title: '清明', group: '节气', src: '/work/zhengda/poster-qingming.webp', width: 1242, height: 2668 },
  { title: '谷雨', group: '节气', src: '/work/zhengda/poster-guyu.webp', width: 1080, height: 1920 },
  { title: '劳动节', group: '营销节点', src: '/work/zhengda/poster-labor-day.webp', width: 1284, height: 2778 },
  { title: '立夏', group: '节气', src: '/work/zhengda/poster-lixia.webp', width: 945, height: 2048 },
  { title: '母亲节', group: '节庆', src: '/work/zhengda/poster-mothers-day.webp', width: 1284, height: 2778 },
  { title: '小满', group: '节气', src: '/work/zhengda/poster-xiaoman.webp', width: 1170, height: 2532 },
  { title: '立春', group: '节气', src: '/work/zhengda/poster-lichun.webp', width: 1170, height: 2532 }
]

const LABEL_OPTIONS = [
  {
    title: '候选方向 1',
    note: '突出品名，建立基础识别',
    src: '/work/zhengda/label-option-01.webp'
  },
  {
    title: '候选方向 2',
    note: '强化品牌与规格的阅读顺序',
    src: '/work/zhengda/label-option-02.webp'
  },
  {
    title: '入选方向 3',
    note: '以红金框景收拢信息层级',
    src: '/work/zhengda/label-option-03.webp',
    selected: true
  }
]

const LABEL_ROUNDS = [
  { title: '方向发散', note: '围绕品牌识别、品类信息与传统酿造感形成多条方向。' },
  { title: '信息校准', note: '重新梳理品名、规格与生产信息的阅读顺序。' },
  { title: '方案收敛', note: '保留更鲜明的红金主视觉，强化终端识别。' },
  { title: '生产落地', note: '方案三确认应用，并进入真实场景验证。' }
]

const FEATURED_POSTERS = [
  { className: 'zhengda-featured-poster--lead', title: '元宵节', src: '/work/zhengda/poster-yuanxiao.webp' },
  { className: 'zhengda-featured-poster--spring', title: '春分', src: '/work/zhengda/poster-chunfen.webp' },
  { className: 'zhengda-featured-poster--labor', title: '劳动节', src: '/work/zhengda/poster-labor-day.webp' },
  { className: 'zhengda-featured-poster--mother', title: '母亲节', src: '/work/zhengda/poster-mothers-day.webp' }
]

function ZhengdaNavAnchor({ targetId }) {
  return (
    <span
      aria-hidden="true"
      className="zhengda-nav-anchor"
      data-zhengda-nav-anchor={targetId}
    />
  )
}

function AssetImage({ alt, className = '', height, loading = 'lazy', src, width }) {
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

function ZhengdaLineNavigation() {
  const [activeIndex, setActiveIndex] = useState(0)
  const lockedIndexRef = useRef(null)
  const syncActiveRef = useRef(null)
  const unlockTimerRef = useRef(null)

  useEffect(() => {
    const anchors = ZHENGDA_NAV_ITEMS
      .map((item, index) => ({
        element: document.querySelector(`[data-zhengda-nav-anchor="${item.targetId}"]`),
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
    <aside className="zhengda-line-sidebar-shell">
      <LineSidebar
        activeIndex={activeIndex}
        accentColor="var(--zhengda-red)"
        ariaLabel="正溪鹭缘项目章节导航"
        className="zhengda-line-sidebar"
        fontSize={0.76}
        itemGap={15}
        items={ZHENGDA_NAV_ITEMS}
        markerColor="color-mix(in srgb, var(--zhengda-red) 30%, transparent)"
        markerGap={7}
        markerLength={40}
        maxShift={7}
        onItemClick={handleItemClick}
        proximityRadius={78}
        smoothing={120}
        textColor="color-mix(in srgb, var(--zhengda-ink) 56%, transparent)"
      />
    </aside>
  )
}

function PosterFigure({ className = '', eager = false, poster }) {
  return (
    <figure className={className}>
      <AssetImage
        alt={`正溪鹭缘${poster.title}主题海报`}
        loading={eager ? 'eager' : 'lazy'}
        src={poster.src}
      />
    </figure>
  )
}

export default function ZhengdaDetail({ nextProject, projectsPage }) {
  const rootRef = useRef(null)

  useEffect(() => {
    document.body.classList.add('zhengda-page-active')
    document.documentElement.classList.add('zhengda-page-active')

    return () => {
      document.body.classList.remove('zhengda-page-active')
      document.documentElement.classList.remove('zhengda-page-active')
    }
  }, [])

  useEffect(() => {
    const rootElement = rootRef.current
    const nodes = Array.from(rootElement?.querySelectorAll('[data-zhengda-reveal]') || [])
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
    <article className="zhengda-detail" ref={rootRef}>
      <div aria-hidden="true" className="zhengda-atmosphere">
        <span className="zhengda-glow zhengda-glow--one" />
        <span className="zhengda-glow zhengda-glow--two" />
        <span className="zhengda-glow zhengda-glow--three" />
        <span className="zhengda-glow zhengda-glow--four" />
      </div>

      <ZhengdaLineNavigation />

      {projectsPage?.title && (
        <Link className="zhengda-back-link" to="/#projects">
          <span aria-hidden="true">←</span>
          {projectsPage.title}
        </Link>
      )}

      <header className="zhengda-hero" id="zhengda-overview">
        <ZhengdaNavAnchor targetId="zhengda-overview" />

        <div className="zhengda-hero-copy" data-zhengda-reveal="left">
          <div className="zhengda-brand-lockup" aria-label="正大集团与正溪鹭缘品牌标志">
            <div>
              <AssetImage alt="正大集团标志" loading="eager" src="/work/zhengda/cp-group-logo.png" />
            </div>
            <i aria-hidden="true" />
            <div>
              <AssetImage alt="正溪鹭缘品牌标志" loading="eager" src="/work/zhengda/zhengxi-luyuan-logo.svg" />
            </div>
          </div>

          <h1>
            <span>把全年节点，</span>
            <span>连接品牌与销售。</span>
          </h1>
          <p className="zhengda-hero-lead">
            围绕正溪鹭缘，以节气海报与定制酒瓶贴构建全年内容矩阵，让品牌表达在私域触达与销售终端中持续发生。
          </p>

          <dl className="zhengda-hero-meta">
            <div>
              <dt>公司</dt>
              <dd>正大集团</dd>
            </div>
            <div>
              <dt>品牌</dt>
              <dd>正溪鹭缘</dd>
            </div>
            <div>
              <dt>设计内容</dt>
              <dd>节气海报 / 定制酒瓶贴</dd>
            </div>
          </dl>
        </div>

        <div className="zhengda-hero-visual" data-zhengda-reveal="up">
          <PosterFigure
            className="zhengda-hero-poster zhengda-hero-poster--left"
            eager
            poster={{ title: '谷雨', src: '/work/zhengda/poster-guyu.webp' }}
          />
          <PosterFigure
            className="zhengda-hero-poster zhengda-hero-poster--center"
            eager
            poster={{ title: '元旦', src: '/work/zhengda/poster-yuandan.webp' }}
          />
          <PosterFigure
            className="zhengda-hero-poster zhengda-hero-poster--right"
            eager
            poster={{ title: '除夕', src: '/work/zhengda/poster-chuxi.webp' }}
          />
          <p>节气 / 节庆 / 热点</p>
        </div>
      </header>

      <section className="zhengda-strategy zhengda-section" id="zhengda-strategy">
        <ZhengdaNavAnchor targetId="zhengda-strategy" />

        <div className="zhengda-strategy-heading" data-zhengda-reveal="left">
          <h2>设计不是装饰，<br />而是销售终端的催化剂。</h2>
        </div>

        <div className="zhengda-strategy-copy" data-zhengda-reveal="up">
          <p>
            在激烈的市场竞争中，设计承担着唤醒消费欲望、建立客情记忆的作用。产品不再只是功能的载体，也成为传递情感与文化的故事讲述者。
          </p>
          <p>
            项目把品牌语言落到两个高频触点：全年营销海报负责持续沟通，定制酒瓶贴负责在真实终端完成识别与销售承接。
          </p>
        </div>

        <ol className="zhengda-strategy-flow" data-zhengda-reveal="up" aria-label="正溪鹭缘内容营销路径">
          <li><strong>识别节点</strong><span>节气、节庆与热点</span></li>
          <li><strong>建立主题</strong><span>把产品放入真实情境</span></li>
          <li><strong>持续触达</strong><span>私域海报稳定投放</span></li>
          <li><strong>销售承接</strong><span>包装完成终端转化</span></li>
        </ol>
      </section>

      <section className="zhengda-posters zhengda-section" id="zhengda-posters">
        <ZhengdaNavAnchor targetId="zhengda-posters" />

        <header className="zhengda-posters-heading" data-zhengda-reveal="left">
          <p className="zhengda-section-label">CONTENT ENGINE</p>
          <h2>不是为某一天做一张海报，<br />而是搭建持续运转的内容系统。</h2>
          <p>
            以“节气 + 节庆 + 热点”为驱动，借势全年营销节点，通过稳定的主题海报投放持续深耕客情关系，并撬动销售增量。
          </p>
        </header>

        <div className="zhengda-featured-stage" data-zhengda-reveal="up">
          {FEATURED_POSTERS.map((poster) => (
            <PosterFigure
              className={`zhengda-featured-poster ${poster.className}`}
              key={poster.title}
              poster={poster}
            />
          ))}
        </div>

        <dl className="zhengda-content-types" data-zhengda-reveal="up">
          <div>
            <dt>节气</dt>
            <dd>春分、谷雨、立夏、小满等自然节点</dd>
          </div>
          <div>
            <dt>节庆</dt>
            <dd>元旦、春节、元宵、母亲节等情感节点</dd>
          </div>
          <div>
            <dt>热点</dt>
            <dd>开工、妇女节、劳动节等营销节点</dd>
          </div>
        </dl>
      </section>

      <section className="zhengda-archive zhengda-section" id="zhengda-archive">
        <ZhengdaNavAnchor targetId="zhengda-archive" />

        <header className="zhengda-archive-heading" data-zhengda-reveal="left">
          <h2>把 21 个节点，排成一条完整的品牌时间线。</h2>
          <p>保留每张海报的完整比例，让全年内容的节奏、场景与产品组合被一次看清。</p>
        </header>

        <div className="zhengda-poster-atlas" data-zhengda-reveal="up">
          {POSTERS.map((poster) => (
            <figure className="zhengda-atlas-item" key={poster.title}>
              <AssetImage
                alt={`正溪鹭缘${poster.title}主题海报`}
                height={poster.height}
                src={poster.src}
                width={poster.width}
              />
              <figcaption>
                <span>{poster.title}</span>
                <small>{poster.group}</small>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="zhengda-labels zhengda-section" id="zhengda-labels">
        <ZhengdaNavAnchor targetId="zhengda-labels" />

        <div className="zhengda-labels-intro" data-zhengda-reveal="left">
          <h2>
            <span>四轮方案比稿，</span>
            <span>让品牌识别落到</span>
            <span>终端选择。</span>
          </h2>
          <p>
            定制酒瓶贴历经四轮方案比稿，方案三获得客户确认并最终落地。视觉在品牌识别、品类信息与终端阅读之间不断收敛，最终助推当月销售目标圆满达成。
          </p>

          <ol className="zhengda-label-rounds">
            {LABEL_ROUNDS.map((round) => (
              <li key={round.title}>
                <strong>{round.title}</strong>
                <span>{round.note}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="zhengda-label-options" data-zhengda-reveal="up">
          {LABEL_OPTIONS.map((option) => (
            <figure className={option.selected ? 'is-selected' : ''} key={option.title}>
              <AssetImage alt={`正溪鹭缘花雕酒${option.title}`} src={option.src} />
              <figcaption>
                <strong>{option.title}</strong>
                <span>{option.note}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="zhengda-application zhengda-section" id="zhengda-application">
        <ZhengdaNavAnchor targetId="zhengda-application" />

        <header className="zhengda-application-heading" data-zhengda-reveal="left">
          <p className="zhengda-section-label">PACKAGING EXTENSION</p>
          <h2>从标签平面，<br />走进真实厨房与餐饮终端。</h2>
          <p>
            入选方向在真实瓶型与使用场景中验证识别距离、信息清晰度与品牌统一性，并继续延展到餐饮端的大规格包装。
          </p>
        </header>

        <div className="zhengda-application-gallery">
          <figure className="zhengda-application-main" data-zhengda-reveal="up">
            <AssetImage
              alt="正溪鹭缘方案三花雕酒瓶贴厨房场景应用"
              src="/work/zhengda/bottle-option-03.webp"
            />
            <figcaption>方案三 / 瓶装场景</figcaption>
          </figure>

          <figure className="zhengda-application-secondary" data-zhengda-reveal="up">
            <AssetImage
              alt="正溪鹭缘花雕酒餐饮端大规格包装应用"
              src="/work/zhengda/catering-extension.webp"
            />
            <figcaption>同一品牌语言延展至餐饮端规格</figcaption>
          </figure>
        </div>
      </section>

      <section className="zhengda-outcome zhengda-section" id="zhengda-outcome">
        <ZhengdaNavAnchor targetId="zhengda-outcome" />

        <div className="zhengda-outcome-copy" data-zhengda-reveal="left">
          <div className="zhengda-outcome-lockup" aria-hidden="true">
            <AssetImage alt="" src="/work/zhengda/cp-group-logo.png" />
            <AssetImage alt="" src="/work/zhengda/zhengxi-luyuan-logo.svg" />
          </div>
          <h2>让内容持续发生，<br />让品牌落到销售。</h2>
          <blockquote>“产品不只承载功能，也成为传递情感与文化的故事讲述者。”</blockquote>
        </div>

        <dl className="zhengda-outcome-facts" data-zhengda-reveal="up">
          <div>
            <dt>内容覆盖</dt>
            <dd>节气、节庆与热点节点</dd>
          </div>
          <div>
            <dt>触达方式</dt>
            <dd>全年私域视觉营销矩阵</dd>
          </div>
          <div>
            <dt>包装结果</dt>
            <dd>方案三确认落地</dd>
          </div>
          <div>
            <dt>业务反馈</dt>
            <dd>助推当月销售目标圆满达成</dd>
          </div>
        </dl>
      </section>

      <ProjectFooterNav nextProject={nextProject} variant="story" />
    </article>
  )
}
