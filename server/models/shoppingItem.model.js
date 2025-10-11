import { DataTypes } from "@sequelize/core";
import sequelize from "../configs/db.js";

const ShoppingItem = sequelize.define(
  "ShoppingItem",
  {
    shopping_list_item_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    shopping_list_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ingredient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_purchased: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: false,
  }
);

export default ShoppingItem;
