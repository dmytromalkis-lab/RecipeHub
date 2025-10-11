import './SubmitButton.css';

export default function SubmitButton({ buttonName = 'Register' }) {
  return (
    <button type="submit" className="btn">{buttonName}</button>
  );
};
