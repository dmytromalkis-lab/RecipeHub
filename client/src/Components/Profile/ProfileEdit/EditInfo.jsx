import React from 'react';
import './EditInfo.css';
import EditPhoto from './EditPhoto';
import AboutProfile from './AboutProfile';
import AvatarProfile from './AvatarProfile';
import FirstNameProfile from './FirstNameProfile';
import LastNameProfile from './LastNameProfile';

export default function EditInfo({
  avatarSrc,
  firstName,
  lastName,
  about,
  onFirstNameChange,
  onLastNameChange,
  onAboutChange,
  onEditPhoto
}) {
  return (
    <div className="edit-info-container">
      <div className="edit-info-left">
        <AvatarProfile src={avatarSrc} alt="User avatar" size={150} />
        <EditPhoto onClick={onEditPhoto} />
      </div>
      <div className="edit-info-right">
        <FirstNameProfile value={firstName} onChange={onFirstNameChange} />
        <LastNameProfile value={lastName} onChange={onLastNameChange} />
        <AboutProfile value={about} onChange={onAboutChange} />
      </div>
    </div>
  );
}
