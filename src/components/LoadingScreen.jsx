export default function LoadingScreen({ profile, site }) {
  return (
    <div className="loading-screen" aria-live="polite">
      <div className="loading-inner">
        {site?.title && <p className="caption">{site.title}</p>}
        {profile?.name && <p className="loading-name">{profile.name}</p>}
        <div className="loading-line" />
      </div>
    </div>
  )
}
