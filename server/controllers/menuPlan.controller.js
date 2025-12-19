import MenuPlan from "../models/menuPlan.model.js";
import MenuPlanItem from "../models/menuPlanItem.model.js";
import Recipe from "../models/recipe.model.js";

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

const addRecipeToMenuPlan = async (req, res) => {
  try {
    const { menu_plan_id, day_of_week, meal_type, recipe_id } = req.body;
    const user_id = req.user.id;

    if (
      !menu_plan_id ||
      !day_of_week ||
      !meal_type ||
      recipe_id === undefined
    ) {
      return res.status(400).json({
        error:
          "Missing required fields: menu_plan_id, day_of_week, meal_type, recipe_id",
      });
    }

    if (typeof menu_plan_id !== "number" || menu_plan_id <= 0) {
      return res
        .status(400)
        .json({ error: "menu_plan_id must be a positive number" });
    }

    if (typeof recipe_id !== "number" || recipe_id <= 0) {
      return res
        .status(400)
        .json({ error: "recipe_id must be a positive number" });
    }

    const validDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    if (!validDays.includes(day_of_week)) {
      return res.status(400).json({ error: "Invalid day_of_week" });
    }

    const validMeals = ["Breakfast", "Lunch", "Dinner"];
    if (!validMeals.includes(meal_type)) {
      return res.status(400).json({ error: "Invalid meal_type" });
    }

    const menuPlan = await MenuPlan.findOne({
      where: { menu_plan_id, user_id },
    });
    if (!menuPlan) {
      return res
        .status(404)
        .json({ error: "Menu plan not found or access denied" });
    }

    const recipe = await Recipe.findByPk(recipe_id);
    if (!recipe) {
      return res.status(400).json({ error: "Recipe not found" });
    }

    const menuPlanItem = await MenuPlanItem.findOne({
      where: { menu_plan_id, day_of_week, meal_type },
    });
    if (!menuPlanItem) {
      return res.status(404).json({
        error: "Menu plan item not found for the specified day and meal",
      });
    }

    menuPlanItem.recipe_id = recipe_id;
    await menuPlanItem.save();

    res.status(200).json({
      success: true,
      menu_plan_item: menuPlanItem,
    });
  } catch (error) {
    console.error("Error adding recipe to menu plan:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const removeRecipeFromMenuPlan = async (req, res) => {
  try {
    const { menu_plan_id, day_of_week, meal_type } = req.body;
    const user_id = req.user.id;

    if (!menu_plan_id || !day_of_week || !meal_type) {
      return res.status(400).json({
        error: "Missing required fields: menu_plan_id, day_of_week, meal_type",
      });
    }

    if (typeof menu_plan_id !== "number" || menu_plan_id <= 0) {
      return res
        .status(400)
        .json({ error: "menu_plan_id must be a positive number" });
    }

    const validDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    if (!validDays.includes(day_of_week)) {
      return res.status(400).json({ error: "Invalid day_of_week" });
    }

    const validMeals = ["Breakfast", "Lunch", "Dinner"];
    if (!validMeals.includes(meal_type)) {
      return res.status(400).json({ error: "Invalid meal_type" });
    }

    const menuPlan = await MenuPlan.findOne({
      where: { menu_plan_id, user_id },
    });
    if (!menuPlan) {
      return res
        .status(404)
        .json({ error: "Menu plan not found or access denied" });
    }

    const menuPlanItem = await MenuPlanItem.findOne({
      where: { menu_plan_id, day_of_week, meal_type },
    });
    if (!menuPlanItem) {
      return res.status(404).json({
        error: "Menu plan item not found for the specified day and meal",
      });
    }

    menuPlanItem.recipe_id = null;
    await menuPlanItem.save();

    res.status(200).json({
      success: true,
      menu_plan_item: menuPlanItem,
    });
  } catch (error) {
    console.error("Error removing recipe from menu plan:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteMenuPlan = async (req, res) => {
  try {
    const { menu_plan_id } = req.params;
    const user_id = req.user.id;

    const menuPlan = await MenuPlan.findOne({
      where: { menu_plan_id: menu_plan_id, user_id },
    });
    if (!menuPlan) {
      return res
        .status(404)
        .json({ error: "Menu plan not found or access denied" });
    }

    await menuPlan.destroy();

    res.status(200).json({
      success: true,
      message: "Menu plan deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting menu plan:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserMenuPlans = async (req, res) => {
  try {
    const user_id = req.user.id;

    const menuPlans = await MenuPlan.findAll({
      where: { user_id },
      attributes: ["menu_plan_id", "title", "start_date"],
      order: [["start_date", "DESC"]],
    });

    res.status(200).json({
      success: true,
      menu_plans: menuPlans,
    });
  } catch (error) {
    console.error("Error fetching user menu plans:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMenuPlanDetails = async (req, res) => {
  try {
    const { menu_plan_id } = req.params;
    const user_id = req.user.id;

    const id = parseInt(menu_plan_id, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid menu_plan_id" });
    }

    const menuPlan = await MenuPlan.findOne({
      where: { menu_plan_id: id, user_id },
      attributes: ["menu_plan_id", "title", "start_date"],
    });
    if (!menuPlan) {
      return res
        .status(404)
        .json({ error: "Menu plan not found or access denied" });
    }

    const menuPlanItems = await MenuPlanItem.findAll({
      where: { menu_plan_id: id },
      include: [
        {
          model: Recipe,
          attributes: [
            "recipe_id",
            "title",
            "description",
            "difficulty",
            "prep_time",
            "serving",
            "image_url",
          ],
          required: false,
        },
      ],
      order: [
        ["day_of_week", "ASC"],
        ["meal_type", "ASC"],
      ],
    });

    res.status(200).json({
      success: true,
      menu_plan: menuPlan,
      items: menuPlanItems,
    });
  } catch (error) {
    console.error("Error fetching menu plan details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export {
  createMenuPlan,
  addRecipeToMenuPlan,
  removeRecipeFromMenuPlan,
  deleteMenuPlan,
  getUserMenuPlans,
  getMenuPlanDetails,
};
