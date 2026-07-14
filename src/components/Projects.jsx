import { Link } from 'react-router-dom'

function ProjectCard({ project, separator, index }) {
  const meta = [project.category, project.year, project.role].filter(Boolean).join(separator)
  const projectIndex = String(index + 1).padStart(2, '0')

  return (
    <Link className="project-card" to={`/work/${project.id}`}>
      <p className="project-index">{projectIndex}</p>
      <div className="project-main">
        {project.category && <p className="caption project-category">{project.category}</p>}
        {project.title && <h3>{project.title}</h3>}
        {project.description && <p className="project-desc">{project.description}</p>}
      </div>
      {meta && <p className="project-meta">{meta}</p>}
    </Link>
  )
}

export default function Projects({ page, projects, sectionId, separator = '' }) {
  if (!projects?.length) return null

  return (
    <section className="section projects-section" data-home-reveal id={sectionId}>
      <div className="section-heading">
        {page?.caption && <p className="caption">{page.caption}</p>}
        {page?.title && <h2>{page.title}</h2>}
      </div>
      <div className="projects-list">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id || project.title}
            project={project}
            separator={separator}
            index={index}
          />
        ))}
      </div>
    </section>
  )
}
