function ResumeItem({ item }) {
  if (!item) return null
  const hasBody = Boolean(item.body || item.points?.length > 0)

  return (
    <div className={hasBody ? 'resume-item' : 'resume-item resume-item-compact'}>
      <div className="resume-item-heading">
        {item.title && <h3>{item.title}</h3>}
        {item.role && <p className="resume-role">{item.role}</p>}
        {item.period && <p className="resume-period">{item.period}</p>}
      </div>
      {hasBody && (
        <div className="resume-item-body">
          {item.body && <p>{item.body}</p>}
          {item.points?.length > 0 && (
            <ul>
              {item.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

function AboutBlock({ block }) {
  if (typeof block === 'string') return <p>{block}</p>
  if (!block?.items?.length) return null

  return (
    <article className="resume-group">
      {block.label && <p className="caption resume-label">{block.label}</p>}
      <div className="resume-items">
        {block.items.map((item) => (
          <ResumeItem
            item={item}
            key={[item.title, item.role, item.period, item.body].filter(Boolean).join('-')}
          />
        ))}
      </div>
    </article>
  )
}

export default function About({ page, profile, sectionId }) {
  if (!profile?.about?.length) return null

  return (
    <section className="section about-section" data-home-reveal id={sectionId}>
      <div className="section-heading">
        {page?.caption && <p className="caption">{page.caption}</p>}
        {page?.title && <h2>{page.title}</h2>}
      </div>
      <div className="about-content">
        {profile.about.map((block) => (
          <AboutBlock
            block={block}
            key={typeof block === 'string' ? block : block.label}
          />
        ))}
        {page?.sourceLabel && profile?.source && (
          <p className="source-line">
            {page.sourceLabel}
            {page.sourceSeparator}
            {profile.source}
          </p>
        )}
      </div>
    </section>
  )
}
