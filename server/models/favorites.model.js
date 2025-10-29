import { DataTypes } from "@sequelize/core";
import sequelize from "../configs/db.js";
import User from "./user.model.js";
import Recipe from "./recipe.model.js";

const Favorites = sequelize.define("Favorites", {
  favorite_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "user_id",
    },
    onDelete: "CASCADE",
  },
  recipe_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Recipe,
      key: "recipe_id",
    },
    onDelete: "CASCADE",
  },
}, {
  tableName: "Favorites",
  timestamps: true,
});

export default Favorites;
