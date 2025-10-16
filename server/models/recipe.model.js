import { DataTypes } from "@sequelize/core";
import sequelize from "../configs/db.js";

const Recipe = sequelize.define(
  "Recipe",
  {
    recipe_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    difficulty: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Середня",
    },
    prep_time: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    serving: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    moderation_status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
    image_url: {
      type: DataTypes.STRING(1024),
      allowNull: false,
    },
    image_public_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

export default Recipe;
