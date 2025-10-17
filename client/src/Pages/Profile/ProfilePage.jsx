import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Profile.css';

import BackButton from './../../Components/Profile/ProfileMain/BackButton.jsx';
import ProfileInfo from './../../Components/Profile/ProfileMain/ProfileInfo.jsx';
import EditButton from './../../Components/Profile/ProfileMain/EditButton.jsx';
import AboutSection from './../../Components/Profile/ProfileMain/AboutSection.jsx';
import api from '../../api/axios.js';
import useUserStore from '../../stores/userStore.js';

function ProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUserStore();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!id) {
          setProfile(user ? {
            user_id: user.user_id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            avatar: user.avatar,
            about_user: user.about_user,
          } : null);
        } else {
          const res = await api.get(`/user/${id}`);
          setProfile(res.data?.user || null);
        }
      } catch (e) {
        setError(e?.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id, user]);

  const canEdit = !!user && (!id || String(user.user_id) === String(id));

  return (
    <div className="profile-page">
      <BackButton onClick={() => navigate('/main')} />
      <main className="profile-content">
        {loading && <div>Loading...</div>}
        {error && <div>{error}</div>}
        {!loading && !error && (
          <>
            <ProfileInfo 
              name = {profile ? `${profile.first_name} ${profile.last_name}` : "User's first and last name"}
              email = {profile ? profile.email : "user_email@gmail.com"}
              avatar = {profile ? profile.avatar : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
            />
            <AboutSection about = {profile ? (profile.about_user || "") : ""} />
            {canEdit && <EditButton>Edit profile</EditButton>}
          </>
        )}
      </main>
    </div>
  );
}

export default ProfilePage;