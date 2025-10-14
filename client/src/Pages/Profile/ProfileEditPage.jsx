import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileEdit.css';

import BackButton from '../../Components/Profile/ProfileMain/BackButton';

import Header from '../../Components/Main/Header/Header';
import Footer from '../../Components/Main/Footer/Footer';
import SaveButton from '../../Components/Profile/ProfileEdit/SaveButton';
import EditInfo from '../../Components/Profile/ProfileEdit/EditInfo';
import avatarImg from "../../assets/avatar.png";


export default function ProfileEditPage() {
  const [firstName, setFirstName] = useState('Name');
  const [lastName, setLastName] = useState('Last name');
  const [about, setAbout] = useState('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.\n\nIt has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.');
  const navigate = useNavigate();

  const handleSave = () => {
  };

  return (
    <div className="profile-edit-page">
      <Header />
      <BackButton onClick={() => navigate('/profile')} />
      <main className="profile-content">
        <EditInfo
          avatarSrc={avatarImg}
          firstName={firstName}
          lastName={lastName}
          about={about}
          onFirstNameChange={e => setFirstName(e.target.value)}
          onLastNameChange={e => setLastName(e.target.value)}
          onAboutChange={e => setAbout(e.target.value)}
          onEditPhoto={() => {}}
        />
        <SaveButton onClick={handleSave} />
      </main>
      <Footer />
    </div>
  );
}
