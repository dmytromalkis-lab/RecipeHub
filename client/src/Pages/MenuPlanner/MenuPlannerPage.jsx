import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import api from "../../api/axios";
import useUserStore from "../../stores/userStore";
import MenuPlanDay from "./MenuPlanDay";
import AddRecipeModal from "./AddRecipeModal";
import "./MenuPlanner.css";

const MenuPlannerPage = () => {
  const token = useUserStore((state) => state.token);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [menuPlan, setMenuPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDay, setModalDay] = useState("");

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Calendar logic: Highlight whole week
  const getStartOfWeek = (d) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const weekStart = getStartOfWeek(selectedDate);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const fetchWeekPlan = async () => {
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const formattedStart = weekStart.toISOString().split("T")[0];

      const { data } = await api.get("/menuPlan", config);
      const existingPlan = (data?.menu_plans || []).find(p => p.start_date === formattedStart);

      if (existingPlan) {
        const detailRes = await api.get(`/menuPlan/${existingPlan.menu_plan_id}`, config);
        setMenuPlan(detailRes.data);
      } else {
        const createRes = await api.post("/menuPlan/create", {
          title: `Week of ${formattedStart}`,
          start_date: formattedStart,
        }, config);
        const detailRes = await api.get(`/menuPlan/${createRes.data.menu_plan_id}`, config);
        setMenuPlan(detailRes.data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchWeekPlan();
  }, [selectedDate, token]);

  const fetchMenu = async () => {
    try {
      const res = await api.get("/menu-plan");
      setPlanData(res.data); // This updates the whole UI
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  return (
    <div className="planner-page-container">
      <h1 className="page-title">Calendar</h1>
      <div className="planner-layout">
        <aside className="calendar-sidebar">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileClassName={({ date }) => {
              const d = new Date(date).setHours(0, 0, 0, 0);
              const start = new Date(weekStart).setHours(0, 0, 0, 0);
              const end = new Date(weekEnd).setHours(0, 0, 0, 0);
          
              return d >= start && d <= end ? "highlight-week" : null;
            }}
          />
        </aside>

        <main className="days-list">
          {daysOfWeek.map((day) => (
            <MenuPlanDay
              key={day}
              dayName={day}
              items={menuPlan?.items?.filter(i => 
                i.day_of_week === day && i.recipe_id !== null
              ) || []}
              onAddClick={() => { setModalDay(day); setIsModalOpen(true); }}
              refresh={fetchWeekPlan} // This sends the function down
            />
          ))}        </main>
      </div>

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

// Make sure this line exists!
export default MenuPlannerPage;
