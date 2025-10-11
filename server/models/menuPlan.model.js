import { DataTypes } from "@sequelize/core";
import sequelize from "../configs/db.js";

const MenuPlan = sequelize.define(
  "MenuPlan",
  {
    menu_plan_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default MenuPlan;
