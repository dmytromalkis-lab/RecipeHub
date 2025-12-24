import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import MenuPlanDay from "./MenuPlanDay";
import AddRecipeModal from "./AddRecipeModal"; // Import the new modal
import axios from "axios";
import "./MenuPlanner.css";

const MenuPlannerPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [menuPlan, setMenuPlan] = useState(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDay, setModalDay] = useState("");

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Helper: Get start of week (Monday)
  const getStartOfWeek = (d) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const getWeekRange = (date) => {
    const start = getStartOfWeek(date);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return { start, end };
  };

  const { start: weekStart, end: weekEnd } = getWeekRange(selectedDate);

  const fetchWeekPlan = async () => {
    try {
      const { data } = await axios.get("/api/menuPlan");
      const formattedStart = weekStart.toISOString().split("T")[0];
      
      const plansArray = data?.menu_plans || [];
      const existingPlan = plansArray.find((p) => p.start_date === formattedStart);

      if (existingPlan) {
        const detailRes = await axios.get(`/api/menuPlan/${existingPlan.menu_plan_id}`);
        setMenuPlan(detailRes.data);
      } else {
        const createRes = await axios.post("/api/menuPlan/create", {
          title: `Week of ${formattedStart}`,
          start_date: formattedStart,
        });
        const newPlanId = createRes.data.menu_plan_id;
        const detailRes = await axios.get(`/api/menuPlan/${newPlanId}`);
        setMenuPlan(detailRes.data);
      }
    } catch (err) {
      console.error("Error fetching plan:", err);
    }
  };

  useEffect(() => {
    fetchWeekPlan();
  }, [selectedDate]); // Re-fetch when date changes

  // Highlight the whole week in Calendar
  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      if (date >= weekStart && date <= weekEnd) return "highlight-week";
    }
    return null;
  };

  // Open modal handler
  const handleOpenAddModal = (dayName) => {
    setModalDay(dayName);
    setIsModalOpen(true);
  };

  return (
    <div className="planner-page-container">
      <h1 className="page-title">Calendar</h1>

      <div className="planner-layout">
        <aside className="calendar-sidebar">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileClassName={tileClassName}
            locale="en-US"
          />
        </aside>

        <main className="days-list">
          {daysOfWeek.map((dayName) => (
            <MenuPlanDay
              key={dayName}
              dayName={dayName}
              items={menuPlan?.items?.filter((item) => item.day_of_week === dayName) || []}
              menuPlanId={menuPlan?.menu_plan?.menu_plan_id}
              refresh={fetchWeekPlan}
              onAddClick={() => handleOpenAddModal(dayName)} // Pass click handler
            />
          ))}
        </main>
      </div>

      {/* The Popup Window */}
      <AddRecipeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dayOfWeek={modalDay}
        menuPlanId={menuPlan?.menu_plan?.menu_plan_id}
        onRecipeAdded={fetchWeekPlan}
      />
    </div>
  );
};

export default MenuPlannerPage;
