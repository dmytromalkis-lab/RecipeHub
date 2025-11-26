import Rating from "../models/rating.model.js";
import Recipe from "../models/recipe.model.js";
import { fn, col } from "@sequelize/core";

export const createOrUpdateRating = async (req, res) => {
  try {
    const recipeId = req.params.recipeId;

    const userId = req.user.id;

    const { rating } = req.body;

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const existRating = await Rating.findOne({
      where: { recipe_id: recipeId, user_id: userId },
    });

    if (existRating) {
      await existRating.update({ rating });
      return res.status(200).json(existRating);
    }

    const newRating = await Rating.create({
      recipe_id: recipeId,
      user_id: userId,
      rating,
    });

    res.status(201).json(newRating);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error. Failed to create or update rating" });
  }
};

export const getAverageRaiting = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const existingRecipe = await Recipe.findByPk(recipeId);
    if (!existingRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const result = await Rating.findOne({
      where: { recipe_id: recipeId },
      attributes: [
        [fn("COUNT", col("rating")), "count"],
        [fn("AVG", col("rating")), "average"],
      ],
      raw: true,
    });

    const count = parseInt(result.count);

    if (!result || count === 0) {
      return res.status(200).json({
        message: "Recipe doesn't have ratings.",
        averageRating: 0,
        totalRatings: 0,
      });
    }

    res.status(200).json({
      averageRating: parseFloat(result.average),
      totalRatings: count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
