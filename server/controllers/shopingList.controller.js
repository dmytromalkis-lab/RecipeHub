import ShoppingItem from "../models/shoppingItem.model.js";
import ShoppingList from "../models/shoppingList.model.js";
import Ingredient from "../models/ingredient.model.js";

export const addIngredientsToList = async (req, res) => {
  try {
    const { ingredients } = req.body;

    const user_id = req.user.id;

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ message: "Ingredients are required." });
    }

    let shoppingList = await ShoppingList.findOne({
      where: { user_id },
    });

    if (!shoppingList) {
      shoppingList = await ShoppingList.create({ user_id });
    }

    const existingIngredients = await Ingredient.findAll({
      where: { ingredient_id: ingredients },
      attributes: ["ingredient_id"],
    });

    if (existingIngredients.length !== ingredients.length) {
      return res
        .status(400)
        .json({ message: "Some ingredients do not exist." });
    }

    const items = ingredients.map((ingredient_id) => ({
      shopping_list_id: shoppingList.shopping_list_id,
      ingredient_id,
    }));

    const shopingItems = await ShoppingItem.bulkCreate(items);

    res.status(201).json(shopingItems);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error. Error add ingredients to list." });
  }
};
