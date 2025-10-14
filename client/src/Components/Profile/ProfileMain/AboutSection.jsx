import './AboutSection.css';

export default function AboutSection({ about }) {
  return (
    <div className="about-section">
      <h3>About me:</h3>
      <p>{about}</p>
    </div>
  );
}
