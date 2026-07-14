function getFallbackItems(profile, page) {
  const links = profile?.links || []
  const items = []

  if (profile?.phone) {
    items.push({
      label: page?.phoneLabel || '电话',
      value: profile.phone,
      href: `tel:${profile.phone}`
    })
  }

  if (profile?.email) {
    items.push({
      label: page?.emailLabel || '邮箱',
      value: profile.email,
      href: `mailto:${profile.email}`
    })
  }

  links.forEach((link) => {
    items.push({
      label: link.label,
      value: link.label,
      href: link.href
    })
  })

  return items
}

function ContactValue({ item }) {
  const value = item.value || item.label
  const isExternal = item.href?.startsWith('http')

  if (!value) return null

  if (item.href) {
    return (
      <a
        href={item.href}
        rel={isExternal ? 'noreferrer' : undefined}
        target={isExternal ? '_blank' : undefined}
      >
        {value}
      </a>
    )
  }

  return <span className="contact-value">{value}</span>
}

export default function Contact({ page, profile, sectionId }) {
  const contactItems = profile?.contactItems?.length
    ? profile.contactItems
    : getFallbackItems(profile, page)
  const hasContact = contactItems.length > 0

  if (!hasContact) return null

  return (
    <section className="section contact-section" data-home-reveal id={sectionId}>
      <div className="section-heading">
        {page?.caption && <p className="caption">{page.caption}</p>}
        {page?.title && <h2>{page.title}</h2>}
      </div>
      <div className="contact-list">
        {contactItems.map((item) => (
          <p className="contact-row" key={`${item.label}-${item.value || item.href}`}>
            {item.label && <span className="caption">{item.label}</span>}
            <ContactValue item={item} />
          </p>
        ))}
      </div>
    </section>
  )
}
