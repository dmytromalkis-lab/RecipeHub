import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useUserStore from "../../stores/userStore";
import Loading from "../../Components/UI/Loading/Loading";
import ErrorMessage from "../../Components/UI/ErrorMessage/ErrorMessage";
import RecipeMain from "../../Components/Recipe/RecipeMain";
import api from "../../api/axios";

function ModerationRecipe() {
  const recipeId = useParams();
  console.log("====================================");
  console.log(recipeId);
  console.log("====================================");
  const token = useUserStore((state) => state.token);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      setError(null);

      if (!recipeId) {
        return;
      }

      try {
        const config = {};

        if (token) {
          config.headers = { Authorization: `Bearer ${token}` };
        }
        const responseRecipe = await api.get(`/recipes/${recipeId.id}`, config);

        const dataRecipe = responseRecipe.data;
        setRecipe(dataRecipe);
        console.log("-------------------------");

        console.log(dataRecipe);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [recipeId, token]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error.message || "Something went wrong"} />;
  }

  return <RecipeMain initialData={recipe} readOnly />;
}

export default ModerationRecipe;
