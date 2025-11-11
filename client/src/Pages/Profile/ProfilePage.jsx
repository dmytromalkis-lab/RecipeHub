import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Profile.css";
import avatarImg from "../../assets/avatar.png";

import BackButton from "./../../Components/Profile/ProfileMain/BackButton.jsx";
import ProfileInfo from "./../../Components/Profile/ProfileMain/ProfileInfo.jsx";
import EditButton from "./../../Components/Profile/ProfileMain/EditButton.jsx";
import AboutSection from "./../../Components/Profile/ProfileMain/AboutSection.jsx";
import ProfileRecipeForm from "./../../Components/Profile/ProfileRecipes/ProfileRecipeForm.jsx";
import Loading from "./../../components/UI/Loading/Loading.jsx";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";
import olivieImg from "../../assets/salad.jfif";
import kyivcakeImg from "../../assets/pizza.jfif";
import useUserStore from "../../stores/userStore.js";
import SuccessPopup from "../../components/UI/SuccessPopup";

function ProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useUserStore((state) => state.user);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("own");
  const [myRecipes, setMyRecipes] = useState([]);
  const [myRecipesLoading, setMyRecipesLoading] = useState(false);
  const [myRecipesError, setMyRecipesError] = useState(null);
  const [favRecipes, setFavRecipes] = useState([]);
  const [favRecipesLoading, setFavRecipesLoading] = useState(false);
  const [favRecipesError, setFavRecipesError] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const canEdit = !!user && (!id || String(user.user_id) === String(id));

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!id) {
          setProfile(
            user
              ? {
                  user_id: user.user_id,
                  first_name: user.first_name,
                  last_name: user.last_name,
                  email: user.email,
                  avatar: user.avatar,
                  about_user: user.about_user,
                }
              : null
          );
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
      if (!canEdit || selectedTab !== "own") return;
      if (!user || !user.user_id) return;

      setMyRecipesLoading(true);
      setMyRecipesError(null);

      try {
        const config = {};
        const token = useUserStore.getState().token;
        if (token) {
          config.headers = { Authorization: `Bearer ${token}` };
        }

        const responseMyRecipes = await api.get("/recipes/my", config);
        const dataMyRecipes = Array.isArray(responseMyRecipes.data?.recipes)
          ? responseMyRecipes.data?.recipes
          : [];
        setMyRecipes(dataMyRecipes);
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          error.message ||
          "Failed to load my recipes";
        setMyRecipesError(message);
      } finally {
        setMyRecipesLoading(false);
      }
    };
    fetchMyRecipes();
  }, [canEdit, selectedTab, user]);

  useEffect(() => {
    const fetchFavRecipes = async () => {
      if (selectedTab !== "fav" || !canEdit) {
        console.log(selectedTab);

        return;
      }
      if (!user || !user.user_id) return;

      setFavRecipesLoading(true);
      setFavRecipesError(null);

      try {
        const config = {};
        const token = useUserStore.getState().token;

        if (token) {
          config.headers = { Authorization: `Bearer ${token}` };
        }

        const responseFavRecipes = await api.get("/favorites", config);
        const dataFavRecipes = Array.isArray(
          responseFavRecipes?.data?.favorites
        )
          ? responseFavRecipes?.data?.favorites
          : [];
        setFavRecipes(dataFavRecipes);
        console.log(dataFavRecipes);
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          error.message ||
          "Failed to load my recipes";
        setFavRecipesError(message);
      } finally {
        setFavRecipesLoading(false);
      }
    };
    fetchFavRecipes();
  }, [canEdit, selectedTab, user]);

  const handleDeleteRecipe = async (id) => {
    if (window.confirm("Delete this recipe?")) {
      try {
        const token = useUserStore.getState().token;
        await api.delete(`/recipes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // After successful deletion, update the recipes list
        setMyRecipes((prevRecipes) =>
          prevRecipes.filter((recipe) => recipe.recipe_id !== id)
        );
        // Show success popup
        setShowSuccessPopup(true);
        // Hide popup after 3 seconds
        setTimeout(() => setShowSuccessPopup(false), 3000);
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          error.message ||
          "Failed to delete recipe";
        alert(message);
      }
    }
  };

  const avatarToShow = (() => {
    const defaultAvatar = avatarImg;
    if (!profile) return defaultAvatar;
    // if viewing another user's profile (id in URL) — show that profile's avatar
    if (id) return profile.avatar || defaultAvatar;
    // otherwise (own profile) prefer current user avatar from store
    return user?.avatar || profile.avatar || defaultAvatar;
  })();

  return (
    <div className="profile-page">
      <SuccessPopup
        visible={showSuccessPopup}
        message="Recipe successfully deleted!"
        onClose={() => setShowSuccessPopup(false)}
      />
      <BackButton onClick={() => navigate("/")} />
      <main className="profile-content">
        {loading && <div>Loading...</div>}
        {error && <div>{error}</div>}
        {!loading && !error && (
          <>
            <ProfileInfo
              name={
                profile
                  ? `${profile.first_name} ${profile.last_name}`
                  : "User's first and last name"
              }
              email={profile ? profile.email : "user_email@gmail.com"}
              avatar={avatarToShow}
            />
            <AboutSection about={profile ? profile.about_user || "" : ""} />
            {canEdit && <EditButton>Edit profile</EditButton>}

            {/* Show recipes section only for own profile */}
            {canEdit && (
              <>
                {/* Two-part toggle: own recipes / favorite recipes */}
                <div className="profile-tabs-wrapper">
                  <div
                    className="profile-tabs"
                    role="tablist"
                    aria-label="Profile recipe tabs"
                  >
                    <button
                      className={`profile-tab ${
                        selectedTab === "own" ? "active" : ""
                      }`}
                      onClick={() => setSelectedTab("own")}
                      role="tab"
                      aria-selected={selectedTab === "own"}
                    >
                      My recipes
                    </button>
                    <button
                      className={`profile-tab ${
                        selectedTab === "fav" ? "active" : ""
                      }`}
                      onClick={() => setSelectedTab("fav")}
                      role="tab"
                      aria-selected={selectedTab === "fav"}
                    >
                      Favorite recipes
                    </button>
                  </div>
                </div>

                {/* Placeholder area where recipe list component will be shown */}
                <div className="profile-recipes-area">
                  {selectedTab === "own" ? (
                    myRecipesLoading ? (
                      <Loading />
                    ) : myRecipesError ? (
                      <div>{myRecipesError}</div>
                    ) : myRecipes && myRecipes.length > 0 ? (
                      myRecipes.map((r) => (
                        <ProfileRecipeForm
                          key={r.recipe_id}
                          recipe={r}
                          canEdit={canEdit}
                          onEdit={(id) => navigate(`/recipe/${id}/edit`)}
                          onDelete={handleDeleteRecipe}
                        />
                      ))
                    ) : (
                      <div
                        style={{
                          fontSize: "20px",
                          textAlign: "center",
                          marginTop: "10px",
                        }}
                      >
                        No recipes of my own.
                        <Link style={{ color: "green" }} to="/recipe/create">
                          Add first!
                        </Link>
                      </div>
                    )
                  ) : favRecipesLoading ? (
                    <Loading />
                  ) : favRecipesError ? (
                    <div>{favRecipesError}</div>
                  ) : favRecipes.length > 0 ? (
                    favRecipes.map((r) => (
                      <ProfileRecipeForm
                        key={r.favorite_id}
                        recipe={r.favorite_recipe}
                      />
                    ))
                  ) : (
                    <div
                      style={{
                        fontSize: "20px",
                        textAlign: "center",
                        marginTop: "10px",
                      }}
                    >
                      No favorite recipes.
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default ProfilePage;
