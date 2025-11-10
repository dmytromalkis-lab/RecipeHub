import React, { useEffect, useState } from "react";
import "./NewRecipe.css";
import api from "../../../api/axios";
import RecipeComponent from "../../../Components/Searching/RecipeComponent.jsx";
import ErrorMessage from "../../../components/UI/ErrorMessage/ErrorMessage.jsx";
import Loading from "../../../components/UI/Loading/Loading.jsx";

export default function NewRecipe() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const responseRecipes = await api.get("/recipes/latest");
        const dataRecipes = Array.isArray(responseRecipes.data?.recipes)
          ? responseRecipes.data?.recipes
          : [];
        console.log(dataRecipes);
        setRecipes(dataRecipes);
      } catch (error) {
        setError(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (loading) {
    return <Loading />;
  }

  if (recipes.length === 0) {
    return <></>;
  }

  return (
    <section className="new-recipes-root">
      <div className="new-recipes-header">
        <h2>New recipes</h2>
        <div className="new-recipes-sub">Latest added recipes</div>
      </div>

      <div className="new-recipes-list">
        {recipes.map((r) => (
          <div key={r.recipe_id} className="new-recipes-item">
            <RecipeComponent recipe={r} />
          </div>
        ))}
      </div>
    </section>
  );
}
