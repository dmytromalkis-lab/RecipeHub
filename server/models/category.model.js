import { DataTypes } from "@sequelize/core";
import sequelize from "../configs/db.js";

const Category = sequelize.define(
  "Category",
  {
    category_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

export default Category;
