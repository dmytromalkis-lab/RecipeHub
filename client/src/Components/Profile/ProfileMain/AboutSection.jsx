import './AboutSection.css';

export default function AboutSection({ about }) {
  const hasAbout = typeof about === 'string' && about.trim().length > 0;
  const displayText = hasAbout ? about : 'There no information about this user yet.';

  return (
    <div className="about-section">
      <h3>About me:</h3>
      <p>{displayText}</p>
    </div>
  );
}
