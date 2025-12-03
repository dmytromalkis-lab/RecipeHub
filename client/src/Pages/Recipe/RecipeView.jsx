import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../Components/Main/Header/Header.jsx";
import Footer from "../../Components/Main/Footer/Footer.jsx";
import BackButton from "../../Components/Profile/ProfileMain/BackButton.jsx";
import RecipeMain from "../../Components/Recipe/RecipeMain.jsx";
import useUserStore from "../../stores/userStore.js";
import api from "../../api/axios.js";

export default function RecipeView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useUserStore((s) => s.token);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const headers = {};
        if (token) headers.Authorization = `Bearer ${token}`;
        const res = await api.get(`/recipes/${id}`, { headers });
        // debug: log response shape so we can see where User is provided
        // eslint-disable-next-line no-console
        console.log("[RecipeView] GET /recipes/", id, "->", res.data);
        setData(res.data);
      } catch (err) {
        console.error("Error loading recipe", err);
        setError(
          err.response?.data?.message || err.message || "Error loading recipe"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [id, token]);

  return (
    <div className="recipe-create-page">
      <Header />
      <div className="recipe-grid">
        <BackButton onClick={() => navigate("/")} />
        <main className="recipe-create-main">
          <div className="rc-wrapper">
            {loading && <div>Loading...</div>}
            {error && <div className="error">{error}</div>}
            {!loading && !error && data && (
              <RecipeMain initialData={data} readOnly />
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
