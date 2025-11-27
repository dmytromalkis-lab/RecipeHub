import "./ProfileInfo.css";

export default function ProfileInfo({ name, email, avatar }) {
  return (
    <div className="profile-info">
      <img
        className="avatar"
        src={avatar}
        alt="User avatar"
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
      />
      <div className="profile-info-details">
        <h2 className="user-name">{name}</h2>
        <p className="user-email">{email}</p>
      </div>
    </div>
  );
}
