import Comment from "../models/comment.model.js";
import Recipe from "../models/recipe.model.js";

export const createComment = async (req, res) => {
  try {
    const recipeId = req.params.recipeId;

    const existingRecipe = await Recipe.findByPk(recipeId);

    if (!existingRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const { content } = req.body;

    const user_id = req.user.id;

    if (!user_id || !content) {
      return res.status(422).json({ message: "Fiel  ds are required" });
    }

    const comment = await Comment.create({
      user_id: user_id,
      recipe_id: recipeId,
      content: content,
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error("Error create comment. " + error);
    res.status(500).json({ message: "Server Error. Error create comment" });
  }
};
