
import './EditButton.css';
import { useNavigate } from 'react-router-dom';

export default function EditButton({ children = 'Edit profile', ...props }) {
  const navigate = useNavigate();
  const handleClick = (e) => {
    if (props.onClick) props.onClick(e);
    navigate('/profile/edit');
  };
  return (
    <button className="edit-btn" {...props} onClick={handleClick}>
      {children}
    </button>
  );
}
