import { Op } from 'sequelize';
import Recipe from "../models/recipe.model.js";

export const getModerationRecipe = async (req, res) => {
  try {
    const recipes = await Recipe.findAll({
      where: {
        moderation_status: 'pending'
      }
    });

    return res.status(200).json({ recipes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Cannot get recipes from database" });
  }
};

export const fulfill = async (req, res) => {
  try {
    const recipeId = req.params.id;

    const recipe = await Recipe.findByPk(recipeId);

    const [updated] = await Recipe.update(
      { moderation_status: 'fulfill' },
      { where: { recipe_id: recipeId } } 
    );

    if (updated) {
      const updatedRow = await Recipe.findByPk(recipeId);
      return res.status(200).json(updatedRow);
    }

    return res.status(404).json({ message: 'Row not found' });

    // const isAdmin = email == process.env.ADMIN_EMAIL;
    // const existUser = await User.findOne({ where: { email } });

    // if (existUser || isAdmin) {
    //   return res.status(409).json({ message: "User already exists" });
    // } 
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error. Recipe fulfill error" + error.message });
  }
};

export const reject = async (req, res) => {
  try {
    const recipeId = req.params.id;

    const recipe = await Recipe.findByPk(recipeId);

    const [updated] = await Recipe.update(
      { moderation_status: 'reject' },
      { where: { recipe_id: recipeId } } 
    );

    if (updated) {
      const updatedRow = await Recipe.findByPk(recipeId);
      return res.status(200).json(updatedRow);
    }

    return res.status(404).json({ message: 'Row not found' });

    // const isAdmin = email == process.env.ADMIN_EMAIL;
    // const existUser = await User.findOne({ where: { email } });

    // if (existUser || isAdmin) {
    //   return res.status(409).json({ message: "User already exists" });
    // } 
   
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error. Recipe reject error" + error.message });
  }
};
