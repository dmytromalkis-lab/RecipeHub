import { useNavigate } from 'react-router-dom';
import './Profile.css';

import BackButton from './../../Components/Profile/ProfileMain/BackButton.jsx';
import ProfileInfo from './../../Components/Profile/ProfileMain/ProfileInfo.jsx';
import EditButton from './../../Components/Profile/ProfileMain/EditButton.jsx';
import AboutSection from './../../Components/Profile/ProfileMain/AboutSection.jsx';

function ProfilePage() {
  const navigate = useNavigate();
  return (
    <div className="profile-page">
      <BackButton onClick={() => navigate('/main')} />
      <main className="profile-content">
        <ProfileInfo 
          name = {"User's first and last name"}
          email = {"user_email@gmail.com"}
          avatar = {"https://cdn-icons-png.flaticon.com/512/149/149071.png"}
        />
        <AboutSection about = {"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.\n\nIt has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."} 
        /> 
        <EditButton>Edit profile</EditButton>
      </main>
    </div>
  );
}

export default ProfilePage;