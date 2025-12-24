import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import "./MenuPlanDetails.css";
import AddRecipeModal from "../../components/MenuPlan/AddRecipeModal";
import MenuDay from "../../components/MenuPlan/MenuDay";
import useUserStore from "../../stores/userStore";

const MenuPlanDetails = () => {
  const { menu_plan_id } = useParams();
  const navigate = useNavigate();
  const [menuPlan, setMenuPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMealType, setSelectedMealType] = useState(null);
  const token = useUserStore((state) => state.token);

  useEffect(() => {
    fetchMenuPlan();
  }, [menu_plan_id]);

  const fetchMenuPlan = async () => {
    try {
      const response = await axios.get(`/menuPlan/${menu_plan_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      const days = {};
      data.items.forEach((item) => {
        const day = item.day_of_week;
        const meal = item.meal_type.toLowerCase();
        if (!days[day]) days[day] = {};
        days[day][meal] = item.recipe;
      });
      setMenuPlan({ ...data.menu_plan, days });
    } catch (err) {
      setError("Failed to load menu plan");
    } finally {
      setLoading(false);
    }
  };

  const addRecipe = async (recipeId) => {
    try {
      await axios.post(
        "/menuPlan/add-recipe",
        {
          menu_plan_id: parseInt(menu_plan_id),
          recipe_id: parseInt(recipeId),
          day_of_week: selectedDay,
          meal_type:
            selectedMealType.charAt(0).toUpperCase() +
            selectedMealType.slice(1),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchMenuPlan(); // Refresh data
      setModalOpen(false);
    } catch (err) {
      alert("Failed to add recipe " + err);
    }
  };

  const removeRecipe = async (day, mealType) => {
    if (!confirm("Are you sure you want to remove this recipe?")) return;
    try {
      await axios.put(
        "/menuPlan/remove-recipe",
        {
          menu_plan_id: parseInt(menu_plan_id),
          day_of_week: day,
          meal_type: mealType.charAt(0).toUpperCase() + mealType.slice(1),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchMenuPlan();
    } catch (err) {
      alert("Failed to remove recipe " + err);
    }
  };

  const openAddModal = (day, mealType) => {
    setSelectedDay(day);
    setSelectedMealType(mealType);
    setModalOpen(true);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="menu-plan-details">
      <button
        onClick={() => navigate("/menu-plans")}
        className="back-button-fixed"
      >
        ← Back to Menu Plans
      </button>
      <div className="menu-header">
        <h1>{menuPlan.title}</h1>
        <p>
          Start date:{" "}
          {new Date(menuPlan.start_date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
      <div className="menu-calendar">
        {days.map((day) => (
          <MenuDay
            key={day}
            day={day}
            meals={menuPlan.days[day] || {}}
            onAddRecipe={(mealType) => openAddModal(day, mealType)}
            onRemoveRecipe={removeRecipe}
          />
        ))}
      </div>
      {modalOpen && (
        <AddRecipeModal onClose={() => setModalOpen(false)} onAdd={addRecipe} />
      )}
    </div>
  );
};

export default MenuPlanDetails;
