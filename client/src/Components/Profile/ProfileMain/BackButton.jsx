import './BackButton.css';

export default function BackButton({ onClick }) {
  return (
    <div className="back-button" onClick={onClick} style={{userSelect: 'none'}}>
      ← Back
    </div>
  );
}