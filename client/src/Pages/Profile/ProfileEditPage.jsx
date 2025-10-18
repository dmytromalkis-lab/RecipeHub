import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileEdit.css';

import BackButton from '../../Components/Profile/ProfileMain/BackButton';

import SaveButton from '../../Components/Profile/ProfileEdit/SaveButton';
import EditInfo from '../../Components/Profile/ProfileEdit/EditInfo';
import avatarImg from "../../assets/avatar.png";
import api from '../../api/axios.js';
import useUserStore from '../../stores/userStore.js';


export default function ProfileEditPage() {
  const [firstName, setFirstName] = useState('Name');
  const [lastName, setLastName] = useState('Last name');
  const [about, setAbout] = useState('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.\n\nIt has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.');
  const navigate = useNavigate();
  const { user, token, setUser } = useUserStore();

  // Initialize from current user if available
  React.useEffect(() => {
    if (user) {
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
      setAbout(user.about_user || '');
    }
  }, [user]);

  const [avatarSrc, setAvatarSrc] = useState(avatarImg);
  const fileInputRef = React.useRef(null);

  React.useEffect(() => {
    if (user && user.avatar) setAvatarSrc(user.avatar);
  }, [user]);

  const handleSave = async () => {
    try {
      const userId = user?.user_id;
      if (!userId) {
        console.error('No user id available');
        return;
      }

      const payload = {
        first_name: firstName,
        last_name: lastName,
        about_user: about,
      };

      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await api.put(`/user/${userId}`, payload, { headers });

      // Update local store user fields if backend returned updated user
      const updated = res.data?.user;
      if (updated) {
        setUser({
          ...user,
          first_name: updated.first_name ?? user.first_name,
          last_name: updated.last_name ?? user.last_name,
          about_user: updated.about_user ?? user.about_user,
        });
      }

      navigate('/profile');
    } catch (err) {
      console.error('Error saving profile', err?.response?.data || err.message || err);
      // Optionally show UI feedback here
    }
  };

  const handleEditPhotoClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const userId = user?.user_id;
      if (!userId) return console.error('No user id available for avatar upload');

      const formData = new FormData();
      formData.append('avatar', file);

      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await api.put(`/user/${userId}/avatar`, formData, {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data',
        },
      });

      const newAvatar = res.data?.avatar;
      if (newAvatar) {
        setAvatarSrc(newAvatar);
        setUser({ ...user, avatar: newAvatar });
      }
    } catch (err) {
      console.error('Error uploading avatar', err?.response?.data || err.message || err);
    } finally {
      // clear file input so same file can be uploaded again if needed
      if (fileInputRef.current) fileInputRef.current.value = null;
    }
  };

  return (
    <div className="profile-edit-page">
      <BackButton onClick={() => navigate('/profile')} />
      <main className="profile-content">
        <EditInfo
          avatarSrc={avatarSrc}
          firstName={firstName}
          lastName={lastName}
          about={about}
          onFirstNameChange={e => setFirstName(e.target.value)}
          onLastNameChange={e => setLastName(e.target.value)}
          onAboutChange={e => setAbout(e.target.value)}
          onEditPhoto={handleEditPhotoClick}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <SaveButton onClick={handleSave} />
      </main>
    </div>
  );
}
