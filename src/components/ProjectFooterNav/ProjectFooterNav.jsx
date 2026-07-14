import { Link } from 'react-router-dom'
import './ProjectFooterNav.css'

export default function ProjectFooterNav({ nextProject, variant = 'default' }) {
  if (!nextProject?.id) return null

  const revealProps = variant === 'maple'
    ? {
        'data-maple-reveal': '',
        'data-maple-reveal-direction': 'up'
      }
    : variant === 'baby'
      ? {
          'data-baby-reveal': '',
          'data-baby-reveal-direction': 'up'
        }
    : variant === 'story'
      ? { 'data-reveal': '' }
      : {}

  return (
    <nav
      aria-label="项目页尾导航"
      className={`project-footer-nav project-footer-nav--${variant}`}
      {...revealProps}
    >
      <Link
        aria-label="返回所有项目"
        className="project-footer-nav__action project-footer-nav__action--all"
        to="/#projects"
      >
        <span className="project-footer-nav__copy">
          <small>作品导航</small>
          <strong>返回所有项目</strong>
        </span>
        <span aria-hidden="true" className="project-footer-nav__arrow">←</span>
      </Link>

      <Link
        aria-label={`查看下一项目：${nextProject.title}`}
        className="project-footer-nav__action project-footer-nav__action--next"
        to={`/work/${nextProject.id}`}
      >
        <span className="project-footer-nav__copy">
          <small>查看下一项目</small>
          <strong>{nextProject.title}</strong>
        </span>
        <span aria-hidden="true" className="project-footer-nav__arrow">→</span>
      </Link>
    </nav>
  )
}
