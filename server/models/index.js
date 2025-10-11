import Category from "./category.model.js";
import User from "./user.model.js";
import Recipe from "./recipe.model.js";
import Ingredient from "./ingredient.model.js";
import Step from "./step.model.js";
import Comment from "./comment.model.js";
import ShoppingList from "./shoppingList.model.js";
import ShoppingItem from "./shoppingItem.model.js";
import Rating from "./rating.model.js";
import MenuPlan from "./menuPlan.model.js";
import MenuPlanItem from "./menuPlanItem.model.js";

// User -> Recipe
User.hasMany(Recipe, { foreignKey: "user_id" });
Recipe.belongsTo(User, { foreignKey: "user_id" });

// Category -> Recipe
Category.hasMany(Recipe, { foreignKey: "category_id" });
Recipe.belongsTo(Category, { foreignKey: "category_id" });

// Recipe -> Ingredient
Recipe.hasMany(Ingredient, { foreignKey: "recipe_id" });
Ingredient.belongsTo(Recipe, { foreignKey: "recipe_id" });

// Recipe -> Step
Recipe.hasMany(Step, { foreignKey: "recipe_id" });
Step.belongsTo(Recipe, { foreignKey: "recipe_id" });

// Recipe -> Comment
Recipe.hasMany(Comment, { foreignKey: "recipe_id" });
Comment.belongsTo(Recipe, { foreignKey: "recipe_id" });

// User -> Comment
User.hasMany(Comment, { foreignKey: "user_id" });
Comment.belongsTo(User, { foreignKey: "user_id" });

// User -> ShopList
User.hasMany(ShoppingList, { foreignKey: "user_id" });
ShoppingList.belongsTo(User, { foreignKey: "user_id" });

// ShoppingList -> ShoppingListItem
ShoppingList.hasMany(ShoppingItem, { foreignKey: "shopping_list_id" });
ShoppingItem.belongsTo(ShoppingList, { foreignKey: "shopping_list_id" });

// Ingredient -> ShoppingListItem
Ingredient.hasMany(ShoppingItem, { foreignKey: "ingredient_id" });
ShoppingItem.belongsTo(Ingredient, { foreignKey: "ingredient_id" });

// Recipe -> Rating
Recipe.hasMany(Rating, { foreignKey: "recipe_id" });
Rating.belongsTo(Recipe, { foreignKey: "recipe_id" });

// User -> Rating
User.hasMany(Rating, { foreignKey: "user_id" });
Rating.belongsTo(User, { foreignKey: "user_id" });

// User -> MenuPlan
User.hasMany(MenuPlan, { foreignKey: "user_id" });
MenuPlan.belongsTo(User, { foreignKey: "user_id" });

// MenuPlan -> MenuPlanItem
MenuPlan.hasMany(MenuPlanItem, { foreignKey: "menu_plan_id" });
MenuPlanItem.belongsTo(MenuPlan, { foreignKey: "menu_plan_id" });

// Recipe -> MenuPlanItem
Recipe.hasMany(MenuPlanItem, { foreignKey: "recipe_id" });
MenuPlanItem.belongsTo(Recipe, { foreignKey: "recipe_id" });

const models = [
  Category,
  User,
  Recipe,
  Ingredient,
  Step,
  Comment,
  ShoppingList,
  ShoppingItem,
  Rating,
  MenuPlan,
  MenuPlanItem,
];

export default models;
