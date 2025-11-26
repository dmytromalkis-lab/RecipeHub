import Rating from "../models/rating.model.js";

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
