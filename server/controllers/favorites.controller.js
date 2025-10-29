import { Op } from 'sequelize';
import Favorites from "../models/favorites.model.js";

export const getFavorites = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      throw new Error("User not authenticated");
    }

    const userId = req.user.id;

    const favorites = await Favorites.findAll({
      where: {
        user_id: userId
      }
    });

    return res.status(200).json({ favorites });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Cannot get favorites " + error });
  }
};

export const addFavorite = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      throw new Error("User not authenticated");
    }

    const userId = req.user.id;
    const recipeId = req.params.recipeId;

    const favoriteCheck = await Favorites.findOne({
      where: {
        user_id: userId,
        recipe_id: recipeId
      }
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
    res.status(500).json({ message: "Server error. Cannot get favorites", error });
  }
};

export const deleteFavorite = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      throw new Error("User not authenticated");
    }

    const userId = req.user.id;
    const recipeId = req.params.recipeId;

    const favoriteCheck = await Favorites.findOne({
      where: {
        user_id: userId,
        recipe_id: recipeId
      }
    });
    if (!favoriteCheck) {
      throw new Error("This favorite does not exist!");
    }

    await Favorites.destroy({
      where: {
        user_id: userId,
        recipe_id: recipeId,
      }
    });

    return res.status(200).json({ message: "Favorite deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Cannot get favorites " + error });
  }
};
