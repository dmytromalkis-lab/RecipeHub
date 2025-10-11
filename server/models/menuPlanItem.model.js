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
      allowNull: false,
    },
    day_of_week: {
      type: DataTypes.ENUM(
        "Понеділок",
        "Вівторок",
        "Середа",
        "Четвер",
        "П'ятниця",
        "Субота",
        "Неділя"
      ),
      allowNull: false,
    },
    meal_type: {
      type: DataTypes.ENUM("Сніданок", "Обід", "Вечеря"),
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default MenuPlanItem;
