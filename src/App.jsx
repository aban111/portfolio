import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom'
import './portfolio.css'
import Hero from './components/Hero'
import Projects from './components/Projects'
import About from './components/About'
import Contact from './components/Contact'
import HomeAmbientBackground from './components/HomeAmbientBackground/HomeAmbientBackground'
import LoadingScreen from './components/LoadingScreen'
import WorkDetail from './components/WorkDetail'
import { usePDFData } from './lib/usePDFData'

const ROUTER_BASENAME = import.meta.env.BASE_URL.replace(/\/+$/, '') || '/'

function HomePage({ site, pages, profile, projects }) {
  return (
    <>
      <HomeAmbientBackground />
      <Hero profile={profile} sectionId="home" site={site} />
      <Projects
        page={pages.projects}
        projects={projects}
        sectionId="projects"
        separator={site.metaSeparator}
      />
      <About page={pages.about} profile={profile} sectionId="about" />
      <Contact page={pages.contact} profile={profile} sectionId="contact" />
    </>
  )
}

function HomeRevealObserver() {
  const location = useLocation()

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('[data-home-reveal]'))

    if (!nodes.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-visible', entry.intersectionRatio >= 0.18)
        })
      },
      {
        rootMargin: '-8% 0px -14% 0px',
        threshold: [0.18, 0.36]
      }
    )

    nodes.forEach((node) => observer.observe(node))

    return () => observer.disconnect()
  }, [location.pathname, location.hash])

  return null
}

function getSectionId(path) {
  if (path === '/') return 'home'

  return path.replace(/^\//, '')
}

function getSectionHref(path) {
  return `/#${getSectionId(path)}`
}

function ScrollAndSectionObserver({ onSectionChange }) {
  const location = useLocation()

  useEffect(() => {
    const isWorkPage = location.pathname.startsWith('/work/')

    if (isWorkPage) {
      onSectionChange('projects')
      window.scrollTo({ top: 0, behavior: 'instant' })
      return undefined
    }

    const sectionId = location.hash.replace('#', '') || 'home'
    const target = document.getElementById(sectionId)

    if (target) {
      window.requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }

    onSectionChange(sectionId)

    const sections = ['home', 'projects', 'about', 'contact']
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visible?.target?.id) onSectionChange(visible.target.id)
      },
      {
        rootMargin: '-24% 0px -58% 0px',
        threshold: [0.1, 0.35, 0.6]
      }
    )

    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [location.hash, location.pathname, onSectionChange])

  return null
}

function SiteHeader({ activeSection, site }) {
  const location = useLocation()
  const currentSection = location.pathname.startsWith('/work/') ? 'projects' : activeSection

  return (
    <header className="site-header">
      <nav className="pill-nav" aria-label="主要导航">
        {site.navigation.map((item) => {
          const sectionId = getSectionId(item.path)
          const isActive = currentSection === sectionId

          return (
            <Link
              aria-current={isActive ? 'page' : undefined}
              className={isActive ? 'is-active' : undefined}
              key={item.path}
              to={getSectionHref(item.path)}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}

function NotFound({ projectsPage }) {
  return (
    <section className="data-error not-found" aria-labelledby="not-found-title">
      <p className="caption">404 / Page not found</p>
      <h1 id="not-found-title">这里暂时没有这一页。</h1>
      <p>可能是链接写错了，也可能这部分作品还在打磨中。</p>
      <Link className="error-action" to={getSectionHref(projectsPage?.path || '/projects')}>
        回到作品
      </Link>
    </section>
  )
}

function RouteMetadata({ pages, profile, projects, site }) {
  const location = useLocation()

  useEffect(() => {
    const workId = location.pathname.startsWith('/work/')
      ? decodeURIComponent(location.pathname.replace('/work/', ''))
      : ''
    const project = projects.find((item) => item.id === workId)
    const sectionId = location.hash.replace('#', '')
    const sectionTitle = sectionId && sectionId !== 'home' ? pages?.[sectionId]?.title : ''
    const pageTitle = project?.title || sectionTitle
    const ownerTitle = [profile?.name, profile?.title].filter(Boolean).join('｜')
    const nextTitle = pageTitle && profile?.name
      ? `${pageTitle}｜${profile.name}`
      : ownerTitle || site?.title
    const description = project?.description || profile?.description

    if (nextTitle) document.title = nextTitle
    document.documentElement.lang = site?.language || 'zh-CN'

    if (description) {
      let meta = document.querySelector('meta[name="description"]')

      if (!meta) {
        meta = document.createElement('meta')
        meta.name = 'description'
        document.head.appendChild(meta)
      }

      meta.content = description
    }
  }, [location.hash, location.pathname, pages, profile, projects, site])

  return null
}

function DataError({ message }) {
  return (
    <main className="data-error" role="alert">
      <p className="caption">Data unavailable</p>
      <h1>作品集暂时无法载入。</h1>
      <p>{message || '请检查 public/data.json 后重试。'}</p>
      <button type="button" onClick={() => window.location.reload()}>
        重新加载
      </button>
    </main>
  )
}

function App() {
  const [isMinimumLoading, setIsMinimumLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('home')
  const { data, error, isLoading } = usePDFData()
  const { site, pages, profile, projects } = data
  const footerParts = [site.footerPrefix, site.year, profile.name].filter(Boolean)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsMinimumLoading(false), 2000)

    return () => window.clearTimeout(timer)
  }, [])

  const showLoading = isMinimumLoading || isLoading

  return (
    <BrowserRouter basename={ROUTER_BASENAME}>
      {showLoading ? (
        <LoadingScreen profile={profile} site={site} />
      ) : error ? (
        <DataError message={error.message} />
      ) : (
        <div className="container">
          <a className="skip-link" href="#main-content">
            跳到主要内容
          </a>
          <RouteMetadata pages={pages} profile={profile} projects={projects} site={site} />
          <ScrollAndSectionObserver onSectionChange={setActiveSection} />
          <HomeRevealObserver />
          <SiteHeader activeSection={activeSection} site={site} />

          <main id="main-content">
            <Routes>
              <Route
                path="/"
                element={<HomePage site={site} pages={pages} profile={profile} projects={projects} />}
              />
              <Route
                path="/projects"
                element={<Navigate to="/#projects" replace />}
              />
              <Route path="/about" element={<Navigate to="/#about" replace />} />
              <Route path="/contact" element={<Navigate to="/#contact" replace />} />
              <Route
                path="/work/:id"
                element={<WorkDetail projects={projects} projectsPage={pages.projects} separator={site.metaSeparator} />}
              />
              <Route path="*" element={<NotFound projectsPage={pages.projects} />} />
            </Routes>
          </main>

          {footerParts.length > 0 && <footer className="site-footer">{footerParts.join(' ')}</footer>}
        </div>
      )}
    </BrowserRouter>
  )
}

export default App
