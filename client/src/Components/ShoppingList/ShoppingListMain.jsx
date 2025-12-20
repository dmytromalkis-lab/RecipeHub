import React, { useState, useEffect } from "react";
import ShoppingListRecipeCard from "./ShoppingListRecipeCard.jsx";
import ShoppingListGroup from "./ShoppingListGroup.jsx";
import api from "../../api/axios.js";
import useUserStore from "../../stores/userStore.js"; // <--- 1. Импортируем стор
import "./ShoppingList.css";

export default function ShoppingListMain() {
  const [recipes, setRecipes] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // <--- 2. Достаем токен
  const token = useUserStore((state) => state.token);

  // Вспомогательная функция для заголовков
  const getAuthHeader = () => {
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchList = async () => {
    // Если токена нет, даже не пытаемся грузить (или редиректим на логин)
    if (!token) {
        setLoading(false);
        return;
    }

    try {
      setLoading(true);
      // <--- 3. Передаем токен в get запросе
      const res = await api.get("/shopingList", getAuthHeader());
      const data = res.data;

      const newRecipes = [];
      const newItems = [];

      if (Array.isArray(data)) {
        data.forEach((group) => {
          newRecipes.push({
            id: group.recipe_id,
            title: group.title,
            image_url: group.image_url
          });

          group.ingredients.forEach((ing) => {
            newItems.push({
              // ID может не приходить (как мы выяснили ранее), но если придет - подхватим
              id: ing.id, 
              recipeId: group.recipe_id,
              name: ing.name,
              quantity: ing.quantity,
              unit: ing.unit,
              checked: ing.is_purchased 
            });
          });
        });
      }
      setRecipes(newRecipes);
      setItems(newItems);
    } catch (err) {
      console.error("Failed to load shopping list", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [token]); // Перезагружаем, если токен появился

  // --- УДАЛЕНИЕ ---
  const handleDeleteItem = async (id) => {
    if (!id || !token) return; 
    
    // Оптимистичное удаление
    setItems((prev) => prev.filter((i) => i.id !== id));
    
    try {
      // DELETE принимает конфиг вторым аргументом
      await api.delete(`/shopingListItem/${id}`, getAuthHeader());
    } catch (err) {
      console.error("Failed to delete", err);
      fetchList(); // Откат при ошибке
    }
  };

  // --- ГАЛОЧКА (КУПЛЕНО) ---
  const handleCheckItem = async (id) => {
    if (!id || !token) return;

    setItems((prev) => prev.map((i) => i.id === id ? { ...i, checked: !i.checked } : i));
    
    try {
      // PATCH принимает: url, data (тело), config (заголовки)
      // Мы шлем пустое тело {}, и конфиг с токеном
      await api.patch(`/shopingListItem/${id}`, {}, getAuthHeader()); 
    } catch (err) {
      console.error("Failed to mark purchased", err);
    }
  };

  // --- УДАЛИТЬ ГРУППУ ---
  const handleRemoveGroup = async (recipeId) => {
    if (!token) return;
    const itemsToRemove = items.filter((i) => i.recipeId === recipeId);
    setItems((prev) => prev.filter((i) => i.recipeId !== recipeId));

    try {
      await Promise.all(itemsToRemove.map((item) => {
         if(item.id) return api.delete(`/shopingListItem/${item.id}`, getAuthHeader());
         return Promise.resolve();
      }));
    } catch (err) {
      console.error("Failed to remove group", err);
      fetchList();
    }
  };

  // --- ОЧИСТИТЬ ВСЁ ---
  const handleClearAll = async () => {
    if (!token) return;
    if (!window.confirm("Clear list?")) return;
    
    const ids = items.map(i => i.id).filter(id => id);
    setItems([]); 
    setRecipes([]);
    try {
      await Promise.all(ids.map((id) => api.delete(`/shopingListItem/${id}`, getAuthHeader())));
    } catch (err) {
      console.error("Failed to clear", err);
      fetchList();
    }
  };

  const isEmpty = items.length === 0;

  if (loading) return <div className="sl-grid" style={{textAlign:"center", paddingTop: 100}}>Loading...</div>;

  return (
    <div className="sl-grid">
      <div className="sl-header-row">
        <h2>Shopping List</h2>
        {!isEmpty && (
          <button className="sl-clear-btn" onClick={handleClearAll}>
            Clear all
          </button>
        )}
      </div>

      {isEmpty ? (
        <div className="sl-empty-state">
          <p>Your shopping list is empty</p>
        </div>
      ) : (
        <>
          <div className="sl-recipes-row">
            {recipes.map((r) => {
               if (!items.some(i => i.recipeId === r.id)) return null;
               return <ShoppingListRecipeCard key={r.id} recipe={r} />;
            })}
          </div>

          {recipes.map((recipe) => {
            const recipeIngredients = items.filter((i) => i.recipeId === recipe.id);
            if (recipeIngredients.length === 0) return null;

            return (
              <ShoppingListGroup
                key={recipe.id}
                recipe={recipe}
                ingredients={recipeIngredients}
                onCheckItem={handleCheckItem}
                onDeleteItem={handleDeleteItem}
                onRemoveGroup={handleRemoveGroup}
              />
            );
          })}
        </>
      )}
    </div>
  );
}