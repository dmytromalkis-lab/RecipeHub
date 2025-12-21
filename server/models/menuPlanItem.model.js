import { DataTypes } from "@sequelize/core";
import sequelize from "../configs/db.js";

const MenuPlanItem = sequelize.define(
  "MenuPlanItem",
  {
    menu_plan_item_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    menu_plan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    recipe_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    day_of_week: {
      type: DataTypes.ENUM(
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ),
      allowNull: false,
    },
    meal_type: {
      type: DataTypes.ENUM("Breakfast", "Lunch", "Dinner"),
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default MenuPlanItem;
