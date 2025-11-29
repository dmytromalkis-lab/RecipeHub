import User from "../models/user.model.js";
import Recipe from "../models/recipe.model.js";
import { literal } from "@sequelize/core";
import sequelize from "../configs/db.js";

export const getAllUsersCount = async (req, res) => {
  try {
    const count = await User.count();

    res.status(200).json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Error get count users." });
  }
};

export const getCountsRecipe = async (req, res) => {
  try {
    const total = await Recipe.count();
    const pending = await Recipe.count({
      where: {
        moderation_status: "pending",
      },
    });
    const rejected = await Recipe.count({
      where: {
        moderation_status: "reject",
      },
    });
    const approved = await Recipe.count({
      where: {
        moderation_status: "fulfill",
      },
    });

    res.status(200).json({
      total,
      pending,
      rejected,
      approved,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error. Error get recipe counts" });
  }
};

export const getRecipesByMonth = async (req, res) => {
  try {
    const year = req.params.year;

    const data = await Recipe.findAll({
      attributes: [
        [literal(`MONTH(createdAt)`), "month"],
        [literal(`COUNT(*)`), "count"],
      ],
      where: sequelize.where(literal(`YEAR(createdAt)`), year),
      group: [literal(`MONTH(createdAt)`)],
      order: [literal(`MONTH(createdAt) ASC`)],
      raw: true,
    });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
