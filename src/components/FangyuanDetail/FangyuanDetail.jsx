import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import LineSidebar from '../LineSidebar/LineSidebar'
import ProjectFooterNav from '../ProjectFooterNav/ProjectFooterNav'
import { getAssetUrl } from '../../lib/assets'
import './FangyuanDetail.css'

const FANGYUAN_NAV_ITEMS = [
  { id: 'overview', label: '概述', targetId: 'fangyuan-overview' },
  { id: 'insight', label: '洞察', targetId: 'fangyuan-insight' },
  { id: 'structure', label: '架构', targetId: 'fangyuan-structure' },
  { id: 'interface', label: '界面', targetId: 'fangyuan-interface' },
  { id: 'hmi', label: '车机', targetId: 'fangyuan-hmi' },
  { id: 'summary', label: '总结', targetId: 'fangyuan-summary' }
]

const ASSETS = {
  mark: '/work/fangyuan/mark.svg',
  parkingAction: '/work/fangyuan/parking-action.svg',
  splash: '/work/fangyuan/splash.png',
  moodboard: '/work/fangyuan/moodboard.png',
  homePhone: '/work/fangyuan/home-phone.png',
  parkedPhone: '/work/fangyuan/parked-phone.png',
  navigationPhone: '/work/fangyuan/navigation-phone.png',
  reservationPhone: '/work/fangyuan/reservation-phone.png',
  datePhone: '/work/fangyuan/date-phone.png',
  timePhone: '/work/fangyuan/time-phone.png',
  paymentAccount: '/work/fangyuan/payment-account.png',
  paymentPin: '/work/fangyuan/payment-pin.png',
  paymentSuccess: '/work/fangyuan/payment-success.png',
  wireframeDetail: '/work/fangyuan/wireframe-detail.png',
  wireframeMap: '/work/fangyuan/wireframe-map.png',
  hmiScene: '/work/fangyuan/hmi-scene.png'
}

const IMAGE_DIMENSIONS = {
  [ASSETS.splash]: [489, 869],
  [ASSETS.moodboard]: [490, 869],
  [ASSETS.homePhone]: [329, 671],
  [ASSETS.parkedPhone]: [329, 671],
  [ASSETS.navigationPhone]: [373, 759],
  [ASSETS.reservationPhone]: [293, 596],
  [ASSETS.datePhone]: [311, 596],
  [ASSETS.timePhone]: [293, 596],
  [ASSETS.paymentAccount]: [329, 671],
  [ASSETS.paymentPin]: [329, 671],
  [ASSETS.paymentSuccess]: [329, 671],
  [ASSETS.wireframeDetail]: [354, 766],
  [ASSETS.wireframeMap]: [353, 766],
  [ASSETS.hmiScene]: [1920, 1080]
}

const PROBLEM_CLUSTERS = [
  {
    number: '01',
    title: '操作负担',
    finding: '基础操作存在疑惑，步骤繁琐，在驾驶场景里会放大犹豫与误触。',
    response: '以强引导和极简路径降低认知难度。'
  },
  {
    number: '02',
    title: '资源错配',
    finding: '临时车位不足与闲置车位并存，信息分散在邻里沟通与即时消息中。',
    response: '建立车位流转平台，提高闲置资源利用率。'
  },
  {
    number: '03',
    title: '寻位困难',
    finding: '借来的车位位置陌生，进入停车场后仍要反复确认路线与车位编号。',
    response: '联通手机与 HMI，让导航延伸到最后一公里。'
  }
]

const PERSONAS = [
  { type: '高频刚需', name: '老小区通勤族', need: '稳定获得车位，并快速导航到指定地点。' },
  { type: '高频刚需', name: '换乘通勤族', need: '找到可靠、高效的日间通勤接力站。' },
  { type: '低频改善', name: '悠闲生活家', need: '简单、明确、不会出错的产品路径。' },
  { type: '商务效率', name: '全域精英', need: '跨区域快速约位，并精准抵达。' }
]

const EXPERIENCE_PRINCIPLES = [
  { title: '双模态自适应', body: '短租与长租共享一套视觉语言，根据时长和状态切换核心操作。' },
  { title: '去地图化指引', body: '在高压驾驶场景中保留方向、距离与车位号，主动压低无关信息。' },
  { title: '隐性安全网', body: '通过预判、状态反馈与异常容错，让关键操作始终可撤回、可确认。' },
  { title: '负面情绪抚慰', body: '用沉浸色彩、清晰节奏与情感化声音缓解找位过程中的焦虑。' }
]

const FLOW_STEPS = [
  { title: '首页', note: '确认当前状态' },
  { title: '预约', note: '匹配车位与时段' },
  { title: '导航', note: '抵达具体车位' },
  { title: '支付', note: '无感完成闭环' }
]

const COLOR_SYSTEM = [
  { hex: '#186051', label: '主品牌绿' },
  { hex: '#CFFFC8', label: '状态薄荷' },
  { hex: '#FEFB54', label: '决策高亮' },
  { hex: '#FFB2F5', label: '辅助提示' },
  { hex: '#FFFFFF', label: '信息留白' }
]

const SUMMARY_POINTS = [
  { number: '01', title: '资源流转', body: '把分散的闲置车位转化为可匹配、可预约、可支付的城市资源。' },
  { number: '02', title: '路径减负', body: '用首页、预约、导航、支付四个节点收束复杂业务，减少驾驶中的操作负担。' },
  { number: '03', title: '跨端连续', body: '让手机与 HMI 同步状态和导航语义，保持从出发到泊车的一致体验。' }
]

function AssetImage({ alt, className = '', loading = 'lazy', src }) {
  const [width, height] = IMAGE_DIMENSIONS[src] || []

  return (
    <img alt={alt} className={className} height={height} loading={loading} src={getAssetUrl(src)} width={width} />
  )
}

function SectionEyebrow({ children }) {
  return <p className="fangyuan-section-eyebrow">{children}</p>
}

function FangyuanLineNavigation() {
  const [activeIndex, setActiveIndex] = useState(0)
  const lockedIndexRef = useRef(null)
  const unlockTimerRef = useRef(null)
  const frameRef = useRef(null)

  useEffect(() => {
    const sections = FANGYUAN_NAV_ITEMS
      .map((item, index) => ({ element: document.getElementById(item.targetId), index }))
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
      setActiveIndex((currentIndex) => (currentIndex === nextIndex ? currentIndex : nextIndex))
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
    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
    window.history.replaceState(null, '', `#${item.targetId}`)

    unlockTimerRef.current = window.setTimeout(() => {
      lockedIndexRef.current = null
      unlockTimerRef.current = null
      const activationLine = Math.min(window.innerHeight * 0.46, 430)
      let nextIndex = 0
      FANGYUAN_NAV_ITEMS.forEach((navItem, navIndex) => {
        const section = document.getElementById(navItem.targetId)
        if (section?.getBoundingClientRect().top <= activationLine) nextIndex = navIndex
      })
      setActiveIndex(nextIndex)
    }, reducedMotion ? 80 : 1100)
  }

  return (
    <aside className="fangyuan-line-sidebar-shell">
      <LineSidebar
        activeIndex={activeIndex}
        accentColor="var(--fangyuan-green)"
        ariaLabel="方圆项目章节导航"
        className="fangyuan-line-sidebar"
        fontSize={0.76}
        itemGap={15}
        items={FANGYUAN_NAV_ITEMS}
        markerColor="color-mix(in srgb, var(--fangyuan-mint) 32%, transparent)"
        markerGap={7}
        markerLength={40}
        maxShift={7}
        onItemClick={handleItemClick}
        proximityRadius={80}
        smoothing={120}
        textColor="color-mix(in srgb, var(--fangyuan-ink) 48%, transparent)"
      />
    </aside>
  )
}

function PhoneVisual({ alt, className = '', loading = 'lazy', src }) {
  return <figure className={`fangyuan-phone ${className}`}><AssetImage alt={alt} loading={loading} src={src} /></figure>
}

export default function FangyuanDetail({ nextProject, projectsPage }) {
  const rootRef = useRef(null)
  const heroVisualRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    const nodes = Array.from(root?.querySelectorAll('[data-fangyuan-reveal]') || [])
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!nodes.length) return undefined

    if (reducedMotion) {
      nodes.forEach((node) => node.classList.add('is-visible'))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-visible', entry.isIntersecting && entry.intersectionRatio >= 0.08)
        })
      },
      { rootMargin: '-7% 0px -10% 0px', threshold: [0, 0.08, 0.28] }
    )

    nodes.forEach((node) => observer.observe(node))
    root.classList.add('is-motion-ready')
    return () => {
      observer.disconnect()
      root.classList.remove('is-motion-ready')
    }
  }, [])

  const handleHeroPointerMove = (event) => {
    const stage = heroVisualRef.current
    if (!stage || event.pointerType === 'touch') return
    const rect = stage.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2
    stage.style.setProperty('--pointer-x', x.toFixed(3))
    stage.style.setProperty('--pointer-y', y.toFixed(3))
  }

  const resetHeroPointer = () => {
    heroVisualRef.current?.style.setProperty('--pointer-x', '0')
    heroVisualRef.current?.style.setProperty('--pointer-y', '0')
  }

  return (
    <article className="fangyuan-detail" ref={rootRef}>
      <div aria-hidden="true" className="work-story-atmosphere fangyuan-atmosphere">
        <span className="fangyuan-glow fangyuan-glow--one" />
        <span className="fangyuan-glow fangyuan-glow--two" />
        <span className="fangyuan-glow fangyuan-glow--three" />
        <span className="fangyuan-glow fangyuan-glow--four" />
      </div>

      <FangyuanLineNavigation />

      {projectsPage?.title && (
        <Link className="fangyuan-back-link" to="/#projects"><span aria-hidden="true">←</span>{projectsPage.title}</Link>
      )}

      <header className="fangyuan-hero" id="fangyuan-overview">
        <div className="fangyuan-hero-copy" data-fangyuan-reveal data-fangyuan-reveal-direction="left">
          <div className="fangyuan-hero-brand">
            <AssetImage alt="方圆车位平台标志" className="fangyuan-hero-mark" loading="eager" src={ASSETS.mark} />
            <span>FANGYUAN / SMART PARKING</span>
          </div>
          <SectionEyebrow>01 / PROJECT OVERVIEW · TO C 移动端车位平台</SectionEyebrow>
          <h1><span>方圆</span><strong>让停车从“寻找”，<br />变成一条确定的路径。</strong></h1>
          <p className="fangyuan-hero-lead">针对城市停车资源错配、驾驶操作割裂与支付信任缺失，重构“寻位—预约—导航—交付”的完整体验，并把同一套设计语言延伸到 HMI 车机端。</p>
          <dl className="fangyuan-hero-meta">
            <div><dt>项目角色</dt><dd>移动端 UX / HMI 适配</dd></div>
            <div><dt>设计范围</dt><dd>需求分析、产品架构、交互原型、视觉系统、跨端体验</dd></div>
          </dl>
        </div>

        <div
          className="fangyuan-hero-visual"
          data-fangyuan-reveal
          data-fangyuan-reveal-direction="up"
          onPointerLeave={resetHeroPointer}
          onPointerMove={handleHeroPointerMove}
          ref={heroVisualRef}
        >
          <span aria-hidden="true" className="fangyuan-hero-track" />
          <PhoneVisual alt="方圆首页未停车状态" className="fangyuan-phone--hero-left" loading="eager" src={ASSETS.homePhone} />
          <PhoneVisual alt="方圆车位导航界面" className="fangyuan-phone--hero-center" loading="eager" src={ASSETS.navigationPhone} />
          <PhoneVisual alt="方圆正在停车状态" className="fangyuan-phone--hero-right" loading="eager" src={ASSETS.parkedPhone} />
          <p><strong>4</strong> 个关键节点 <span>首页 / 预约 / 导航 / 支付</span></p>
        </div>
      </header>

      <section className="fangyuan-section fangyuan-insight" id="fangyuan-insight">
        <div className="fangyuan-section-heading" data-fangyuan-reveal data-fangyuan-reveal-direction="left">
          <SectionEyebrow>02 / BUSINESS INSIGHT</SectionEyebrow>
          <h2>先解决“最后一公里”，<br />再谈停车体验。</h2>
          <p>调研里反复出现的并不是单一功能缺失，而是资源、路径和驾驶情境之间的断层。项目因此从用户抱怨回到业务结构，把问题收束为三个可行动的设计命题。</p>
        </div>

        <div className="fangyuan-problem-ledger">
          {PROBLEM_CLUSTERS.map((item, index) => (
            <article data-fangyuan-reveal data-fangyuan-reveal-direction="up" key={item.title} style={{ '--item-index': index }}>
              <span>{item.number}</span><div><h3>{item.title}</h3><p>{item.finding}</p></div><strong>{item.response}</strong>
            </article>
          ))}
        </div>

        <div className="fangyuan-persona-band" data-fangyuan-reveal data-fangyuan-reveal-direction="up">
          <header><p>USER SPECTRUM</p><h3>同一套服务，承接不同频率与确定性需求。</h3></header>
          <div className="fangyuan-persona-list">
            {PERSONAS.map((persona, index) => (
              <article key={`${persona.name}-${index}`}><span>{String(index + 1).padStart(2, '0')}</span><small>{persona.type}</small><h4>{persona.name}</h4><p>{persona.need}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="fangyuan-section fangyuan-structure" id="fangyuan-structure">
        <div className="fangyuan-structure-intro">
          <div className="fangyuan-section-heading" data-fangyuan-reveal data-fangyuan-reveal-direction="left">
            <SectionEyebrow>03 / EXPERIENCE STRUCTURE</SectionEyebrow>
            <h2>围绕业务场景，<br />把复杂度留在系统里。</h2>
          </div>
          <p data-fangyuan-reveal data-fangyuan-reveal-direction="up">通过重构“寻位—导航—交付”的交互架构，整合车位时空属性、驾驶行为与环境感知数据，提升闲置车位的预约转化与最终核销效率。</p>
        </div>

        <div className="fangyuan-experience-model" data-fangyuan-reveal data-fangyuan-reveal-direction="up">
          <ul className="fangyuan-experience-list fangyuan-experience-list--left">
            {EXPERIENCE_PRINCIPLES.slice(0, 2).map((item) => <li key={item.title}><strong>{item.title}</strong><span>{item.body}</span></li>)}
          </ul>
          <div className="fangyuan-experience-orbits" aria-label="交互形式与回归体验共同承接业务诉求"><div><span>交互形式</span></div><p>业务<br />诉求</p><div><span>回归体验</span></div></div>
          <ul className="fangyuan-experience-list fangyuan-experience-list--right">
            {EXPERIENCE_PRINCIPLES.slice(2).map((item) => <li key={item.title}><strong>{item.title}</strong><span>{item.body}</span></li>)}
          </ul>
        </div>

        <div className="fangyuan-flow" data-fangyuan-reveal data-fangyuan-reveal-direction="up">
          <header><p>PRODUCT FLOW</p><strong>高效 · 简洁 · 沉浸 · 可靠</strong></header>
          <ol className="fangyuan-flow-track">
            {FLOW_STEPS.map((step, index) => <li key={step.title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{step.title}</h3><p>{step.note}</p></li>)}
          </ol>
        </div>

        <div className="fangyuan-prototype" data-fangyuan-reveal data-fangyuan-reveal-direction="up">
          <div className="fangyuan-prototype-copy"><p>LOW-FIDELITY PROTOTYPE</p><h3>先验证信息顺序，<br />再建立视觉确定性。</h3><span>用低保真原型梳理车位信息、地图搜索与关键操作，将“定位—日期—付款”压缩成最短闭环。</span></div>
          <figure className="fangyuan-wireframe fangyuan-wireframe--map"><AssetImage alt="方圆地图搜索低保真原型" src={ASSETS.wireframeMap} /></figure>
          <figure className="fangyuan-wireframe fangyuan-wireframe--detail"><AssetImage alt="方圆车位详情低保真原型" src={ASSETS.wireframeDetail} /></figure>
        </div>
      </section>

      <section className="fangyuan-section fangyuan-interface" id="fangyuan-interface">
        <div className="fangyuan-interface-intro">
          <div className="fangyuan-section-heading" data-fangyuan-reveal data-fangyuan-reveal-direction="left">
            <SectionEyebrow>04 / VISUAL & INTERFACE</SectionEyebrow>
            <h2>用高对比的极简界面，<br />帮助用户更快做决定。</h2>
          </div>
          <p data-fangyuan-reveal data-fangyuan-reveal-direction="up">深绿承接沉浸与可靠，荧光黄只出现在关键数字和决策动作上；P 字母被演化为定位针形态，让“停车”与“精确抵达”在一个符号里完成识别。</p>
        </div>

        <div className="fangyuan-visual-system" data-fangyuan-reveal data-fangyuan-reveal-direction="up">
          <div className="fangyuan-logo-study"><AssetImage alt="方圆品牌标志" src={ASSETS.mark} /><div><p>LOGO CONCEPT</p><h3>P + 定位坐标</h3><span>保留停车符号的识别特征，以向下延伸的坐标尖点强化“精确找位”。</span></div></div>
          <div className="fangyuan-color-study"><p>COLOR SYSTEM</p><div>{COLOR_SYSTEM.map((color) => <span key={color.hex} style={{ '--swatch': color.hex }}><i>{color.hex}</i><small>{color.label}</small></span>)}</div></div>
          <figure className="fangyuan-moodboard"><AssetImage alt="方圆视觉情绪板" src={ASSETS.moodboard} /><figcaption>沉浸 / 简约 / 高效</figcaption></figure>
        </div>

        <article className="fangyuan-screen-story fangyuan-screen-story--home">
          <div className="fangyuan-screen-copy" data-fangyuan-reveal data-fangyuan-reveal-direction="left"><SectionEyebrow>CORE 01 / HOME</SectionEyebrow><h3>让当前状态，<br />成为首页唯一的主角。</h3><p>未停车时放大预约入口；正在停车时，用天量时钟把时间进度与当前车位锁定在第一视线，并把“结束停车”提升为高频快捷动作。</p><ul><li>单一视觉焦点</li><li>状态驱动信息</li><li>关键动作前置</li></ul></div>
          <div className="fangyuan-device-group fangyuan-device-group--pair" data-fangyuan-reveal data-fangyuan-reveal-direction="up"><PhoneVisual alt="方圆首页未停车状态" src={ASSETS.homePhone} /><PhoneVisual alt="方圆首页正在停车状态" src={ASSETS.parkedPhone} /></div>
        </article>

        <article className="fangyuan-screen-story fangyuan-screen-story--reservation">
          <div className="fangyuan-screen-copy" data-fangyuan-reveal data-fangyuan-reveal-direction="right"><SectionEyebrow>CORE 02 / RESERVATION</SectionEyebrow><h3>距离、日期、时间，<br />一条连续的预约节奏。</h3><p>距离条先帮助用户比较候选车位，再用连续圆点完成日期选择，并把抽象时长转化为可滑动的时间刻度，让长短租在同一流程中自然切换。</p></div>
          <div className="fangyuan-device-group fangyuan-device-group--trio" data-fangyuan-reveal data-fangyuan-reveal-direction="up"><PhoneVisual alt="方圆可预约车位列表" src={ASSETS.reservationPhone} /><PhoneVisual alt="方圆预约日期选择" src={ASSETS.datePhone} /><PhoneVisual alt="方圆预约时长选择" src={ASSETS.timePhone} /></div>
        </article>

        <article className="fangyuan-screen-story fangyuan-screen-story--navigation">
          <div className="fangyuan-screen-copy" data-fangyuan-reveal data-fangyuan-reveal-direction="left"><SectionEyebrow>CORE 03 / NAVIGATION</SectionEyebrow><h3>极度降噪，<br />只留下下一步。</h3><p>无地图背景、放大的方向箭头、明确的车位号与距离，将导航压缩为驾驶时可以一眼完成的判断，减少干扰与误读。</p></div>
          <div className="fangyuan-navigation-stage" data-fangyuan-reveal data-fangyuan-reveal-direction="up"><span aria-hidden="true">B1 313</span><PhoneVisual alt="方圆车位导航界面" src={ASSETS.navigationPhone} /></div>
        </article>

        <article className="fangyuan-screen-story fangyuan-screen-story--payment">
          <div className="fangyuan-screen-copy" data-fangyuan-reveal data-fangyuan-reveal-direction="right"><SectionEyebrow>CORE 04 / PAYMENT</SectionEyebrow><h3>授权一次，<br />把停车交付变成无感闭环。</h3><p>车牌绑定后自动识别离场时间并结算；账单完整保留计费规则、时段与合作方信息，让“无需操作”与“费用可追溯”同时成立。</p></div>
          <div className="fangyuan-device-group fangyuan-device-group--trio" data-fangyuan-reveal data-fangyuan-reveal-direction="up"><PhoneVisual alt="方圆支付账户确认" src={ASSETS.paymentAccount} /><PhoneVisual alt="方圆支付密码输入" src={ASSETS.paymentPin} /><PhoneVisual alt="方圆支付完成界面" src={ASSETS.paymentSuccess} /></div>
        </article>
      </section>

      <section className="fangyuan-section fangyuan-hmi" id="fangyuan-hmi">
        <div className="fangyuan-hmi-heading">
          <div className="fangyuan-section-heading" data-fangyuan-reveal data-fangyuan-reveal-direction="left"><SectionEyebrow>05 / HMI EXTENSION</SectionEyebrow><h2>手机不是终点，<br />体验继续跟随驾驶。</h2></div>
          <p data-fangyuan-reveal data-fangyuan-reveal-direction="up">通过手机与车机的数据同步和状态互通，在切换终端时保持信息连续、操作一致，形成真正无断点的出行生态。</p>
        </div>
        <figure className="fangyuan-hmi-stage" data-fangyuan-reveal data-fangyuan-reveal-direction="up"><AssetImage alt="方圆 HMI 车机端导航界面" src={ASSETS.hmiScene} /><figcaption>HMI / PARKING NAVIGATION</figcaption></figure>
        <div className="fangyuan-hmi-principles">
          <article data-fangyuan-reveal data-fangyuan-reveal-direction="up"><span>01</span><h3>安全优先</h3><p>核心操作部署在屏幕两侧边缘，保持视觉中心完整，并贴合驾驶员自然触控热区。</p></article>
          <article data-fangyuan-reveal data-fangyuan-reveal-direction="up"><span>02</span><h3>极简地图</h3><p>仅保留核心路径与关键路口提示，降低视觉疲劳和驾驶中的认知成本。</p></article>
          <article data-fangyuan-reveal data-fangyuan-reveal-direction="up"><span>03</span><h3>情感护航</h3><p>以音乐播放和低刺激反馈缓解驾驶焦虑，让功能效率之外仍保留体验温度。</p></article>
        </div>
      </section>

      <section className="fangyuan-section fangyuan-summary" id="fangyuan-summary">
        <div className="fangyuan-summary-heading" data-fangyuan-reveal data-fangyuan-reveal-direction="left"><SectionEyebrow>06 / PROJECT SUMMARY</SectionEyebrow><h2>把车位、时间与路径，<br />组织成一套确定的体验。</h2><p>项目最终不是增加更多功能，而是让资源更可用、决策更轻、跨端更连续。</p></div>
        <div className="fangyuan-summary-list">
          {SUMMARY_POINTS.map((point, index) => <article data-fangyuan-reveal data-fangyuan-reveal-direction="up" key={point.title} style={{ '--item-index': index }}><span>{point.number}</span><h3>{point.title}</h3><p>{point.body}</p></article>)}
        </div>
        <blockquote data-fangyuan-reveal data-fangyuan-reveal-direction="up"><AssetImage alt="" src={ASSETS.parkingAction} /><p>“停车体验的终点，不是找到一个位置，<br />而是让用户从出发开始就拥有确定感。”</p></blockquote>
      </section>

      <div data-fangyuan-reveal data-fangyuan-reveal-direction="up"><ProjectFooterNav nextProject={nextProject} variant="fangyuan" /></div>
    </article>
  )
}
