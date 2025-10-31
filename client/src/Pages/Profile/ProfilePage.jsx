import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Profile.css';
import avatarImg from '../../assets/avatar.png';

import BackButton from './../../Components/Profile/ProfileMain/BackButton.jsx';
import ProfileInfo from './../../Components/Profile/ProfileMain/ProfileInfo.jsx';
import EditButton from './../../Components/Profile/ProfileMain/EditButton.jsx';
import AboutSection from './../../Components/Profile/ProfileMain/AboutSection.jsx';
import ProfileRecipeForm from './../../Components/Profile/ProfileRecipes/ProfileRecipeForm.jsx';
import Loading from "./../../components/UI/Loading/Loading.jsx";
import { Link } from 'react-router-dom';
import api from '../../api/axios.js';
import borschtImg from '../../assets/borscht.jfif';
import varenikiImg from '../../assets/burger.jfif';
import olivieImg from '../../assets/salad.jfif';
import kyivcakeImg from '../../assets/pizza.jfif';
import useUserStore from '../../stores/userStore.js';

function ProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useUserStore((state) => state.user);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('own');
  const [myRecipes, setMyRecipes] = useState([]);
  const [myRecipesLoading, setMyRecipesLoading] = useState(false);
  const [myRecipesError, setMyRecipesError] = useState(null);
  const initialSrc = user?.avatar ?? avatarImg;
  const canEdit = !!user && (!id || String(user.user_id) === String(id));

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

  useEffect(() => {
    const fetchMyRecipes = async () => {
      if(!canEdit || selectedTab !== "own") return;
      if(!user || !user.user_id) return;

      setMyRecipesLoading(true);
      setMyRecipesError(null);

      try {
        const config = {};
        const token = useUserStore.getState().token;
        if (token) {
          config.headers = { Authorization: `Bearer ${token}` };
        }

        const responseMyRecipes = await api.get("/recipes/my", config);
        const dataMyRecipes = Array.isArray(responseMyRecipes.data?.recipes) ? responseMyRecipes.data?.recipes : [];
        setMyRecipes(dataMyRecipes);
      } catch (error) {
        const message = error?.response?.data?.message || error.message || 'Failed to load my recipes';
        setMyRecipesError(message);
      } finally {
        setMyRecipesLoading(false);
      }
    }
    fetchMyRecipes();
  }, [canEdit, selectedTab, user]);

  console.log(myRecipes);

  const avatarToShow = (() => {
    const defaultAvatar = avatarImg;
    if (!profile) return defaultAvatar;
    // if viewing another user's profile (id in URL) — show that profile's avatar
    if (id) return profile.avatar || defaultAvatar;
    // otherwise (own profile) prefer current user avatar from store
    return user?.avatar || profile.avatar || defaultAvatar;
  })();

  // sample test data for the two tabs
  const ownRecipesSample = [
    {
      id: 1,
      title: 'Borscht',
      ingredients: ['beet', 'cabbage', 'water'],
      prep_time: 44,
      serving: 2,
      image_url: borschtImg,
      difficulty: 'medium',
      category: 'Soups',
      author: { first_name: profile?.first_name || 'Mykyta', last_name: '', avatar: profile?.avatar || null, user_id: profile?.user_id || '' },
    },
    {
      id: 2,
      title: 'Cherry dumplings',
      ingredients: ['flour', 'cherry', 'sugar'],
      prep_time: 60,
      serving: 4,
      image_url: varenikiImg,
      difficulty: 'easy',
      Category: { category_name: 'Bakery' },
      author: { first_name: profile?.first_name || 'Mykyta', last_name: '', avatar: profile?.avatar || null, user_id: profile?.user_id || '' },
    }
  ];

  const favRecipesSample = [
    {
      id: 'f1',
      title: "Olivier Salad",
      ingredients: ['potato', 'carrot', 'cucumber'],
      prep_time: 25,
      serving: 6,
      image_url: olivieImg,
      difficulty: 'easy',
      category: 'Salads',
      author: { first_name: 'Oksana', last_name: '', avatar: null, user_id: 'u2' },
    },
    {
      id: 'f2',
      title: 'Kyiv Cake',
      ingredients: ['eggs', 'nuts', 'chocolate'],
      prep_time: 90,
      serving: 8,
      image_url: kyivcakeImg,
      difficulty: 'hard',
      Category: { category_name: 'Desserts' },
      author: { first_name: 'Olena', last_name: '', avatar: null, user_id: 'u3' },
    }
  ];

  return (
    <div className="profile-page">
      <BackButton onClick={() => navigate('/')} />
      <main className="profile-content">
        {loading && <div>Loading...</div>}
        {error && <div>{error}</div>}
        {!loading && !error && (
          <>
            <ProfileInfo
              name={profile ? `${profile.first_name} ${profile.last_name}` : "User's first and last name"}
              email={profile ? profile.email : "user_email@gmail.com"}
              avatar={avatarToShow}
            />
            <AboutSection about = {profile ? (profile.about_user || "") : ""} />
            {canEdit && <EditButton>Edit profile</EditButton>}

            {/* Two-part toggle: own recipes / favorite recipes */}
            <div className="profile-tabs-wrapper">
              <div className="profile-tabs" role="tablist" aria-label="Profile recipe tabs">
                <button
                  className={`profile-tab ${selectedTab === 'own' ? 'active' : ''}`}
                  onClick={() => setSelectedTab('own')}
                  role="tab"
                  aria-selected={selectedTab === 'own'}
                >
                  My recipes
                </button>
                <button
                  className={`profile-tab ${selectedTab === 'fav' ? 'active' : ''}`}
                  onClick={() => setSelectedTab('fav')}
                  role="tab"
                  aria-selected={selectedTab === 'fav'}
                >
                  Favorite recipes
                </button>
              </div>
            </div>

            {/* Placeholder area where recipe list component will be shown */}
            <div className="profile-recipes-area">
              {selectedTab === 'own' ? (
                (myRecipesLoading ? (
                  <Loading />
                ) : myRecipesError ? (
                  <div>{myRecipesError}</div>
                ) : (myRecipes && myRecipes.length > 0 ? (
                  myRecipes.map(r => (
                    <ProfileRecipeForm
                      key={r.recipe_id}
                      recipe={r}
                      canEdit={canEdit}
                      onEdit={(id) => navigate(`/recipe/${id}/edit`)}
                      onDelete={(id) => { if (window.confirm('Delete this recipe?')) { /* TODO: call delete handler */ console.log('deleted', id); } }}
                    />
                  ))
                ) : (
                  <div style={{fontSize: "20px", textAlign: "center", marginTop: "10px"}}>No recipes of my own. <Link style={{color: "green"}} to = "/recipe/create">Add first!</Link></div>
                )))
              ) : (
                favRecipesSample.map(r => (
                  <ProfileRecipeForm key={r.id} recipe={r} />
                ))
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default ProfilePage;