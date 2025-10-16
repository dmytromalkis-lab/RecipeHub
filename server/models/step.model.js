import { DataTypes } from "@sequelize/core";
import sequelize from "../configs/db.js";

const Step = sequelize.define(
  "Step",
  {
    step_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    recipe_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING(1024),
      allowNull: true,
    },
    image_public_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    step_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

export default Step;
