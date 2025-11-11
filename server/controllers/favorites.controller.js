import { Op } from "sequelize";
import Favorites from "../models/favorites.model.js";
import Recipe from "../models/recipe.model.js";
import Category from "../models/category.model.js";
import User from "../models/user.model.js";
import Step from "../models/step.model.js";
import Ingredient from "../models/ingredient.model.js";

export const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const favorites = await Favorites.findAll({
      where: {
        user_id: userId,
      },
      include: [
        {
          model: Recipe,
          attributes: [
            "recipe_id",
            "title",
            "description",
            "image_url",
            "difficulty",
            "prep_time",
            "serving",
            "updatedAt",
          ],
          include: [
            {
              model: Step,
              attributes: [
                "description",
                "image_url",
                "step_number",
                "image_public_id",
              ],
            },
            { model: Ingredient, attributes: ["name", "quantity", "unit"] },
            { model: Category, attributes: ["category_id", "category_name"] },
            {
              model: User,
              as: "author",
              attributes: ["user_id", "first_name", "last_name", "avatar"],
            },
          ],
        },
      ],
    });

    return res.status(200).json({ favorites });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error. Cannot get favorites " + error });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const recipeId = req.params.recipeId;

    const existRecipe = await Recipe.findByPk(recipeId);

    if (!existRecipe) {
      return res
        .status(404)
        .json({
          message:
            "Not found recipe. You cannot add recipe to favorites because recipe doesn`t found",
        });
    }

    const favoriteCheck = await Favorites.findOne({
      where: {
        user_id: userId,
        recipe_id: recipeId,
      },
    });
    if (favoriteCheck) {
      throw new Error("This favorite is already exist!");
    }

    const favorite = await Favorites.create({
      user_id: userId,
      recipe_id: recipeId,
    });

    return res.status(201).json({ message: "Favorite added", favorite });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error. Cannot add favorites", error });
  }
};

export const deleteFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const recipeId = req.params.recipeId;

    // ensure recipe exists before attempting to delete favorite
    const existRecipe = await Recipe.findByPk(recipeId);
    if (!existRecipe) {
      return res
        .status(404)
        .json({
          message:
            "Not found recipe. You cannot delete recipe from favorites because recipe wasn't found",
        });
    }

    const favoriteCheck = await Favorites.findOne({
      where: {
        user_id: userId,
        recipe_id: recipeId,
      },
    });
    if (!favoriteCheck) {
      throw new Error("This favorite does not exist!");
    }

    await Favorites.destroy({
      where: {
        user_id: userId,
        recipe_id: recipeId,
      },
    });

    return res.status(200).json({ message: "Favorite deleted" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error. Cannot delete favorites " + error });
  }
};
