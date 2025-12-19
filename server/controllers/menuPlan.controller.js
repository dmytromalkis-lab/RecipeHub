import MenuPlan from "../models/menuPlan.model.js";
import MenuPlanItem from "../models/menuPlanItem.model.js";

const createMenuPlan = async (req, res) => {
  try {
    const { title, start_date } = req.body;

    const user_id = req.user.id;

    // Validate input
    if (!title || !start_date) {
      return res
        .status(400)
        .json({ error: "Missing required fields: title, start_date" });
    }

    // Validate start_date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(start_date)) {
      return res
        .status(400)
        .json({ error: "start_date must be in YYYY-MM-DD format" });
    }

    // Check if start_date is a valid date
    const date = new Date(start_date);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ error: "start_date must be a valid date" });
    }

    // Create MenuPlan
    const newMenuPlan = await MenuPlan.create({
      user_id,
      title,
      start_date,
    });

    // Days of the week
    const daysOfWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    // Meal types
    const mealTypes = ["Breakfast", "Lunch", "Dinner"];

    // Prepare MenuPlanItems
    const menuPlanItems = [];
    for (const day of daysOfWeek) {
      for (const meal of mealTypes) {
        menuPlanItems.push({
          menu_plan_id: newMenuPlan.menu_plan_id,
          recipe_id: null,
          day_of_week: day,
          meal_type: meal,
        });
      }
    }

    // Bulk create MenuPlanItems
    await MenuPlanItem.bulkCreate(menuPlanItems);

    // Return the new menu_plan_id
    res.status(201).json(newMenuPlan);
  } catch (error) {
    console.error("Error creating menu plan:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { createMenuPlan };
