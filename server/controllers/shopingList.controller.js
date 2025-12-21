import ShoppingItem from "../models/shoppingItem.model.js";
import ShoppingList from "../models/shoppingList.model.js";
import Ingredient from "../models/ingredient.model.js";
import Recipe from "../models/recipe.model.js";

export const addIngredientsToList = async (req, res) => {
  try {
    const { recipe_id } = req.body;

    const user_id = req.user.id;

    if (!recipe_id || typeof recipe_id !== "number") {
      return res.status(400).json({ message: "Valid recipe_id is required." });
    }

    const recipe = await Recipe.findByPk(recipe_id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    let shoppingList = await ShoppingList.findOne({
      where: { user_id },
    });

    if (!shoppingList) {
      shoppingList = await ShoppingList.create({ user_id });
    }

    const recipeIngredients = await Ingredient.findAll({
      where: { recipe_id },
      attributes: ["ingredient_id"],
    });

    if (recipeIngredients.length === 0) {
      return res
        .status(404)
        .json({ message: "No ingredients found for this recipe." });
    }

    const ingredientIds = recipeIngredients.map((ing) => ing.ingredient_id);

    const existingItems = await ShoppingItem.findAll({
      where: {
        shopping_list_id: shoppingList.shopping_list_id,
        ingredient_id: ingredientIds,
      },
      attributes: ["ingredient_id"],
    });

    const existingIngredientIds = existingItems.map(
      (item) => item.ingredient_id
    );

    const newIngredientIds = ingredientIds.filter(
      (id) => !existingIngredientIds.includes(id)
    );

    if (newIngredientIds.length === 0) {
      return res
        .status(200)
        .json({ message: "All ingredients are already in the list." });
    }

    const items = newIngredientIds.map((ingredient_id) => ({
      shopping_list_id: shoppingList.shopping_list_id,
      ingredient_id,
    }));

    const shoppingItems = await ShoppingItem.bulkCreate(items);

    res.status(201).json({
      message: "Ingredients added to shopping list.",
      added_items: shoppingItems.length,
      items: shoppingItems,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error. Error adding ingredients to list." });
  }
};

export const getList = async (req, res) => {
  try {
    const user_id = req.user.id;

    const existList = await ShoppingList.findOne({
      where: {
        user_id: user_id,
      },
    });

    if (!existList) {
      return res.status(404).json({ message: "You don`t have list." });
    }

    const ingredients = await ShoppingItem.findAll({
      where: {
        shopping_list_id: existList.shopping_list_id,
      },
      include: [
        {
          model: Ingredient,
          attributes: ["name", "quantity", "unit", "recipe_id"],
          include: [
            {
              model: Recipe,
              attributes: ["recipe_id", "title", "image_url"],
            },
          ],
        },
      ],
      order: [["shopping_list_item_id", "ASC"]],
    });

    const grouped = {};
    ingredients.forEach((item) => {
      const ingredient = item.ingredient;
      const recipe = ingredient.recipe;
      const recipeId = recipe.recipe_id;

      if (!grouped[recipeId]) {
        grouped[recipeId] = {
          recipe_id: recipeId,
          title: recipe.title,
          image_url: recipe.image_url,
          ingredients: [],
        };
      }

      grouped[recipeId].ingredients.push({
        id: item.shopping_list_item_id,
        name: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
        is_purchased: item.is_purchased,
      });
    });

    const result = Object.values(grouped).sort((a, b) =>
      a.title.localeCompare(b.title)
    );

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Error get list." });
  }
};
