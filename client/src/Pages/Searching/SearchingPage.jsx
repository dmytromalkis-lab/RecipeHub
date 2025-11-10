import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "./SearchingPage.css";
import RecipeComponent from "../../Components/Searching/RecipeComponent.jsx";
import SearchingTab from "../../Components/Searching/SearchingTab.jsx";
import SearchingFilters from "../../Components/Searching/SearchingFilters.jsx";
import api from "../../api/axios.js";
import Loading from "../../components/UI/Loading/Loading.jsx";
import ErrorMessage from "../../components/UI/ErrorMessage/ErrorMessage.jsx";

export default function SearchingPage() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    title: searchParams.get("title") || "",
    withIngredients: "",
    difficulty: "",
    categoryId: "",
    minTime: searchParams.get("minTime") || "",
    maxTime: searchParams.get("maxTime") || "",
  });
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (filters.title) params.title = filters.title;
        if (filters.withIngredients)
          params.ingredients = filters.withIngredients;
        if (filters.difficulty) params.difficulty = filters.difficulty;
        if (filters.categoryId) params.category_id = filters.categoryId;
        if (filters.minTime) params.minTime = filters.minTime;
        if (filters.maxTime) params.maxTime = filters.maxTime;
        params.limit = 30;
        params.offset = 0;
        const res = await api.get("/recipes/search", { params });
        setRecipes(res.data.recipes || []);
      } catch (e) {
        setError(e.response.data.message);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, [filters, searchParams]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (error) {
    <ErrorMessage message={error} />;
  }

  return (
    <div className="main-page">
      <main className="main-content">
        <div className="searching-page-root">
          <SearchingTab
            value={filters.title}
            onChange={(title) => handleFiltersChange({ ...filters, title })}
          />
          <div className="search-layout">
            <div className="search-main">
              <div className="search-results">
                {loading ? (
                  <Loading />
                ) : recipes.length === 0 ? (
                  <div className="no-recipes-message">No recipes found.</div>
                ) : (
                  recipes.map((r) => (
                    <RecipeComponent key={r.recipe_id} recipe={r} />
                  ))
                )}
              </div>
            </div>
            <aside className="search-sidebar">
              <SearchingFilters
                filters={filters}
                onChange={handleFiltersChange}
              />
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
