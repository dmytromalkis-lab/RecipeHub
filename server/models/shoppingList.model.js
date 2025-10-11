import { DataTypes } from "@sequelize/core";
import sequelize from "../configs/db.js";

const ShoppingList = sequelize.define(
  "ShoppingList",
  {
    shopping_list_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default ShoppingList;
