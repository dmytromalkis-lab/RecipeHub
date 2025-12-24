import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import "./AddRecipeModal.css";

const AddRecipeModal = ({ onClose, onAdd }) => {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [filters, setFilters] = useState({
    title: "",
    ingredients: "",
    difficulty: "",
    category_id: "",
    minTime: "",
    maxTime: "",
  });

  useEffect(() => {
    fetchCategories();
    fetchRecipes(true);
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/categories");
      setCategories(response.data.categories);
    } catch (err) {
      console.error("Failed to fetch categories " + err);
    }
  };

  const fetchRecipes = async (reset = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const params = {
        title: filters.title || undefined,
        ingredients: filters.ingredients || undefined,
        difficulty: filters.difficulty || undefined,
        category_id: filters.category_id
          ? Number(filters.category_id)
          : undefined,
        minTime: filters.minTime ? Number(filters.minTime) : undefined,
        maxTime: filters.maxTime ? Number(filters.maxTime) : undefined,
        limit: 30,
        offset: reset ? 0 : offset,
      };
      const response = await axios.get("/recipes/search", { params });
      if (reset) {
        setRecipes(response.data.recipes);
        setOffset(30);
      } else {
        setRecipes((prev) => [...prev, ...response.data.recipes]);
        setOffset((prev) => prev + 30);
      }
      setHasMore(response.data.hasMore);
    } catch (err) {
      console.error("Failed to fetch recipes" + err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    fetchRecipes(true);
  };

  const handleLoadMore = () => {
    fetchRecipes();
  };

  const handleAdd = (recipeId) => {
    onAdd(recipeId);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Add Recipe</h2>
        <div className="filters">
          <input
            type="text"
            name="title"
            placeholder="Search by title"
            value={filters.title}
            onChange={handleFilterChange}
            className="filter-input"
          />
          <input
            type="text"
            name="ingredients"
            placeholder="Ingredients (comma separated)"
            value={filters.ingredients}
            onChange={handleFilterChange}
            className="filter-input"
          />
          <select
            name="difficulty"
            value={filters.difficulty}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">Any Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <select
            name="category_id"
            value={filters.category_id}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">Any Category</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.category_name}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="minTime"
            placeholder="Min prep time"
            value={filters.minTime}
            onChange={handleFilterChange}
            className="filter-input"
          />
          <input
            type="number"
            name="maxTime"
            placeholder="Max prep time"
            value={filters.maxTime}
            onChange={handleFilterChange}
            className="filter-input"
          />
          <button onClick={handleSearch} className="search-button">
            Search
          </button>
        </div>
        <div className="recipes-list">
          {recipes.map((recipe) => (
            <div key={recipe.recipe_id} className="recipe-item">
              <img
                src={recipe.image_url}
                alt={recipe.title}
                className="recipe-image"
              />
              <div>
                <h4 style={{ color: "black" }}>{recipe.title}</h4>
                <p>Prep time: {recipe.prep_time} min</p>
                <p>Difficulty: {recipe.difficulty}</p>
                <p>Category: {recipe.category?.category_name}</p>
              </div>
              <button
                onClick={() => handleAdd(recipe.recipe_id)}
                className="add-recipe-button"
              >
                Add
              </button>
            </div>
          ))}
          {loading && <p>Loading...</p>}
          {hasMore && !loading && (
            <button onClick={handleLoadMore} className="load-more-button">
              Load More
            </button>
          )}
        </div>
        <button onClick={onClose} className="close-button">
          Close
        </button>
      </div>
    </div>
  );
};

export default AddRecipeModal;
