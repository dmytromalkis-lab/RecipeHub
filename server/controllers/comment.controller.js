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

export const updateComment = async (req, res) => {
  try {
    const commentId = req.params.id;

    const userId = req.user.id;

    const { content } = req.body;

    if (!content) {
      return res.status(422).json({ message: "Fields are required" });
    }

    const existingComment = await Comment.findOne({
      where: {
        user_id: userId,
        comment_id: commentId,
      },
    });

    if (!existingComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    await existingComment.update({
      content: content,
    });

    res.status(200).json(existingComment);
  } catch (error) {
    console.error("Error updating comment: ", error);
    res.status(500).json({ message: "Server error while updating comment" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;

    const userId = req.user.id;

    const existingComment = await Comment.findOne({
      where: {
        user_id: userId,
        comment_id: commentId,
      },
    });

    if (!existingComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    await existingComment.destroy();

    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    console.error("Error deleting comment: ", error);
    res.status(500).json({ message: "Server error while deleting comment" });
  }
};
