import './ProfileInfo.css';
import avatarImg from '../../../assets/avatar.png';

export default function ProfileInfo({ name, email, avatar }) {
  return (
    <div className="profile-info">
      <img className="avatar" src={avatarImg} alt="User avatar" />
      <div className="profile-info-details">
        <h2 className="user-name">{name}</h2>
        <p className="user-email">{email}</p>
      </div>
    </div>
  );
}
